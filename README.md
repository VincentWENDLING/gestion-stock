# Outil de gestion - Starling Burger 🍔

Cet outil a pour but de suivre la vie des commandes passées par les restaurants au laboratoire de production, de la création de la commande à la 
livraison et réception par le restaurant.

## Comment lancer le projet ?

### Fichier .env
Un fichier `.env` doit contenir les variables d'environnement nécessaires pour accéder à supabase. Si vous n'avez pas ces variables, demandez à 
Vincent (vincent@starling-burgers.com)
Ce fichier doit ce trouver à la racine du projet

### Lancer le serveur de développement

Une fois ce fichier crée, vous pouvez lancer le serveur de développement:
`npm run dev`
Par défaut, le site se trouvera à l'adresse suivante: `http://locahost:3000`

## Comment se connecter une fois l'application lancée

Il existe pour l'instant trois utilisateurs par défaut:
|Username|Password|Rôle|
|--------|--------|----|
|vincent|vincent|Manager|
|vincito|vincito|Labo|
|vincenzo|vincenzo|Livreur|
|admin|admin|Admin|
|manager|manager|Manager|

* vincent est manager au restaurant "Krutenau".
* manager est manager au food truck.

**NB:** Même avec ces crendentials, on ne peut pas se connecter sans avoir accès aux variables d'environnement citées plus haut.
