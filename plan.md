# Plan — RIBAT MVP

## Approche d’implémentation

Le projet reprend le starter React/Express/tRPC/Drizzle déjà initialisé. Le livrable prioritaire est un vertical slice démontrable et non une intégration Hedera live : la console frontend porte un état de registre synthétique permettant de jouer les scénarios de contrôle, collision, gel et vérification ; les libellés distinguent explicitement les ancrages Hedera simulés des données réellement testées. La structure garde des frontières compatibles avec une future gateway/API : canonisation multi-clés, registre de claims, ordre de due process, Link Card et métriques sont des modules de domaine côté client pour la démo, avec des routes tRPC/Express disponibles pour les futurs appels persistants.

Le dashboard est la surface principale : navigation latérale, vue d’ensemble, formulaire « vérifier une créance », journal d’activité, scénarios, et page publique Verify accessible par URL de nullifier. Les données sensibles restent absentes des vues publiques ; la page Verify ne montre qu’un nullifier raccourci, un statut, le rang, un horodatage et l’état d’ancrage. Le design est responsive et prêt pour un basculement RTL via les attributs CSS.

## Structure

- `client/src/pages/Home.tsx` : shell de console et orchestration des scénarios de démo.
- `client/src/pages/Verify.tsx` : page publique de vérification redigée.
- `client/src/lib/ribat-demo.ts` : types, données synthétiques et opérations locales de registre.
- `client/src/App.tsx` : routes `/`, `/verify/:nullifier` et `/404`.
- `client/src/index.css` : tokens visuels, layout dashboard, responsive et micro-interactions.
- `server/routers.ts` : surface tRPC minimale pour exposer la santé et les métriques si l’API est branchée ensuite.
- `client/public/manus-routes.json` : manifeste des routes publiques du projet.
- `TODO.md` : critères de sortie et état des livrables.

## Direction design choisie

### Options considérées

- Editorial risk terminal — probabilité 0,07 : interface de registre dense, typographie à contraste élevé et accents de signal.
- Warm fintech atelier — probabilité 0,05 : beige papier, bordures souples et gestes plus conversationnels.
- Dark protocol console — probabilité 0,08 : fond nocturne, cyan technique et visualisation de flux.

### Choix : Editorial risk terminal

- **Design Movement** : editorial swiss modernism appliqué à une console de risque, avec la rigueur d’un registre papier et la lisibilité d’un terminal d’observabilité.
- **Core Principles** : hiérarchie typographique nette ; densité utile sans bruit ; chaque statut est explicable ; les actions à impact sont réversibles ou temporisées.
- **Color Philosophy** : ivoire chaud pour réduire l’effet « crypto casino », graphite pour l’autorité, orange signal pour les collisions, teal pour les preuves et la confiance.
- **Layout Paradigm** : rail latéral compact et grande feuille de travail décalée, avec une colonne de contexte et des panneaux empilés plutôt qu’une grille de cartes uniforme.
- **Signature Elements** : motif de points de registre dans l’en-tête ; lignes de timeline numérotées ; badges « on-ledger / redacted / simulated ».
- **Interaction Philosophy** : chaque clic produit une preuve visible : toast, événement de journal ou changement de rang ; les collisions interrompent clairement le parcours.
- **Animation** : transitions courtes 160–220 ms, pulse discret sur les preuves fraîches, entrée décalée des lignes d’activité ; aucune animation décorative continue.
- **Typography System** : sans-serif système pour l’interface, monospace pour les nullifiers, IDs et valeurs de consensus ; titres serrés avec une forte variation de taille.
- **Brand Essence** : « La couche de preuve qui empêche une créance d’être promise deux fois. » Sérieux, neutre, protecteur.
- **Brand Voice** : les titres sont directs (« Vérifier avant d’avancer »), les CTAs sont opératoires (« Lancer le contrôle »), et les erreurs expliquent la conséquence (« Cette créance est déjà senior »).
- **Wordmark & Logo** : monogramme R en deux barres reliées, évoquant un lien scellé et une page de registre ; le mot RIBAT est en capitales espacées.
- **Signature Brand Color** : orange safran `#E58A3A`, réservé aux alertes, collisions et actions de due process.

## Dépendances et contraintes

- Utiliser les dépendances déjà installées, notamment `lucide-react`, `wouter`, Radix et Tailwind.
- Aucun secret, aucun vrai nom d’entreprise, aucune facture réelle.
- Aucun appel Hedera live dans ce MVP ; toute simulation doit être étiquetée.
- Ne pas envoyer de document, nom, montant ou ID fiscal vers la page publique Verify.
- Vérifier `pnpm check`, `pnpm test`, `pnpm build` et le manifeste `/manus-routes.json` avant le checkpoint.
