### Projet Hackathon
Groupe:
Ethan Cadorel - Yann Lainé Odic - Florian Gallais - Noam Rault - Anaëlle Daumand

## Liste des fonctionnalités implémentées

- Création d'utilisateurs et authentification
- Création d'échoppes virtuelles par les utilisateurs, avec une adresse url d'accès
- Ajout de produits et services aux échoppes
- Recherche des échoppes alentours en fonction de mot-clés dans le nom ou la description
- Gestion d'abonnement à des boutiques
- Mécanisme de réservation d'offres, ainsi que de visualisation de ses offres en cours (reçues et envoyées)
- Décrémentation automatique des stocks
- Gestion des utilisateurs, échoppes, offres et réservations plus précise possible avec des méthodes CRUD
- Lien d'accès pour les échoppes

## Lancement du projet
`npm install` dans le dossier racine
`./pocketbase serve` pour lancer le serveur pocketbase
Rentrez les identifiants voulus du superutilisateur dans la page web qui s'ouvre

## Utilisation du projet
Importez les méthodes voulues des fichiers `[...]Service.js` du dossier `/src/services`

# Documentation pocketbase
https://pocketbase.io/docs/