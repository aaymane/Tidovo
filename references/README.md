# Références visuelles — inventaire

Médias tiers fournis par le fondateur (captures de publications Instagram et d'écrans), destinés à l'**inspiration uniquement**.
**Règle du fondateur : aucune référence n'est un modèle à copier. On s'en inspire, on fait mieux, on adapte à ROOMRESET.** La table de transformation se trouve dans `docs/MOTION_SYSTEM.md` §2.4.
Ils restent **locaux** : non redistribuables et exclus de Git (voir `.gitignore` et l'ADR-013 dans `docs/DECISIONS.md`).
L'analyse complète (timecodes, principes retenus, ce qu'on n'emprunte pas) se trouve dans `docs/MOTION_SYSTEM.md` §2.

> Le fichier `roomreset-motion-reference.mp4` cité dans le brief **n'existe pas** sous ce nom. La référence de mouvement principale est `ScreenRecording_11-08-2026 20-35-33_1.MP4`.

| Fichier | Type | Métadonnées (ffprobe, 2026-11-10) | Contenu observé | Usage |
|---|---|---|---|---|
| `ScreenRecording_11-08-2026 20-35-33_1.MP4` | Vidéo verticale | 11,38 s · 1170×2532 · HEVC ~60 i/s · audio AAC · 21,4 Mo | Story Instagram filmant un téléphone : écran de connexion interactif « Aura, where money meets lifestyle » (concept tiers, présenté comme fait en Flutter) — bulles de verre flottantes avec avatars, profondeur de champ, morph bouton → feuille | **Référence principale** de qualité d'interaction |
| `ScreenRecording_11-10-2026 18-33-56_1.MP4` | Vidéo verticale | 7,47 s · 1170×2532 · HEVC ~60 i/s · 9,8 Mo | Post « iOS Feedback Patterns » : grille de 9 patterns (Dynamic Island, Live Activity, HUD, Action sheet, Swipe actions, Haptic feedback, Jiggle mode, Symbol effect, Shake to undo) | Vocabulaire de feedback |
| `fdc799360cc7439e87e3d72b4c076c0f.MP4` | Vidéo verticale | 22,0 s · 720×1280 · H.264 30 i/s · 6,6 Mo | Simulateur iOS : parcours de paiement (carrousel de cartes, slide-to-pay, terminal 3D, ticket de caisse imprimé avec tampon « PAID ») | Métaphores physiques de clôture |
| `b0e2900305704171bca11088107d809c.MP4` *(ajoutée le 2026-11-10 à 19:16)* | Vidéo verticale | 9,6 s · 720×1280 · H.264 30 i/s · audio AAC · 2,0 Mo | « Glassy Navigation Tabs V5 » : 4 barres d'onglets en verre sur la photo d'un salon (bosse lumineuse, cône de lumière, encoche liquide, goutte en verre dépoli chaud), démo à la souris | Indicateurs actifs → *Light Dock*, berceau, vitre dépolie |
| `753ddb12bd9f460fafe37987903bc4f9.MP4` | Vidéo paysage | 19,2 s · 720×406 · H.264 30 i/s · 4,9 Mo | Teaser motion design : faux appel entrant iOS, typographie cinétique « glitch » en compte à rebours, gros plan d'œil, date | Futures vidéos marketing (Remotion) |
| `IMG_6633.PNG` → `IMG_6635.PNG` | Captures 1170×2532 | — | Palettes en pilules empilées avec halos lumineux : (a) `#1A0F2E #3B1B4F #7A2E6F #D6598F #F4D7D4 #FF6B6B` (b) `#1A1A1F #2D2B55 #6A5ACD #A678B9 #F0D9B5 #F4A62A` (c) `#0B0F0D #1F2A1F #3E5A3F #8CA98C #D9C7A3 #B08D57` | Goût couleur du fondateur (sombre, lumineux, chaud) |
| `IMG_6636.PNG` | Capture | — | « Lifestyle App Navigation » : barre flottante chaude avec bouton central + | Idées de navigation |
| `IMG_6637.PNG` | Capture | — | « AI Assistant App Navigation » : barre flottante avec orbe lumineux « What's Up? » | Idées de navigation |

## Régénérer les planches d'analyse (hors dépôt)
```sh
OUT="$TMPDIR/rr-frames"; mkdir -p "$OUT"
ffmpeg -v error -y -i "references/ScreenRecording_11-08-2026 20-35-33_1.MP4" \
  -vf "fps=12/11.38,scale=234:-1,tile=6x2" -frames:v 1 "$OUT/aura_sheet.jpg"
ffmpeg -v error -y -ss 9.0 -t 1.6 -i "references/ScreenRecording_11-08-2026 20-35-33_1.MP4" \
  -vf "fps=7.5,crop=640:1650:220:200,scale=170:-1,tile=12x1" -frames:v 1 "$OUT/aura_sheet_morph.jpg"
```
