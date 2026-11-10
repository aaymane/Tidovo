# ROOMRESET — Progression

> Mise à jour à la fin de **chaque** tâche. Le journal (§9) est en ajout seulement.

## 1. État courant
| | |
|---|---|
| **Dernière mise à jour** | 2026-11-10 |
| **Dernière étape terminée** | **T0.1** — Discovery, audit des outils créatifs, mémoire persistante (🔍 livrée, en attente de revue du fondateur) |
| **Étape en cours** | Aucune : **en attente de validation, commit et push par le fondateur** |
| **Prochaine tâche** | **T1.1** — Planche de direction artistique et étude de mouvement interactive (*Light Dock*, *Placed* et empreintes, *Sunrise Reveal*). **Non commencée.** |

## 2. Fichiers créés pendant T0.1
- `CLAUDE.md` — instructions permanentes du projet et procédure de reprise.
- `docs/PRODUCT_VISION.md` — vision, personas, valeur, modèle économique, hypothèses, jalons.
- `docs/ROADMAP.md` — 13 phases (P0–P12), tâches avec ID stables, dépendances, critères, statuts, estimation.
- `docs/MOTION_SYSTEM.md` — **v0.2** : direction artistique « Morning Clarity », analyse et **transformation** de toutes les références, revue critique intégrée, tokens, signatures, performance, accessibilité.
- `docs/DECISIONS.md` — ADR-001 à ADR-017.
- `docs/QA_CHECKLIST.md` — définition de « terminé » et exigences vérifiables par domaine.
- `docs/TOOL_AUDIT.md` — état vérifié des outils, MCP, skills et agents.
- `references/README.md` — inventaire des médias de référence (exclus de Git).
- `.gitignore` — exclut les dépendances, les secrets, `references/*` (sauf le README), les photos privées et `.claude/settings.local.json`.

Aucun fichier existant n'a été modifié. Les médias de `references/` sont intacts (lecture seule via FFmpeg).

## 3. Vérifications effectuées (preuves)
| Vérification | Résultat |
|---|---|
| `git status` | `fatal: not a git repository` : **le dossier n'est pas un dépôt** |
| Machine, runtimes, CLI, apps | Voir TOOL_AUDIT §2–4 (commandes `--version`, `sysctl`, `system_profiler`) |
| MCP Blender, LottieFiles, Computer Use, Supabase, Expo, Context7 | Appels réels ; résultats dans TOOL_AUDIT §6 (Blender et LottieFiles non connectés ; LottieFiles re-testé après l'ouverture de Chrome par le fondateur : toujours « No Creator tab is connected ») |
| Références (5 vidéos, 5 images) | `ffprobe`, planches de 12 images, bandes image par image, énergie de mouvement (scores de scène FFmpeg) ; détails dans MOTION_SYSTEM §2 |
| Versions npm et licences | `npm view` (2026-11-10) ; `LICENSE.md` de Remotion lue |
| Doc Expo (Xcode requis) · doc Supabase (2 projets gratuits) · doc Motion (ressorts) · skill `claude-api` (modèles, tarifs, images) | Consultées ; citées dans les ADR |
| Contrastes de la palette v0 | Calculés (script Python, formule WCAG) : texte OK partout ; **aplats `sun` et `sage` sur `paper` < 3:1** ⇒ contrainte documentée |
| Polices (Bricolage Grotesque, Figtree) | Disponibles sur l'API Google Fonts avec axes variables et latin-ext |
| Capture Chrome headless | Fonctionne, mais **viewport réel de 500 px** au lieu de 390 ⇒ inadaptée au mobile |
| Safari du simulateur iOS 17.2 | **Fonctionne avec l'app Simulator ouverte** (393×659 px CSS, DPR 3, accents FR OK) ; écran noir pendant plus de 5 min en headless. Environnement restauré ensuite (simulateur éteint, app fermée, serveur local arrêté) |
| Revue critique `motion-director` | Faite sur la v0.1 ; **ses trois défauts et sa proposition ont été intégrés** (MOTION_SYSTEM §2.5, ADR-017) |

**Non vérifié (honnêtement)** : aucune interface n'existe encore, donc aucune mesure de FPS, aucun test tactile, aucune mesure de coût IA. Les coûts IA sont **estimés** à partir des tarifs publiés.

## 4. Problèmes restants
1. **Pas de dépôt Git** : le fondateur doit faire `git init` et le premier commit.
2. **Blender MCP** et **LottieFiles Creator MCP** sont configurés mais non connectés (actions dans TOOL_AUDIT §9). Pas bloquant avant P8.
3. **Supabase** : les deux créneaux gratuits sont occupés (décision ADR-008, avant T10.1).
4. **Xcode 15.2** : pas de build natif Expo en local (P12, plus tard).
5. **Claude in Chrome** n'est pas connecté à la session : la QA navigateur passera par Playwright (T3.1) et le simulateur.
6. `@lottiefiles/creator-mcp@latest` n'est pas épinglé (risque de chaîne d'approvisionnement, à épingler si on l'utilise).
7. Le fichier `roomreset-motion-reference.mp4` du brief n'existe pas (les références réelles sont inventoriées).

## 5. Décisions à prendre par le fondateur
| # | Décision | Recommandation | Quand |
|---|---|---|---|
| D1 | Valider la direction « Morning Clarity » v0.2 (ADR-015, 016, 017) | Valider le principe ; trancher les variantes sur preuve visuelle en T1.1 | Revue de T0.1 |
| D2 | Valider le re-séquencement (ADR-014) et le périmètre M1 | Oui : spike IA tôt, boucle utile avant rétention | Revue de T0.1 |
| D3 | Exclure `references/` de Git (ADR-013) | Oui (droits tiers, 45 Mo) | Avant le premier commit |
| D4 | Budget pour le benchmark IA (T2.2) et choix final du modèle (Opus 5.5 par défaut ; Sonnet/Haiku à comparer ?) | Prévoir un petit budget de test (quelques dollars) ; décider sur mesures | Avant T2.2 |
| D5 | Créneau Supabase (ADR-008 a, b ou c) | (c) local pour le développement, puis (a) ou (b) pour la préversion | Avant T10.1 |
| D6 | Hébergement de la préversion M1 (ADR-012) | Comparer les CGU et les coûts en T7.5 | T7.5 |
| D7 | Modèle de l'iPhone et version d'iOS pour les tests | — | Avant T1.1 |

## 6. Travail reporté
- T4.1 Moteur physique maison (⏸, ADR-017).
- T12.1 Natif Expo (⏸, Xcode).
- Offre Family, mascotte animée, monde 3D temps réel : hors MVP.

## 7. Statut Git
Dossier **non initialisé** (`git status` ⇒ `fatal: not a git repository`). Claude n'a exécuté aucune commande Git d'écriture.

Commandes à exécuter **par le fondateur** :
```sh
cd /Users/aymaneamri/Desktop/TIdovo
git init
git status            # vérifier que references/*.MP4 et .PNG sont bien ignorés
git add CLAUDE.md .gitignore docs references/README.md
git commit -m "docs: bootstrap ROOMRESET project memory, tool audit and roadmap (T0.1)"
```

## 8. Retours du fondateur pendant T0.1
- « Chrome est ouvert » : LottieFiles re-testé (toujours non connecté) ; Claude in Chrome toujours non exposé à la session.
- Nouvelle vidéo de référence (Glassy Navigation Tabs V5) : analysée (MOTION_SYSTEM §2.3).
- « Pour toutes les références : pas un modèle à copier, inspiration, faire mieux, adapté au projet » : table de transformation (MOTION_SYSTEM §2.4), ADR-016, contrôle QA DES-08.

## 9. Journal des étapes (ajout seulement)
| Date | Tâche | Événement |
|---|---|---|
| 2026-11-10 | T0.1 | Audit (Git, machine, runtimes, apps, skills, agents, plugins, MCP), analyse des références (dont la nouvelle vidéo), vision, direction créative v0.1 puis v0.2 après la revue `motion-director`, roadmap P0–P12, ADR-001 à 017, QA, mémoire du projet. Livrée pour revue. **Arrêt : attente du fondateur.** |
