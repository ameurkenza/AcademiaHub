import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loginAttempted, setLoginAttempted] = useState(false); // ✅ Nouvel état pour suivre la tentative de connexion

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { token, loading, error } = useSelector((state) => state.auth);

  // ✅ Redirection uniquement après une tentative de connexion réussie
  useEffect(() => {
    if (loginAttempted && token) {
      console.log("✅ Redirection en cours vers /departements-matieres");
      navigate('/departements-matieres');
    }
  }, [token, loginAttempted, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginAttempted(true); // ✅ Marque que l'utilisateur a tenté de se connecter
    dispatch(loginUser({ email, motDePasse }));
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
