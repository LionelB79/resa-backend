resa-backend - Application de Réservation de Salles
Instructions d'installation et de lancement

Prérequis
Node.js
Assurez-vous que Node.js est installé sur votre machine (version recommandée : 16+).

NestJS CLI
Installez le CLI de NestJS globalement si ce n'est pas encore fait :
npm install -g @nestjs/cli

MongoDB
Assurez-vous que MongoDB est installé et en cours d'exécution localement ou sur un serveur accessible.

Étapes d'installation

- Clonez le dépôt backend sur votre machine locale

- Faites la commande npm install

- Insérer des données initiales en base
  Pour insérer des salles (rooms) :
  npm run insert:rooms

Pour insérer des réservations (bookings) :
npm run insert:bookings

- Lancer l'application
  Une fois les données insérées, lancez le serveur backend :
  npm run start

L'application backend sera disponible sur http://localhost:3001.
