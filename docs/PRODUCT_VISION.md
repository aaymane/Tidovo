# ROOMRESET — Vision produit

> **Your room. Your game. Your reset.** — « Ta pièce. Ton jeu. Ton reset. »
> Version 0.1 — 2026-11-10 (T0.1). À valider par le fondateur. Les hypothèses sont signalées comme telles.

---

## 1. En une phrase
ROOMRESET transforme une pièce en désordre en une **courte aventure guidée**. On la photographie ; l'app propose des micro-missions réalistes **ajustées au temps dont on dispose** ; on les accomplit **une à la fois**, avec des retours tactiles qui donnent l'impression de *remettre chaque chose à sa place* ; on découvre un **vrai avant/après**. Pendant ce temps, un petit monde personnel grandit à chaque Reset.

## 2. Le problème et l'insight
Le désordre n'est pas un problème de savoir-faire. **C'est un problème de démarrage, de décision et d'émotion.**

| Obstacle | Ce que l'utilisateur ressent | Réponse de ROOMRESET |
|---|---|---|
| Ne pas savoir par où commencer | « Je regarde la pièce et je bloque » | L'IA choisit une **première petite victoire** (moins de 2 min) |
| Trop de choses à faire | « C'est trop, je laisse tomber » | On ne montre **que ce qui tient dans le temps choisi** (5, 10 ou 20 min) ; le reste attend sans pression |
| Peu de temps | « Je n'ai pas une heure devant moi » | Sessions courtes, durées réalistes, interruption possible sans perte |
| Manque de motivation | « C'est ingrat » | Une action à la fois, des retours sensoriels satisfaisants, une progression visible |
| Pas de routine | « Ça revient toujours » | Micro-routines quotidiennes **sans photo** (Daily Coach) |
| Découragement, honte | « Je suis nul·le » | **Zéro jugement** : pas de score de propreté, pas de série punitive. Passer une mission est normal |

## 3. Pour qui
Public international, adulte, en anglais et en français au lancement (architecture i18n prête pour d'autres langues). Aucune culture IA ou jeu vidéo n'est requise : la première expérience doit se comprendre **en moins de 5 secondes**.

**Personas (hypothèses à confronter aux tests)**
- **Sam, 29 ans — « Je n'ai que 10 minutes. »** Travaille, petit appartement, le désordre s'accumule dans la semaine. *Job : retrouver vite un espace correct, sans rien planifier.*
- **Inès, 34 ans — « Je ne sais pas par où commencer. »** Se sent submergée et procrastine sur la maison. A besoin d'un tout premier pas minuscule et de bienveillance. *(Le produit est pensé pour les personnes qui ont du mal à démarrer, sans aucune prétention médicale ni diagnostic.)*
- **Léo, 22 ans — « Coloc et studio. »** Étudiant ou jeune actif, sensible à la progression, au jeu et au partage. *Job : rendre la corvée un peu fun et montrer le résultat.*
- *Plus tard :* foyers et familles (offre Family, hors MVP).

## 4. Jobs-to-be-done
1. Quand ma pièce me paraît « trop », **aide-moi à démarrer en moins d'une minute.**
2. Quand je n'ai que 5 à 20 minutes, **donne-moi la meilleure façon de les utiliser.**
3. Pendant le rangement, **fais-moi avancer une étape à la fois.**
4. Quand j'ai fini, **fais-moi voir et ressentir la différence.**
5. Les jours ordinaires, **aide-moi à éviter que ça s'accumule**, avec de toutes petites routines.

## 5. Proposition de valeur et différenciation
1. **Ça part de TA pièce, maintenant.** Les missions viennent de ce qui est réellement visible sur la photo, pas d'un planning de ménage générique.
2. **Taillé à ton temps.** 5, 10 ou 20 minutes : le plan s'adapte à l'énergie du moment.
3. **Une chose à la fois.** Un mode concentration dont les retours tactiles imitent le geste de ranger (*Loose → Placed*).
4. **Une preuve réelle.** L'avant/après, avec tes vraies photos, est la récompense la plus honnête qui soit.
5. **Sans honte.** Pas de note, pas de punition ; l'app encourage et ne culpabilise jamais.
6. **Un monde qui grandit avec la régularité, pas avec la perfection.**

Références anti-clone citées par le fondateur : Tody, Unfrozen, Finch. **Aucune analyse concurrentielle n'a encore été faite** (pas de recherche web à cette étape) : c'est la tâche T1.4.

## 6. La boucle principale
```
 Photo de la pièce ──▶ Missions-galets sur la table ──▶ Choix du temps (5/10/20)
        ▲                (libellées, la 1re victoire     │  les empreintes du plan
        │                 éclairée)                      ▼  se creusent dans le plateau
 Coach quotidien ◀── Le chemin pousse ◀── Avant/après ◀── Mode mission : une à la fois
 (sans photo)         dans le terrarium     (la lumière du    (chaque galet se pose
                      (galets → chemin)      matin traverse    dans SON empreinte)
                                             la pièce)
```

## 7. Les espaces de l'expérience
| Espace | Intention | Décisions clés (proposées) |
|---|---|---|
| **A. Welcome** | Comprendre la promesse en 5 s et faire immédiatement le geste central | « **Pose-le à sa place** » : un galet, une empreinte. On le glisse dedans (ou on touche « Placer »), puis la promesse et le CTA « Commencer un Reset gratuit » apparaissent. Aucun compte requis |
| **B. AI Room Scan** | Transformer une photo en observations visibles, puis en missions | Consentement IA explicite au premier scan (prestataire nommé) ; photo réduite et nettoyée de ses EXIF sur l'appareil ; observations corrigeables ; jamais de prétention sur ce qui est caché |
| **C. Mission Selection** | Choisir son temps et voir ce qui y tient | Sélecteur 5/10/20 : les **empreintes** du plan se creusent dans le plateau, les galets retenus s'ordonnent, les autres glissent dans « plus tard ». La première petite victoire est éclairée par le rai de soleil |
| **D. Mission Mode** | Une action à la fois, sans friction | Minuteur optionnel ; passer, modifier ou mettre en pause sans pénalité ; reprise après interruption |
| **E. Reset World** | Rendre la régularité visible | Un terrarium qui pousse ; les plantes ne meurent jamais (elles se reposent) |
| **F. Home Memory** | Mémoriser les espaces qu'on choisit d'enregistrer | Opt-in par pièce ; historique et préférences ; tout reste supprimable |
| **G. Daily Coach** | Faire revenir chaque jour sans nouveau scan | Micro-resets de 2 à 5 min basés sur l'historique ; rappels opt-in |
| **H. Before / After** | Le moment émotionnel le plus fort | **Sunrise Reveal** : mise au point sur la photo *après*, puis on fait **traverser la lumière du matin** dans la pièce (on fait entrer le jour, on ne « nettoie » pas l'avant). Résumé. Partage seulement après consentement, **sans photo par défaut** (« Reset Receipt » = le plateau rempli) |
| **I. Subscription** | Payer pour une utilité récurrente | Premier Reset complet gratuit ; offre Plus présentée **après** la valeur ; facturation réelle seulement sur autorisation |

## 8. Identité et concept créatif (résumé)
Détails dans `docs/MOTION_SYSTEM.md`.
- **Direction artistique « Morning Clarity »** — la lumière d'un matin dans une pièce qu'on vient de ranger : air clair, lumière chaude et rasante, surfaces mates, ombres douces. Thème jour (lin, encre de mousse) et thème soir (nuit verte, lumière de lampe).
- **Trois verbes de mouvement** :
  - **Se poser** (*Loose → Lifted → Placed*) : des objets de travers retrouvent leur empreinte.
  - **S'éclaircir** (*Haze → Clarity*) : la lumière monte avec la session.
  - **Pousser** (*Path → Life*) : chaque Reset prolonge un chemin, et la vie pousse le long.
- **Le poids et le repos** : des galets vus de dessus, qu'on soulève et qu'on pose ; rien ne bouge sans raison. Une géographie stable : **en haut le plan et ce qui est fait, au centre maintenant, en bas plus tard.**
- **Trois interactions signature** :
  1. **The Scatter** — les missions tombent de la photo sur la table, en galets **libellés**, dont la taille indique la durée ; la première petite victoire est éclairée.
  2. **Placed** — « Fait » : le galet vole et tombe dans **sa propre empreinte** du plateau, qui se creuse sous l'impact. Le plateau est à la fois le plan et la progression.
  3. **The Sunrise Reveal** — mise au point sur la photo *après*, puis on fait **traverser la lumière du matin** dans la pièce pour comparer avec l'*avant*, sans jugement.
- **Reset World** : un **terrarium** (un monde sous verre) où chaque Reset ajoute **un tronçon de chemin fait des galets placés**, et une pousse naît au bout.
- **Le guide** : une **luciole**, simple point de lumière chaude sans visage, présente aux moments d'attente et de retour. Ce n'est pas une mascotte bavarde.
- **Light Dock** : la navigation est un dock en vitre dépolie. L'onglet actif est éclairé par un **rai de soleil** qui suit l'angle de lumière de l'app, et le **galet Reset** central repose dans un berceau.
- **Ta pièce est la scène** : pendant une session, ta propre photo très floutée sert d'atmosphère, et la lumière monte à chaque mission placée. Au Reveal, la mise au point se fait sur la photo *après*.
- **Références** : toutes servent d'**inspiration, jamais de modèle**. Chacune est transformée en une idée propre à ROOMRESET (table dans `docs/MOTION_SYSTEM.md` §2.4).

## 9. Modèle économique (hypothèses à valider)
**Gratuit, pour toujours :** un premier Reset IA complet (scan, session, avant/après) sans compte. Ensuite : Resets manuels (catalogue de missions), Daily Coach de base, et le monde qui continue de grandir. L'habitude et la bonne volonté sont préservées.

**Plus (hypothèses du fondateur)** : **6,99 €/mois** ou **49,99 €/an** (environ −40 % par rapport au mensuel). Essai de 7 jours avec carte, proposé **après** la découverte de la valeur (après le premier avant/après ou au deuxième scan).
- Inclus : scans IA illimités (usage raisonnable), Home Memory (pièces, historique, archive avant/après), Daily Coach adaptatif, routines personnalisées, multi-pièces, progression complète du monde.
- **Ce qu'on vend, c'est une utilité récurrente** (scan, mémoire, coach), pas des décorations.
- *Family* (89,99 €/an) : piste future, hors MVP.

**Coût IA par scan — estimation, non mesurée** (tarifs de la doc Anthropic en cache au 2026-11-03, par million de tokens entrée/sortie : Opus 5.5 4 $/20 $ · Sonnet 5.5 2 $/10 $ · Haiku 5.5 0,10 $/0,50 $).
Hypothèse : image réduite à ~1280 px, soit environ 1 300 à 1 600 tokens image (règle documentée : ~1 token par carré de 28×28 px). S'ajoutent environ 2 000 tokens de consignes, et 1 500 à 2 500 tokens de sortie, raisonnement compris.

| Modèle | Coût estimé par scan |
|---|---|
| `claude-opus-5-5` (défaut recommandé par la doc du SDK) | ≈ 0,04 à 0,07 $ |
| `claude-sonnet-5-5` | ≈ 0,02 à 0,035 $ |
| `claude-haiku-5-5` | ≈ 0,002 $ |

À 20 scans par mois et par abonné, le coût reste faible face à 6,99 € avec Opus. Le choix final se fera sur **mesure réelle** (benchmark T2.2) et sur **décision du fondateur** (qualité contre coût). Des quotas côté serveur protègent l'offre gratuite.

**Canaux de paiement :** Stripe sur le web (pas de commission de store ; les frais Stripe s'appliquent). Une future app native devra respecter les règles d'achat intégré des stores. Les droits d'accès sont donc gérés de façon **indépendante du fournisseur** (table `entitlements`).
**Juridique :** abonnements, essais et rappels de fin d'essai sont encadrés (notamment dans l'UE). Une relecture professionnelle est à prévoir avant d'activer la facturation réelle ; ce document n'est pas un avis juridique.

## 10. Confidentialité dès la conception
- Photo **réduite et ré-encodée sur l'appareil** avant tout envoi (EXIF et GPS supprimés).
- Au MVP, la photo de scan est envoyée au serveur **uniquement** pour l'analyse, puis **jamais stockée** côté serveur. Les photos restent sur l'appareil (IndexedDB) tant que l'utilisateur n'active pas la sauvegarde de compte.
- Consentement explicite avant le premier envoi à l'IA ; prestataire nommé ; mode manuel si l'utilisateur refuse.
- Le modèle ignore les personnes et les documents visibles ; aucune identification, aucun jugement de propreté, aucun diagnostic.
- Suppression de toutes les données en un geste ; export plus tard (phase 10).
- Partage : écran de consentement ; par défaut, un « ticket » de statistiques **sans photo** ; photos optionnelles, avec recadrage et floutage manuel.
- Journaux sans image, sans contenu libre, sans donnée personnelle.

## 11. Ce que ROOMRESET n'est pas
Une simple todo list · un chatbot à qui on envoie une photo · un clone de Tody, Unfrozen ou Finch · un petit jeu décoratif · un outil de nettoyage professionnel · un produit administratif ou scolaire · un juge de la propreté · un outil médical.

## 12. Indicateurs de réussite
- **North Star :** Resets terminés par utilisateur actif et par semaine.
- **Activation :** part des nouveaux utilisateurs qui terminent leur premier Reset dans les 24 h.
- **Qualité IA :** taux de missions conservées après revue (objectif ≥ 80 %) ; hallucinations par scan.
- **Valeur perçue :** « Ça va mieux ? » en un tap après le Reset ; taux de partage du ticket.
- **Rétention :** J1, J7, J30 ; usage du Daily Coach.
- **Business :** démarrage d'essai après le premier avant/après ; conversion essai → payant ; coût IA par utilisateur actif.

## 13. Hypothèses et risques
| # | Hypothèse ou risque | Comment on le vérifie | Où |
|---|---|---|---|
| H1 | L'IA produit des missions utiles et réalistes à partir d'une seule photo | Benchmark sur photos réelles, grille de notation | T2.2 |
| H2 | Les micro-missions limitées dans le temps aident à démarrer | Taux scan → session, puis session terminée (tests M1) | T7.5 |
| H3 | Le retour tactile « Placed » augmente la complétion par rapport à une liste simple | Comparaison qualitative en M1, A/B plus tard | M2 |
| H4 | L'avant/après réel est le moment le plus satisfaisant et donne envie de partager | Entretiens et taux de partage | M1–M2 |
| H5 | Le Daily Coach sans scan fait revenir chaque semaine | Rétention J7 en M2 | M2 |
| H6 | Les utilisateurs paient pour scans, mémoire et coach | Démarrages d'essai, conversion | M3 |
| H7 | Les utilisateurs acceptent d'envoyer une photo de leur intérieur à une IA si c'est clair | Taux de consentement au premier scan | M1 |
| R1 | Peur pour la vie privée | Traitement local, non-stockage, transparence | Partout |
| R2 | Coût IA hors de contrôle | Quotas, journal des coûts, choix du modèle sur mesure | T5.3, T11.6 |
| R3 | Saturation (trop de missions affichées) | Plafond de 7 galets visibles, le reste « plus tard » | T4.2 |
| R4 | Effets lourds sur téléphones modestes | Paliers full/lite/static, budgets mesurés | T3.3, T4.6 |
| R5 | Effet de nouveauté qui s'épuise | Daily Coach, monde évolutif, saisons | M2 |

## 14. Périmètre par jalon (voir `docs/ROADMAP.md`)
- **M1 « Core Loop »** — parcours principal local-first sur web mobile, EN/FR, sans compte ni paiement : Welcome → scan IA → revue → choix du temps → mode mission avec *Placed* → avant/après avec la raclette → résumé. Préversion privée pour 5 à 10 testeurs.
- **M2 « Retention »** — Reset World (terrarium), Home Memory, Daily Coach, carte de partage.
- **M3 « Business »** — comptes et synchronisation (Supabase), Stripe en test, droits d'accès, paywall honnête, suppression et export des données.
- **M4 « Launch »** — QA multi-appareils, performance, accessibilité, sécurité, landing page, vidéos de démo, bêta publique.
- **Plus tard** — app native Expo (exige une machine avec Xcode 26.4+ ou des builds cloud), offre Family, mascotte animée, monde 3D temps réel si justifié.
