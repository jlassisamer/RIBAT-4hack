# RIBAT — Receivable Integrity Registry

RIBAT est une console de démonstration pour un registre neutre d’intégrité des créances : avant de financer une facture ou une traite, un prêteur peut contrôler si le lien exact a déjà été promis ailleurs, sans révéler le document commercial.

## Ce qui est livré

Le MVP présente un parcours vertical complet : contrôle privé multi-clés, enregistrement atomique au rang 1, collision de double financement, collision INV3 sur une réémission renumérotée, journal append-only, workflow de gel à quorum de gardiens et page publique `/verify/:nullifier` redigée. La Link Card, le LinkScore v0 et les métriques sont intégrés à la console.

Les données de démonstration sont synthétiques. Le contrôle OPRF, les timestamps de consensus, les événements HCS et le miroir Hedera sont simulés dans l’interface et marqués comme tels ; aucune transaction Hedera live n’est exécutée par ce prototype. L’architecture est volontairement prête à remplacer l’état local par une gateway/API, un indexeur et les appels HCS/HTS réels.

## Démarrer

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- `pnpm check` / `pnpm test`: types and application tests.

Le serveur écoute sur `PORT` (3000 par défaut). Les contrôles disponibles sont `pnpm check`, `pnpm test` et `pnpm build`.

## Parcours de démo

Depuis la page d’accueil, cliquer sur « Double financement » pour charger `INV-2026-00418`, puis « Lancer le contrôle » : la seconde promesse est bloquée avec son rang senior. Le scénario « Réémission renumérotée » montre une collision sur `INV3`. Dans la section due process, cliquer sur « Approuver » puis exécuter le gel après quorum. Le lien « Verify public » ouvre la preuve redigée : nullifier, party ID pseudonyme, rang, timestamp, racine d’époque et ancrage simulé uniquement.

## Confidentialité et périmètre

Les vues publiques ne contiennent ni PDF/XML, noms, montants, portefeuille de prêteur ni identifiants fiscaux. Les textes affichés dans le prototype ne constituent ni avis juridique ni promesse de priorité opposable en Tunisie. Toute intégration TTN/El Fatoora officielle, HCS/HTS live, seuil OPRF, persistance Postgres et revue juridique sont des étapes ultérieures.

## Non testé dans ce prototype

Les appels Hedera live, les frais réels, la lecture d’événements Mirror Node, le partage de clé OPRF entre opérateurs, la signature de membres, la persistance et l’atomicité côté serveur, ainsi que la validité juridique tunisienne de la priorité ne sont pas testés ici. Les tests automatisés couvrent le starter plateforme/authentification ; les scénarios métier sont validés par le parcours de démonstration local.

Le manifeste de routes est servi sur `GET /manus-routes.json`.

Start with the Webdev skill's default-template guide. Platform login, storage, payments and service contracts live in its shared references; read the relevant capability before extending its helper.

`server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.

Platform configuration is readable and editable through `webdev.config`. Default settings are initial values, not enforced constraints. The agent may modify the files, commands and configuration or follow the flexible guide for another stack.
