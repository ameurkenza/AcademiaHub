import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Department from '../components/Department';
import './Profil.css';

// Composant d'affichage du profil utilisateur
function Profil() {
  // Récupération de l'ID utilisateur depuis l'URL
  const { id } = useParams();

  // État local pour stocker les informations de l'utilisateur
  const [user, setUser] = useState({});

  // URL du serveur (issue de la variable d'environnement ou valeur par défaut)
  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://192.168.2.27:5000/api';

  // Construction de l'URL complète pour la photo de profil
  const getPhotoUrl = (photo) => {
    if (!photo) return '';
    const trimmed = photo.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `${serverUrl.replace('/api', '')}/public/${trimmed}`;
  };

  // Récupération des données utilisateur depuis l'API
  const getUser = () => {
    axios.get(`${serverUrl}/users/${id}`)
      .then(res => {
        console.log("Utilisateur récupéré :", res.data);
        setUser(res.data.data);
      })
      .catch(err => console.log("Erreur de lecture d'utilisateur", err));
  };

  // Appel de l'API au chargement du composant ou lors du changement d'ID
  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <main className="wrapper profil">
      {/* Affichage de la photo si disponible, sinon message d'absence */}
      {user.photo ? (
        <img 
          src={getPhotoUrl(user.photo)} 
          alt={`${user.prenom} ${user.nom}`} 
          crossOrigin="anonymous" 
        />
      ) : (
        <h3>Celui n'a pas encore de photo !</h3>
      )}

      {/* Informations personnelles de l'utilisateur */}
      <div className="user-info">
        <p><strong>Nom :</strong> {user.nom}</p>
        <p><strong>Prénom :</strong> {user.prenom}</p>
        <p><strong>Email :</strong> {user.email}</p>
      </div>

      {/* Affichage du département associé à l'utilisateur */}
      <h3>Département de {user.nom}</h3>
      <Department department={user.Department} />
    </main>
  );
}

export default Profil;
