# ROOMRESET — application web

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 6 strict · Tailwind CSS 4.
Mobile d'abord. Contexte, décisions et feuille de route : `../CLAUDE.md` et `../docs/`.

## Démarrer

```sh
cd web
npm install
npm run dev            # http://localhost:3000
```

**Sur l'iPhone, via le réseau local** : `npm run dev:lan`, puis `http://<adresse du Mac>:3000` (adresse : `ipconfig getifaddr en0`). Cette commande expose le serveur sur votre réseau : arrêtez-la après les tests.

## Scripts

| Script                            | Rôle                                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `npm run typecheck`               | TypeScript strict, sans émission                                                        |
| `npm run lint`                    | ESLint (Next, Core Web Vitals, TypeScript), plus la règle de pureté de `src/core`       |
| `npm run test`                    | Tests unitaires (Vitest) de `src/**/*.test.ts`                                          |
| `npm run e2e`                     | Playwright : build de production, puis tests dans Chrome en émulation iPhone 13 tactile |
| `npm run format` / `format:check` | Prettier                                                                                |
| `npm run check`                   | typecheck + lint + test + format:check                                                  |
| `npm run build`                   | Build de production                                                                     |

## Structure (cible)

```
src/
  app/        routes Next.js (App Router)
  core/       TypeScript pur, partagé avec la future app Expo : AUCUN import React/Next/UI (règle ESLint)
  ui/         composants (T3.4)
  motion/     système de mouvement : ressorts, paliers, préférences (T3.3)
  features/   fonctionnalités : scan, session, reveal, monde… (P4+)
  server/     code serveur uniquement (secrets, appels IA) (P5)
  i18n/       messages EN/FR (T3.6)
e2e/          tests Playwright
```

Les dossiers sont créés au moment où ils servent ; seul `src/core/color` existe pour l'instant.

## Conventions

- Versions **épinglées exactement** pour l'outillage. TypeScript reste en 6.0.3 : la version 7 n'est pas encore acceptée par `typescript-eslint` (ADR-023).
- Polices auto-hébergées par `next/font` (aucune requête vers Google à l'exécution).
- Aucune clé ni aucun secret dans le code client : tout passe par `src/server` et `.env.local` (ignoré par Git).
