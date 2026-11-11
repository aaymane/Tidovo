# T1.1 — Planche « Morning Clarity » et études de mouvement

Prototype sans build (HTML, CSS, JS modules). Il sert à **décider** :
- le moteur des galets ;
- la palette ;
- la forme des galets ;
- le ressenti au doigt.

Ce n'est pas encore l'application.

## Lancer

```sh
cd design/art-direction
python3 -m http.server 5173 --bind 127.0.0.1
# puis ouvrir http://127.0.0.1:5173/
```

Les modules ES exigent un serveur : `file://` ne fonctionne pas.

## Tester sur votre iPhone 13
Le serveur doit être visible sur votre réseau local. **C'est une décision qui vous revient** : en session, l'exposition réseau a été bloquée par sécurité, et je ne l'ai pas contournée.

1. Mac et iPhone sur le même Wi-Fi, ou iPhone en partage de connexion.
2. Sur le Mac : `cd design/art-direction && python3 -m http.server 5173 --bind 0.0.0.0`
3. Adresse du Mac : `ipconfig getifaddr en0` (à la session du 2026-11-10 : `172.20.10.7`, réseau de partage de connexion).
4. Sur l'iPhone, dans Safari : `http://<adresse>:5173/`. Arrêtez le serveur (Ctrl+C) après les tests.

Ajoutez `?perf=1` à n'importe quelle étude pour afficher les mesures en direct : temps de frame p50, p95 et max, images de plus de 20 ms, et état de la boucle (« au repos (0 rAF) »). Une capture d'écran de cet encart après avoir joué donne la mesure **réelle sur iPhone**.

## Ce qu'il y a à tester

| Page | À essayer | À juger |
|---|---|---|
| `index.html` | Glisser le galet dans son empreinte ; Matin, Midi, Soir ; palette Air ou Lin | La matière, la lumière, la palette |
| `study-placed.html` | « Fait », swipe vers le haut ou le bas, « Plus tard », « Annuler » ; **comparer CSS, Blender et 3D** | Quel moteur donne le meilleur ressenti ? |
| `study-dock.html` | Toucher un onglet, **balayer le dock au pouce**, toucher le galet Reset | Le rai de soleil, le berceau, le viseur |
| `study-atmosphere.html` | Bouger le doigt, activer « Inclinaison » ; comparer Shader, Sprites et Uni ; Matin ou Soir | Arrière-plan vivant en 3D floutée : beauté, lisibilité, chauffe |
| `study-reveal.html` | Laisser la mise au point se faire, puis glisser la lumière n'importe où sur la photo | L'émotion, la lisibilité, la couture cachée |

Le ⚙︎ de chaque page ouvre les réglages : son, vibrations (Android), **haptique iOS expérimentale** (iOS 18+, à essayer sur votre iPhone 13), mouvement calme, mesures.

## Fichiers
- `css/rr.css` : tokens (palettes Air et Lin, thème Soir, lumière globale) et composants.
- `js/spring.js` : ressorts **identiques à Motion** (formule vérifiée dans le code source de motion-dom 14.12.0), friction, interpolations ; zéro rAF au repos.
- `js/feel.js` : son synthétisé, haptique, lumière selon l'heure, mouvement calme, réglages, annonces pour le lecteur d'écran.
- `js/perf.js` : mesures en direct (`?perf=1`) ; `window.rrPerf` pour les tests automatisés.
- `js/missions.js` : données et fonctions pures (trajectoire de vol).
- `js/placed.js` : étude Placed et moteur DOM (variantes CSS et sprites Blender).
- `js/placed-webgl.js` : moteur WebGL (Three.js r187) ; plateau en heightfield qui se creuse à l'impact.
- `js/dock.js`, `js/reveal.js`, `js/board.js`, `js/blur.js`.
- `blender/build_sample_room.py`, `blender/rr_sample_room_v001.blend` : chambre d'exemple avant/après, entièrement procédurale.
- `blender/build_pebble_sprites.py` : galets satinés du moteur « Blender ».
- `assets/` : images web (`room-*.jpg` : 155 Ko pour les deux ; `pebbles/*.webp` : 17,6 Ko pour les cinq).

## Régénérer les assets Blender

```sh
B=/Applications/Blender.app/Contents/MacOS/Blender
$B -b --factory-startup --python design/art-direction/blender/build_sample_room.py -- --rr-cli \
  --out design/art-direction/blender/renders --samples 64 --res 1080x1440 \
  --save design/art-direction/blender/rr_sample_room_v001.blend
$B -b --factory-startup --python design/art-direction/blender/build_pebble_sprites.py -- --rr-cli \
  --out design/art-direction/blender/renders/pebbles
# Conversion web : ffmpeg -q:v 3 (JPEG) ; cwebp -q 86 -alpha_q 92 (WebP)
```

Durées mesurées sur ce Mac (Intel 2017) : chambre en 14 s pour les deux états ; galets en 5 s pour les cinq.
