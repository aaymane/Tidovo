"""ROOMRESET — pebble sprites for the "Blender" material engine of the Placed study (T1.1).

Top-down orthographic renders with alpha, satin stone material, morning light from the
upper-left (same direction as the CSS/WebGL engines' default). Shadows are NOT baked:
the UI draws its own contact shadow so lift height can change it.

  /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup \
    --python design/art-direction/blender/build_pebble_sprites.py -- --rr-cli \
    --out design/art-direction/blender/renders/pebbles
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector

PEBBLES = {  # id: (tint hex, seed) — mirrors MISSIONS in js/placed.js
    "dishes": ("#EBCB86", 0.4), "clothes": ("#B9CFBF", 1.77), "books": ("#C3CFD9", 3.14),
    "papers": ("#E4DFD2", 4.51), "box": ("#DDBF9C", 5.88),
}


def lin(h):
    h = h.lstrip("#")
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return tuple(f(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4)) + (1.0,)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def pebble(seed, tint):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=64, v_segments=40, radius=1.0)
    w, h = 1.0, 0.86
    rz = h * 0.32 * 2  # same proportions as the WebGL engine (radii, not diameters)
    for v in bm.verts:
        x, y, z = v.co
        th = math.atan2(y, x)
        wob = 1 + 0.035 * math.sin(3 * th + seed) + 0.022 * math.sin(5 * th + seed * 1.7)
        zz = z * 0.62 if z < 0 else z
        v.co = Vector((x * w * wob, y * h * wob, zz * rz * 0.5))
    me = bpy.data.meshes.new("Pebble")
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new("Pebble", me)
    bpy.context.scene.collection.objects.link(ob)
    mat = bpy.data.materials.new("Satin")
    mat.use_nodes = True
    bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    for s in bsdf.inputs:
        ident = s.identifier
        if ident == "Base Color":
            s.default_value = lin(tint)
        elif ident == "Roughness":
            s.default_value = 0.42
        elif ident in ("Coat Weight",):
            s.default_value = 0.28
        elif ident in ("Coat Roughness",):
            s.default_value = 0.38
        elif ident in ("Sheen Weight",):
            s.default_value = 0.45
        elif ident in ("Sheen Roughness",):
            s.default_value = 0.55
    me.materials.append(mat)
    return ob


def rig(res=(300, 258)):
    scn = bpy.context.scene
    world = bpy.data.worlds.new("W")
    scn.world = world
    world.use_nodes = True
    bg = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs[0].default_value = lin("#E9EEE8")
    bg.inputs[1].default_value = 0.9
    sun = bpy.data.objects.new("Sun", bpy.data.lights.new("Sun", type="SUN"))
    sun.data.energy = 3.2
    sun.data.angle = math.radians(8)
    sun.data.color = (1.0, 0.94, 0.85)
    d = Vector((0.62, -0.78, -1.1)).normalized()  # light travels toward lower-right, down
    sun.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    scn.collection.objects.link(sun)
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = 2.0 / 0.88
    cam.location = (0, 0, 5)
    cam.rotation_euler = (0, 0, 0)
    scn.collection.objects.link(cam)
    scn.camera = cam
    engines = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
    for cand in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        if cand in engines:
            scn.render.engine = cand
            break
    if hasattr(scn.eevee, "taa_render_samples"):
        scn.eevee.taa_render_samples = 64
    scn.render.film_transparent = True
    scn.render.resolution_x, scn.render.resolution_y = res
    scn.render.image_settings.file_format = "PNG"
    scn.render.image_settings.color_mode = "RGBA"
    try:
        scn.view_settings.view_transform = "AgX"
    except TypeError:
        pass


def main(out):
    os.makedirs(out, exist_ok=True)
    for pid, (tint, seed) in PEBBLES.items():
        reset()
        rig()
        pebble(seed, tint)
        path = os.path.join(out, f"pebble-{pid}.png")
        bpy.context.scene.render.filepath = path
        bpy.ops.render.render(write_still=True)
        print("ROOMRESET sprite:", path)


if "--rr-cli" in sys.argv:
    args = sys.argv[sys.argv.index("--rr-cli") + 1:]
    opts = dict(zip(args[::2], args[1::2]))
    main(opts.get("--out", "renders/pebbles"))
