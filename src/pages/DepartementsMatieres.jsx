// src/pages/DepartmentsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DepartementsMatieres.css';

const DepartementsMatieres = () => {
  // Déclaration des états pour stocker les données, le chargement et l'erreur
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect pour effectuer la requête une seule fois au montage du composant
  useEffect(() => {
    axios.get('http://192.168.106.94:5000/api/departments')
    .then(response => {
        console.log("Réponse complète :", response);
        console.log("Niveau 1 - response.data :", response.data);
        console.log("Niveau 2 - response.data.data :", response.data.data);

        // Vérifie si departments est bien un tableau
        const departments = response.data?.data?.departments || [];
        console.log("⚡ Final departments :", departments, Array.isArray(departments));
        
        setDepartments(departments);
        setLoading(false);
    })
    .catch(err => {
        console.error("Erreur lors de la récupération des départements :", err);
        setError(err);
        setLoading(false);
    });
}, []);


console.log("🔍 Departments affichés :", departments);




  return (
    <div className="departments-page">
      {/* Titre de la page */}
      <h1 className="page-title">Gestion des Départements & Matières</h1>

      {/* Conteneur principal à 2 colonnes */}
      <div className="columns-container">
        {/* Colonne Gauche - Départements */}
        <div className="department-column">
          <div className="column-header">
            <h2>Départements</h2>
            <button className="create-button">+ Nouveau Département</button>
          </div>
          {/* Zone de liste des départements */}
          <div className="list-container">
            {loading && <p>Chargement des départements...</p>}
            {error && <p>Erreur: {error.message}</p>}
            {!loading && !error && (
              <ul>
                {departments.map(dept => (
                  // On suppose que chaque département a un identifiant (id) et un nom (name)
                  <li key={dept.id}>{dept.nom}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Colonne Droite - Matières */}
        <div className="subject-column">
          <div className="column-header">
            <h2>Matières</h2>
            <button className="create-button">+ Nouvelle Matière</button>
          </div>
          {/* Zone de liste des matières (vide pour l'instant) */}
          <div className="list-container">
            {/* La logique pour récupérer et afficher les matières viendra ici */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartementsMatieres;
