# ROOMRESET — Journal des décisions (ADR)

> **Règles du journal.** On ajoute, on n'efface jamais. Une décision remplacée garde son texte et reçoit le statut « Remplacée par ADR-xxx ».
> **Statuts.** *Proposée* (en attente du fondateur) · *Acceptée* · *Remplacée* · *Rejetée*.
> **Format.** Contexte → Décision → Alternatives étudiées → Conséquences.

---

## ADR-001 — La mémoire du projet vit dans le dépôt
- **Date** : 2026-11-10 · **Statut** : Acceptée (demandée par le fondateur)
- **Contexte** : le projet durera plusieurs mois, sur de nombreuses sessions Claude Code dont le contexte est éphémère.
- **Décision** : `CLAUDE.md` sert de point d'entrée opérationnel (procédure de reprise et règles). L'état durable vit dans `docs/` : vision, roadmap, motion, décisions, progression, QA, audit des outils. La mémoire personnelle de Claude ne contient que des préférences transverses, jamais l'état du projet.
- **Alternatives** : mémoire conversationnelle seule (non fiable) ; outil externe type Notion ou Linear (dépendance et coût, hors dépôt).
- **Conséquences** : chaque fin de tâche met à jour ROADMAP, PROGRESS et DECISIONS ; les documents sont versionnés avec le code.

## ADR-002 — Plateforme : web mobile d'abord (Next.js), natif plus tard
- **Date** : 2026-11-10 · **Statut** : Acceptée (cohérente avec la stack du fondateur)
- **Contexte** : il faut valider vite la valeur, avec un budget quasi nul. Constat vérifié : la machine a Xcode 15.2 (macOS 13.7) alors que les SDK Expo 56 à 58 exigent Xcode 26.4+ (documentation Expo consultée via MCP). **Aucun build iOS natif Expo n'est possible en local.**
- **Décision** : une app web mobile-first (Next.js), installable plus tard comme PWA. Le domaine métier est isolé dans `src/core` en TypeScript pur, pour un portage futur vers Expo / React Native.
- **Alternatives** : Expo dès maintenant (bloqué localement ; builds cloud EAS limités sur le plan gratuit ; Expo Go réservé au SDK courant) ; Flutter (hors stack, pas de partage avec le web).
- **Conséquences** :
  - Pas de Live Activities ni de Dynamic Island.
  - Haptique absente sur Safari iOS.
  - Notifications push web uniquement pour les PWA installées sur iOS.
  - Caméra via `<input type="file" accept="image/*" capture>`.
  - Stripe sur le web, sans commission de store.
  - Le natif fera l'objet d'une phase dédiée (P12).

## ADR-003 — Stack front : Next.js 16, React 19, TypeScript strict, Tailwind CSS 4
- **Date** : 2026-11-10 · **Statut** : Acceptée (stack demandée par le fondateur ; versions vérifiées sur npm le 2026-11-10)
- **Contexte** : versions courantes vérifiées : next 16.4.6 (exige node ≥ 20.9.0 ; Node 24.13.0 est installé), react 19.3.1, tailwindcss 4.3.5, typescript **7.0.2**.
- **Décision** : App Router ; TS strict avec `noUncheckedIndexedAccess` ; Tailwind 4 avec tokens via `@theme`. **Point à vérifier en T3.1** : compatibilité de TypeScript 7 avec Next 16 et l'outillage ESLint. Sinon, épingler la dernière version 6.x compatible et le consigner.
- **Alternatives** : Vite + React Router (moins de conventions serveur pour les routes API et la sécurité des secrets) ; Remix (hors stack).
- **Conséquences** : les routes serveur (`app/api/*`) portent tous les secrets ; le rendu par défaut est serveur, avec des îlots client pour l'interactif.

## ADR-004 — Animation : Motion comme seule bibliothèque d'UI, moteur physique 2D maison
- **Date** : 2026-11-10 · **Statut** : Proposée — **amendée par ADR-017** (moteur maison reporté après M1)
- **Contexte** : l'interaction signature exige des ressorts interrompables, des morphs de layout et une physique d'objets (≤ 12 corps) réactive au doigt, fluide sur Safari mobile.
- **Décision** :
  - **Motion** (`motion/react` 14.x, MIT) pour les ressorts, `layoutId`, `AnimatePresence` et les gestes simples. API vérifiée : `visualDuration`/`bounce`, vélocité conservée à l'interruption.
  - **Moteur 2D maison** en TS pur (`src/core/physics`) : cercles, collisions douces, attraction vers la maison, répulsion du pointeur, inertie, sommeil, pas fixe.
- **Alternatives** :
  - matter-js 0.20 (MIT ; trop général pour 12 corps, plus lourd) : **repli** si le moteur maison échoue.
  - Rapier2D 0.21 (WASM, surdimensionné).
  - GSAP 3.15 (licence gratuite « standard » ; ferait doublon avec Motion dans l'app ; reconsidérable pour la landing).
  - Three.js / R3F (0.187 / 9.8 ; coût bundle et GPU injustifié pour le MVP).
  - Pixi.js 8 (canvas : accessibilité des missions plus difficile).
  - Lottie (lecteur dotLottie WASM) et Rive : pas par défaut.
- **Conséquences** : une seule API d'animation à maîtriser ; le moteur maison doit être testé (déterminisme, énergie, tunneling) et mesuré. Tout ajout de bibliothèque d'animation exige une nouvelle ADR.

## ADR-005 — Les galets de missions sont des éléments DOM accessibles, pas un canvas
- **Date** : 2026-11-10 · **Statut** : Proposée (validation en T4.2)
- **Contexte** : les missions sont des actions. Elles doivent être focusables, lisibles par VoiceOver et nettes, et leur nombre visible est faible (≤ 7, ≤ 12 simulées).
- **Décision** : chaque galet est un `<button>` positionné par `transform` depuis une boucle rAF unique (refs, sans état React par frame).
- **Alternatives** : Canvas 2D ou WebGL (plus performant à grande échelle, mais accessibilité, hit-testing et texte à reconstruire).
- **Conséquences** : discipline stricte (transforms uniquement, pas de lecture de layout dans la boucle) ; bascule vers le canvas si la mesure l'exige (nouvelle ADR).

## ADR-006 — Vision IA : Claude API (SDK TypeScript officiel), sorties structurées validées par Zod
- **Date** : 2026-11-10 · **Statut** : Proposée (confirmation après le benchmark T2.2)
- **Contexte** : le brief demande une « API de vision multimodale » et la maîtrise des coûts. La doc du skill `claude-api` a été consultée (tarifs en cache au 2026-11-03) :
  | Modèle | Entrée / sortie par million de tokens |
  |---|---|
  | `claude-opus-5-5` | 4 $ / 20 $ |
  | `claude-sonnet-5-5` | 2 $ / 10 $ |
  | `claude-haiku-5-5` | 0,10 $ / 0,50 $ (prompts ≤ 100 K tokens) |

  Les images coûtent environ 1 token par carré de 28×28 px (≈ 1 200 tokens pour du 1280×720). Les modèles haute résolution acceptent jusqu'à 2 576 px de côté long et jusqu'à ~4 784 tokens par image.
- **Décision** :
  - Une route serveur appelle le **SDK officiel `@anthropic-ai/sdk`** avec `messages.parse` et `zodOutputFormat` (`output_config.format`).
  - **Modèle par défaut : `claude-opus-5-5`**, conformément aux recommandations de la doc. L'effort (`low`/`medium`) est à régler en T2.2.
  - Sonnet 5.5 ou Haiku 5.5 seront comparés **uniquement avec l'accord du fondateur**, et choisis sur mesures (qualité contre coût). **Le choix final appartient au fondateur.**
  - Fallbacks côté serveur activés (`fallbacks: "default"`, beta `server-side-fallback-2026-07-01`). Gestion explicite de `stop_reason: "refusal"`. Images réduites côté client à environ 1 280 px (valeur à confirmer en T2.2).
- **Alternatives** : autres fournisseurs de vision (non évalués : rester sur un seul SDK, cohérent avec l'outillage Claude) ; détection d'objets locale de type YOLO (ne produit pas de missions et alourdit le client).
- **Conséquences** :
  - Coût estimé (non mesuré) : environ 0,04 à 0,07 $ par scan avec Opus 5.5, à mesurer.
  - Le prestataire doit être nommé dans le consentement et la politique de confidentialité ; ses conditions de conservation des données sont à vérifier au moment de l'intégration.
  - Clé API exclusivement côté serveur.

## ADR-007 — Données local-first pour le MVP
- **Date** : 2026-11-10 · **Statut** : Proposée
- **Contexte** : valider la boucle principale sans backend, en gardant les photos privées sur l'appareil.
- **Décision** : Zustand pour l'état d'interface ; IndexedDB (`idb-keyval`) pour la persistance (pièces, sessions, missions, photos en Blob) ; schéma local versionné avec migrations ; purge en un geste.
- **Alternatives** : Supabase dès M1 (comptes et RGPD serveur à gérer trop tôt) ; `localStorage` (trop petit et synchrone pour des photos).
- **Conséquences** : les données sont perdues si le navigateur est vidé (avertir l'utilisateur ; export plus tard) ; migration vers un compte en T10.2.

## ADR-008 — Backend : Supabase à partir de la phase 10
- **Date** : 2026-11-10 · **Statut** : Proposée (**décision du fondateur requise avant T10.1**)
- **Contexte** : vérifié via le MCP et la doc. L'organisation compte **2 projets actifs** (`dalili.web`, `aaymane's Project`). Le plan gratuit autorise **2 projets actifs** (les projets en pause ne comptent pas) et met en pause les projets inactifs pendant 7 jours.
- **Décision proposée** : Auth, Postgres avec RLS, Storage privé (URLs signées courtes). Pour obtenir un créneau, trois options sont soumises au fondateur :
  - (a) mettre en pause un projet existant ;
  - (b) organisation Pro (≈ 25 $/mois) ;
  - (c) développement local avec Docker et la CLI Supabase (Docker est installé, son démon est arrêté ; CLI absente, utilisable via `npx`).
- **Alternatives** : Firebase (hors stack) ; Postgres auto-hébergé (maintenance).
- **Conséquences** : aucun projet Supabase existant n'est modifié sans instruction explicite.

## ADR-009 — Paiement : Stripe en mode test et droits d'accès indépendants du fournisseur
- **Date** : 2026-11-10 · **Statut** : Proposée
- **Décision** : Stripe Checkout, Customer Portal et webhooks signés et idempotents alimentent une table `entitlements` qui sert de source de vérité. **Mode test uniquement.** L'activation réelle est une tâche bloquée (T10.9) qui requiert une autorisation écrite.
- **Alternatives** : paywalls tiers comme RevenueCat (utile surtout pour le natif ; à réévaluer en P12).
- **Conséquences** : une future app native devra intégrer les achats in-app des stores, ce que la table d'entitlements absorbe ; une revue juridique des essais et de la résiliation est à faire avant la mise en production.

## ADR-010 — Internationalisation EN/FR dès le départ (next-intl)
- **Date** : 2026-11-10 · **Statut** : Proposée (le mode de routage sera tranché en T3.6)
- **Décision** : next-intl 4.x. Toutes les chaînes sont externalisées, les messages typés ; règles typographiques françaises (espaces fines insécables avant `: ; ! ?`, guillemets « »). Détection via `Accept-Language`, avec un choix utilisateur persistant.
- **Conséquences** : un test échoue si une clé manque ; le surcoût initial est faible comparé à une internationalisation tardive.

## ADR-011 — Outillage QA : Vitest, Playwright, simulateur iOS, iPhone réel, overlay de performance
- **Date** : 2026-11-10 · **Statut** : Acceptée
- **Contexte (mesures du 2026-11-10)** :
  - La CLI headless de Chrome capture bien, mais impose un **viewport minimum de 500 px** (fenêtre de 390 demandée, `innerWidth` mesuré à 500) : **inadaptée au mobile**.
  - Le **Safari du simulateur iOS 17.2 fonctionne** (viewport de 393×659 px CSS, DPR 3), à condition que **l'app Simulator soit ouverte** : en démarrage headless, l'écran restait noir pendant plus de 5 min.
  - Démarrage du simulateur : environ 32 s. Le premier `openurl` a expiré, mais Safari s'est quand même ouvert.
- **Décision** : Vitest pour `src/core` ; Playwright (Chrome local via `channel: 'chrome'`, sans téléchargement ; WebKit Playwright téléchargé seulement avec accord) pour l'E2E et les captures aux viewports exacts ; Safari du simulateur pour le vrai WebKit mobile ; iPhone du fondateur via le réseau local pour le toucher et les performances ; overlay `?perf=1` pour les mesures réelles.
- **Conséquences** : Playwright sera installé comme dépendance de développement en T3.1.

## ADR-012 — Hébergement : décision reportée, avant la préversion M1
- **Date** : 2026-11-10 · **Statut** : Proposée (à trancher en T7.5)
- **Contexte** : un hébergement est nécessaire pour les testeurs de M1. Les offres gratuites ont des conditions d'usage (le plan gratuit de Vercel est réservé à un usage personnel non commercial, **à revérifier dans les CGU au moment du choix**).
- **Options** : Vercel Pro ; Cloudflare (OpenNext) ; Netlify ; autre. Critères : coût, conditions commerciales, compatibilité avec Next 16, région UE.

## ADR-013 — Les médias de référence tiers restent locaux
- **Date** : 2026-11-10 · **Statut** : Proposée (le fondateur peut la lever)
- **Contexte** : `references/` contient des captures de publications tierces (environ 45 Mo) : droits non détenus, et leur poids alourdirait l'historique Git.
- **Décision** : exclusion de Git (`.gitignore`), sauf `references/README.md` (inventaire). L'analyse est conservée dans `docs/MOTION_SYSTEM.md` §2. On s'inspire des principes ; on ne reprend jamais l'identité (nom, palette, bulles à avatars, mise en page).

## ADR-014 — Re-séquencement de la roadmap pour valider la valeur plus tôt
- **Date** : 2026-11-10 · **Statut** : Proposée
- **Décision** : par rapport aux phases du brief :
  1. un **spike IA** (script seul, sur photos réelles) passe **avant** la fondation, pour valider l'hypothèse produit la plus risquée ;
  2. le **labo d'interaction signature** précède les écrans ;
  3. **Before/After** est placé **avant** le Reset World : la boucle utile d'abord, la rétention ensuite ;
  4. comptes et facturation viennent **après** la boucle principale et la rétention ;
  5. le natif devient une phase ultérieure.

  Les jalons M1 à M4 cadrent le périmètre (voir ROADMAP).
- **Conséquences** : M1 teste l'utilité, M2 la rétention, M3 la monétisation.

## ADR-015 — Direction créative « Morning Clarity »
- **Date** : 2026-11-10 · **Statut** : Proposée (validation visuelle en T1.1) — **amendée par ADR-017** (*Squeegee* → *Sunrise Reveal*, graine → chemin, vue de dessus)
- **Décision** :
  - Concept *Loose → Placed / Haze → Clarity / Grow*.
  - Galets de mission physiques (*The Scatter*), complétion *Placed* dans le plateau du Reset, avant/après en *Squeegee Reveal*.
  - Monde-terrarium, luciole-guide, ticket de partage *Reset Receipt* sans photo par défaut.
  - Palette lin / encre de mousse / soleil / sauge ; Bricolage Grotesque et Figtree.
- **Alternatives étudiées** :
  - Bulles flottantes façon référence (trop proche d'Aura).
  - Mascotte animale bavarde (risque de « clone de Finch », coût d'animation élevé).
  - Énergie ou particules comme récompense (générique, sans lien avec le geste de ranger).
  - Thème sombre seul (moins adapté au matin et au contraste en plein jour).
- **Conséquences** : la contrainte de contraste non textuel est mesurée (aplats `sun` et `sage` sur `paper` < 3:1) et impose des bords et des icônes. Tout effet doit servir l'un des trois verbes.

## ADR-016 — Références : s'inspirer, faire mieux, adapter (Light Dock, berceau, vitre dépolie, atmosphère personnelle)
- **Date** : 2026-11-10 · **Statut** : Proposée (validation visuelle et tactile en T1.1) — **amendée par ADR-017** (« berceau d'impact » → empreintes)
- **Contexte** : le fondateur a ajouté la référence « Glassy Navigation Tabs V5 » et a précisé, pour **toutes** les références : « pas comme modèle à copier exactement : inspiration, et faire mieux, adapté à notre projet ».
- **Décision** :
  1. Chaque référence passe par une **table de transformation** (MOTION_SYSTEM §2.4) : principe extrait → version ROOMRESET re-fondée sur le sens du produit → raison pour laquelle elle est meilleure. Les éléments d'identité des références sont explicitement rejetés.
  2. Nouveaux éléments du système :
     - le **Light Dock** (rai de soleil indexé sur l'angle de lumière global, galet Reset dans un berceau, balayage au pouce) ;
     - le **berceau d'impact** du plateau pour *Placed* ;
     - **deux verres** : la vitre dépolie, réservée au dock (seul `backdrop-filter`), et le verre clair du terrarium ;
     - l'**atmosphère personnelle** : photo floutée en fond de session, la lumière monte sans rendre l'*avant* plus net ;
     - le **focus pull** sur la photo *après* au Reveal.
- **Alternatives** : reprendre l'un des quatre indicateurs de la référence tel quel (rejeté : copie, et sans lien avec le sens du produit) ; verre partout (rejeté : coût GPU sur Safari mobile, lisibilité) ; atmosphère abstraite non personnelle (moins forte émotionnellement).
- **Conséquences** :
  - Les feuilles sont en papier opaque et le dock se retire quand une feuille s'ouvre.
  - Le contraste des libellés du dock doit être vérifié sur le pire fond.
  - Le flou de l'atmosphère doit garantir qu'aucun détail de la pièce n'est lisible.
  - T1.1 inclut une étude interactive pour prouver ces choix au doigt avant toute intégration.

## ADR-017 — Intégration de la revue critique `motion-director` (MOTION_SYSTEM v0.2)
- **Date** : 2026-11-10 · **Statut** : Proposée (validation en T1.1)
- **Contexte** : une revue indépendante de la v0.1 (agent `motion-director`, sans rendu) a relevé quatre problèmes. *The Scatter* recréait l'indécision (pas de libellés, taille ambiguë, lancer sans sens). *Placed* n'avait ni géographie ni morph fiable (`layoutId` en ligne droite, `clip-path` déformé). La raclette jugeait l'*avant* comme une saleté, avec en plus un coût de rendu, un conflit avec le geste retour de Safari et une couture visible. Enfin, la chorégraphie restait « la structure d'Aura en pierre ».
- **Décision** :
  1. **Vue de dessus, poids, repos** : galets posés sur une table ; hauteur exprimée par l'ombre ; aucune errance ni parallaxe sur la table ; soulever, glisser avec friction, poser.
  2. **Lisibilité** : pastille de libellé opaque, taille = durée seulement ; la première victoire est éclairée par le rai de soleil.
  3. **Géographie verticale** : en haut le plateau (plan et fait), au centre la carte (maintenant), en bas la file (plus tard). Swipe haut = fait, bas = plus tard.
  4. **Empreintes** : chaque mission a sa place creusée dès le choix du temps ; *Placed* = le galet seul vole (Bézier via `MotionValue`) et tombe dans **son** empreinte ; « plus tard » referme l'empreinte ; le plateau rempli devient le Reset Receipt, puis un tronçon de chemin du monde (fin de la contradiction « graine »).
  5. **Sunrise Reveal** à la place de la raclette : la lumière du matin traverse la pièce ; uniquement des `transform` ; la bande couvre la couture ; photo à ≥ 20 px des bords.
  6. **Formes** en `border-radius` à 8 valeurs, jamais en `clip-path`.
  7. **Moteur physique maison reporté après M1** (T4.1 en ⏸) : Motion `drag` et `dragTransition` suffisent au MVP.
  8. **Welcome** « Pose-le à sa place » : un galet, une empreinte, le geste central dès la première seconde.
- **Alternatives** : garder le champ flottant (rejeté : proche d'Aura, moins utile) ; garder la raclette (rejeté : métaphore de jugement).
- **Conséquences** : le chemin ★ de M1 passe d'environ 80 h à environ 75 h ; la question des collisions est rouverte en fin de M1 ; ADR-004, ADR-015 et ADR-016 sont amendées (leur texte d'origine est conservé).

## ADR-018 — Interaction signature *Placed* : comparaison de trois moteurs à chorégraphie identique
- **Date** : 2026-11-10 · **Statut** : Proposée (**choix final du fondateur après test au doigt sur iPhone 13**)
- **Contexte** : le fondateur veut « une interaction réellement extraordinaire plutôt que dix ordinaires ». Motion est un point de départ, pas une décision définitive (CLAUDE.md §4). *Placed* est l'interaction la plus répétée du produit.
- **Décision** : construire *Placed* avec trois moteurs interchangeables (`study-placed.html?engine=…`) partageant le contrôleur, les ressorts (formule de Motion), la trajectoire et les timings :
  - **A — `css`** : galets DOM, matière procédurale CSS, guidée par la lumière globale ;
  - **C — `sprite`** : galets DOM, matière satinée pré-rendue dans Blender ;
  - **B — `gl`** : Three.js r187, galets 3D (`MeshPhysicalMaterial` avec sheen et clearcoat), plateau en heightfield qui **se creuse physiquement à l'impact**, ombres portées réelles, tone-mapping Neutral, rendu uniquement à la demande.
- **Mesures du 2026-11-10** :

  | Mesure | CSS | Sprite | 3D | Note |
  |---|---|---|---|---|
  | p95 du temps de frame (Chrome headless, émulation iPhone 13) | 16,8 ms | 16,8 ms | 16,8 ms | Horloge plafonnée à 60 Hz : non discriminant |
  | Pire frame | 150 ms (pic isolé) | 33 ms | 33 ms | Pour la 3D, 83–167 ms **avant** le préchauffage des shaders |
  | Simulateur iOS 17.2 (GPU du Mac) | — | — | p95 18–21 ms, max 113 ms | **Non représentatif** de l'iPhone |
  | Zéro rAF au repos | Oui | Oui | Oui | |
  | Poids (gzip) | ~19 Ko | + 17,6 Ko de sprites | + 4,7 Ko de moteur + **~194 Ko de Three.js** (CDN minifié) | Le prototype chargeait d'abord ~380 Ko (cœur non minifié) avant correction de l'import map |

- **Lecture provisoire** :
  - le moteur 3D est le seul à offrir une vraie profondeur (creux, ombre portée qui grandit avec la hauteur, plateau qui cède) ;
  - son coût de téléchargement est ~10 fois supérieur, et un délai visible apparaît sur un réseau lent (mesuré dans le simulateur) ;
  - CSS et sprites restent instantanés.
- **Pistes** : 3D chargée en différé après la première peinture, avec le galet CSS en attendant ; ou 3D réservée aux moments forts (fin de session, monde) et CSS au quotidien. **À trancher sur preuve tactile**, avec `?perf=1` sur l'iPhone 13.
- **Conséquences** : si la 3D est retenue, l'intégrer en P4 via npm (tree-shaking) et mesurer le poids réel du bundle ; garder la version CSS comme repli (palier `lite`, `prefers-reduced-motion`, échec WebGL : déjà géré par un repli automatique sur CSS).

## ADR-019 — Palette du jour : proposition « Air du matin » (v0.3)
- **Date** : 2026-11-10 · **Statut** : Proposée (choix du fondateur entre Air et Lin, comparables dans la planche)
- **Contexte** : le skill `frontend-design` signale que « crème chaud + accent terracotta » est le cliché le plus courant des designs générés. La v0 (`#F5F0E8` + corail) en relevait.
- **Décision proposée** : fond **`#E9EEE8`** (air vert-gris pâle), surface `#F7F9F5`, placé **mousse** `#5E8C6E` (3,28:1 en non-texte, contre 1,96:1 pour l'ancienne sauge), attention **baie** `#A8385A`, bords non textuels `#7C8982` (3,10:1). Tous les textes sont conformes AA (calculés).
- **Alternatives** : garder Lin (v0), plus chaleureux mais générique.
- **Conséquences** : MOTION_SYSTEM §3.1 et BRAND §2 seront mis à jour selon le choix.

## ADR-020 — Outillage vérifié pendant T1.1
- **Date** : 2026-11-10 · **Statut** : Acceptée
- **Blender MCP** : fonctionne via une **instance dédiée** lancée avec l'add-on activé (`--python-expr addon_utils.enable('blender_mcp')`). L'instance ouverte par le fondateur n'avait pas l'add-on actif. Les rendus reproductibles passent par la **CLI en arrière-plan** (scripts versionnés). Un crash (segfault) a été causé par **mon** code : itération sur `all_objects` pendant une modification. C'est corrigé et commenté.
- **Computer Use** : les clics fonctionnent, mais la **capture est impossible sous macOS 13** (« ScreenCaptureKit requires macOS 14.0 »). La vision passe par `screencapture`, avec les coordonnées en points 1:1 sur l'écran 1920×1080.
- **Tests navigateur** : `playwright-core` 1.65 (dossier temporaire), avec le **Chrome installé** (`channel: 'chrome'`), émulation iPhone 13, toucher réel via CDP, mesures de frames et capture image par image. Il sera installé dans le projet en T3.1.
- **Safari réel** : simulateur iPhone 15 Pro Max (iOS 17.2, WebKit) ouvert par le fondateur. Le parcours *Placed* complet a été vérifié jusqu'au ticket final.
- **Réseau local** : servir sur `0.0.0.0` (pour l'iPhone) a été **refusé par le classifieur de sécurité**. Le fondateur lance lui-même cette commande (README du prototype).
- **Comptes** : le fondateur dispose d'un **compte Apple Developer** et d'un **iPhone 13**. La voie native passera par EAS (builds cloud) et TestFlight (P12), malgré Xcode 15.2.

## ADR-021 — Impact réel et sprites hybrides (deuxième revue `motion-director`)
- **Date** : 2026-11-11 · **Statut** : Acceptée (amende ADR-018 et MOTION_SYSTEM §5)
- **Contexte** : le vol utilisait un ressort critique (`flight`). Le contact arrivait vers 0,71 s, après ~200 ms de lente approche : le galet « se garait », il ne tombait pas. Par ailleurs, les sprites Blender figeaient la lumière du matin.
- **Décision** :
  1. **Vol** : temps **linéaire de 420 ms** (`FLIGHT_MS`), hauteur en parabole `4τ(1−τ)` (vitesse maximale au contact), trajet en ease-out. `onLand` est déclenché **au contact** ; la carte suivante arrive à `onLand − 60 ms` ; l'écrasement est proportionnel à la taille du galet. Les ressorts restent utilisés pour tout le reste (retour, réorganisations, annulation).
  2. **Plan** : une empreinte refermée par « Plus tard » est masquée, les autres glissent à leur place (FLIP avec la propriété `translate`), et les galets placés ainsi que les puits 3D suivent. Compteur : « placées sur (N − plus tard) ».
  3. **Sprites hybrides** : Blender rend l'albédo satiné **sans lumière directionnelle** ; le reflet et l'ombrage viennent du CSS (`--lx`/`--ly`), masqués par la silhouette du sprite. Ils sont justes à toute heure.
  4. **Un seul soleil** : l'inclinaison du rai du dock vaut `lx × 22°`, dans le même sens que les ombres.
- **Conséquences** : le token `flight` devient une interpolation (MOTION_SYSTEM §15) ; le moteur recommandé par la revue est le DOM (CSS ou hybride), **à confirmer au doigt sur iPhone 13**.

## ADR-022 — Atmosphère vivante (plan 0) : arrière-plan animé de formes 3D floutées
- **Date** : 2026-11-11 · **Statut** : Proposée (choix du fondateur après test sur iPhone 13)
- **Contexte** : le fondateur refuse le fond uni : « je veux surtout un arrière-plan animé, et surtout les trucs 3D floutés ». C'est sa décision de produit. Elle **amende** le principe « rien ne bouge sans cause » **pour le plan 0 seulement** ; la table interactive reste calme.
- **Décision** :
  - 12 galets et orbes de lumière sur trois profondeurs, en **profondeur de champ** (flou selon la distance au plan de netteté) ;
  - relief éclairé par la **lumière globale**, dérive lente (périodes de 18 à 46 s), parallaxe au doigt et à l'inclinaison (sur autorisation iOS) ;
  - **voile de mise au point** derrière le texte, qui garantit la lisibilité ;
  - **règles d'énergie** : 30 i/s au repos, 60 i/s pendant l'interaction, arrêt quand l'onglet est caché, image fixe en mouvement réduit.
- **Deux approches comparées** à scène identique (`study-atmosphere.html?atmos=gl|dom|flat`) :

  | Approche | Rendu | Poids (gzip) | Mesure Chrome headless |
  |---|---|---|---|
  | **A — shader** (WebGL 1, un seul appel de dessin, demi-résolution) | Le plus lumineux et vivant : relief, reflets, flaque de lumière, grain | ≈ 6 Ko, sans bibliothèque ni image | p95 16,7 ms ; un pic isolé à 233 ms au matin |
  | **B — sprites** (Blender + flou CSS statique + `transform`) | Plus photographique et calme | ≈ 4 Ko + 16 Ko de sprites | p95 16,7 ms |

- **Recommandation provisoire : A (shader)**, la plus fidèle à la demande (3D, lumineuse, vivante) et la plus légère. **À confirmer sur iPhone 13** : chauffe et batterie sur 10 minutes, p95 avec `?perf=1`.
- **Conséquences** : en production, le module d'atmosphère sera partagé par tous les écrans (Accueil, Mission, Reveal), avec une intensité par écran. Pendant une mission, l'atmosphère sera plus discrète.
