#  AcademiaHub - Gestion des Départements, Utilisateurs, Rôles et Laboratoires

##  Description du Projet
**AcademiaHub** est une application permettant la gestion des départements, des matières, des utilisateurs, des rôles et des laboratoires au sein d'un établissement académique. Cette application permet l'ajout, la modification, la suppression et l'affichage des différentes entités.

---

##  Fonctionnalités Principales
### 1️ **Gestion des Départements et Matières** (DepartementsMatieres.jsx)
- Ajout, modification et suppression des départements (nom, histoire, domaine, image)
- Affichage des départements avec images chargées en Blob URL
- Ajout, modification et suppression des matières (nom, code, description, statut, image, département associé)
- Affichage des matières avec images
- Interaction avec l'API pour la gestion des départements et matières
- Gestion des erreurs lors du chargement des données

### 2️ **Gestion des Utilisateurs et Rôles** (UtilisateursRoles.jsx)
- Ajout, modification et suppression des utilisateurs (nom, prénom, email, mot de passe, biographie, département, photo)
- Affichage des utilisateurs avec leurs détails (photo, biographie, conduite, département)
- Gestion des rôles (ajout, suppression et association d'un rôle à un utilisateur)
- Association des utilisateurs à des matières
- Chargement dynamique des images utilisateur
- Gestion des erreurs et vérification des données

### 3️ **Gestion des Laboratoires et Équipements** (LaboratoiresEquipements.jsx)
- Ajout, modification et suppression des laboratoires (nom, salle, information, département associé, image)
- Affichage des laboratoires et chargement dynamique des images
- Ajout, modification et suppression des équipements (nom, modèle, description, image)
- Gestion des associations entre laboratoires et équipements
- Interaction avec l'API pour charger les équipements disponibles
- Gestion des erreurs lors des requêtes API

---

##  Technologies Utilisées
- **React.js** : Framework pour la construction de l'interface utilisateur
- **Axios** : Pour les requêtes HTTP vers l'API backend
- **CSS** : Pour la mise en page et le design des composants
- **Fetch API** : Pour le chargement des images avec gestion des Blob URLs

---



## 📢 Remarque
- Les images sont chargées via `fetch()` et converties en Blob URL pour une meilleure performance.
- La gestion des erreurs est implémentée pour chaque requête API.
- La mise à jour des images est gérée séparément des autres données.

---

## 📜 Auteur
- Kenza Ameur
- Jugurta Maziz
- Christie Mosseca Louis



---

Merci d'utiliser **AcademiaHub** ! 🎓🚀

