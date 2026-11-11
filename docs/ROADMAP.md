# ROOMRESET — Roadmap

> Version 0.1 — 2026-11-10 (T0.1). Source de vérité pour l'ordre des tâches.

## Règles
- **Une tâche à la fois**, validée par le fondateur (revue, commit, push) avant la suivante.
- **Les identifiants sont stables** : on ne renumérote jamais. Une tâche ajoutée prend le prochain numéro libre de sa phase (ou un suffixe `a`, `b`).
- **Affinage juste-à-temps** : avant d'ouvrir une phase, ses fiches sont précisées (critères, outils) et l'affinage est consigné dans PROGRESS.
- Une tâche n'est ✅ qu'après **validation du fondateur**. Avant cela, elle est 🔍 (livrée, en revue).

**Légende**
- **Statuts** : ⬜ À faire · 🟨 En cours · 🔍 En revue (livrée) · ✅ Validée · ⏸ Reportée · 🔒 Bloquée.
- **Priorité** : `P0` indispensable au jalon · `P1` important · `P2` souhaitable.
- **Taille** (estimation ±50 %, session Claude + revue) : `S` ≤ 2 h · `M` ≈ 3–4 h · `L` ≈ 6–8 h.
- **Jalon** : `M1★` chemin critique · `M1` · `M2` · `M3` · `M4` · `Later`.

## Jalons et estimation honnête
| Jalon | Contenu | Estimation |
|---|---|---|
| **M1 « Core Loop »** | Boucle principale local-first, web mobile, EN/FR, sans compte ni paiement ; préversion privée pour 5 à 10 testeurs | Chemin ★ ≈ **75 h** ; M1 complet ≈ **100 h** |
| **M2 « Retention »** | Reset World, Home Memory, Daily Coach, partage | ≈ 50–60 h |
| **M3 « Business »** | Comptes, synchronisation, Stripe en test, droits d'accès, paywall, RGPD | ≈ 40–50 h |
| **M4 « Launch »** | QA approfondie, landing, vidéos, bêta publique | ≈ 40–60 h |

**Sur l'objectif des 7 jours.** Sept jours très concentrés (10 à 11 h par jour) permettent de tenir le **chemin ★** : boucle complète, avec les interactions *Scatter* et *Placed* et la raclette au niveau studio, le reste fonctionnel mais sobre. Avec un cycle de revue et de commit après chaque tâche, **M1 complet prend plutôt deux semaines calendaires.** Un monde 3D complet ou un produit mondial mature ne tiennent pas en une semaine.

## Re-séquencement par rapport au brief (ADR-014)
| Phase du brief | Phase de la roadmap |
|---|---|
| 0 Discovery | **P0** |
| 1 Brand & Art Direction | **P1** (avec une étude de mouvement interactive) |
| 4 AI Room Scan (partie risque) | **P2 Spike IA**, avancé pour valider la valeur |
| 2 Creative Foundation | **P3** |
| 3 Signature Experience | **P4** |
| 4 AI Room Scan (intégration) | **P5** |
| 5 Mission Engine | **P6** |
| 8 Before / After | **P7**, avancé : boucle utile avant rétention |
| 6 Reset World | **P8** |
| 7 Home Memory (+ Daily Coach) | **P9** |
| 9 Accounts & Billing | **P10** |
| 10 Quality & Launch | **P11** |
| — | **P12 Natif (Expo)**, plus tard |

---

## P0 — Discovery & Architecture

#### T0.1 — Découverte du projet, audit des outils créatifs, mémoire persistante
`P0` · `M` · `M1★` · Statut : 🔍 En revue · Dépend de : —
- **Description** : auditer le dépôt, Git, les skills, agents et MCP, les outils graphiques et la machine ; analyser les références vidéo ; formaliser la vision et la direction créative ; découper la roadmap ; créer la mémoire du projet.
- **Livrable** : `CLAUDE.md`, `docs/{PRODUCT_VISION,ROADMAP,MOTION_SYSTEM,DECISIONS,PROGRESS,QA_CHECKLIST,TOOL_AUDIT}.md`, `.gitignore`, `references/README.md`.
- **Critères d'acceptation**
  - [x] Audit réel avec preuves (commandes et appels MCP) dans TOOL_AUDIT.
  - [x] Toutes les références analysées (5 vidéos, 5 images), absence du fichier nommé dans le brief signalée.
  - [x] Vision, direction créative et roadmap atomique avec dépendances et critères.
  - [x] Prochaine tâche définie et non commencée.
  - [x] Aucune commande Git d'écriture exécutée ; aucun autre projet modifié.

---

## P1 — Brand & Art Direction

#### T1.1 — Planche de direction artistique et étude de mouvement interactive
`P0` · `L` · `M1★` · 🔍 En revue (livrée le 2026-11-10) · Dépend de : T0.1 validée
- **Description** : un dossier autonome `design/art-direction/` (HTML, CSS et JS sans build ; Motion via CDN épinglé si nécessaire), servi en local et testable au téléphone. Il contient :
  1. **La planche** : palettes Jour et Soir avec les contrastes calculés dans la page ; spécimen Bricolage Grotesque et Figtree en EN/FR ; deux variantes de galet (superellipse irrégulière / cercle) avec leur matière et leur bord ; le modèle de profondeur à 3 plans ; les matières papier, vitre dépolie et verre clair ; des croquis du terrarium et de la luciole.
  2. **L'étude de mouvement interactive** (vraies interactions, pas une vidéo) :
     - (a) **Light Dock** : rai de soleil sur l'onglet actif, réglé sur l'angle de lumière global, avec traîne liée à la vitesse, balayage au pouce et galet Reset dans son berceau ;
     - (b) **Placed et empreintes** : sur l'axe vertical (plateau, carte, file), « Fait » fait voler le galet de la carte dans **son** empreinte, qui se creuse sous l'impact. Le même geste sert au Welcome « Pose-le à sa place » ;
     - (c) **Sunrise Reveal** sur deux photos d'exemple : focus pull, puis bande de lumière du matin qui traverse, uniquement en `transform`.
- **Livrable** : `design/art-direction/` (planche, 3 études, moteur *Placed* en 3 variantes, README de test, scripts et `.blend` Blender) ; `docs/BRAND.md` v1. Captures de QA (Chrome et Safari iOS) et extraction image par image produites en session, hors dépôt.
- **Critères d'acceptation**
  - [x] Texte ≥ 4,5:1 et éléments non textuels ≥ 3:1, table calculée en direct dans la page. Le seul échec, la lumière seule (1,58:1), est signalé et traité par un bord obligatoire.
  - [x] Glyphes FR corrects dans les deux polices (captures Chrome et Safari iOS) ; chiffres tabulaires alignés.
  - [~] Interactions (a), (b), (c) **fonctionnelles au toucher** :
    - vérifié dans Chrome (émulation iPhone 13, toucher CDP) ;
    - vérifié dans Safari iOS 17.2 (simulateur, parcours *Placed* complet jusqu'au ticket) ;
    - **reste : test sur l'iPhone 13 du fondateur, avec `?perf=1`**.
  - [x] Variantes en mouvement réduit présentes et vérifiées (Playwright `reducedMotion`, moteur au repos à 120 ms).
  - [x] Revue critique `motion-director` sur captures réelles : **ses 6 points sont corrigés** et vérifiés (2026-11-11 : tests et captures, voir PROGRESS §8).
  - [ ] Le fondateur choisit le moteur (ADR-018), la palette (ADR-019) et la forme ; ADR-015 et ADR-016 passent en « Acceptée » ou sont amendées.
- **Outils** : skills `frontend-design`, `cinematic-ui`, `visual-qa` ; simulateur iOS ; FFmpeg pour l'analyse image par image.

#### T1.2 — Voix de marque, microcopie EN/FR, nommage
`P1` · `S` · `M1` · ⬜ · Dépend de : T1.1
- **Description** : principes de ton ; lexique (Reset, mission, placé, plus tard…) ; 30 exemples EN/FR (missions, encouragements, erreurs IA, consentement photo, paywall honnête, retour après absence) ; règles typographiques FR ; nom de la luciole et du monde.
- **Livrable** : `docs/BRAND.md` §Voix.
- **Critères** : [ ] aucune formulation culpabilisante ni jugement de propreté (relu avec QA DES-09) · [ ] chaque exemple existe en EN et en FR · [ ] validé par le fondateur.

#### T1.3 — Concept du Reset World et choix technique
`P1` · `M` · `M2` · ⬜ · Dépend de : T1.1
- **Description** : 3 images clés (vide → 5 Resets → 30 Resets) ; prototype de parallaxe à 5 couches dans un masque (pointeur) ; comparaison chiffrée de trois approches : 2.5D SVG/Canvas, couches de verre pré-rendues dans Blender, R3F en temps réel (poids, GPU, temps de production).
- **Livrable** : `design/world/` et une ADR.
- **Critères** : [ ] assets du stade 1 ≤ 300 Ko · [ ] parallaxe mesurée dans le Safari du simulateur · [ ] ADR consignée.

#### T1.4 — Benchmark concurrentiel léger
`P2` · `S` · `M2` · ⬜ · Dépend de : T0.1
- **Description** : Tody, Sweepy, Finch, Unfrozen et deux autres : promesse, boucle, monétisation, prix, forces et faiblesses, d'après des sources publiques. Aucune copie.
- **Livrable** : `docs/COMPETITION.md`.
- **Critères** : [ ] sources citées et datées · [ ] 3 enseignements actionnables · [ ] prix vérifiés à la date.

---

#### T1.5 — Atmosphère vivante : arrière-plan animé et formes 3D floutées
`P0` · `M` · `M1★` · 🔍 En revue (livrée le 2026-11-11) · Dépend de : T1.1 (corrections de la revue appliquées)
- **Description** : demande explicite du fondateur, « pas de simple couleur ». Le plan 0 devient un arrière-plan **animé, avec des galets et des orbes de lumière en 3D floutés** (profondeur de champ, lueurs, grain), qui dérivent lentement et réagissent au doigt ou à l'inclinaison.
- **Comparaison** de deux approches, à disposition identique :
  - (A) shader WebGL plein écran, en demi-résolution ;
  - (B) sprites Blender floutés en CSS statique, animés en `transform`.
- **Livrable** : `design/art-direction/study-atmosphere.html` (nouveaux fichiers uniquement), derrière un écran représentatif : carte de mission et dock.
- **Critères**
  - [x] Lisibilité ≥ 4,5:1 sur le pire pixel derrière le texte, grâce au voile de mise au point. Mesuré sur une image : 8,4 / 8,8 / 4,8 / 6,1:1 (shader matin, sprites matin, shader soir, sprites soir).
  - [x] Mouvement réduit : image fixe, boucle arrêtée (vérifié).
  - [~] Pause quand l'onglet est caché : implémentée (`visibilitychange`), non testée automatiquement.
  - [ ] p95 mesuré sur iPhone 13 (fondateur).
  - [x] Comparaison consignée (ADR-022).
  - [ ] Validation du fondateur.

## P2 — Spike IA : valider la valeur avant de construire

#### T2.1 — Schéma de sortie, consignes v1 et harnais
`P0` · `S` · `M1★` · ⏸ Reportée par le fondateur le 2026-11-11 (« la clé API, pour après ») · Dépend de : T0.1 ; clé API placée par le fondateur dans `spikes/ai-scan/.env.local`
- **Description** : dossier isolé `spikes/ai-scan/` avec son propre `package.json`.
  - Schéma Zod `ScanResult` :
    - **observations visibles**, chacune avec sa preuve ;
    - **missions** : titre, catégorie, minutes, effort 1–3, impact 1–3, confiance, zone normalisée optionnelle, notes de sécurité.
  - Consignes : visible uniquement ; ignorer personnes et documents ; aucun jugement ; aucun avis médical ; ton bienveillant ; EN/FR.
  - Script de lancement qui journalise tokens, latence et coût depuis `usage`.
- **Livrable** : `spikes/ai-scan/` avec un README.
- **Critères** : [ ] typecheck OK · [ ] les tests du schéma rejettent les sorties invalides · [ ] `.env.local` et `photos/` ignorés par Git (vérifié en lecture avec `git check-ignore`) · [ ] **aucun appel API sans accord du fondateur**.

#### T2.2 — Benchmark sur photos réelles
`P0` · `M` · `M1★` · ⏸ Reportée (avec T2.1) · Dépend de : T2.1 ; budget approuvé par le fondateur
- **Description** :
  - 10 à 15 photos réelles fournies par le fondateur (sans personnes, avec le consentement des occupants), réduites à 1280 px.
  - Exécution avec `claude-opus-5-5` (effort `low` et `medium`). Comparaison avec Sonnet 5.5 ou Haiku 5.5 **uniquement si le fondateur l'autorise**.
  - Notation par le fondateur : pertinence, réalisme, hallucinations, temps, ton.
  - Mesures : tokens, latence p50/p90, coût ; fiabilité des zones approximatives.
- **Livrable** : `docs/AI_SCAN_BENCHMARK.md` et consignes v2.
- **Critères** : [ ] ≥ 80 % des missions jugées pertinentes (sinon itération) · [ ] hallucinations comptées par scan · [ ] coût et latence **mesurés** · [ ] dépense ≤ budget approuvé · [ ] recommandation de modèle soumise au fondateur.

---

## P3 — Creative Foundation

#### T3.1 — Scaffold Next.js et outillage qualité
`P0` · `M` · `M1★` · 🔍 En revue (livrée le 2026-11-11, dans `web/`) · Dépend de : T1.1
- **Description** :
  - Next.js 16 App Router, React 19, TS strict (`noUncheckedIndexedAccess`), Tailwind 4, ESLint, Prettier, Vitest, Playwright (`channel: 'chrome'`).
  - Scripts `dev`, `dev:lan`, `build`, `typecheck`, `lint`, `test`, `e2e`.
  - Arborescence `src/{app,core,ui,motion,features,server,i18n}` ; règle lint qui interdit React et Next dans `src/core`.
  - Polices auto-hébergées.
- **Livrable** : une app vide qui compile.
- **Critères**
  - [x] `build`, `typecheck`, `lint` et `test` verts (4 tests) ; `format:check` vert.
  - [x] Règle de pureté de `src/core` prouvée par un fichier sonde.
  - [x] E2E Playwright vert en émulation iPhone 13 : `lang="fr"`, police de marque, 0 erreur, 0 requête en échec ; capture à 390 px.
  - [x] Build de production vérifié dans le Safari du simulateur iOS 17.2.
  - [ ] Page ouverte sur l'iPhone du fondateur (`npm run dev:lan`, à lancer par lui).
  - [x] Versions épinglées consignées ; TypeScript 7 tranché (ADR-023 : 6.0.3).

#### T3.2 — Design tokens en code
`P0` · `S` · `M1★` · ⬜ · Dépend de : T3.1
- **Description** : couleurs Jour et Soir, teinte horaire, angle de lumière global, typographie fluide, espacements de 4 pt, rayons, élévations, z-index (`@theme`) ; tokens de motion en TS ; page `/dev/tokens`.
- **Critères** : [ ] un test Vitest calcule les contrastes de tous les couples déclarés · [ ] aucune couleur codée en dur hors tokens (grep) · [ ] bascule Jour/Soir via le système et le réglage.

#### T3.3 — Noyau du système de motion
`P0` · `M` · `M1★` · ⬜ · Dépend de : T3.2
- **Description** : `src/motion` regroupe :
  - les presets de ressorts ;
  - la préférence de mouvement (OS + « Mouvement calme ») ;
  - les paliers full/lite/static et la sonde FPS ;
  - l'overlay `?perf=1` ;
  - les hooks d'haptique et de son (opt-in).
- **Critères** : [ ] tests unitaires du choix de palier · [ ] l'overlay affiche des mesures réelles sur appareil · [ ] Playwright `reducedMotion: 'reduce'` ⇒ aucune animation continue · [ ] aucun rAF actif au repos.

#### T3.4 — Composants fondamentaux
`P0` · `L` · `M1★` · ⬜ · Dépend de : T3.3
- **Description** : Button (pression physique), IconButton, Card, Sheet en papier opaque (fermeture au glisser avec relais de vélocité), DurationDial 5/10/20, Toast/HUD, **Tray avec empreintes** (`Imprint`), Pebble (forme `border-radius` à 8 valeurs, pastille de libellé), Text ; états hover, press, focus, disabled, loading ; galerie `/dev/components`.
- **Critères** : [ ] clavier et focus visible · [ ] cibles ≥ 44 px · [ ] axe-core : 0 violation critique ou sérieuse · [ ] captures 390 px Jour et Soir · [ ] aucune erreur console.

#### T3.5 — Coquille d'app, Light Dock et transitions d'écran
`P0` · `M` · `M1★` · ⬜ · Dépend de : T3.4
- **Description** :
  - Routes `/`, `/scan`, `/reset/[id]`, `/reveal/[id]`, `/world`, `/settings`.
  - **Light Dock** : navigation flottante en vitre dépolie, rai de lumière sur l'onglet actif, galet « Reset » central dans son berceau (MOTION_SYSTEM §7.3) ; géographie de session haut, centre, bas (§7.1).
  - Transitions dirigées (MOTION_SYSTEM §7), safe areas, pages d'erreur et 404, manifest PWA de base.
- **Critères** : [ ] retour arrière cohérent · [ ] transitions interrompables · [ ] CLS ≤ 0,05 mesuré · [ ] encoche et indicateur d'accueil respectés (simulateur) · [ ] **un seul** `backdrop-filter` visible · [ ] contraste des libellés du dock ≥ 4,5:1 sur le pire fond testé.

#### T3.6 — Internationalisation EN/FR
`P1` · `S` · `M1` · ⬜ · Dépend de : T3.1
- **Description** : next-intl, détection et choix persistant, messages typés, typographie FR, formats de durée.
- **Critères** : [ ] un test échoue si une clé manque · [ ] 100 % des chaînes externalisées · [ ] changement de langue sans perte d'état.

#### T3.7 — Modèle de données et état local-first
`P0` · `M` · `M1★` · ⬜ · Dépend de : T3.1
- **Description** : types du domaine dans `src/core/model` (Room, Scan, Observation, Mission, Session, RewardEvent, WorldState) ; Zustand ; IndexedDB (`idb-keyval`) ; photos en Blob ; schéma versionné avec migrations ; purge totale.
- **Critères** : [ ] tests unitaires (reducers, migrations) · [ ] IndexedDB vide après la purge (test) · [ ] aucune photo ne quitte l'appareil, sauf vers la route de scan (revue de code).

---

## P4 — Signature Interactive Experience

#### T4.1 — Moteur physique 2D (reporté, ADR-017)
`P2` · `M` · `M2` · ⏸ Reportée · Dépend de : retours des tests M1 (T7.5)
- **Description** : à ouvrir **seulement si** les tests M1 montrent un besoin de collisions ou de poussée entre galets. `src/core/physics` en TS pur : cercles avec masse, collisions douces, poussée au contact, friction, sommeil, pas fixe. Repli : matter-js.
- **Critères** : [ ] besoin démontré par les retours M1 · [ ] tests de déterminisme, d'énergie et d'absence de traversée · [ ] temps par pas **mesuré**.

#### T4.2 — La table des missions (*The Scatter*)
`P0` · `L` · `M1★` · ⬜ · Dépend de : T3.3, T3.4
- **Description** :
  - Galets DOM **libellés**, taille = durée, vue de dessus avec ombre de contact.
  - Soulever, glisser et poser avec Motion `drag` et friction (`dragTransition`) ; glisser vers le bas = plus tard ; aucun lancer.
  - Chute depuis la photo ; 7 galets visibles au maximum, pile « plus tard » ; première victoire éclairée par le rai de soleil.
  - Vue liste ; grille statique en mode réduit ; marges de 20 px aux bords ; route `/lab/table`.
- **Critères** : [ ] p95 mesuré sur l'iPhone du fondateur (Safari) et sur Chrome émulé CPU ×4, consigné (cibles 16,7 / 20 ms) · [ ] tas stable sur 10 min (CDP) · [ ] 0 rAF au repos · [ ] aucun conflit avec le geste retour de Safari · [ ] VoiceOver lit chaque galet et son libellé · [ ] ressenti validé par le fondateur.

#### T4.3 — Morph galet ↔ carte de mission
`P0` · `M` · `M1★` · ⬜ · Dépend de : T4.2
- **Critères** : [ ] interrompable · [ ] aucune discontinuité (extraction image par image d'un enregistrement) · [ ] focus déplacé sur la carte · [ ] mode réduit : fondu de 150 ms.

#### T4.4 — *Placed* : complétion dans l'empreinte
`P0` · `M` · `M1★` · ⬜ · Dépend de : T4.3
- **Description** : sur l'axe vertical (plateau, carte, file), seul le galet vole (courbe de Bézier via `MotionValue`) vers **son empreinte**, qui se creuse sous l'impact ; cran de lumière, son et haptique, annonce `aria-live`, puce « Annuler » 5 s. « Plus tard » : l'empreinte se referme sans pénalité.
- **Critères** : [ ] au repos en ≤ 700 ms ; action suivante possible dès 150 ms (mesuré) · [ ] mode réduit · [ ] état conservé après un passage en arrière-plan.

#### T4.5 — Welcome « Pose-le à sa place »
`P0` · `M` · `M1` · ⬜ · Dépend de : T4.4, T3.6
- **Description** : un galet, une empreinte. On le glisse dedans (ou on touche « Placer »), puis la promesse et le CTA « Commencer un Reset gratuit » apparaissent ; lien vers la confidentialité ; aucun compte.
- **Critères** : [ ] test des 5 secondes avec 3 personnes (mené par le fondateur) · [ ] LCP ≤ 2,5 s (Lighthouse mobile) · [ ] JS initial mesuré (cible ≤ 170 Ko gzip).

#### T4.6 — QA appareils des interactions signature
`P0` · `M` · `M1` · ⬜ · Dépend de : T4.5
- **Critères** : [ ] iPhone réel, simulateur (SE 3 et Pro Max), Chrome Android émulé · [ ] mesures consignées (appareil, OS) · [ ] défauts critiques corrigés · [ ] astuce haptique iOS testée.

---

## P5 — AI Room Scan (intégration)

| ID | Tâche | Prio | Taille | Jalon | Dépend de | Critères clés | Statut |
|---|---|---|---|---|---|---|---|
| T5.1 | Capture et import photo, consentement IA | P0 | S | M1★ | T3.5, T3.7 | Safari iOS et Chrome Android ; HEIC géré ; prestataire nommé ; refus ⇒ mode manuel | ⬜ |
| T5.2 | Prétraitement local (taille, orientation, ré-encodage, EXIF) | P0 | S | M1★ | T5.1 | Test : GPS EXIF absent en sortie ; poids typique ≤ 400 Ko mesuré | ⬜ |
| T5.3 | Route `/api/scan` (SDK, Zod, fallbacks, quotas, journal de coûts) | P0 | M | M1★ | T5.2, T2.2 | Tests avec SDK simulé (succès, refus, timeout, sortie invalide) ; aucune clé dans le bundle (grep) ; aucune image persistée | ⬜ |
| T5.4 | Balayage de la luciole et chute des galets depuis la photo | P1 | M | M1 | T5.3, T4.2 | Messages honnêtes ; annulable ; état > 10 s ; mode réduit ; chute depuis les zones si elles sont fiables (T2.2), sinon depuis le centre | ⬜ |
| T5.5 | Revue et correction des observations | P0 | M | M1★ | T5.3 | Retirer en ≤ 2 taps ; ajout depuis le catalogue | ⬜ |
| T5.6 | Erreurs et cas limites (hors ligne, flou, refus, quota) | P0 | S | M1 | T5.3 | Un test E2E par cas ; jamais d'impasse | ⬜ |

## P6 — Mission Engine

| ID | Tâche | Prio | Taille | Jalon | Dépend de | Critères clés | Statut |
|---|---|---|---|---|---|---|---|
| T6.1 | Priorisation et budgets de temps (`src/core/missions`) | P0 | S | M1★ | T3.7 | Budget jamais dépassé de plus de 10 % ; première mission courte ; déterministe (tests) | ⬜ |
| T6.2 | Sélection de session (sélecteur et rassemblement) | P0 | M | M1 | T6.1, T4.2 | Réorganisation en `settle` sans saut ; total affiché ; clavier et VoiceOver | ⬜ |
| T6.3 | Mode mission (une action à la fois) | P0 | L | M1★ | T4.4, T6.1 | Reprise exacte après rechargement ; aucune pénalité ; minuteur non bloquant ; Wake Lock et son en opt-in | ⬜ |
| T6.4 | Fin de session et récompenses | P1 | S | M1 | T6.3 | Récompense liée à l'effort, jamais à la propreté (tests) | ⬜ |
| T6.5 | Mode manuel sans scan (catalogue EN/FR) | P1 | M | M2 | T6.1 | Reset complet sans réseau ni IA | ⬜ |

## P7 — Before / After & Big Reveal

| ID | Tâche | Prio | Taille | Jalon | Dépend de | Critères clés | Statut |
|---|---|---|---|---|---|---|---|
| T7.1 | Photo « après » avec cadrage fantôme | P0 | S | M1★ | T6.3 | Avant à 30 % pour l'alignement ; aucune retouche | ⬜ |
| T7.2 | Focus pull et *Sunrise Reveal* (lumière du matin qui traverse) | P0 | M | M1★ | T7.1 | Uniquement des `transform` ; bande qui couvre la couture ; photo à ≥ 20 px des bords ; glisser, clavier (`role="slider"`), bouton ; p95 mesuré ; mode réduit | ⬜ |
| T7.3 | Résumé et chorégraphie finale (plateau scellé → *Reset Receipt*) | P1 | M | M1 | T7.2, T6.4 | Passable ; ≤ 2 s ; annonces lecteur d'écran | ⬜ |
| T7.4 | Partage avec consentement explicite | P1 | M | M2 | T7.3 | Généré localement, sans photo par défaut ; aucune requête réseau ; écran de consentement | ⬜ |
| T7.5 | QA M1 et préversion privée (hébergement, ADR-012) | P0 | M | M1★ | T7.2, T5.5, T6.3 | Checklist M1 cochée avec preuves ; URL privée ; protocole de test et retours de 5 à 10 testeurs ; go/no-go M2 | ⬜ |

## P8 — Reset World

| ID | Tâche | Prio | Taille | Jalon | Dépend de | Critères clés | Statut |
|---|---|---|---|---|---|---|---|
| T8.1 | Assets du terrarium, stades 1 à 3 (Blender MCP si l'ADR de T1.3 le retient) | P1 | M | M2 | T1.3 | Poids ≤ budget ; rendus validés ; fichiers `.blend` versionnés | ⬜ |
| T8.2 | Scène interactive (parallaxe, inclinaison, vie, veille hors écran) | P1 | M | M2 | T8.1, T3.3 | p95 mesuré ; 0 rAF hors écran ; gyroscope en opt-in | ⬜ |
| T8.3 | Progression du monde (`src/core/world`) : tronçons de chemin issus des galets, paliers | P1 | S | M2 | T3.7, T6.4 | Tests ; le monde ne régresse jamais | ⬜ |
| T8.4 | Séquences d'évolution animées | P1 | M | M2 | T8.2, T8.3 | Conforme à MOTION_SYSTEM §8.4 ; passable ; mode réduit | ⬜ |

## P9 — Home Memory & Daily Coach

| ID | Tâche | Prio | Taille | Jalon | Dépend de | Critères clés | Statut |
|---|---|---|---|---|---|---|---|
| T9.1 | Pièces enregistrées (opt-in) et historique local | P1 | M | M2 | T3.7 | Suppressible pièce par pièce ; photos locales | ⬜ |
| T9.2 | Préférences et apprentissage simple | P2 | S | M2 | T9.1 | Missions souvent passées moins proposées (tests) | ⬜ |
| T9.3 | Daily Coach : micro-resets de 2 à 5 min sans scan, rappels opt-in | P1 | M | M2 | T6.5, T9.1 | Fonctionne hors ligne ; notifications seulement en PWA installée sur iOS | ⬜ |
| T9.4 | Routines personnalisées de base | P2 | S | M2 | T9.3 | Création et modification ; aucune culpabilisation | ⬜ |

## P10 — Accounts, Sync & Billing

| ID | Tâche | Prio | Taille | Jalon | Dépend de | Critères clés | Statut |
|---|---|---|---|---|---|---|---|
| T10.0 | Signal d'intérêt Plus (liste d'attente honnête) | P2 | S | M2 | T10.1 | Aucun paiement ; consentement email ; mesure de l'intérêt | ⬜ |
| T10.1 | Projet Supabase, schéma, RLS, migrations | P1 | M | M3 | **Décision ADR-008** | Advisors Supabase sans alerte critique ; RLS testée avec deux utilisateurs | ⬜ |
| T10.2 | Authentification et migration des données locales | P1 | M | M3 | T10.1 | Aucune perte de données lors de la migration (test) | ⬜ |
| T10.3 | Stockage privé des photos (bucket privé, URLs signées courtes) | P1 | M | M3 | T10.2 | Accès refusé à un autre utilisateur (test) ; suppression effective | ⬜ |
| T10.4 | Droits d'accès et quotas (`entitlements`) | P1 | M | M3 | T10.2 | Quotas appliqués côté serveur ; indépendant du fournisseur | ⬜ |
| T10.5 | Paywall honnête, présenté après la valeur | P1 | M | M3 | T10.4, T7.3 | Ne bloque jamais l'accès à ses données ni leur suppression | ⬜ |
| T10.6 | Stripe Checkout et Customer Portal (**test**) | P1 | M | M3 | T10.4 | Clés live absentes ; événements de test validés | ⬜ |
| T10.7 | Webhooks Stripe → entitlements | P1 | M | M3 | T10.6 | Signature vérifiée ; idempotence (test de rejeu) | ⬜ |
| T10.8 | Suppression de compte et export des données | P0 | M | M3 | T10.3 | Purge vérifiée (base, stockage, Stripe) | ⬜ |
| T10.9 | Activation de la facturation réelle | P0 | S | M4 | T10.7, T10.8, T11.5 | **Autorisation écrite du fondateur** et revue juridique | 🔒 |

## P11 — Quality & Launch

| ID | Tâche | Prio | Taille | Jalon | Dépend de | Statut |
|---|---|---|---|---|---|---|
| T11.1 | Tests E2E du parcours complet | P0 | M | M4 | M3 | ⬜ |
| T11.2 | Matrice appareils (Safari iOS, Chrome Android, petits écrans, paysage) | P0 | M | M4 | T11.1 | ⬜ |
| T11.3 | Performance (budgets Lighthouse, traces, sessions de 20 min, mémoire) | P0 | M | M4 | T11.1 | ⬜ |
| T11.4 | Accessibilité (axe, VoiceOver, clavier, contrastes, mode réduit) | P0 | M | M4 | T11.1 | ⬜ |
| T11.5 | Sécurité et confidentialité (CSP, rate limits, revue RLS, politique, sous-traitants) | P0 | M | M4 | M3 | ⬜ |
| T11.6 | Coûts API (tableau d'usage, alertes, plafonds) | P0 | S | M4 | T5.3 | ⬜ |
| T11.7 | Analytics avec consentement | P1 | S | M4 | T11.5 | ⬜ |
| T11.8 | Déploiement de production | P0 | S | M4 | T11.5 | ⬜ |
| T11.9 | Landing page | P1 | M | M4 | T1.1 | ⬜ |
| T11.10 | Vidéos de démo (Remotion + captures réelles de l'app) | P1 | M | M4 | T11.2 | ⬜ |
| T11.11 | Bêta publique (onboarding des testeurs, retours, critères go/no-go) | P0 | M | M4 | T11.1 à T11.8 | ⬜ |

## P12 — Natif (exploratoire, plus tard)

| ID | Tâche | Prio | Jalon | Note | Statut |
|---|---|---|---|---|---|
| T12.1 | Faisabilité Expo : builds cloud EAS ou nouvelle machine (Xcode 26.4+), achats intégrés, réutilisation de `src/core` | P2 | Later | Bloqué en local (Xcode 15.2) | ⏸ |
