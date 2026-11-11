# ROOMRESET — Instructions projet (Claude Code)

> **Your room. Your game. Your reset.**
> App grand public, web mobile d'abord : photo d'une pièce → micro-missions réalistes → mode mission (une action à la fois) → vrai avant/après → un petit monde personnel qui grandit.

Communication avec le fondateur : **français**. Code, identifiants, noms de fichiers : anglais.

---

## 0. Début de CHAQUE session — obligatoire, dans cet ordre
1. Lire ce fichier.
2. Lire `docs/PROGRESS.md` : dernière étape, étape en cours, prochaine tâche.
3. Lire la fiche de la tâche dans `docs/ROADMAP.md` : dépendances, livrable, critères d'acceptation.
4. Examiner l'état réel, en lecture seule : `git status`, `git log --oneline -15`, `git diff --stat`.
5. Repérer les modifications humaines faites depuis la dernière étape (comparer avec « Fichiers modifiés » dans PROGRESS) et les respecter. Cela inclut les **nouveaux médias déposés dans `references/`** : les analyser, les inventorier dans `references/README.md`, et les traiter comme **inspiration à transformer, jamais comme modèle à copier** (MOTION_SYSTEM §2.4).
6. Reprendre exactement à la prochaine tâche incomplète. **Une seule tâche.**

## 1. Règles absolues
- **Une tâche à la fois.** Ne jamais commencer la suivante sans instruction explicite du fondateur.
- **Git en lecture seule.** Interdit : `git add`, `commit`, `push`, `reset`, `rebase`, `checkout` ou `restore` sur du travail existant, `clean`, `stash`, `merge`, toute réécriture d'historique. Autorisé : `status`, `diff`, `log`, `show`, `blame`. Le fondateur commit et push lui-même ; Claude propose un message de commit (Conventional Commits, en anglais).
- Ne jamais écraser une modification non commitée du fondateur.
- Ne toucher à aucun autre projet de la machine, ni aux projets Supabase existants (`dalili.web`, `aaymane's Project`).
- Secrets uniquement côté serveur (`.env.local`, jamais commité, jamais dans le bundle client).
- **Facturation réelle interdite** sans autorisation écrite du fondateur : Stripe en mode test uniquement.
- Demander l'accord avant toute dépense d'API, tout rendu coûteux, toute installation système, toute publication externe ou toute action destructive.
- Ne jamais prétendre avoir testé, mesuré ou vu ce qui ne l'a pas été. Toujours distinguer **mesuré**, **estimé** et **non vérifié**.

## 2. Garde-fous produit (non négociables)
- Le rangement réel prime ; le jeu sert la motivation, jamais l'inverse.
- **Zéro culpabilisation** : pas de note de propreté, pas de pénalité quand on passe, modifie ou interrompt une mission, pas de série punitive.
- L'IA ne décrit **que ce qui est visible** ; les observations restent corrigeables ; aucune identification de personnes ; aucun diagnostic médical ou psychologique.
- Photos privées : redimensionnées et ré-encodées côté client (EXIF/GPS supprimés), conservation minimale, suppression possible, partage uniquement après consentement explicite.
- Offre payante réservée aux adultes.

## 3. Standards de qualité
- Direction artistique « **Morning Clarity** », langage de mouvement **Loose → Placed** : voir `docs/MOTION_SYSTEM.md`.
- Motion centralisé (`src/motion`) : ressorts et durées nommés, aucune valeur magique dans les composants, chaque animation a une intention. Respecter `prefers-reduced-motion` et le réglage interne « Mouvement calme ». N'animer que `transform` et `opacity`, sauf justification mesurée.
- Mobile d'abord : 390 px de référence, 360 px minimum, cibles tactiles ≥ 44 px, contrastes WCAG AA (texte 4,5:1, éléments non textuels 3:1).
- TypeScript strict. `src/core` est du TS pur, sans React ni Next, pour pouvoir être porté vers Expo.
- Tâche visuelle : lancer l'app, capturer, tester les interactions, lire la console, mesurer quand c'est possible, corriger, puis seulement conclure. Voir `docs/QA_CHECKLIST.md`.
- Captures mobiles : Playwright (viewport exact) ou Safari du simulateur iOS. La CLI headless de Chrome est **inadaptée** (viewport minimum mesuré à 500 px).

### 3.1 Règles absolues du fondateur (2026-11-10)
- Explorer plusieurs approches techniques si nécessaire : **Motion est le choix initial, pas une limite absolue.**
- Exploiter les skills, MCP et agents créatifs **réellement disponibles** (vérifiés), lorsqu'ils apportent une amélioration tangible.
- Pousser au meilleur niveau possible la direction artistique, les micro-interactions, les matières, les ombres, la profondeur, la typographie, les transitions et le ressenti tactile.
- **Tester dans le navigateur et, si possible, sur mobile.** Un travail n'est jamais terminé simplement parce qu'il compile.
- Performance, accessibilité et fluidité restent excellentes.
- Les références sont une inspiration à transformer et à dépasser, jamais un modèle à copier.

## 4. Stack (justifications dans `docs/DECISIONS.md`)
Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · Motion (`motion/react`) · moteur physique 2D maison · Zod · next-intl (EN/FR) · Zustand + IndexedDB (local-first) · Claude API vision + sorties structurées (serveur uniquement) · Supabase (phase 10) · Stripe en mode test (phase 10) · Vitest · Playwright.
Motion est le **choix initial, pas définitif**. Pour toute interaction signature, comparer librement plusieurs approches (DOM/CSS, WebGL/Three.js, sprites Blender, GSAP, Lottie, Rive…) **à chorégraphie identique**, mesurer, puis retenir celle qui donne le meilleur résultat réel. Le choix est consigné dans une ADR. Une interaction extraordinaire vaut mieux que dix ordinaires.

## 5. Environnement (détails dans `docs/TOOL_AUDIT.md`)
MacBook Pro 2017 Intel, macOS 13.7, Node 24, Xcode 15.2. Conséquence : pas de build iOS natif Expo en local (SDK 56–58 exigent Xcode 26.4+).
Blender MCP et LottieFiles Creator MCP doivent être reconnectés manuellement avant usage. Vérifier avec un appel réel, jamais par supposition.

## 6. Fin de CHAQUE tâche — obligatoire
1. Vérifier chaque critère d'acceptation, preuves à l'appui.
2. Mettre à jour le statut dans `docs/ROADMAP.md`.
3. Consigner les décisions dans `docs/DECISIONS.md` : on ajoute, on n'efface jamais. Une décision remplacée est marquée « Remplacée par ADR-xxx ».
4. Mettre à jour `docs/PROGRESS.md`, y compris l'entrée du journal.
5. Répondre au fondateur en français : **OBJECTIF · DÉCISIONS · RÉALISATION · QUALITÉ · FICHIERS · LIMITES · GIT** (message suggéré) **· NEXT**. Puis **s'arrêter**.

## 7. Carte des documents
| Fichier | Rôle |
|---|---|
| `docs/PRODUCT_VISION.md` | Vision, utilisateurs, valeur, modèle économique, périmètre |
| `docs/ROADMAP.md` | Phases et tâches : ID stables, dépendances, critères, statuts |
| `docs/MOTION_SYSTEM.md` | Bible d'animation et direction artistique, analyse des références |
| `docs/DECISIONS.md` | Journal des décisions (ADR), en ajout seulement |
| `docs/PROGRESS.md` | État courant, prochaine tâche, journal des étapes |
| `docs/QA_CHECKLIST.md` | Exigences vérifiables et définition de « terminé » |
| `docs/TOOL_AUDIT.md` | Outils, MCP, skills et agents vérifiés |
| `references/` | Médias de référence tiers : usage local uniquement, exclus de Git (voir `references/README.md`) |
| `web/` | **Application Next.js**. Commandes : `cd web && npm run check` (types, lint, tests, format) et `npm run e2e` (Playwright). Voir `web/README.md` |
| `design/art-direction/` | Prototypes et études T1.x (planche, Placed, dock, reveal, atmosphère) |
