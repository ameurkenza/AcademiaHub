// src/components/Header/Navbar.jsx
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-container">
      {/* Côté gauche - 2 boutons */}
      <div className="nav-section left">
        <Link 
          to="/departements-matieres" 
          className="nav-button"
        >
          Départements & Matières
        </Link>
        <Link 
          to="/laboratoires-equipements" 
          className="nav-button"
        >
          Laboratoires & Équipements
        </Link>
      </div>

      {/* Logo central */}
      <Link to="/" className="logo-link">
        <img 
          src="/src/pics/academiahublogo.png" 
          alt="Academic Hub Logo" 
          className="navbar-logo" 
        />
      </Link>

      {/* Côté droit - 3 boutons */}
      <div className="nav-section right">
        <Link 
          to="/utilisateurs-roles" 
          className="nav-button"
        >
          Utilisateurs & Rôles
        </Link>
        <Link 
          to="/contact" 
          className="nav-button"
        >
          Contactez-nous
        </Link>
        <Link 
          to="/login" 
          className="nav-button"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
