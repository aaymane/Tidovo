"""ROOMRESET — Sample room, before/after (T1.1, Sunrise Reveal study).

Original procedural scene: no external assets, no downloads, no generators.
Target: Blender 4.5 LTS (Intel macOS). One locked camera, identical lighting in both
states (honesty rule: the "before" is never darkened or degraded).

Two ways to use it:
  1) Inside a running Blender (e.g. through MCP): exec() this file, then call
        build(); set_state("before")  # or "after"
  2) Command line, fully reproducible renders:
        /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup \
          --python design/art-direction/blender/build_sample_room.py -- \
          --rr-cli --out design/art-direction/blender/renders --samples 32 --res 1080x1440 \
          --save design/art-direction/blender/rr_sample_room_v001.blend
"""

import math
import os
import sys

import bmesh
import bpy
from mathutils import Euler, Vector

# --------------------------------------------------------------------------------------
# Palette (sRGB hex). Kept close to the ROOMRESET art direction, but this is a "real"
# room: warm oak, plaster walls, linen, a few saturated objects that read as clutter.
# --------------------------------------------------------------------------------------
HEX = {
    "wall": "#E4E8E1", "floor": "#C49E78", "skirting": "#D9DDD5", "rug": "#A8B5A5",
    "bed_wood": "#B48B63", "linen": "#F1EFEA", "duvet": "#ECE9E2", "throw": "#4F6B5A",
    "cushion": "#E9B54A", "desk_wood": "#C09872", "chair": "#2E3A35", "night": "#D6CEC3",
    "shade": "#F3E8D4", "frame": "#F4F3EF", "pot": "#E7E3DB", "leaf": "#5A8A5D",
    "basket": "#C9B79A", "card": "#C49A6C", "paper": "#FAF8F3", "tray": "#9C7A57",
    "shelf": "#CDB596",
}
BOOKS = ["#B5543F", "#2F5D6B", "#E2B04A", "#6E7F5A", "#A7B4C2", "#3B3F45"]
MUGS = ["#F2EEE6", "#E2B04A", "#4F6B5A"]
CLOTHES = ["#E8B74B", "#4F6B5A", "#3E5878", "#EDEAE3"]
SHOES = ["#2B2F33", "#D9D4CB"]

COLLECTION_NAME = "RR_SampleRoom"
_MATS = {}


def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_rgba(h):
    h = h.lstrip("#")
    return tuple(srgb_to_linear(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4)) + (1.0,)


def material(name, hex_color, roughness=0.65, sheen=0.0):
    key = (name, hex_color)
    if key in _MATS:
        return _MATS[key]
    m = bpy.data.materials.new(f"RR_{name}")
    m.use_nodes = True
    bsdf = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    for sock in bsdf.inputs:
        if sock.identifier == "Base Color":
            sock.default_value = hex_rgba(hex_color)
        elif sock.identifier == "Roughness":
            sock.default_value = roughness
        elif sock.identifier in ("Sheen Weight", "Sheen") and sheen:
            sock.default_value = sheen
    m.diffuse_color = hex_rgba(hex_color)  # viewport only
    _MATS[key] = m
    return m


def _collection():
    col = bpy.data.collections.get(COLLECTION_NAME)
    if col is None:
        col = bpy.data.collections.new(COLLECTION_NAME)
        bpy.context.scene.collection.children.link(col)
    return col


def _obj_from_bm(name, bm, mat=None, smooth=False):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    _collection().objects.link(ob)
    if mat:
        me.materials.append(mat)
    return ob


def _place(ob, loc, rot):
    ob.location = Vector(loc)
    ob.rotation_euler = Euler([math.radians(a) for a in rot], "XYZ")
    return ob


def _bevel(ob, width=0.012, segments=3):
    mod = ob.modifiers.new("RR_Bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    return ob


def box(name, dims, loc, rot=(0, 0, 0), mat=None, bevel=0.012):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(dims), verts=bm.verts)
    ob = _place(_obj_from_bm(name, bm, mat), loc, rot)
    return _bevel(ob, bevel) if bevel else ob


def cyl(name, radius, depth, loc, rot=(0, 0, 0), mat=None, radius_top=None, segments=40):
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=False, segments=segments,
        radius1=radius, radius2=radius if radius_top is None else radius_top, depth=depth,
    )
    ob = _place(_obj_from_bm(name, bm, mat, smooth=True), loc, rot)
    return _bevel(ob, min(0.006, radius * 0.2), 2)


def sphere(name, radius, loc, scale=(1, 1, 1), rot=(0, 0, 0), mat=None):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=14, radius=radius)
    ob = _place(_obj_from_bm(name, bm, mat, smooth=True), loc, rot)
    ob.scale = Vector(scale)
    return ob


def blob(name, dims, loc, rot=(0, 0, 0), mat=None, strength=0.07, noise=0.35, seed=1):
    """Soft crumpled textile: subdivided box + cloud displacement."""
    ob = box(name, dims, loc, rot, mat, bevel=0)
    for p in ob.data.polygons:
        p.use_smooth = True
    sub = ob.modifiers.new("RR_Sub", "SUBSURF")
    sub.levels = 3
    sub.render_levels = 3
    tex = bpy.data.textures.new(f"RR_Cloud_{name}", type="CLOUDS")
    tex.noise_scale = noise
    tex.noise_depth = 2
    disp = ob.modifiers.new("RR_Crumple", "DISPLACE")
    disp.texture = tex
    disp.strength = strength
    disp.texture_coords = "LOCAL"
    # Offset the texture per object so blobs are not identical.
    disp.texture_coords_object = None
    ob["rr_seed"] = seed
    ob.location.x += 0.0001 * seed
    return ob


def states(ob, before=None, after=None, vis="both"):
    """Record per-state transforms (loc, rot in degrees) and visibility on the object."""
    ob["rr_vis"] = vis
    if before:
        ob["rr_before_loc"], ob["rr_before_rot"] = list(before[0]), list(before[1])
    if after:
        ob["rr_after_loc"], ob["rr_after_rot"] = list(after[0]), list(after[1])
    return ob


def set_state(state):
    assert state in ("before", "after")
    # Iterate over a snapshot: changing visibility rebuilds `all_objects`, and iterating
    # the live collection while mutating it crashed Blender 4.5 (segfault, 2026-11-10).
    for ob in list(_collection().all_objects):
        vis = ob.get("rr_vis", "both")
        hidden = vis not in ("both", state)
        ob.hide_render = hidden
        ob.hide_viewport = hidden
        if f"rr_{state}_loc" in ob:
            _place(ob, ob[f"rr_{state}_loc"], ob[f"rr_{state}_rot"])
    bpy.context.scene["rr_state"] = state


def clear_scene():
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras,
                 bpy.data.textures):
        for block in list(coll):
            if block.users == 0:
                coll.remove(block)
    _MATS.clear()


# --------------------------------------------------------------------------------------
# Scene construction. Units: meters. Room: x in [-1.8, 1.8], y in [-1.6, 1.6], z up.
# Back wall at y = +1.6 holds the window; left wall at x = -1.8 holds the bed.
# --------------------------------------------------------------------------------------
def build_room():
    wall, floor = material("wall", HEX["wall"], 0.9), material("floor", HEX["floor"], 0.55)
    box("Floor", (3.8, 3.4, 0.04), (0, 0, -0.02), mat=floor, bevel=0)
    box("WallLeft", (0.06, 3.4, 2.7), (-1.83, 0, 1.35), mat=wall, bevel=0)
    box("WallRight", (0.06, 3.4, 2.7), (1.83, 0, 1.35), mat=wall, bevel=0)
    box("Ceiling", (3.8, 3.4, 0.04), (0, 0, 2.72), mat=wall, bevel=0)
    # Back wall built around a window opening x:[0.15,1.25], z:[0.95,2.15].
    box("WallBack_L", (1.98, 0.06, 2.7), (-0.84, 1.63, 1.35), mat=wall, bevel=0)
    box("WallBack_R", (0.55, 0.06, 2.7), (1.525, 1.63, 1.35), mat=wall, bevel=0)
    box("WallBack_B", (1.1, 0.06, 0.95), (0.7, 1.63, 0.475), mat=wall, bevel=0)
    box("WallBack_T", (1.1, 0.06, 0.55), (0.7, 1.63, 2.425), mat=wall, bevel=0)
    fr = material("frame", HEX["frame"], 0.4)
    for nm, d, l in (("WinSill", (1.24, 0.16, 0.04), (0.7, 1.57, 0.95)),
                     ("WinTop", (1.16, 0.08, 0.05), (0.7, 1.62, 2.15)),
                     ("WinL", (0.05, 0.08, 1.2), (0.15, 1.62, 1.55)),
                     ("WinR", (0.05, 0.08, 1.2), (1.25, 1.62, 1.55)),
                     ("WinMid", (0.035, 0.05, 1.2), (0.7, 1.62, 1.55)),
                     ("WinTransom", (1.12, 0.05, 0.035), (0.7, 1.62, 1.62))):
        box(nm, d, l, mat=fr, bevel=0.006)
    # Bright morning sky behind the window: seen by the camera, never casts shadows.
    sky = bpy.data.materials.new("RR_SkyGlow")
    sky.use_nodes = True
    nt = sky.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs[0].default_value = hex_rgba("#FFF4E4")
    em.inputs[1].default_value = 2.6
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(em.outputs[0], out.inputs[0])
    glow = box("SkyGlow", (3.0, 0.02, 2.6), (0.7, 2.3, 1.5), mat=sky, bevel=0)
    for attr in ("visible_shadow", "visible_diffuse", "visible_glossy"):
        if hasattr(glow, attr):
            setattr(glow, attr, False)
    sk = material("skirting", HEX["skirting"], 0.6)
    box("SkirtBack", (3.6, 0.02, 0.08), (0, 1.595, 0.04), mat=sk, bevel=0.003)
    box("SkirtLeft", (0.02, 3.3, 0.08), (-1.795, 0, 0.04), mat=sk, bevel=0.003)
    box("Rug", (1.7, 1.25, 0.012), (0.35, 0.05, 0.006), mat=material("rug", HEX["rug"], 0.95),
        bevel=0.004)


def build_furniture():
    wood = material("bed_wood", HEX["bed_wood"], 0.5)
    linen = material("linen", HEX["linen"], 0.85, sheen=0.4)
    box("BedFrame", (1.45, 2.0, 0.26), (-1.07, 0.58, 0.13), mat=wood, bevel=0.02)
    box("Headboard", (1.45, 0.07, 0.95), (-1.07, 1.56, 0.6), mat=wood, bevel=0.02)
    box("Mattress", (1.38, 1.92, 0.2), (-1.07, 0.6, 0.36), mat=linen, bevel=0.05)
    box("Pillow1", (0.55, 0.36, 0.13), (-1.4, 1.3, 0.52), rot=(0, 0, 3), mat=linen, bevel=0.06)
    box("Cushion", (0.36, 0.14, 0.32), (-0.98, 1.36, 0.6), rot=(-14, 0, 6),
        mat=material("cushion", HEX["cushion"], 0.8, sheen=0.3), bevel=0.06)
    # Nightstand + lamp.
    night = material("night", HEX["night"], 0.6)
    box("Nightstand", (0.42, 0.38, 0.5), (-0.1, 1.36, 0.25), mat=night, bevel=0.015)
    cyl("LampBase", 0.06, 0.22, (-0.08, 1.4, 0.61), mat=material("lampbase", "#D9D2C6", 0.4))
    cyl("LampShade", 0.14, 0.18, (-0.08, 1.4, 0.8), radius_top=0.09,
        mat=material("shade", HEX["shade"], 0.9))
    # Desk under the window.
    dw = material("desk_wood", HEX["desk_wood"], 0.5)
    box("DeskTop", (1.2, 0.58, 0.04), (0.75, 1.27, 0.75), mat=dw, bevel=0.008)
    for i, (x, y) in enumerate(((0.18, 1.02), (1.32, 1.02), (0.18, 1.52), (1.32, 1.52))):
        box(f"DeskLeg{i}", (0.04, 0.04, 0.73), (x, y, 0.365), mat=dw, bevel=0.004)
    # Wall shelf above the bed (left wall).
    box("Shelf", (0.22, 0.95, 0.03), (-1.69, 0.6, 1.38), mat=material("shelf", HEX["shelf"], 0.5),
        bevel=0.005)
    # Plant on the desk corner.
    cyl("Pot", 0.08, 0.14, (1.22, 1.43, 0.84), mat=material("pot", HEX["pot"], 0.5),
        radius_top=0.09)
    leaf = material("leaf", HEX["leaf"], 0.6)
    for i in range(9):
        a = i * 40
        sphere(f"Leaf{i}", 0.1, (1.22 + 0.07 * math.cos(math.radians(a)),
                                 1.43 + 0.07 * math.sin(math.radians(a)), 1.0 + 0.03 * (i % 3)),
               scale=(1.0, 0.35, 0.12), rot=(25 + 6 * (i % 3), 0, a), mat=leaf)
    # Laundry basket near the bed foot.
    cyl("Basket", 0.21, 0.42, (-0.12, -0.55, 0.21), mat=material("basket", HEX["basket"], 0.9),
        radius_top=0.24)


def build_stateful():
    chair = material("chair", HEX["chair"], 0.55)
    # Chair: seat + back + legs, grouped under an empty so it moves as one.
    root = bpy.data.objects.new("ChairRoot", None)
    _collection().objects.link(root)
    parts = [box("ChairSeat", (0.44, 0.42, 0.04), (0, 0, 0.46), mat=chair, bevel=0.01),
             box("ChairBack", (0.44, 0.04, 0.42), (0, -0.2, 0.7), rot=(-6, 0, 0), mat=chair,
                 bevel=0.01)]
    for i, (x, y) in enumerate(((-0.19, 0.18), (0.19, 0.18), (-0.19, -0.18), (0.19, -0.18))):
        parts.append(box(f"ChairLeg{i}", (0.03, 0.03, 0.45), (x, y, 0.225), mat=chair,
                         bevel=0.004))
    for p in parts:
        p.parent = root
    states(root, before=((0.55, 0.42, 0), (0, 0, -32)), after=((0.75, 0.92, 0), (0, 0, 180)))

    linen = material("duvet", HEX["duvet"], 0.85, sheen=0.4)
    throw = material("throw", HEX["throw"], 0.9, sheen=0.3)
    # Duvet: crumpled and sliding off (before) / flat and folded back (after).
    states(blob("DuvetCrumpled", (1.5, 1.5, 0.16), (-0.95, 0.35, 0.52), rot=(0, -8, 9), mat=linen,
                strength=0.12, noise=0.45, seed=3), vis="before")
    states(box("DuvetFlat", (1.42, 1.45, 0.08), (-1.07, 0.35, 0.5), mat=linen, bevel=0.035),
           vis="after")
    states(box("ThrowFolded", (1.42, 0.32, 0.05), (-1.07, -0.25, 0.565), mat=throw, bevel=0.02),
           vis="after")
    states(blob("ThrowHeap", (0.7, 0.55, 0.12), (0.05, -0.15, 0.07), rot=(0, 0, 25), mat=throw,
                strength=0.09, noise=0.3, seed=5), vis="before")
    # Second pillow: on the floor (before) / on the bed (after).
    states(box("Pillow2", (0.55, 0.36, 0.13), (-0.75, 1.3, 0.52), mat=material("linen2",
           HEX["linen"], 0.85, sheen=0.4), bevel=0.06),
           before=((-0.25, 0.75, 0.07), (8, 4, 38)), after=((-0.78, 1.3, 0.52), (0, 0, -2)))

    # Books: scattered (before) / upright on the shelf (after).
    for i, hc in enumerate(BOOKS):
        bk = box(f"Book{i}", (0.03, 0.17, 0.24), (0, 0, 0), mat=material(f"book{i}", hc, 0.6),
                 bevel=0.003)
        before = [((0.55, -0.2, 0.016), (0, 90, 20)), ((0.85, 0.15, 0.016), (0, 90, -35)),
                  ((-0.6, -0.95, 0.016), (0, 90, 70)), ((-0.85, 0.05, 0.6), (0, 90, 15)),
                  ((0.2, 0.42, 0.016), (0, 90, -60)), ((1.0, 1.2, 0.79), (0, 90, 10))][i]
        h = (0.24, 0.21, 0.23, 0.19, 0.22, 0.2)[i]
        bk.scale.z = h / 0.24
        after = ((-1.69, 0.3 + i * 0.042, 1.395 + h / 2), (0, 0, 0))
        states(bk, before=before, after=after)

    # Mugs + tray.
    states(box("Tray", (0.36, 0.24, 0.02), (0.45, 1.3, 0.78), mat=material("tray", HEX["tray"],
           0.5), bevel=0.006), vis="after")
    for i, hc in enumerate(MUGS):
        m = cyl(f"Mug{i}", 0.042, 0.095, (0, 0, 0), mat=material(f"mug{i}", hc, 0.35))
        before = [((-0.3, 0.2, 0.0475), (0, 0, 0)), ((-0.05, 1.3, 0.5475), (0, 0, 0)),
                  ((1.05, 1.08, 0.8175), (0, 0, 0))][i]
        after = ((0.36 + i * 0.09, 1.3, 0.8375), (0, 0, 0))
        states(m, before=before, after=after)

    # Papers: scattered (before) / neat stack (after).
    pm = material("paper", HEX["paper"], 0.9)
    for i in range(6):
        pp = box(f"Paper{i}", (0.21, 0.297, 0.002), (0, 0, 0), mat=pm, bevel=0)
        before = [((0.55, 1.2, 0.772), (0, 0, 25)), ((0.9, 1.35, 0.772), (0, 0, -40)),
                  ((0.35, -0.5, 0.013), (0, 0, 15)), ((0.6, -0.65, 0.013), (0, 0, -70)),
                  ((1.1, 1.25, 0.773), (0, 0, 75)), ((-0.05, 0.95, 0.013), (0, 0, 33))][i]
        after = ((0.95, 1.33, 0.772 + i * 0.0025), (0, 0, 2))
        states(pp, before=before, after=after)

    # Cardboard box: open in the middle of the floor (before) / closed under the desk (after).
    card = material("card", HEX["card"], 0.8)
    states(box("CardOpen", (0.42, 0.34, 0.3), (0.95, -0.35, 0.15), rot=(0, 0, 18), mat=card,
               bevel=0.004), vis="before")
    for j, (dx, rx) in enumerate(((-0.2, -120), (0.2, 120))):
        fl = box(f"CardFlap{j}", (0.02, 0.32, 0.17), (0, 0, 0), mat=card, bevel=0.002)
        a = math.radians(18)
        x0, y0 = 0.95 + dx * math.cos(a), -0.35 + dx * math.sin(a)
        states(fl, before=((x0, y0, 0.36), (0, rx / 4, 18)), vis="before")
    states(box("CardClosed", (0.42, 0.34, 0.3), (0.45, 1.3, 0.15), mat=card, bevel=0.004),
           vis="after")

    # Clothes: heaps (before) / folded stack in the basket (after).
    heaps = [((0.15, -0.45, 0.05), (0, 0, 10)), ((-0.75, 0.0, 0.58), (0, 0, -20)),
             ((0.62, 0.42, 0.52), (0, 0, 35)), ((-0.45, -1.05, 0.05), (0, 0, 60))]
    for i, hc in enumerate(CLOTHES):
        cm = material(f"cloth{i}", hc, 0.95, sheen=0.5)
        states(blob(f"ClothHeap{i}", (0.42, 0.34, 0.09), heaps[i][0], heaps[i][1], mat=cm,
                    strength=0.06, noise=0.22, seed=10 + i), vis="before")
        states(box(f"ClothFolded{i}", (0.3, 0.24, 0.045), (-0.12, -0.55, 0.44 + i * 0.047),
                   rot=(0, 0, 4 * (i % 2)), mat=cm, bevel=0.015), vis="after")

    # Shoes: scattered (before) / paired by the wall (after).
    for i in range(4):
        sm = material(f"shoe{i // 2}", SHOES[i // 2], 0.6)
        sh = box(f"Shoe{i}", (0.1, 0.27, 0.09), (0, 0, 0), mat=sm, bevel=0.035)
        before = [((0.2, -1.0, 0.045), (0, 0, 40)), ((0.75, -0.95, 0.045), (0, 75, -20)),
                  ((-0.55, 0.6, 0.045), (0, 0, 110)), ((1.2, 0.3, 0.045), (0, 0, -15))][i]
        after = ((1.6 - (i // 2) * 0.28 - (i % 2) * 0.12, -0.9, 0.045), (0, 0, 0))
        states(sh, before=before, after=after)


def build_lights_camera():
    scn = bpy.context.scene
    # World: soft daylight sky (seen through the window and as ambient fill).
    world = scn.world or bpy.data.worlds.new("RR_World")
    scn.world = world
    world.use_nodes = True
    bg = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs[0].default_value = hex_rgba("#DCE6EE")
    bg.inputs[1].default_value = 0.42
    # Morning sun through the window: rays go toward -y and steeply downward, slightly
    # to -x, so the window cross lands as a readable patch on the rug (the brand's
    # "sunbeam"), instead of washing the whole floor.
    sun_data = bpy.data.lights.new("RR_Sun", type="SUN")
    sun_data.energy = 5.0
    sun_data.angle = math.radians(1.5)
    sun_data.color = (1.0, 0.86, 0.66)
    sun = bpy.data.objects.new("RR_Sun", sun_data)
    _collection().objects.link(sun)
    d = Vector((-0.3, -1.0, -1.25)).normalized()
    sun.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    sun.location = (0.7, 3.0, 3.0)
    # Gentle fill from the camera side so shadows keep detail.
    fill_data = bpy.data.lights.new("RR_Fill", type="AREA")
    fill_data.energy = 35
    fill_data.size = 2.2
    fill_data.color = (1.0, 0.96, 0.92)
    fill = bpy.data.objects.new("RR_Fill", fill_data)
    _collection().objects.link(fill)
    fill.location = (1.3, -1.35, 2.3)
    fill.rotation_euler = (Vector((-0.6, 0.9, 0.75)) - Vector(fill.location)).to_track_quat(
        "-Z", "Y").to_euler()
    # Phone-like camera: ~26 mm equivalent, held at chest height in the doorway corner.
    cam_data = bpy.data.cameras.new("RR_Cam")
    cam_data.lens = 22
    cam_data.sensor_width = 36
    cam = bpy.data.objects.new("RR_Cam", cam_data)
    _collection().objects.link(cam)
    cam.location = (1.42, -1.42, 1.5)
    target = Vector((-0.35, 0.65, 0.55))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    scn.camera = cam


def configure_render(samples=32, res=(1080, 1440)):
    scn = bpy.context.scene
    engines = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
    for candidate in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        if candidate in engines:
            try:
                scn.render.engine = candidate
                break
            except TypeError:
                continue
    ee = scn.eevee
    for attr, val in (("taa_render_samples", samples), ("use_shadows", True),
                      ("use_raytracing", True), ("use_gtao", True)):
        if hasattr(ee, attr):
            try:
                setattr(ee, attr, val)
            except (TypeError, AttributeError):
                pass
    scn.render.resolution_x, scn.render.resolution_y = res
    scn.render.resolution_percentage = 100
    scn.render.image_settings.file_format = "PNG"
    scn.render.image_settings.color_mode = "RGB"
    scn.render.film_transparent = False
    try:
        scn.view_settings.view_transform = "AgX"
        scn.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        pass


def build():
    clear_scene()
    build_room()
    build_furniture()
    build_stateful()
    build_lights_camera()
    configure_render()
    set_state("before")


def render_state(state, out_dir):
    set_state(state)
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"room_{state}.png")
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    return path


def _cli(argv):
    args = dict(zip(argv[::2], argv[1::2])) if len(argv) % 2 == 0 else {}
    out = args.get("--out", "renders")
    samples = int(args.get("--samples", 32))
    w, h = (int(v) for v in args.get("--res", "1080x1440").split("x"))
    build()
    configure_render(samples, (w, h))
    for st in ("before", "after"):
        print("ROOMRESET render:", render_state(st, out))
    if "--save" in args:
        set_state("before")
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(args["--save"]))


if "--rr-cli" in sys.argv:
    _argv = sys.argv[sys.argv.index("--rr-cli") + 1:]
    _cli(_argv)
