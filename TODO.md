# TODO — RIBAT MVP

## Console de risque et navigation

- [ ] La console affiche un rail latéral avec les sections Vue d’ensemble, Vérifier une créance, Journal, Scénarios et Verify public ; la page est lisible sur desktop et mobile.
- [ ] Le header expose le statut de registre, l’environnement de démonstration et le rôle opérateur sans afficher de portefeuille ou de données sensibles.
- [ ] Les textes sont en français prioritaire et les styles sont prêts pour une interface arabe RTL.

## Contrôle privé et enregistrement prioritaire

- [ ] Le prêteur peut saisir une référence TEIF, un fournisseur, un acheteur, une date d’émission, un montant et choisir Facture ou Traite.
- [ ] Le contrôle produit trois clés canoniques (INV1, INV2, INV3) sous forme de clés privées/aveuglées ; l’interface explique que les noms et montants ne quittent pas le prêteur.
- [ ] Une créance libre peut être enregistrée et reçoit un rang 1, un horodatage de consensus simulé, un `docHash` redigé et un événement visible.
- [ ] Une seconde tentative sur la même créance est bloquée avec le message « déjà enregistrée », le rang senior et son horodatage ; la démonstration montre aussi le cas de réémission renumérotée détectée par INV3.
- [ ] Les données publiques ne contiennent ni PDF/XML, noms, montants ni identifiants fiscaux.

## Due process et preuve

- [ ] Une action de gel peut être proposée, affiche l’ETA du time-lock, exige 2 approbations sur 3 gardiens, puis devient exécutable.
- [ ] Le gel expiré automatiquement redevient visible dans le journal, sans clé admin toute-puissante.
- [ ] La page `/verify/:nullifier` est publique et redigée : statut, rang, horodatage, nullifier raccourci, statut d’ancrage et preuve de racine uniquement.
- [ ] Les marqueurs distinguent clairement « Hedera simulé » de toute intégration live ; aucun appel réseau externe n’est présenté comme preuve réelle.

## Link Card, score et métriques

- [ ] La Link Card JSON affiche un pool pseudonyme, une classe d’actif, un LinkScore v0, un statut de dispute et l’identifiant d’ancrage HCS simulé.
- [ ] Le tableau de métriques affiche des compteurs de créances protégées, collisions bloquées, TND protégés, transactions Hedera simulées et coût estimé.
- [ ] Les métriques et événements sont alimentés par les opérations de la démo et se mettent à jour sans rechargement.

## Livraison technique

- [ ] Le manifeste `GET /manus-routes.json` déclare `/`, `/verify/:nullifier` et `/404`.
- [ ] `pnpm check`, `pnpm test` et `pnpm build` passent depuis un clone propre avec les dépendances verrouillées.
- [ ] La documentation du projet indique les éléments synthétiques, simulés et non testés sur Hedera live.
- [ ] Un checkpoint est créé après validation du build ; aucune publication publique n’est revendiquée sans confirmation explicite de succès.
