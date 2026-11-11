# ROOMRESET — QA Checklist

> Version 0.1 — 2026-11-10 (T0.1). Chaque exigence est **vérifiable** et indique sa méthode.
> **Show, don't claim** : une case n'est cochée qu'avec une preuve (capture, sortie de commande, mesure, enregistrement) référencée dans `docs/PROGRESS.md`.
> Phases d'application entre crochets, par exemple [P3+].

## 0. Définition de « terminé » (toute tâche)
- [ ] Tous les critères d'acceptation de la fiche ROADMAP sont satisfaits, avec leurs preuves.
- [ ] `typecheck`, `lint` et `test` sont verts quand du code existe (sorties jointes).
- [ ] Aucune erreur dans la console (tâches visuelles).
- [ ] Aucun secret dans le code ni dans le bundle client.
- [ ] Aucune modification hors du périmètre de la tâche ; les modifications du fondateur sont préservées.
- [ ] Git non modifié par Claude (lecture seule).
- [ ] ROADMAP, PROGRESS et DECISIONS sont à jour ; un message de commit est proposé.
- [ ] Ce qui reste estimé ou non vérifié est explicitement signalé.

## 1. Design (DES)
| ID | Exigence | Méthode | Phase |
|---|---|---|---|
| DES-01 | Aucune couleur, taille ou ombre codée en dur hors tokens | grep et lint sur `src/` | P3+ |
| DES-02 | Échelle typographique respectée ; 2 familles au maximum ; glyphes FR corrects | Capture et page `/dev/tokens` | P1, P3+ |
| DES-03 | Grille de 4 pt ; safe areas respectées (encoche, indicateur d'accueil) | Captures du simulateur iOS | P3+ |
| DES-04 | Une seule action primaire par écran ; hiérarchie lisible en 5 s | Revue de capture et test des 5 s | P4+ |
| DES-05 | Thèmes Jour et Soir revus | Captures dans les deux thèmes | P3+ |
| DES-06 | Mise en page correcte à 360, 390 et 430 px ; paysage utilisable | Captures Playwright | P3+ |
| DES-07 | Aucun texte sur un fond chargé sans surface opaque ou voile suffisant | Revue et calcul de contraste | P3+ |
| DES-08 | **Aucune reprise d'une référence telle quelle** : la table de transformation (MOTION_SYSTEM §2.4) est respectée | Comparaison côte à côte avec les références | P1+ |
| DES-09 | Microcopie **et métaphores** conformes à la voix : aucune culpabilisation, aucun jugement de propreté (on ne « nettoie » jamais l'*avant*) | Relecture de toutes les chaînes EN/FR et des animations | P1+ |
| DES-10 | Chaque galet affiche sa pastille de libellé (mission + durée) lisible à 52 px | Capture à 390 px et lecture à bout de bras | P1, P4+ |

## 2. Motion (MOT)
| ID | Exigence | Méthode | Phase |
|---|---|---|---|
| MOT-01 | Durées et ressorts issus de `src/motion/tokens` uniquement | grep | P3+ |
| MOT-02 | Toute animation est interrompable (re-tap en cours d'animation) | Test manuel et E2E | P3+ |
| MOT-03 | État pressé visible dans la frame (< 16 ms) | Trace de performance ou enregistrement à 60 i/s | P3+ |
| MOT-04 | `prefers-reduced-motion` et « Mouvement calme » ⇒ variantes statiques (MOTION_SYSTEM §11.1) | Playwright `reducedMotion: 'reduce'` et iOS (réglage Réduire les animations) | P3+ |
| MOT-05 | Aucun flou animé sur de grandes surfaces ; **un seul** `backdrop-filter` visible (le dock) | Revue de code et calques DevTools | P3+ |
| MOT-06 | Boucles ambiantes en pause si caché ou hors écran ; **0 rAF au repos** | Overlay `?perf=1` | P3+ |
| MOT-07 | Cérémonies passables d'un tap, ≤ 2 s | Test manuel | P4+ |
| MOT-08 | Chaque geste a un équivalent bouton ou clavier | Revue et test clavier | P3+ |
| MOT-09 | Interactions signature sans saut ni « pop » | Enregistrement d'écran puis extraction image par image (FFmpeg) | P1, P4+ |
| MOT-10 | **Rien ne bouge sans cause** : aucune animation sur la table au repos | Overlay (0 rAF) et enregistrement de 10 s au repos | P4 |
| MOT-11 | La lumière (dock, galets, ombres, Reveal) suit **un seul** angle global | Revue visuelle à 3 heures simulées | P3+ |
| MOT-12 | Aucune zone de glisser à moins de 20 px des bords de l'écran (geste retour de Safari) | Test sur iPhone réel et revue CSS | P4+ |
| MOT-13 | Aucune forme en `clip-path` ou masque animé ; formes en `border-radius` | grep et revue | P3+ |
| MOT-14 | La géographie de session est respectée : haut = fait, centre = maintenant, bas = plus tard | Revue des écrans P4, P6 et P7 | P4+ |

## 3. Fonctionnel (FON)
| ID | Exigence | Méthode | Phase |
|---|---|---|---|
| FON-01 | Parcours principal de bout en bout : Welcome → scan (IA simulée) → revue → durée → missions → Reveal → résumé | E2E Playwright | P7 |
| FON-02 | Passer, modifier ou mettre en pause sans pénalité ; reprise exacte après rechargement | E2E | P6 |
| FON-03 | Retour arrière cohérent sur toutes les routes | E2E | P3+ |
| FON-04 | Hors ligne, erreur IA, refus du modèle, quota : chaque cas a une issue (mode manuel) | E2E avec réponses simulées | P5 |
| FON-05 | Un Reset complet est possible sans IA (catalogue) | E2E | P6 (M2) |
| FON-06 | 100 % des chaînes externalisées ; bascule EN/FR | Test des clés manquantes | P3+ |
| FON-07 | « Supprimer mes données » vide IndexedDB (et le serveur à partir de P10) | Test automatisé | P3, P10 |

## 4. Mobile (MOB)
| ID | Exigence | Méthode | Phase |
|---|---|---|---|
| MOB-01 | Test sur l'iPhone réel du fondateur pour chaque tâche signature | Retour écrit du fondateur et mesures de l'overlay | P1, P4+ |
| MOB-02 | Captures Safari dans le simulateur iOS 17.2 (SE 3 et 15 Pro Max) | `xcrun simctl`, **avec l'app Simulator ouverte** (ADR-011) | P1+ |
| MOB-03 | Chrome Android (émulation, appareil réel si disponible) | Playwright (profil d'appareil) | P3+ |
| MOB-04 | Capture caméra et import galerie sur iOS et Android ; HEIC géré | Test manuel | P5 |
| MOB-05 | Cibles ≥ 44 px ; le champ ne piège pas le défilement de la page | Test manuel et revue CSS | P3+ |
| MOB-06 | Le clavier virtuel ne masque pas les champs ; unités `dvh` correctes | Simulateur | P3+ |
| MOB-07 | PWA installable, affichage standalone | Simulateur et appareil réel | P11 |

## 5. Performance (PERF)
| ID | Exigence (cible) | Méthode | Phase |
|---|---|---|---|
| PERF-01 | p95 du temps de frame ≤ 16,7 ms pendant les interactions signature (iPhone du fondateur) | Overlay `?perf=1`, consigné avec modèle et version d'OS | P1, P4+ |
| PERF-02 | Palier lite : p95 ≤ 20 ms (Chrome émulé CPU ×4) | Overlay et trace CDP | P4+ |
| PERF-03 | Aucune tâche longue > 50 ms pendant une interaction | `PerformanceObserver` | P4+ |
| PERF-04 | LCP ≤ 2,5 s · CLS ≤ 0,05 · INP ≤ 200 ms | Lighthouse mobile (4G simulée) | P4+ |
| PERF-05 | JS initial de la route Welcome ≤ 170 Ko gzip | Sortie de `next build` | P4+ |
| PERF-06 | Session de 20 min : tas stable (±10 %), pas de fuite d'écouteurs | Instantanés de tas via CDP | P6+ |
| PERF-07 | Photo envoyée ≤ ~400 Ko typique | Mesure sur photos de test | P5 |
| PERF-08 | Polices ≤ 120 Ko WOFF2 au total | Sortie de build | P3 |
| PERF-09 | Aucun rAF actif au repos (batterie) | Overlay | P3+ |

## 6. Accessibilité (A11Y)
| ID | Exigence | Méthode | Phase |
|---|---|---|---|
| A11Y-01 | Texte ≥ 4,5:1 (grand texte ≥ 3:1) ; non-texte ≥ 3:1. **Constat : aplats `sun` et `sage` sur `paper` < 3:1 ⇒ bord, icône ou texte obligatoires** | Test automatisé des tokens (T3.2) | P1, P3+ |
| A11Y-02 | axe-core : 0 violation critique ou sérieuse par écran | `@axe-core/playwright` | P3+ |
| A11Y-03 | Parcours principal au VoiceOver | Appareil réel ou Accessibility Inspector | P4+ |
| A11Y-04 | Toutes les actions au clavier ; focus visible | E2E clavier | P3+ |
| A11Y-05 | Annonces `aria-live` de la progression (*Placed*, fin de session) | VoiceOver et test DOM | P4+ |
| A11Y-06 | Aucune information portée par la couleur seule | Revue | P3+ |
| A11Y-07 | Zoom à 200 % et grande taille de texte sans casse | Test manuel | P3+ |
| A11Y-08 | Pas plus de 3 flashs par seconde ; aucun minuteur qui avance seul | Revue | P4+ |

## 7. Confidentialité (PRIV)
| ID | Exigence | Méthode | Phase |
|---|---|---|---|
| PRIV-01 | EXIF et GPS supprimés avant l'envoi | Test automatisé avec une image GPS de test | P5 |
| PRIV-02 | Consentement explicite avant le premier scan, prestataire nommé ; refus ⇒ mode manuel | E2E | P5 |
| PRIV-03 | Aucune image de scan conservée côté serveur | Revue de code ; journaux sans charge image | P5 |
| PRIV-04 | Journaux sans image, sans contenu libre, sans donnée personnelle | Revue des journaux | P5+ |
| PRIV-05 | Suppression totale des données (locales puis serveur) | Tests | P3, P10 |
| PRIV-06 | Partage uniquement après consentement ; par défaut **sans photo** ; génération locale | E2E (aucune requête réseau) | P7 |
| PRIV-07 | Le modèle n'identifie personne, ne juge pas, ne pose aucun diagnostic | Jeu d'évaluation du benchmark | P2, P5 |
| PRIV-08 | La politique de confidentialité liste les sous-traitants (IA, hébergement, Supabase, Stripe, analytics) | Revue | P11 |
| PRIV-09 | Bucket privé, URLs signées courtes, RLS testée avec deux utilisateurs | Tests | P10 |
| PRIV-10 | L'atmosphère personnelle ne laisse **aucun détail lisible** de la pièce | Revue de capture à pleine résolution | P6 |

## 8. IA (IA)
| ID | Exigence | Méthode | Phase |
|---|---|---|---|
| IA-01 | Sortie validée par Zod ; invalide ⇒ une relance, puis une erreur bienveillante | Tests avec SDK simulé | P2, P5 |
| IA-02 | Uniquement des éléments visibles ; taux d'hallucination mesuré | Benchmark T2.2 | P2 |
| IA-03 | Coût par scan journalisé (tokens) et dans le budget | Journal d'usage | P2, P5 |
| IA-04 | `stop_reason: "refusal"` géré | Test | P5 |
| IA-05 | Quotas et rate limit appliqués côté serveur | Tests | P5, P10 |
| IA-06 | Latence p50/p90 mesurée ; au-delà de 10 s, l'interface reste claire | Benchmark et E2E | P2, P5 |

## 9. Paiement (PAY) [P10+]
| ID | Exigence | Méthode |
|---|---|---|
| PAY-01 | Stripe en **mode test** uniquement ; aucune clé live dans l'environnement avant autorisation | Revue de l'environnement |
| PAY-02 | Signature des webhooks vérifiée ; traitement idempotent | Test de rejeu |
| PAY-03 | Droits mis à jour : achat, renouvellement, annulation, échec de paiement | Événements de test Stripe |
| PAY-04 | Essai : conditions claires, rappel avant la fin, résiliation facile (portail) | Revue et E2E |
| PAY-05 | Prix localisés ; traitement des taxes documenté | Revue |
| PAY-06 | Le paywall ne bloque jamais l'accès à ses données ni leur suppression | E2E |
| PAY-07 | Facturation réelle seulement avec **autorisation écrite du fondateur** (T10.9) | Gate |

## 10. Sécurité (SEC)
| ID | Exigence | Méthode | Phase |
|---|---|---|---|
| SEC-01 | Secrets côté serveur uniquement ; bundle client vérifié | grep sur `.next/static` | P3+ |
| SEC-02 | En-têtes CSP, `frame-ancestors`, `referrer-policy` | Inspection des réponses | P5+ |
| SEC-03 | Toutes les routes serveur valident leurs entrées (Zod) | Tests | P5+ |
| SEC-04 | `npm audit` : aucune vulnérabilité haute ou critique non traitée | Commande | P3+ |
| SEC-05 | Limites d'upload (type, taille, dimensions) vérifiées côté serveur | Tests | P5 |

## 11. Matrice appareils (à compléter)
| Appareil | Moteur | Usage | Disponibilité vérifiée |
|---|---|---|---|
| iPhone du fondateur (modèle à confirmer ; références enregistrées en 1170×2532) | Safari iOS (version à confirmer) | Toucher, performance, caméra | À confirmer |
| Simulateur iPhone 15 (iOS 17.2) | WebKit 605.1.15 | Captures, rendu WebKit | ✅ testé le 2026-11-10 (393×659 px CSS, DPR 3) |
| Simulateur iPhone SE 3 / 15 Pro Max (iOS 17.2) | WebKit | Petit et grand écran | Présents, non testés |
| Chrome 156 desktop (émulation mobile via Playwright) | Blink | E2E, traces, Lighthouse | Chrome présent ; Playwright à installer (T3.1) |
| Android réel | Blink | Haptique, caméra | Non disponible à ce jour |

### Mise à jour du 2026-11-10 (T1.1)
| Appareil | Statut |
|---|---|
| **iPhone 13 du fondateur** (iOS à préciser) | **À tester** avec `?perf=1` : c'est la mesure de référence |
| Simulateur iPhone 15 Pro Max (iOS 17.2, WebKit) | ✅ Testé : Placed en 3D complet jusqu'au ticket ; dock, reveal et planche rendus |
| Chrome 156 (Playwright, émulation iPhone 13 390×844, tactile) | ✅ Testé : console propre sur les 4 pages ; parcours, mouvement réduit, 0 rAF au repos ; capture du vol image par image |

### Atmosphère vivante (T1.5)
| ID | Exigence | Méthode |
|---|---|---|
| ATM-01 | Texte sur l'atmosphère ≥ 4,5:1 sur le pire pixel (voile de mise au point) | Capture avec le texte rendu transparent, `signalstats` YMIN/YMAX, puis calcul WCAG |
| ATM-02 | Mouvement réduit : image fixe, aucune boucle | `window.rrAtmos.running === false` |
| ATM-03 | Arrêt quand l'onglet est caché ; 30 i/s au repos | Revue de code et overlay `?perf=1` |
| ATM-04 | p95 ≤ 16,7 ms pendant l'interaction sur iPhone 13 ; chauffe acceptable sur 10 min | Test du fondateur |
