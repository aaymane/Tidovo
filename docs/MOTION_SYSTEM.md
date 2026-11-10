# ROOMRESET — Motion System & direction artistique

> **Version 0.2** — 2026-11-10 (T0.1). Elle intègre la référence « Glassy Navigation Tabs V5 », la règle du fondateur (« s'inspirer, faire mieux, adapter ») et la revue critique indépendante de l'agent `motion-director` (§2.5).
> Les valeurs numériques (couleurs, ressorts, budgets) sont des **propositions v0**. Elles seront calibrées et validées en T1.1 (planche et étude interactive), T3.3 (noyau motion) et T4.2 (champ, mesures sur appareil).
> Règle d'or : **trois interactions extraordinaires valent mieux que trente animations médiocres.**

---

## 1. Intention

### 1.1 Le concept : « Tout retrouve sa place »
Le mouvement de ROOMRESET **raconte physiquement le geste de ranger**. Des objets **posés de travers** sur une table, qu'on soulève et qu'on dépose **dans leur empreinte**. Une lumière du matin qui **traverse la pièce**. Un chemin qui **pousse** à chaque Reset.

| Verbe | Paire d'états | Où il s'exprime |
|---|---|---|
| **Se poser** (*Place*) | **Loose → Lifted → Placed** | Missions, plateau d'empreintes, confirmations |
| **S'éclaircir** (*Clear*) | **Haze → Clarity** | Atmosphère de session, chargement, Reveal |
| **Pousser** (*Grow*) | **Path → Life** | Reset World : chaque Reset ajoute un tronçon de chemin, et la vie pousse le long |

### 1.2 Personnalité du mouvement
Calme, tactile, **pesant**, discrètement joueur. **Des objets qui ont du poids, vus de dessus, dans une pièce ensoleillée.** Le repos est un état noble : **rien ne bouge sans cause.** Ni cartoon élastique, ni flottement perpétuel.

### 1.3 Principes
1. Le mouvement est un **feedback** ou un **récit**, jamais une décoration.
2. Chaque geste reçoit une réponse **dans la frame** (état pressé en moins de 16 ms).
3. Tout est **interrompable et réversible** ; la vélocité est conservée lors d'une reprise.
4. **Le doigt est la cause.** Les effets partent du point de contact.
5. **Chaque geste a un sens produit** : vers le haut = fait, vers le bas = plus tard. Aucun geste gratuit.
6. **La géographie est stable** : le haut = le plan et ce qui est fait (plateau) ; le centre = maintenant (la carte) ; le bas = plus tard (la file).
7. L'intensité est réservée aux moments mérités : *Placed*, *Reveal*, *Grow*. Une cérémonie se passe et ne dépasse pas 2 s.

---

## 2. Références : analyse, transformation, revue

**Méthode (2026-11-10).** Inspection `ffprobe` ; planches de 12 images par vidéo ; bandes image par image (2,4 à 7,5 i/s) sur les transitions clés ; « énergie de mouvement » mesurée par le score de changement de scène FFmpeg sur la zone d'interface recadrée. Commandes dans `references/README.md`.
**Règle du fondateur, pour toutes les références :** aucune n'est un modèle à copier. On en extrait un principe, on le re-fonde sur le sens du produit, et on fait **mieux**.

> Le fichier `references/roomreset-motion-reference.mp4` cité dans le brief n'existe pas. Les cinq vidéos et cinq images présentes ont été analysées.

### 2.1 Référence principale — écran de connexion « Aura » (concept tiers)
11,38 s, 1170×2532, HEVC environ 60 i/s. C'est une **story qui filme un vrai téléphone tenu en main**, pas une capture d'écran. La publication affirme que c'est fait en Flutter : non vérifiable.

| Timecode | Observation |
|---|---|
| 0,0 – 2,4 s | Dégradé chaud plein écran (orange → corail → lie-de-vin), scène **entièrement floue** ; flaque de lumière bleue avec point tactile ; mise au point progressive ; label « SEND » |
| ≈ 1,3 – 3,0 s | Titre en serif italique ; des dizaines de **bulles de verre irisées** avec portraits ; tailles d'environ 1 à 10 ; bulles sombres d'actions (SEND, RECEIVE, SWAP) |
| 3,2 – 8,8 s | **Répulsion** au doigt ; grosses bulles floues au premier plan ; **trois plans de parallaxe** ; bulles devant et derrière les boutons |
| 9,0 – 10,6 s | **Panneau dépoli qui s'ouvre depuis le bouton** et devient une feuille plein écran ; fond très flou ; repli symétrique |

**Énergie de mouvement** : un fond continu (0,003 à 0,08) et des pics de 0,11 à 0,28 entre 9,1 et 10,5 s (morph). Limite : les mouvements de la main contaminent la mesure, et aucune courbe exacte n'est extractible d'une vidéo filmée.

### 2.2 Références secondaires
| Référence | Observation |
|---|---|
| **iOS Feedback Patterns** (7,5 s) | Grille de 9 patterns : Dynamic Island, Live Activity, HUD, Action sheet, Swipe actions, Haptic, Jiggle, Symbol effect, Shake to undo |
| **Parcours de paiement** (22 s, simulateur iOS) | Carrousel de cartes, slide-to-pay, terminal 3D, **ticket imprimé** avec tampon « PAID », passage du clair au sombre |
| **Teaser cinétique** (19,2 s) | Faux appel entrant iOS, compte à rebours typographique « glitch », gros plan d'œil, date |
| **Palettes à halos** (IMG_6633 à 6635) | Pilules empilées et rétro-éclairées : prune → corail, encre → lavande → ambre, forêt → sauge → bronze |
| **Navigations flottantes** (IMG_6636 et 6637) | Barre chaude avec bouton central + ; barre avec orbe IA lumineux « What's Up? » |

### 2.3 « Glassy Navigation Tabs V5 » (ajoutée le 2026-11-10)
9,6 s, 720×1280, H.264 30 i/s. Démo **à la souris** (aucune preuve tactile) : quatre barres d'onglets en verre posées sur la **photo d'un salon**.

| Barre | Mécanique de l'indicateur actif (observée image par image) |
|---|---|
| 1 — Verre sombre | Le **contour se soulève en cloche** autour de l'onglet actif (trait menthe lumineux) et glisse |
| 2 — Verre sombre | Un **plafonnier** projette un **cône de lumière** sur l'icône active |
| 3 — Verre sombre | L'icône active dans un **disque qui sort de la barre** ; la barre se creuse en **berceau** dessous (encoche liquide) |
| 4 — Verre dépoli chaud | Barre beige translucide ; au tap, elle rosit et une **goutte s'extrude** vers le haut |

**Énergie mesurée** : ≤ 0,016 (hors carton de fin : 0,357). Le mouvement est très localisé, sur un fond immobile.

### 2.4 Transformations : de l'inspiration à ROOMRESET, en mieux
| Référence | Principe extrait | Version ROOMRESET | Pourquoi c'est mieux |
|---|---|---|---|
| Aura — bulles flottantes | Objets interactifs vivants | **Galets posés sur une table, vus de dessus** : poids, ombre de contact, **libellé visible** (« Évier · 2 min »), **taille = durée seulement**. Ils **tombent** de l'endroit de la photo où se trouve la tâche | Le mouvement porte une information lisible ; structure opposée au flottement d'Aura |
| Aura — flottement perpétuel | Une ambiance vivante | **Le repos comme récompense** : un galet touché se soulève, glisse avec friction, se repose ; rien ne bouge sans cause | Calme pour une personne débordée ; batterie préservée ; originalité |
| Aura — des dizaines de bulles | Densité spectaculaire | **7 galets visibles au maximum**, le reste « plus tard » | L'abondance angoisse quand la pièce est en désordre |
| Aura — mise au point d'intro | Flou → net | **Focus pull mérité** sur la photo *après*, au Reveal | Émotion reliée à un vrai résultat |
| Aura — morph bouton → feuille | Continuité depuis l'action | Le **galet Reset** du dock s'enfonce dans son berceau puis **devient le viseur** ; feuilles en papier opaque | Même continuité, sans flou coûteux |
| Aura — flou animé plein écran | Atmosphère | **Calques pré-floutés en fondu** (opacité seule), générés une fois sur l'appareil | Tient sur Safari mobile |
| Glassy — cône de lumière | Indicateur lumineux | **Rai de soleil** incliné selon l'angle de lumière global et l'heure. Il désigne l'onglet actif du dock **et la « première petite victoire »** dans le champ | Un seul langage de lumière dans toute l'app |
| Glassy — encoche liquide | Le contenant accueille | **Berceau** du galet Reset dans le dock, et surtout **les empreintes** : chaque mission a **sa** place creusée dans le plateau dès le choix du temps | Le plan et la progression sans pourcentage ; le « clic » a un sens |
| Glassy — verre dépoli sur photo d'intérieur | UI translucide sur un espace réel | **Vitre dépolie** pour le **seul** dock ; pendant la session, **ta pièce floutée** sert de fond | Personnel ; un seul `backdrop-filter` |
| Glassy — démo à la souris | Micro-interactions précises | **Pensé pour le pouce** : balayage du dock, cibles de 44 px, marges contre le geste retour de Safari, équivalents clavier et VoiceOver | Prouvé au toucher |
| iOS Feedback Patterns | Vocabulaire de retours | **Carte des retours** : le plateau sert de HUD ; swipe haut = fait (avec bouton) ; en édition, les galets frémissent (*jiggle*) ; « Annuler » visible 5 s | Un pattern par événement, pas de soupe |
| Paiement — ticket imprimé | Clôture physique | **Reset Receipt** : le **plateau rempli** devient le visuel du ticket (missions, temps, tampon « RESET ✓ »), partageable **sans photo** | Satisfaisant et respectueux de la vie privée |
| Teaser cinétique | Typographie en mouvement | **Film de lancement** (Remotion) : des noms de missions épars qui *se posent* dans leurs empreintes ; captures réelles uniquement | Le langage de marque en vidéo |
| Palettes à halos | Profondeur sombre lumineuse | **Thème Soir** : nuit verte, lumière de lampe, contrastes vérifiés | Le goût du fondateur, au service du concept |
| Navigations, orbe IA | Action centrale ; présence IA | **Galet Reset** central ; la **luciole** incarne l'IA | Un personnage-lumière propre |

**Rejeté explicitement** : néon menthe sur verre sombre, bosse de contour, teinte rose, goutte extrudée, bulles irisées à avatars, dégradé orange / lie-de-vin, **flottement perpétuel, répulsion à distance, parallaxe sur le champ**, et toute mise en page reprise.

### 2.5 Revue critique indépendante (agent `motion-director`, 2026-11-10)
Revue écrite de la v0.1, sans rendu (l'agent n'a pas vu les vidéos). Les constats ont été **intégrés dans cette v0.2** :

| Constat | Correctif intégré |
|---|---|
| *The Scatter* recréait l'indécision : pas de libellé, la taille codait trois choses, le lancer ne voulait rien dire, la première victoire était invisible | Pastille de libellé opaque ; taille = durée seulement ; lancer supprimé (bas = plus tard) ; la première victoire est éclairée par le rai de soleil et porte le bouton principal (§8.1) |
| *Placed* n'avait pas de géographie ; `layoutId` interpole en ligne droite et déforme un `clip-path` | Axe vertical stable (§1.3) ; seul le galet vole, le long d'une courbe de Bézier (§8.2) ; forme en `border-radius` à 8 valeurs (§3.3) |
| La raclette traitait l'*avant* comme une saleté (jugement) ; le balayage était coûteux ; elle entrait en conflit avec le geste retour de Safari ; la couture montrait le désalignement | **Sunrise Reveal** : la lumière du matin traverse la pièce ; uniquement des `transform` ; la bande couvre la couture ; photo en retrait des bords (§8.3) |
| La chorégraphie restait « la structure d'Aura en pierre » | Vue de dessus, poids, repos, pas de parallaxe sur le champ, poussée seulement au contact, feuilles opaques (§3.4, §4) |
| Proposition : **l'empreinte** | Adoptée : elle structure le plan, le *Placed*, le Receipt et le chemin du monde (§8.2, §8.4) |
| Le moteur physique est le poste le plus coûteux | **Reporté après M1** : Motion `drag` et `dragTransition` suffisent (ADR-017) |

---

## 3. Direction artistique « Morning Clarity »
> La lumière d'un matin dans une pièce qu'on vient de ranger : air clair, lumière chaude et rasante, surfaces mates, ombres douces, chaque chose à sa place.

### 3.1 Palette v0 (contrastes calculés, formule WCAG 2.x)
**Thème Jour**
| Token | Hex | Rôle | Contraste mesuré |
|---|---|---|---|
| `paper` | `#F5F0E8` | Fond (lin chaud) | — |
| `surface` | `#FFFCF7` | Cartes, feuilles | — |
| `ink` | `#15231E` | Texte principal (encre de mousse) | 14,34:1 sur `paper` · 15,89:1 sur `surface` |
| `ink-2` | `#4B5B54` | Texte secondaire | 6,33:1 sur `paper` |
| `ink-3` | `#7A8780` | Texte auxiliaire (grand texte seulement) | 3,30:1 sur `paper` |
| `sun` | `#F2B33D` | Lumière, récompense (aplat) | `ink` dessus : 8,75:1 |
| `sun-ink` | `#8A5300` | Accent textuel chaud | 5,58:1 sur `paper` |
| `sage` | `#8DB89C` | Placé, succès (aplat) | `ink` dessus : 7,33:1 |
| `sage-ink` | `#2E6A4D` | Texte succès | 5,64:1 sur `paper` |
| `coral` | `#E27A62` | Attention, rare (aplat) | `ink` dessus : 5,57:1 |
| `coral-ink` | `#A13F2A` | Texte d'alerte | 5,68:1 sur `paper` |

**Thème Soir**
| Token | Hex | Rôle | Contraste mesuré |
|---|---|---|---|
| `night` | `#0F1A16` | Fond (nuit verte) | — |
| `night-surface` | `#18261F` | Cartes | — |
| `text` | `#F1EADF` | Texte principal | 14,90:1 sur `night` · 13,16:1 sur `night-surface` |
| `text-2` | `#A8B4AD` | Texte secondaire | 8,30:1 sur `night` |
| `lamp` | `#F5BE55` | Lumière de lampe | 10,49:1 sur `night` |
| `sage-night` | `#94C3A5` | Placé, succès | 8,99:1 sur `night` |
| `coral-night` | `#F08E77` | Attention | 7,49:1 sur `night` |

**Constat mesuré, contrainte non négociable.** En thème Jour, les aplats `sun` (**1,64:1**) et `sage` (**1,96:1**) sur `paper` sont **sous les 3:1** exigés pour les éléments non textuels (WCAG 1.4.11). Un état, une empreinte ou une limite n'est **jamais** porté par l'aplat seul : il faut un bord teinté d'encre, une ombre interne ou de contact, une icône ou un texte. À vérifier en T1.1 sur les rendus réels.

**Thèmes et lumière du jour** : le thème suit le système (Jour/Soir), avec un réglage manuel. À l'intérieur de chaque thème, une **teinte et un angle de lumière** (`--light-angle`) varient selon l'heure locale : matin frais avec la lumière venant de la gauche, soir chaud et bas comme une lampe. Les variables CSS sont mises à jour au plus une fois par heure, sans animation. Ce même angle oriente les ombres des galets, le rai du dock et la lumière du Reveal.

### 3.2 Typographie (disponibilité vérifiée sur Google Fonts le 2026-11-10)
- **Titres et chiffres forts : Bricolage Grotesque.** Variable : graisse 200–800, chasse 75–100 %, taille optique ; latin-ext (accents FR) et vietnamien. Chaleureuse et un peu « bricolée », comme la maison.
- **Interface et texte : Figtree.** Variable : graisse 300–900, italiques ; latin et latin-ext.
- Auto-hébergées via `next/font` (aucune requête vers Google à l'exécution). Budget : ≤ 120 Ko WOFF2.
- À vérifier en T1.1 : chiffres tabulaires pour le minuteur, rendu FR (`é è ê à ç œ « » ’`), poids réel des sous-ensembles.
- Échelle mobile v0 (fluide) :

  | Style | Taille / interligne |
  |---|---|
  | Display | 40/44 → 56/60 |
  | H1 | 32/36 |
  | H2 | 24/28 |
  | Texte | 17/24 |
  | Légende et pastilles | 13/18 |
  | Minuteur | 64, chiffres tabulaires |

  Interlettrage : −1,5 % sur Display ; +6 % sur les petites capitales.

### 3.3 Matières
- **Papier** (surfaces d'interface, feuilles, cartes) : mat et chaud, filet de lumière de 1 px en haut, ombre de contact douce et serrée. **Les feuilles sont toujours en papier opaque.**
- **Galet** (objet de mission) : satiné, en **superellipse organique obtenue par un `border-radius` à 8 valeurs en %** (par exemple `48% 52% 46% 54% / 52% 47% 53% 48%`), propre à chaque galet. **Jamais en `clip-path`**, que les animations de layout déforment. Lumière radiale orientée par `--light-angle`, ombre de contact au sol (la hauteur est exprimée par l'ombre, pas par l'échelle), glyphe de catégorie en creux, **bord teinté d'encre**. Une **pastille de libellé opaque** sous le galet (« Évier · 2 min ») est **toujours visible**. Trois tailles seulement, qui codent **uniquement la durée** (≤ 2 min, ≤ 5 min, > 5 min).
- **Empreinte** : le creux d'un galet dans le **plateau**. Même `border-radius` et même glyphe en creux, ombre interne, contour d'encre ≥ 3:1. Visible dès le choix du temps.
- **Lumière** : flaques de lumière très douces et un **rai de soleil** diagonal. Jamais de néon.
- **Vitre dépolie** (fenêtre) : réservée au **seul élément flottant**, le *Light Dock*. Teinte lin translucide, grain léger, filet de lumière sur le bord haut. C'est le **seul `backdrop-filter`** de l'app ; les libellés gardent ≥ 4,5:1 sur le pire fond testé.
- **Verre clair** : réservé au **terrarium**. Deux verres, deux rôles : la vitre laisse passer la lumière, le bocal protège la vie.

### 3.4 Modèle de profondeur (3 plans)
| Plan | Contenu | Parallaxe | Interactif |
|---|---|---|---|
| **0 — Atmosphère** | Lumière, voile, photo personnelle floutée (§8.6) | **Aucune** (seule la lumière évolue) | Non |
| **1 — Table** | Galets, plateau d'empreintes, file ; vue **de dessus** ; la hauteur se lit dans l'ombre | **Aucune** (le glisser reste 1:1) | Oui |
| **2 — Surface** | Cartes, dock, boutons, texte | Aucune | Oui |

La parallaxe et l'inclinaison sont **réservées au terrarium** (le monde est un objet qu'on tient). Le texte vit **uniquement** sur le plan 2, ou sur un fond suffisamment opaque.

### 3.5 Iconographie et illustration
- Icônes en trait arrondi (1,75 px sur une grille de 24) ; glyphes de catégories dans la même famille : surfaces, sol, linge, vaisselle, déchets, papiers, lit, divers.
- Monde : vectoriel 2.5D en couches, palette restreinte, grain statique léger.
- **La luciole** : un point de lumière chaude avec une courte traîne, sans visage ni dialogue. Elle apparaît pendant le scan, dans les états vides et le soir dans le terrarium. Nom à choisir en T1.2.

---

## 4. Principes physiques : poids, friction, repos

### 4.1 Trois états
| | **LOOSE** (posé de travers) | **LIFTED** (soulevé) | **PLACED** (dans son empreinte) |
|---|---|---|---|
| Position | Sur la table, au repos | Sous le doigt, 1:1 | Dans son empreinte |
| Rotation | ±6° (figée) | Se redresse vers 0° pendant le geste | 0° |
| Ombre | Contact serrée | Plus haute, plus diffuse, décalée selon `--light-angle` | Fusionnée avec l'ombre interne de l'empreinte |
| Échelle | 1 | 1,06 | 1, avec un écrasement de 4 % à l'impact |
| Mouvement propre | **Aucun** | Suit le doigt | **Aucun** |

### 4.2 Lois
- **Rien ne bouge sans cause.** Aucune errance, aucune dérive ambiante sur la table.
- **Soulever** : au `pointerdown`, `lift` (ombre et échelle). Le galet passe **au-dessus** des autres (z-order), comme un objet qu'on prend : pas de collision en M1.
- **Glisser** : 1:1 sous le doigt. Au relâchement, il **glisse avec friction** (inertie décroissante via `dragTransition` : `power` et `timeConstant`), puis `drop` (petit rebond d'atterrissage, l'ombre se resserre).
- **Zones et sens** : relâché dans l'empreinte (à moins de 24 px ou avec une vitesse dirigée vers elle) ⇒ *Placed* ; relâché dans la bande basse ⇒ **plus tard** ; ailleurs ⇒ il reste où il est posé. Aucun lancer gratuit.
- **Bords** : élastique (`dragElastic` ≈ 0,2) ; **aucune zone de saisie à moins de 20 px des bords de l'écran** (geste retour de Safari).
- **Masse** : la taille (donc la durée) module la friction ; les grosses missions sont plus lourdes et glissent moins.
- **Moteur physique maison** : **reporté après M1** (ADR-017), réévalué seulement si l'on a besoin de collisions ou de poussée entre galets.

---

## 5. Tokens de mouvement (v0, à calibrer en T3.3 et T4.2)
Les ressorts utilisent Motion `{ type: "spring", visualDuration, bounce }` (API vérifiée : `bounce` 0 = amortissement critique ; `stiffness`, `damping` et `mass` écrasent `bounce` et `duration` ; un ressort interrompu reprend la vélocité courante).

| Token | Usage | `visualDuration` | `bounce` |
|---|---|---|---|
| `press` | Retour d'un bouton relâché | 0,18 s | 0,25 |
| `lift` | Soulever un galet | 0,16 s | 0 |
| `drop` | Reposer un galet sur la table | 0,35 s | 0,2 |
| `flight` | Progression 0 → 1 du vol vers l'empreinte | 0,50 s | 0 |
| `snap` | Impact dans l'empreinte, interrupteurs | 0,30 s | 0,18 |
| `settle` | Cartes, listes, réorganisations | 0,45 s | 0,08 |
| `morph` | Galet Reset → viseur, bouton → feuille | 0,52 s | 0,12 |
| `sheet` | Feuilles | 0,40 s | 0,04 |
| `reveal` | Reveal, croissance | 0,80 s | 0,15 |
| **Friction** | Glissé après relâchement (`dragTransition`) | `power` ≈ 0,2 · `timeConstant` ≈ 200 ms | — |

| Tween | Courbe | Durée |
|---|---|---|
| `fade-in` | `cubic-bezier(0.22, 1, 0.36, 1)` | 180 ms |
| `fade-out` | `cubic-bezier(0.4, 0, 1, 1)` | 120 ms |
| `light` | Sinusoïde in-out | 600–1200 ms (changements de lumière uniquement) |

**Échelle des durées** : micro 80–120 ms · courte 180–240 ms · moyenne 320–450 ms · longue 600–900 ms · cérémonie 1 200–2 000 ms (Reveal seulement, toujours passable).
**Décalages** : 35 ms, 8 éléments au maximum, dans l'ordre de la cause. **Sorties ≈ 65 % des entrées.** Une interruption repart toujours de la valeur et de la vélocité courantes.

---

## 6. Interaction tactile
- **Pression** : bouton à 0,97 avec une ombre resserrée dès `pointerdown`, puis `press` au relâchement. Galet : `lift`.
- **Cibles** : ≥ 44×44 px ; galet visuel ≥ 52 px, avec 8 px de marge de toucher.
- **Gestes** : `touch-action: none` **seulement** sur la table ; aucune action n'existe uniquement sous forme de geste (chaque glisser a son bouton : « Fait », « Plus tard », « Placer »).
- **Haptique** :

  | Événement | Retour |
  |---|---|
  | Placed | 12 ms |
  | Session terminée | Motif `[10, 40, 18]` |
  | Tic d'onglet du dock | 6 ms |
  | Erreur | Aucun |

  Via la Vibration API, **absente de Safari iOS**. L'astuce iOS 18 `<input type="checkbox" switch>` est **à tester sur appareil, sans promesse**.
- **Son** (opt-in, proposé à la première mission) : Web Audio, fichiers de moins de 20 Ko. *Placed* = un « tock » boisé dont **la hauteur monte d'un degré par placement** (une petite gamme de session). Fin = un accord aérien. « Plus tard » = silence. Jamais avant un geste de l'utilisateur.

---

## 7. Géographie et transitions d'écran

### 7.1 La géographie de session (stable)
```
┌──────────────────────────────┐
│  PLATEAU d'empreintes  (fait) │  ← haut : le plan et la progression
│                               │
│     CARTE de la mission       │  ← centre : maintenant (son galet posé dessus)
│        [ Fait ]               │
│                               │
│  FILE  « plus tard »           │  ← bas : ce qui attend, sans pression
│  [ dock ]                      │
└──────────────────────────────┘
```
Swipe vers le haut sur la carte = **fait** ; vers le bas = **plus tard**. Les boutons équivalents sont toujours visibles.

### 7.2 Transitions
| De → vers | Mécanisme | Ressort | Note |
|---|---|---|---|
| Dock → Scan | Le **galet Reset** s'enfonce dans son berceau, puis **devient le viseur** | `press` puis `morph` | Continuité depuis l'action |
| Photo → Analyse | La photo se pose dans un cadre ; la luciole commence son balayage | `settle` | Messages honnêtes (§8.5) |
| Analyse → Table | La photo remonte en vignette ; les galets **tombent** de leur zone de la photo sur la table (ombre qui se resserre, petit rebond, rotation qui se fige) | `drop` + décalage | Tap pour passer |
| Table → choix du temps | Les **empreintes** du plan se creusent dans le plateau ; les galets retenus s'ordonnent, les autres glissent dans la file | `settle` | §8.1 |
| Table → Mission | La première carte monte au centre avec **son galet posé dessus** | `settle` | Le focus passe sur la carte |
| Mission → mission | *Placed* (§8.2), puis la carte suivante monte de la file | `flight` + `snap` + `settle` | Non bloquant dès 150 ms |
| Mission → Reveal | Plateau complet : un éclat de lumière le parcourt, il se **scelle** | `reveal` | Visuel du Reset Receipt |
| Reveal → Monde | Les galets du plateau deviennent un **nouveau tronçon de chemin** dans le terrarium ; une pousse naît au bout | `reveal` | §8.4 |
| Retour arrière | Inverse exact de l'aller | Identique | Continuité spatiale |
| Feuille | Papier opaque, depuis l'élément source ; fermeture en glissant vers le bas avec reprise de vélocité ; le dock se retire | `sheet` | Aucun flou |

Implémentation : Motion (`layoutId` pour les cartes à coins simples, `MotionValue` et `useTransform` pour les vols en courbe). View Transitions API à évaluer pour les fondus entre routes (T3.5).

### 7.3 Le *Light Dock* (navigation)
- **Forme** : dock flottant en vitre dépolie (plan 2), à 12 px au-dessus de l'indicateur d'accueil. Quatre destinations et, au centre, le **galet Reset** dans son **berceau** (le bord haut se creuse sous lui). Proposition : Accueil · Monde · ● Reset · Coach · Réglages (choix final en T3.5).
- **Indicateur actif, le rai de soleil** : un faisceau doux tombe du bord haut sur l'onglet actif. Il est **incliné selon `--light-angle`**, plus frais le matin et chaud comme une lampe le soir. Au changement d'onglet, la source glisse avec `snap`, et le cône **traîne** légèrement en proportion de la vitesse. L'icône se réchauffe (`sun`) et monte de 2 px.
- **Balayage au pouce** : la lumière suit le doigt le long du dock ; on relâche pour choisir ; tic haptique par onglet (Android).
- **Rendu** : contour en chemin SVG (creux gaussien piloté par un ressort), faisceau en dégradé CSS, un seul `backdrop-filter`, aucun rAF au repos.
- **Accessibilité** : `nav` avec `aria-current` ; libellés visibles ; contraste ≥ 4,5:1 sur le pire fond ; en mode réduit, le faisceau saute avec un fondu de 120 ms, sans traîne.

---

## 8. Animations signature

### 8.1 S1 — *The Scatter* (les missions sur la table)
- **Arrivée** : les galets tombent de la photo sur la table (§7.2). **7 visibles au maximum** ; les autres forment la pile « +N plus tard ».
- **Lisibilité d'abord** : chaque galet porte sa **pastille de libellé** ; **taille = durée**. La **première petite victoire** choisie par l'IA est **éclairée par le rai de soleil** et porte le bouton principal « Commencer par celle-ci ».
- **Choix du temps (5/10/20)** : les empreintes du plan se creusent dans le plateau ; les galets retenus s'ordonnent sous elles ; les autres glissent dans la file. La priorisation devient visible physiquement, sans pourcentage.
- **Gestes** : soulever, glisser, poser (§4). Glisser vers le bas = plus tard ; glisser vers une empreinte libre = ajouter au plan. **Pas de lancer.**
- **Rendu** : galets DOM (`<button>`), Motion `drag`, `transform` uniquement ; zéro rAF au repos.
- **Accessibilité** : libellé du type « Évier, 2 minutes, recommandé » ; boutons « Ajouter au plan » et « Plus tard » ; vue liste ; en mode réduit, une grille ordonnée statique.
- **Budget** : p95 du temps de frame ≤ 16,7 ms pendant le glisser (mesuré en T4.2).

### 8.2 S2 — *Placed* (la mission retrouve **sa** place)
- **Entrées** : bouton « Fait » (principal) ; swipe vers le haut sur la carte (secondaire).
- **Séquence** (au repos en ≤ 700 ms, non bloquante dès 150 ms) :
  - **t0** : la carte se comprime (0,97) ; son galet se soulève (`lift`).
  - Le galet **vole seul** vers **son empreinte** : progression `flight` de 0 à 1, courbe de Bézier quadratique via `useTransform` (apex de 60 à 100 px), rotation ramenée à 0°.
  - **Impact** : le plateau **se creuse localement** sous l'empreinte (6 à 10 px, selon la masse) ; le galet s'écrase de 4 % ; les deux remontent ensemble (`snap`). Une chaleur lumineuse s'allume dans l'empreinte (300 ms) ; la lumière de la session monte d'un cran (§8.6) ; « tock » un degré plus haut ; haptique de 12 ms.
  - La carte s'efface et la suivante monte de la file (`settle`).
- **Plus tard** : la carte et son galet glissent vers la file ; **l'empreinte se referme** doucement et le plateau se réorganise (`settle`). Pas de son, pas de rouge, pas de perte : le plan s'adapte.
- **Annuler** : une puce « Annuler » reste visible 5 s.
- **Accessibilité** : `aria-live="polite"` du type « Évier placé. 3 sur 6. » ; en mode réduit, l'empreinte se remplit par un fondu.

### 8.3 S3 — *The Sunrise Reveal* (la lumière traverse la pièce)
- **Prélude, le focus pull** (≤ 900 ms, passable) : la photo *après* apparaît très floue, dans les couleurs de la session, puis la mise au point se fait sur elle (fondu entre 3 calques pré-floutés et l'image nette). La clarté est gagnée.
- **La lumière du matin** : une bande verticale de lumière chaude se tient au bord de la photo. On la fait glisser **n'importe où sur la photo** : derrière la lumière, la pièce *après* ; devant, la pièce *avant*. **On ne nettoie pas l'*avant*, on fait entrer le jour.** Au relâchement, ressort vers le bout le plus proche selon la vitesse ; une traversée complète lance le résumé.
- **Technique** : uniquement des `transform`. Une fenêtre `overflow: hidden` est translatée et l'image *après* contre-translatée à l'intérieur ; la **bande lumineuse recouvre la couture** et masque les petits désalignements. Aucun `clip-path` ni masque recalculé à chaque frame.
- **Ergonomie** : la photo reste à **≥ 20 px des bords** de l'écran (geste retour de Safari) ; clavier via `role="slider"` ; bouton « Montrer l'après ».
- **Honnêteté** : les deux photos sont montrées **sans retouche**. Le cadrage de l'*après* est aidé par la **photo fantôme de l'avant à 30 %** au moment de la prise.
- La cérémonie dure ≤ 2 s et se passe d'un tap.

### 8.4 Reset World — le chemin qui pousse
- Chaque Reset ajoute au terrarium **un tronçon de chemin fait des galets du plateau**, dans leurs couleurs et leurs formes. Une **pousse** naît au bout du tronçon : la tige se dessine (longueur de tracé), puis les feuilles se déplient en `reveal`, avec décalage. La lumière du bocal se réchauffe.
- Les paliers débloquent des éléments (lanterne, banc, fenêtre, lucioles la nuit), annoncés par un projecteur doux et un libellé.
- **Rien ne meurt.** En l'absence de l'utilisateur, le monde se repose (luciole endormie, lumière plus faible). À son retour, la luciole se réveille : on est accueilli, pas jugé.
- Le terrarium **s'incline** avec le doigt (et avec le gyroscope sur opt-in, permission iOS) : 4 à 6 couches de parallaxe et des reflets de verre. C'est la **seule** parallaxe de l'app.

### 8.5 Chargement — le balayage de la luciole
- Pendant l'analyse IA (durée réelle mesurée en T2.2), la luciole parcourt la photo en S lent et sa traîne éclaire brièvement les zones survolées.
- Messages honnêtes, en rotation toutes les 2,5 s environ : « Je regarde les surfaces visibles… », « Je repère ce qui se range vite… », « Je prépare des missions courtes… ».
- Bouton Annuler. Au-delà de 10 s : « Ça prend un peu plus longtemps… ». **Jamais de faux pourcentage.**

### 8.6 Atmosphère personnelle — « ta pièce est la scène »
- Pendant une session, le plan 0 est **ta propre photo** réduite et **très floutée** : un champ de couleurs abstrait aux teintes de ta pièce, aucun détail lisible.
- La progression ne rend **jamais** l'*avant* plus net. Elle fait **monter la lumière** : exposition et chaleur augmentent d'un cran à chaque *Placed*. La netteté est réservée à la photo *après* (§8.3).
- Technique : versions floutées générées **une fois** sur l'appareil, par sous-échantillonnage dans un canvas (compatible Safari, sans `ctx.filter`), puis fondus d'opacité entre calques de lumière. La photo ne quitte jamais l'appareil pour cet usage.

### 8.7 Welcome — « Pose-le à sa place »
- Premier contact : **un seul galet** posé de travers et **une seule empreinte**. On le glisse dedans (ou on touche « Placer ») : clic, chaleur, lumière qui monte. La promesse apparaît alors, avec le CTA « Commencer un Reset gratuit ».
- En 3 secondes, l'utilisateur a **déjà fait le geste central du produit**. Ce n'est pas un nuage d'objets décoratifs : c'est l'opposé de la structure d'Aura.

---

## 9. États : chargement, vide, erreur
- Pas de squelettes gris scintillants. Au-delà de 300 ms, des flaques de lumière respirent une fois (sans boucle infinie) ; en dessous, rien.
- État vide : la luciole, une phrase, une action.
- Erreur : jamais d'alarme rouge pour une action de l'utilisateur. Le corail est réservé, et il y a **toujours une suite** (mode manuel).

---

## 10. Performance

### 10.1 Budgets cibles (à mesurer, jamais à affirmer)
| Mesure | Cible |
|---|---|
| p95 du temps de frame pendant les interactions principales | ≤ 16,7 ms (iPhone du fondateur, Safari) |
| Palier `lite`, Chrome émulé CPU ×4 | ≤ 20 ms |
| Tâches longues pendant une interaction | Aucune > 50 ms |
| JS initial de la route Welcome | ≤ 170 Ko gzip |
| LCP · CLS · INP | ≤ 2,5 s · ≤ 0,05 · ≤ 200 ms |
| Polices | ≤ 120 Ko |
| Mémoire | Tas stable (±10 %) sur 20 min |

### 10.2 Règles
- N'animer que `transform` et `opacity` ; `will-change` uniquement pendant l'animation.
- **Aucun flou animé.** Les flous sont des calques pré-calculés en fondu. `backdrop-filter` est réservé au **seul *Light Dock***, qui se retire quand une feuille s'ouvre.
- **Pas de `clip-path` ni de masque animé.** Les formes passent par `border-radius` ; le Reveal par des translations.
- **Zéro rAF au repos.** La table ne bouge pas sans geste ; le terrarium s'arrête hors écran (`visibilitychange`, `IntersectionObserver`).
- Positions écrites via des `MotionValue` ou des refs, **jamais dans un état React à chaque frame**.

### 10.3 Paliers
| Palier | Quand | Ce qui change |
|---|---|---|
| `full` | Par défaut | Tout |
| `lite` | Sonde FPS : p75 > 20 ms sur les 2 premières secondes | Lumière de session sans fondu, ombres simplifiées, terrarium sans reflets ni parallaxe |
| `static` | `prefers-reduced-motion` ou « Mouvement calme » | Aucun mouvement continu ; voir §11.1 |

Le palier est mémorisé et peut être forcé dans les réglages.

### 10.4 Protocole de mesure
Overlay `?perf=1` : deltas rAF, p50, p95 et max, tâches longues (`PerformanceObserver`). Traces Chrome via Playwright (CDP), Lighthouse pour le chargement. Sur appareil réel, noter le modèle et la version d'OS. Pour les interactions signature, **enregistrement d'écran puis extraction image par image (FFmpeg)**. Résultats et méthode consignés dans `docs/PROGRESS.md`.

---

## 11. Accessibilité

### 11.1 Correspondance en mode réduit
| Moment | Mode complet | Mode réduit (`static`) |
|---|---|---|
| Table | Soulever, glisser, poser | Grille ordonnée statique + boutons |
| Chute depuis la photo | Chute avec ombre et rebond | Apparition en fondu |
| *Placed* | Vol en courbe, creux d'impact | L'empreinte se remplit en fondu + annonce |
| Lumière de session | Monte en fondu | Change par crans, sans animation |
| Dock | Rai qui glisse avec traîne | Saut avec fondu de 120 ms |
| Reveal | Focus pull et lumière qui traverse | Image nette, curseur sans halo + bouton « Montrer l'après » |
| Monde | Pousse animée, inclinaison | Fondu entre états, sans parallaxe |
| Chargement | Balayage de la luciole | Luciole fixe + texte |

### 11.2 Exigences
- Réglage interne « Mouvement calme », indépendant de l'OS.
- Chaque élément manipulable a son équivalent sémantique (bouton) ; annonces `aria-live` ; focus déplacé après chaque changement de contexte.
- Contraste du texte AA ; non-texte ≥ 3:1 pour les limites, les empreintes et les états (§3.1) ; aucune information par la couleur seule.
- Cibles ≥ 44 px ; aucun geste exclusif ; aucun minuteur qui avance seul ; pas plus de 3 flashs par seconde.
- Respect de `prefers-contrast: more` (bords renforcés) et de `prefers-color-scheme`.

---

## 12. Interdits
Confettis génériques · boucles ou dérives sans cause · lancer gratuit · parallaxe sur la table ou le texte · rebonds partout · 300 ms ease uniforme · cérémonies bloquantes · rouge quand on passe une mission · métaphores qui jugent l'*avant* (essuyer, nettoyer la photo) · fausses barres de progression · culpabilisation sur les séries · flou, ombre, `clip-path` ou masque animés plein écran · plusieurs `backdrop-filter` · 3D décorative lourde · **toute reprise d'une référence telle quelle** (look Aura, indicateurs des Glassy Tabs, ticket « PAID », etc.).

---

## 13. Pipeline et outils
| Besoin | Outil | Raison | Phase |
|---|---|---|---|
| Ressorts, layout, glisser avec friction, vols en courbe | **Motion** (`motion/react` 14.x, MIT) | `drag`, `dragTransition`, `MotionValue`/`useTransform`, vélocité conservée | 3+ |
| Collisions et poussée entre galets | Moteur TS maison (`src/core/physics`), **reporté après M1** ; repli : matter-js | Seulement si le ressenti l'exige (ADR-017) | M2+ |
| Atmosphère personnelle | Canvas 2D (flou par sous-échantillonnage) + fondus d'opacité | Compatible Safari | 6 |
| Contour du dock et du plateau | Un chemin SVG par élément, creux piloté par un ressort | Léger | 3–4 |
| Terrarium | Couches SVG/Canvas 2.5D ; **pré-rendu Blender 4.5** des couches de verre via MCP une fois reconnecté | Vrai verre sans 3D à l'exécution | 8 |
| Animations vectorielles *authored* | Code SVG + Motion d'abord ; LottieFiles Creator seulement sur ADR | Poids des lecteurs | 8+ |
| Son | Web Audio + petits fichiers | — | 6 |
| Films marketing | **Remotion** (licence gratuite pour individus et entreprises ≤ 3 employés, `LICENSE.md` lue) + FFmpeg | — | 11 |
| QA visuelle | Playwright (viewports exacts), Safari du simulateur iOS 17.2 (**app Simulator ouverte**), iPhone réel, extraction FFmpeg | La CLI headless de Chrome impose 500 px de largeur minimum (mesuré) | 1+ |

---

## 14. Questions ouvertes (et la tâche qui tranchera)
1. Galet : quelle famille de `border-radius` organiques ? Quelle lisibilité de la pastille à 52 px ? (T1.1)
2. Profondeur du creux d'impact et ressenti au doigt (T1.1 b, iPhone du fondateur).
3. Son activé ou non par défaut ? (T6.3)
4. Haptique iOS via l'astuce `switch` : viable ? (T4.6)
5. Terrarium : sphère, bocal ou jardinière de fenêtre ? Rendu du chemin ? (T1.3)
6. Nom et fréquence de la luciole (T1.2).
7. L'IA fournit-elle des zones assez fiables pour la chute depuis la photo ? (T2.2, mesuré)
8. Dock : quels quatre onglets ? Faisceau ou simple lueur sur les petits écrans ? (T1.1, T3.5)
9. Atmosphère personnelle : quel niveau de flou garantit qu'aucun détail n'est lisible ? (T6.3)
10. Collisions entre galets : nécessaires après les tests M1 ? (fin M1, ADR-017)
