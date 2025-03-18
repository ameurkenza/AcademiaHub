import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice"; // ✅ Import du logout
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token); // ✅ Vérifie si l'utilisateur est connecté

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // ✅ Redirige vers la page de connexion après déconnexion
  };

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

      {/* Côté droit - Affichage conditionnel */}
      <div className="nav-section right">
        <Link to="/utilisateurs-roles" className="nav-button">
          Utilisateurs & Rôles
        </Link>

        {token ? (
          <button className="nav-button logout-button" onClick={handleLogout}>
            🚪 Déconnexion
          </button>
        ) : (
          <Link to="/login" className="nav-button">
            Login
          </Link>
        )}

<Link to="/signin" className="nav-button">
        SignIn
      </Link>
      </div>
    </nav>
  );
};

export default Navbar;
