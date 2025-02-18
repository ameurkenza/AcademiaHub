#  AcademiaHub - Gestion des Départements, Utilisateurs, Rôles et Laboratoires

## 📫Description

**AcademiaHub** est une application permettant la gestion des départements, des matières, des utilisateurs, des rôles et des laboratoires au sein d'un établissement académique. Cette application permet l'ajout, la modification, la suppression et l'affichage des différentes entités.

---

##  Fonctionnalités Principales
### 1️ **Gestion des Départements et Matières** (DepartementsMatieres.jsx)
- [ ] Ajout, modification et suppression des départements (nom, histoire, domaine, image)
- [ ] Affichage des départements avec images chargées en Blob URL
- [ ] Ajout, modification et suppression des matières (nom, code, description, statut, image, département associé)
- [ ] Affichage des matières avec images
- [ ] Interaction avec l'API pour la gestion des départements et matières
- [ ] Gestion des erreurs lors du chargement des données

### 2️ **Gestion des Utilisateurs et Rôles** (UtilisateursRoles.jsx)
- [ ] Ajout, modification et suppression des utilisateurs (nom, prénom, email, mot de passe, biographie, département, photo)
- [ ] Affichage des utilisateurs avec leurs détails (photo, biographie, conduite, département)
- [ ] Gestion des rôles (ajout, suppression et association d'un rôle à un utilisateur)
- [ ] Association des utilisateurs à des matières
- [ ] Chargement dynamique des images utilisateur
- [ ] Gestion des erreurs et vérification des données

### 3️ **Gestion des Laboratoires et Équipements** (LaboratoiresEquipements.jsx)
- [ ] Ajout, modification et suppression des laboratoires (nom, salle, information, département associé, image)
- [ ] Affichage des laboratoires et chargement dynamique des images
- [ ] Ajout, modification et suppression des équipements (nom, modèle, description, image)
- [ ] Gestion des associations entre laboratoires et équipements
- [ ] Interaction avec l'API pour charger les équipements disponibles
- [ ] Gestion des erreurs lors des requêtes API

---

  ### 🔨 language et outils Utilisées
- **React.js** : Framework pour la construction de l'interface utilisateur
- **Axios** : Pour les requêtes HTTP vers l'API backend
- **CSS** : Pour la mise en page et le design des composants
- **Fetch API** : Pour le chargement des images avec gestion des Blob URLs
- **visual-studio-code**
- **virtualbox**: Pour le frontend 

![icons8-visual-studio-code-240](https://github.com/user-attachments/assets/5ea264d4-487a-4efd-9c31-7b7c5618fdb4)
![image](https://github.com/user-attachments/assets/3a3a59e6-703f-4948-a1d9-dc6e8073182f)
![image](https://github.com/user-attachments/assets/d29af812-9447-4450-aeb4-985cbc8dd424)
![react](https://github.com/user-attachments/assets/e038634d-158c-4e1e-8796-3ec34d9014fe)
![icons8-css-144](https://github.com/user-attachments/assets/635f59ce-6a52-4693-aba8-81baab825c1a)
![virtualbox_logo_icon_169253 (1)](https://github.com/user-attachments/assets/8e3c72e1-ff66-40fb-97c5-40d526fdcf0e)


##  Remarque
- Les images sont chargées via `fetch()` et converties en Blob URL pour une meilleure performance.
- La gestion des erreurs est implémentée pour chaque requête API.
- La mise à jour des images est gérée séparément des autres données.
  
## Captures d'écran
![academiahublogo](https://github.com/user-attachments/assets/db7a84c8-0d89-4f3e-9fa4-28c2a5d6cfc3)
![224308](https://github.com/user-attachments/assets/15b4e97f-ce3f-46b2-94ae-ce30dddfae3b)
![224245](https://github.com/user-attachments/assets/329673ab-1adf-4f74-8a68-ec469589b452)
![224216](https://github.com/user-attachments/assets/8bd56f03-8845-4a52-ae84-486a82989a1b)
![image](https://github.com/user-attachments/assets/d8cfdfb9-fecc-4efa-b47a-87972a1f25e3)
![image](https://github.com/user-attachments/assets/cd2d5d3e-bfe1-4ccb-94ff-ef6e56d59cf9)
![image](https://github.com/user-attachments/assets/47fe2f30-68ec-4747-8adb-05e02c328497)
![image](https://github.com/user-attachments/assets/57ab6f75-eacd-4ab4-b370-bc71179bfea3)
![image](https://github.com/user-attachments/assets/f6975674-bbc4-4904-8687-419de08a34e4)
![image](https://github.com/user-attachments/assets/a2a10fee-2566-49e1-9511-a9ea1f33253c)

# 🚶 Auteur
Ce projet a été réalisé par [Maziz Jugurta, Kenza Ameur et Louis Christie Mosseca ].
# License
- © 2025 AcademiaHub - Tous droits réservés

