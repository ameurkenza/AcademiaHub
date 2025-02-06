// components/Footer/Footer.jsx
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <span>© 2025 AcademiaHub - Tous droits réservés</span>
        <a 
          href="https://github.com/ameurkenza/AcademiaHub.git" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
        >
          GitHub du Projet
        </a>
      </div>
    </footer>
  );
};

export default Footer