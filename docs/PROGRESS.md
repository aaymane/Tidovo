# ROOMRESET — Progression

> Mise à jour à la fin de **chaque** tâche. Le journal (§9) est en ajout seulement.

## 1. État courant
| | |
|---|---|
| **Dernière mise à jour** | 2026-11-10, ~20 h 50 |
| **Dernière étape livrée** | **T1.1** — Planche de direction artistique et étude de mouvement interactive (🔍 en revue). T0.1 a été validée et commitée par le fondateur. |
| **Étape en cours** | Aucune : **en attente du test sur iPhone 13 et des choix du fondateur** (moteur, palette, forme) |
| **Prochaine tâche** | **T2.1** — Spike IA : schéma, consignes et harnais (chemin critique ★ ; demande votre clé API et un budget). Alternative : T1.2, voix de marque. **Non commencée.** |

## 2. Fichiers de T1.1
**Nouveaux**
- `design/art-direction/` (28 fichiers, 5,4 Mo, `.blend` compris) :
  - `index.html` (planche) ; `study-placed.html`, `study-dock.html`, `study-reveal.html` ; `README.md` (test sur iPhone) ;
  - `css/rr.css` ;
  - `js/` : `spring`, `feel`, `perf`, `missions`, `blur`, `placed`, `placed-webgl`, `dock`, `reveal`, `board` ;
  - `blender/build_sample_room.py`, `blender/build_pebble_sprites.py`, `blender/rr_sample_room_v001.blend` ;
  - `assets/room-before.jpg`, `assets/room-after.jpg`, `assets/pebbles/*.webp`.
- `docs/BRAND.md` (identité visuelle v1).

**Modifiés**
- `docs/DECISIONS.md` (ADR-018 à 020) ;
- `docs/ROADMAP.md` (statut de T1.1) ;
- `docs/MOTION_SYSTEM.md` (§15, journal v0.3) ;
- `docs/QA_CHECKLIST.md` (matrice d'appareils) ;
- `docs/TOOL_AUDIT.md` (§11).

**Déjà commités par le fondateur pendant la session** (`2b650e7`, 20:23) : `CLAUDE.md` (règles absolues, Motion non définitif) et `.gitignore` (rendus Blender ignorés).

## 3. Vérifications de T1.1 (preuves)
| Vérification | Résultat |
|---|---|
| Console (Chrome, 4 pages, 3 moteurs, matin et soir) | **0 erreur, 0 avertissement**, après correction de 5 défauts trouvés par les tests |
| Parcours *Placed* (Fait, swipe vers le haut, Plus tard) | « 2 sur 5 missions placées » dans les 3 moteurs (Playwright, toucher CDP) |
| Safari iOS 17.2 (simulateur iPhone 15 Pro Max) | Moteur 3D fonctionnel ; parcours complet jusqu'au ticket « RESET ✓ » ; dock, reveal et planche rendus |
| Mouvement réduit | Au repos 120 ms après « Fait » ; la progression s'applique |
| 0 rAF au repos | Vérifié après chaque scénario, sur toutes les pages |
| Temps de frame (Chrome headless, horloge plafonnée à 60 Hz) | p95 16,8 ms pour tous ; pire frame 33 ms (3D, après préchauffage des shaders) ; **indicatif seulement** |
| Temps de frame (simulateur, GPU du Mac) | 3D : p95 18–21 ms, max 113 ms ; **non représentatif de l'iPhone 13** |
| Vol image par image (screencast) | Trajectoire corrigée : elle sortait de l'écran ; elle se bombe désormais vers le centre |
| Poids (gzip) | Base DOM ~19 Ko ; sprites 17,6 Ko ; 3D +4,7 Ko de moteur et ~194 Ko de Three.js (CDN minifié) |
| Contrastes | Calculés en direct dans la planche ; le seul échec, la lumière seule (1,58:1), est traité par un bord |
| Rendus Blender | Chambre avant/après (même caméra, même lumière) en 14 s ; 5 galets en 5 s |
| Revue `motion-director` sur captures réelles | Voir §8 |

**Non vérifié** : le ressenti et les mesures **sur l'iPhone 13** ; l'haptique iOS expérimentale ; le son sur appareil.

## 4. Défauts trouvés par les tests et corrigés pendant T1.1
1. **Chaque clic réinitialisait l'étude.** `setDaypart()` posait `data-daypart` sur `<html>`, qui recevait donc l'écouteur des boutons. Corrigé avec `data-rr-daypart` et des sélecteurs restreints aux boutons.
2. `hidden` annulé par `display: flex` (toast, message du héros). Règle globale `[hidden] { display: none !important }`.
3. Galet suivant placé 27 px trop bas (mesure pendant l'animation de la carte).
4. Impact déclenché ~0,4 s après l'arrivée visuelle (attente du repos du ressort).
5. Trajectoire sortant de l'écran.
6. Toast « Annuler » qui recouvrait « Plus tard ».
7. Avertissements WebGL `texImage3D` (`flipY` des textures canvas).
8. Pics de 83–167 ms au premier vol 3D (shaders non précompilés).
9. Three.js qui chargeait son cœur non minifié (290 Ko gzip).
10. Images forcées à 1440 px de haut (attributs `width`/`height` sans `height: auto`).
11. Plateau 3D trop sombre le soir.
12. Polices Google bloquant le rendu (~25 s dans le simulateur).
13. Schéma « Profondeur » invisible (transformations 3D CSS).
14. Crash de Blender causé par mon script (itération pendant une mutation).
15. Régression que j'ai introduite moi-même : guillemets échappés dans `onload` (erreur JS sur toutes les pages). Détectée par la dernière passe de tests, puis corrigée.
16. Moteur 3D trop gourmand sous CPU ×4 (p95 33 ms). Ombre 1024², maillage du plateau à 3,2 px : p95 16,8 ms. Les mesures headless varient fortement d'une passe à l'autre (Mac chargé par le simulateur et Blender) : **non concluant pour départager les moteurs**.

## 5. Décisions à prendre par le fondateur
| # | Décision | Comment trancher |
|---|---|---|
| D8 | **Moteur des galets** : CSS, Blender ou 3D (ADR-018) | Jouer l'étude Placed sur l'iPhone 13 avec `?perf=1` ; envoyer les captures de l'encart |
| D9 | **Palette du jour** : Air (proposée) ou Lin (ADR-019) | Bascule dans la planche |
| D10 | Forme des galets : organique ou cercle | Section Matières de la planche |
| D11 | Son activé par défaut ou proposé | Réglages de l'étude |
| D4 à D7 | Inchangées (budget IA, Supabase, hébergement) | Voir l'historique T0.1 |

## 6. Travail reporté
- Captures dans `design/art-direction/captures/` : remplacées par des captures de QA produites en session et décrites ici, pour ne pas alourdir le dépôt. À produire si vous les voulez versionnées.
- Mesures de référence sur iPhone 13 : nécessitent votre test.
- T4.1 (moteur physique maison) et P12 (natif) : inchangés.

## 7. Statut Git
- Branche `master`, **aucun remote configuré** (le push ne peut pas partir sans `git remote add origin …`).
- Commits du fondateur : `8cbda3a` (T0.1) et `2b650e7` (20:23).
- À commiter pour T1.1 : `design/` et `docs/`. Claude n'a exécuté aucune commande Git d'écriture.

## 8. Revue critique `motion-director` (captures réelles de T1.1)
Reçue. **Corrections à faire en début de prochaine session (elles terminent T1.1)** :
1. **« Plus tard » laisse un trou dans le plateau.**
   - Passer l'empreinte en `hidden` à la fin du ressort, puis animer les empreintes restantes et les galets placés vers leur nouvelle place (FLIP, `SPRING.settle`), y compris les puits WebGL.
   - Compteur « x sur (N − plus tard) ».
   - `.tray-head h1 { white-space: nowrap }`.
2. **Le toast « Annuler » est trop fort.**
   - Fond `var(--card)`, bouton en texte `--light-ink`, libellé court.
   - L'annulation de « Plus tard » va dans la rangée `.later`.
3. **Deux soleils** (sens du rai incohérent avec les ombres) : `--beam-skew = lx × 22deg` (matin positif, soir négatif) ; masque en dégradé statique sur `.cone`.
4. **Un vrai impact** : `fly()` passe à une interpolation linéaire de 420 ms, une hauteur en `4τ(1−τ)` (vitesse maximale au contact), un trajet en ease-out et `onLand` au contact. La carte suivante arrive à `onLand − 60 ms` ; l'écrasement dépend de la taille.
5. **Plateau 3D** : soleil neutre (pas beige) et liseré sombre des empreintes en couleurs de sommet (règle des 3:1).
6. Détails :
   - bord d'empreinte en `var(--ink-3)` ;
   - Reveal recentré (`margin-inline: auto`) ;
   - sprites Blender sans lumière directionnelle (albédo et AO) + reflet CSS piloté par `--lx` (moteur hybride).
- Avis de l'agent sur le moteur : **DOM/CSS**, avec une texture Blender neutre ; l'effet extraordinaire viendra du timing de l'impact. **À confirmer par le test du fondateur sur iPhone 13.**

**Demande design du fondateur (2026-11-10)** : « pas de simple couleur ; surtout un arrière-plan animé et des formes 3D floutées ». C'est la nouvelle tâche **T1.5** (ROADMAP), à faire après la clôture de T1.1. Elle prime sur le principe « rien ne bouge sans cause » pour le plan 0 (atmosphère). La table interactive reste calme.

## 9. Journal des étapes (ajout seulement)
| Date | Tâche | Événement |
|---|---|---|
| 2026-11-10 | T0.1 | Audit, vision, direction v0.2, roadmap, ADR 001 à 017, mémoire du projet. Livrée, puis validée et commitée par le fondateur (`8cbda3a`). |
| 2026-11-10 | T1.1 | Planche « Morning Clarity », 3 études, moteur *Placed* en 3 variantes (CSS, sprites Blender, Three.js), chambre et galets rendus dans Blender. Tests Chrome et Safari iOS ; 14 défauts trouvés et corrigés ; ADR 018 à 020. Livrée pour revue. **Arrêt : attente du test sur iPhone 13 et des choix du fondateur.** |
