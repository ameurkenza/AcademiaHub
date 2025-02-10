// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';


const DOMAIN_URL = 'http://192.168.2.27:5000/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Envoi des identifiants à l'API (adapté à votre endpoint)
      const response = await axios.post(`${DOMAIN_URL}/login`, {
        email,
        mot_de_passe: motDePasse,
      });
      console.log('Connexion réussie', response.data);
      // Vous pouvez sauvegarder le token, rediriger l'utilisateur, etc.
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("Identifiants invalides ou erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Entrez votre email"
          />
        </div>
        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            placeholder="Entrez votre mot de passe"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default Login;
