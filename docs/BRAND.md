# ROOMRESET — Identité visuelle (v1)

> Version 1 — 2026-11-10 (T1.1). Les choix marqués **à valider** seront tranchés par le fondateur sur preuve, dans `design/art-direction/`.
> Mouvement et motion : `docs/MOTION_SYSTEM.md`. Voix et microcopie : T1.2, section §8 ci-dessous.

## 1. Idée
**« Tout retrouve sa place. »** C'est la lumière d'un matin dans une pièce qu'on vient de ranger. Des objets qui ont du poids, vus de dessus, que l'on pose dans leur empreinte. Une seule lumière, qui suit l'heure.

## 2. Couleur
**Proposition v0.3 : « Air du matin »**, à valider, prototype par défaut. Elle remplace le fond crème de la v0 : un crème chaud associé à un accent terracotta est le cliché le plus fréquent des designs générés. L'air vert-gris pâle se raccorde à la nuit verte et à la mousse.

| Rôle | Jour (Air) | Soir |
|---|---|---|
| Fond | `#E9EEE8` air | `#0F1A16` nuit verte |
| Surface (cartes, feuilles) | `#F7F9F5` | `#18261F` |
| Texte | `#15231E` encre de mousse (13,83:1) | `#F1EADF` (14,90:1) |
| Texte secondaire | `#4B5B54` (6,11:1) | `#A8B4AD` (8,30:1) |
| Lumière | `#F2B33D` soleil (**jamais seul comme limite** : 1,58:1) | `#F5BE55` lampe |
| Accent textuel chaud | `#8A5300` (5,38:1) | — |
| Placé | `#5E8C6E` mousse (3,28:1, non-texte) ; texte `#2E6A4D` (5,44:1) | `#94C3A5` |
| Bord non textuel | `#7C8982` (3,10:1) | `#6E7E76` |
| Attention (rare) | `#A8385A` baie (5,29:1) | `#F08E77` |

Contrastes calculés avec la formule WCAG 2 et recalculés en direct dans `design/art-direction/index.html`. Variante « Lin » (v0) : fond `#F5F0E8`, surface `#FFFCF7`, attention `#A13F2A`.

## 3. Typographie
- **Bricolage Grotesque** (variable : graisse, chasse, taille optique) pour les titres et les chiffres qui comptent. En titre : `wdth 88`, `opsz 72`, graisse 700, interlettrage −2 %.
- **Figtree** (variable) pour l'interface et le texte. Texte courant en 17/24.
- Chiffres tabulaires pour le minuteur : à vérifier visuellement dans la planche (test « 09:41 / 11:11 »).
- Interdits : étiquettes en capitales, mots isolés mis en exergue dans un titre, séparateurs « · » dans l'interface.

## 4. Matières
| Matière | Usage | Règle |
|---|---|---|
| Papier | Cartes, feuilles | Toujours opaque ; contact directionnel selon la lumière |
| Galet | Missions | Superellipse organique en `border-radius` à 8 valeurs ; bord d'encre ≥ 3:1 ; libellé visible ; taille = durée |
| Empreinte | Plateau | Creux, ombre interne orientée, glyphe gravé |
| Vitre dépolie | **Dock uniquement** | Seul `backdrop-filter` de l'app ; libellés ≥ 4,5:1 |
| Verre clair | Terrarium uniquement | Le monde sous verre |

**Trois rendus de galet en comparaison (T1.1) :** CSS procédural, sprites Blender satinés, WebGL réel. Voir `docs/DECISIONS.md` ADR-018.

## 5. Lumière
- **Une seule direction**, issue de `--lx` et `--ly`. Elle oriente les ombres des galets, le rai du dock, la lumière du Reveal et la lumière WebGL.
- Elle varie selon l'heure : **matin** (lumière venant de la gauche, fraîche), **midi** (zénithale), **soir** (venant de la droite, lampe chaude, thème nuit verte).

## 6. Iconographie
Trait arrondi de 1,75 px sur une grille de 24. Glyphes de missions : tasse, t-shirt, livre, feuille, carton, plus les catégories à venir. Les icônes du dock suivent le même trait.

## 7. Monde et guide
- Terrarium sous verre. Chaque Reset y ajoute un **tronçon de chemin fait des galets placés**, et une pousse naît au bout. Rien ne meurt.
- La luciole : un point de lumière chaude, sans visage. Elle incarne l'IA (le scan) et l'accueil au retour.

## 8. Voix et microcopie
À rédiger en T1.2. Principes déjà actés :
- encourager, ne jamais culpabiliser ;
- on ne « nettoie » jamais l'*avant* ;
- verbes simples, en phrases ;
- une action garde le même nom tout au long du parcours (« Fait » → « placé »).
