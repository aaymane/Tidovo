# ROOMRESET — Audit des outils (vérifié)

> Audit réalisé le **2026-11-10** (T0.1) par des commandes et des appels MCP réels. Aucun outil n'est déclaré fonctionnel sur la seule base de sa présence dans une liste.
> **Légende** : ✅ vérifié fonctionnel · ⚠️ installé mais non connecté ou incomplet · ❌ absent · ➖ présent, non testé.
> **Re-vérifier** au début de toute phase qui dépend d'un outil (commandes au §9).

## 1. Synthèse
| Domaine | Statut | Conséquence principale |
|---|---|---|
| Dépôt Git | ❌ **le dossier n'est pas un dépôt** (`fatal: not a git repository`) | Le fondateur doit faire `git init` et le premier commit |
| Node / npm | ✅ Node 24.13.0, npm 11.6.2 | Compatible Next 16 (exige ≥ 20.9.0) |
| FFmpeg / FFprobe | ✅ 9.0.2 | Analyse des références faite ; utile pour la QA image par image et les vidéos |
| Chrome headless (CLI) | ⚠️ capture OK, mais **viewport minimum de 500 px** (390 demandé) | Inadapté à la QA mobile ⇒ Playwright (T3.1) |
| Simulateur iOS (Safari 17.2) | ✅ **avec l'app Simulator ouverte** ; écran noir en démarrage headless | Vrai WebKit mobile disponible localement |
| Xcode | ⚠️ 15.2 | **Pas de build iOS natif Expo** (SDK 56–58 exigent Xcode 26.4+) |
| Blender 4.5.9 LTS + MCP | ⚠️ MCP configuré, **Blender non joignable** | Ouvrir Blender et activer l'add-on avant usage (P8) |
| LottieFiles Creator MCP | ⚠️ serveur OK, **aucun onglet Creator connecté** (re-testé après l'ouverture de Chrome) | Ouvrir `creator.lottiefiles.com` et activer le MCP, si on en a besoin |
| Supabase MCP | ✅ authentifié, 1 organisation, **2 projets actifs** | Plan gratuit : 2 projets actifs ⇒ décision ADR-008 |
| Expo MCP | ✅ (recherche et lecture de la doc) | Utile en P12 |
| Context7 MCP | ✅ (Next.js et Motion consultés) | Docs à jour pour l'implémentation |
| Computer Use MCP | ✅ connecté, **aucune app autorisée** | Accès à demander app par app ; navigateurs en lecture seule |
| Claude in Chrome | ❌ aucun outil exposé dans la session | QA navigateur via Playwright et simulateur |
| Figma MCP | ⚠️ non authentifié | Non nécessaire pour l'instant |
| Claude Docs (connecteur claude.ai) | ✅ disponible | Non utilisé : la mémoire vit dans le dépôt (ADR-001) |
| Docker | ⚠️ CLI 24.0.6, **démon arrêté** | Option de Supabase local (ADR-008 c) |

## 2. Machine (mesuré)
- MacBook Pro 2017 : Intel Core i7-7920HQ à 3,10 GHz, 8 threads, **16 Go de RAM**.
- GPU : Intel HD Graphics 630 (Metal 3) et Radeon Pro 560, 4 Go (Metal 2).
- macOS **13.7.8** (22H730). Disque : 293 Gio libres.
- Implications :
  - Les pré-rendus Blender doivent rester en basse résolution et à faible nombre d'échantillons pour les aperçus.
  - Le simulateur iOS est lent (démarrage ≈ 32 s, premier `openurl` expiré).
  - Les mesures de performance se font **sur le téléphone réel**, pas sur ce Mac.

## 3. Runtimes et CLI (`--version` exécuté)
| Outil | Version / statut |
|---|---|
| node / npm / npx | v24.13.0 (nvm) / 11.6.2 |
| yarn | 1.22.22 · corepack 0.34.5 (pnpm activable) · pnpm, bun, deno : ❌ |
| python3 · uv / uvx | 3.13.3 · 0.13.7 |
| git · gh | 2.45.2 · 2.102.0 |
| ffmpeg / ffprobe | 9.0.2 (build martin-riedl, `~/.local/bin`) ✅ |
| avifenc · cwebp | 1.2.1 (aom) ✅ · présent ➖ |
| ImageMagick | ❌ |
| supabase, vercel, stripe, eas/expo (CLI globales) | ❌ (utilisables via `npx` au besoin) |
| gltf-transform / gltfpack · watchman | ❌ |
| npm globaux | `@expo/ngrok` 4.1.3 ➖ (tunnel possible pour tester au téléphone en HTTPS), corepack, npm |

## 4. Applications
| App | Statut |
|---|---|
| Blender | 4.5.9 LTS (build du 2026-04-21) ➖ non lancée pendant l'audit |
| Google Chrome | 156.0.8078.74 ✅ |
| Safari | ✅ |
| Xcode | 15.2 (15C500b) ; simulateurs iOS 17.2 : iPhone SE 3, 15, 15 Plus, 15 Pro, 15 Pro Max, iPad Air 5 |
| Figma.app, Docker.app, Claude.app, Codex.app | Présentes ➖ |

## 5. Claude Code — skills, agents, plugins
**Skills utilisateur** (`~/.claude/skills`) : `creative-director-master` (**chargé** pour cette tâche), `cinematic-ui` (lu ; contient `references/{react-native-expo,video-aura-notes,web-motion}.md`), `visual-qa`, `video-qa`, `cinematic-video`, `video-editing`, `three-d-motion`.

**Skills de plugins disponibles et pertinents** :
- `frontend-design`
- `remotion:*` (13 skills)
- `expo:*` (dont `expo-animation`, `expo-design-system`)
- `supabase`, `supabase-postgres-best-practices`
- `claude-api` (**chargé** : modèles et tarifs)
- `figma:*` (authentification requise)
- `artifact-*`, `run`, `code-review`, `simplify`, `security-review`

**Non disponibles dans cette session**, bien que cités par les instructions globales : Emil Kowalski (`animate-expo`, `choreograph`, `animation-performance`, `review-animations`), Software Mansion (`react-native-best-practices`), LottieFiles `motion-design`. Les plugins `skills@swmansion`, `building-react-native-apps` et `testing-react-native-apps` sont installés mais **non activés** (`enabledPlugins`).

**Agents** : `motion-director` (✅ **utilisé le 2026-11-10** : revue de la direction v0.1, intégrée dans MOTION_SYSTEM v0.2 / ADR-017) et `video-director` (➖). Tous deux n'ont que Read, Grep et Glob : ils critiquent sans exécuter et sans voir de rendu. Agents intégrés : `Explore`, `Plan`, `general-purpose`.
**Plugins activés** : expo, figma, supabase, frontend-design, context7, typescript-lsp, remotion. **Désactivés** : code-review, feature-dev, skill-creator, design@synced.

## 6. Serveurs MCP — appels réels et résultats
| Serveur | Configuration | Appel de test | Résultat |
|---|---|---|---|
| blender | `uvx mcp-for-blender` (utilisateur) | `get_addon_status` | ⚠️ « Could not connect to Blender. Make sure the Blender addon is running. » ; port 9876 fermé |
| lottiefiles-creator | `npx -y @lottiefiles/creator-mcp@latest` (**version non épinglée**) | `list_scenes` (×2) | ⚠️ « No Creator tab is connected » |
| computer-use | intégré | `list_granted_applications` | ✅ `allowedApps: []` |
| supabase (plugin) | OAuth | `list_organizations`, `list_projects`, `search_docs` | ✅ org « aaymane's Org » ; projets **`dalili.web`** et **`aaymane's Project`** (eu-west-1, ACTIVE_HEALTHY), **à ne pas toucher** |
| expo (plugin) | — | `search_documentation`, `read_documentation` | ✅ SDK 56–58 : Xcode **26.4+** requis ; Node ≥ 20.19 (SDK 56) ou ≥ 22.13 (SDK 57–58) |
| context7 (plugin) | — | `resolve-library-id` (Next.js, Motion), `query-docs` (Motion) | ✅ Next.js indexé jusqu'à v16.4.5 ; ressorts Motion `visualDuration`/`bounce` confirmés |
| figma (plugin) | — | outils d'authentification seulement | ⚠️ non authentifié |
| claude-in-chrome | — | aucun outil exposé | ❌ |
| ide | — | outils présents en différé | ➖ non testé |

## 7. Bibliothèques candidates (npm, vérifié le 2026-11-10)
| Paquet | Version | Licence | Décision |
|---|---|---|---|
| next | 16.4.6 | MIT | ✅ retenu |
| react | 19.3.1 | MIT | ✅ |
| tailwindcss | 4.3.5 | MIT | ✅ |
| typescript | 7.0.2 | Apache-2.0 | ⚠️ compatibilité à vérifier en T3.1 |
| motion | 14.12.0 | MIT | ✅ retenu (seule bibliothèque d'animation UI) |
| zod | 4.6.7 | MIT | ✅ |
| next-intl | 4.14.10 | MIT | ✅ |
| @supabase/supabase-js · @supabase/ssr | 2.119.0 · 0.12.7 | MIT | P10 |
| stripe | 23.1.0 | MIT | P10 (test) |
| vitest · @playwright/test · lighthouse | 5.1.0 · 1.65.0 · 13.6.0 | MIT / Apache-2.0 | ✅ QA |
| matter-js | 0.20.0 | MIT | Repli si le moteur maison échoue |
| @dimforge/rapier2d-compat | 0.21.0 | Apache-2.0 | ❌ surdimensionné |
| gsap | 3.15.1 | licence gratuite « standard » | ❌ app (doublon) ; possible pour la landing |
| three · @react-three/fiber · drei | 0.187.0 · 9.8.2 · 10.7.9 | MIT | ❌ MVP ; à réévaluer pour le monde (T1.3) |
| ogl | 1.0.11 | Unlicense | Option pour un shader d'atmosphère, si mesuré nécessaire |
| pixi.js | 8.22.0 | MIT | ❌ (accessibilité des missions) |
| @lottiefiles/dotlottie-web · @rive-app/canvas | 0.82.1 · 2.50.0 | MIT | Seulement sur ADR |
| remotion | 4.0.542 | Licence Remotion : **gratuite pour individus et entreprises ≤ 3 employés** (`LICENSE.md` lu) | ✅ vidéos marketing (P11) |
| @anthropic-ai/sdk | à épingler en T2.1 | — | ✅ IA (ADR-006) |

## 8. Ce que nous ferons avec chaque outil
| Outil | Usage prévu | Phase |
|---|---|---|
| FFmpeg / FFprobe | Analyse des références ; extraction image par image des enregistrements d'interactions (MOT-09) ; montages vidéo | P1+, P11 |
| Simulateur iOS + Safari | Captures WebKit mobile ; safe areas ; VoiceOver avec Accessibility Inspector | P1+ |
| Playwright + Chrome | E2E, captures aux viewports exacts, traces CDP, reduced motion, axe | P3+ |
| Context7 | Docs à jour (Next, Motion, next-intl, Zod, Supabase, Stripe) avant chaque implémentation | P3+ |
| claude-api (skill) | Bonnes pratiques SDK, modèles, coûts, sorties structurées | P2, P5 |
| Supabase MCP | Inspection, migrations, advisors (seulement sur un projet ROOMRESET dédié) | P10 |
| Blender MCP | Pré-rendu des couches de verre du terrarium, si l'ADR de T1.3 le retient ; aperçus basse résolution | P8 |
| LottieFiles Creator | Seulement si une animation vectorielle *authored* surpasse le code (ADR requise) | P8+ |
| Remotion | Film de lancement et démos à partir de captures réelles | P11 |
| Computer Use | Inspection d'apps natives si nécessaire (les navigateurs sont en lecture seule) | Ponctuel |
| Agent `motion-director` | Revue critique des directions et des interactions (une passe par tâche signature) | P1, P4, P7 |
| Expo MCP | Étude du natif | P12 |

**Écartés et pourquoi** :
- Three.js / R3F au MVP : poids et GPU injustifiés ; la 2.5D suffit.
- GSAP dans l'app : doublon avec Motion.
- Rapier : surdimensionné.
- Pixi : accessibilité.
- Lottie et Rive par défaut : poids des lecteurs.
- Builds natifs locaux : Xcode trop ancien.

## 9. Actions pour débloquer (fondateur)
1. **Git** : `git init` dans `/Users/aymaneamri/Desktop/TIdovo`, puis vérifier `.gitignore` et faire le premier commit (Claude ne le fait pas).
2. **Blender MCP** (avant P8) : ouvrir Blender 4.5.9 et activer l'add-on MCP (serveur sur le port 9876). Claude revérifiera avec `get_addon_status`.
3. **LottieFiles** (optionnel) : ouvrir `https://creator.lottiefiles.com` dans Chrome et activer le MCP. Envisager d'épingler la version de `@lottiefiles/creator-mcp` (aujourd'hui `@latest`).
4. **Clé API Anthropic** (avant T2.2) : la placer dans `spikes/ai-scan/.env.local`, jamais dans le chat. Fixer un budget de test.
5. **Supabase** (avant T10.1) : choisir une option de l'ADR-008.
6. **iPhone** : indiquer le modèle et la version d'iOS ; autoriser les tests sur le réseau local.

## 10. Commandes de re-vérification
```sh
node -v && npm -v && ffmpeg -version | head -1 && git --version
xcodebuild -version && xcrun simctl list devices available | head
/Applications/Blender.app/Contents/MacOS/Blender --version | head -1; nc -z -w 2 localhost 9876 && echo "Blender MCP port open"
npm view next version; npm view motion version
```
Côté MCP : `mcp__blender__get_addon_status`, `mcp__lottiefiles-creator__list_scenes`, `mcp__plugin_supabase_supabase__list_projects`, `mcp__computer-use__list_granted_applications`.

## 11. Mise à jour du 2026-11-10 (T1.1) — re-vérifiée par des appels réels
| Outil | Statut | Preuve et détail |
|---|---|---|
| Blender MCP | ✅ via une **instance dédiée** | Votre Blender n'avait pas l'add-on activé (port 9876 fermé). Lancement de `Blender --python-expr "import addon_utils; addon_utils.enable('blender_mcp', default_set=True)"`, puis `get_addon_status` : add-on 1.8, protocole 15. Bibliothèques et générateurs payants désactivés |
| Blender CLI (arrière-plan) | ✅ | Chambre avant/après en 14 s ; 5 galets en 5 s (Eevee Next, Intel 2017) |
| Computer Use | ⚠️ clics oui, **captures non** | « ScreenCaptureKit requires macOS 14.0 ». Vision par `screencapture` (1920×1080, points 1:1). Clic réel vérifié dans le simulateur |
| `screencapture` (macOS) | ✅ | Un seul écran actif, 1920×1080 |
| LottieFiles Creator MCP | ⚠️ toujours non connecté | Re-testé au début de T1.1 : « No Creator tab is connected » |
| Claude in Chrome | ❌ | Toujours aucun outil exposé |
| Playwright | ✅ (`playwright-core` 1.65, dossier temporaire) | Chrome installé (`channel: 'chrome'`), émulation iPhone 13, toucher CDP, screencast image par image, `reducedMotion`, throttling CPU |
| WebGL dans Chrome headless | ✅ | Le moteur Three.js tourne (`--use-angle=metal`) |
| Simulateur iPhone 15 Pro Max (iOS 17.2) | ✅ | Ouvert par le fondateur. Safari et WebKit : étude Placed en moteur 3D complète jusqu'au ticket ; dock, reveal et planche capturés |
| Serveur sur le réseau local (`0.0.0.0`) | ⛔ refusé par le classifieur de sécurité | Commande à lancer par le fondateur (`design/art-direction/README.md`) |
| Compte Apple Developer, iPhone 13 | Déclarés par le fondateur | Voie native via EAS et TestFlight (P12) |

**Enseignement réseau** : dans le simulateur, les polices Google et le CDN ont retardé le premier affichage d'environ 25 s (réseau lent). Les polices sont désormais chargées sans bloquer le rendu, et seront auto-hébergées en production (`next/font`).
