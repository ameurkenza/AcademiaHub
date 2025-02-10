import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Department from '../components/Department';
import './Profil.css';

function Profil() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://192.168.2.27:5000/api';

  const getPhotoUrl = (photo) => {
    if (!photo) return '';
    const trimmed = photo.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `${serverUrl.replace('/api', '')}/public/${trimmed}`;
  };

  const getUser = () => {
    axios.get(`${serverUrl}/users/${id}`)
      .then(res => {
        console.log("Utilisateur récupéré :", res.data);
        setUser(res.data.data);
      })
      .catch(err => console.log("Erreur de lecture d'utilisateur", err));
  };

  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <main className="wrapper profil">
      {user.photo ? (
        <img 
          src={getPhotoUrl(user.photo)} 
          alt={`${user.prenom} ${user.nom}`} 
          crossOrigin="anonymous" 
        />
      ) : (
        <h3>Celui n'a pas encore de photo !</h3>
      )}

      <div className="user-info">
        <p><strong>Nom :</strong> {user.nom}</p>
        <p><strong>Prénom :</strong> {user.prenom}</p>
        <p><strong>Email :</strong> {user.email}</p>
      </div>
      <h3>Département de {user.nom}</h3>
      <Department department={user.Department} />
    </main>
  );
}

export default Profil;
