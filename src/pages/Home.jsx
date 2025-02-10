import React from 'react';
import './Home.css';

function Home() {
  return (
    <main className="home">
      {/* ===== SLIDER SECTION ===== */}
      <section className="slider-section">
        <div className="slider">
          <div className="slider-inner">
            <div className="slide">
              <img src="/src/pics/224308.png" alt="Slide 1" />
              <div className="slide-caption">
                <h2>Innovation</h2>
                <p>Des solutions innovantes pour une gestion moderne</p>
              </div>
            </div>
            <div className="slide">
              <img src="/src/pics/224245.png" alt="Slide 2" />
              <div className="slide-caption">
                <h2>Performance</h2>
                <p>Optimisez vos processus et boostez votre productivité</p>
              </div>
            </div>
            <div className="slide">
              <img src="/src/pics/8290045.jpg" alt="Slide 3" />
              <div className="slide-caption">
                <h2>Sécurité</h2>
                <p>Protégez vos données avec des technologies de pointe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTRO SECTION ===== */}
      <section className="intro">
        <h1>Bienvenue sur Notre Site Web</h1>
        <p>
          Notre solution complète vous offre la gestion efficace de vos départements, utilisateurs, matières,
          laboratoires, équipements et rôles. Profitez d’une interface intuitive, sécurisée et performante pour booster votre activité.
        </p>
        <a href="/departements-matieres" className="cta-button">
          Découvrir nos services
        </a>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features">
        <div className="feature">
          <h2>Interface Intuitive</h2>
          <p>Naviguez facilement et administrez vos données sans effort</p>
        </div>
        <div className="feature">
          <h2>Support 24/7</h2>
          <p>Une équipe dédiée à votre écoute à tout moment</p>
        </div>
        <div className="feature">
          <h2>Fiabilité</h2>
          <p>Des performances robustes pour garantir la continuité de vos activités</p>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="about">
        <h2>À Propos de Nous</h2>
        <p>
          Notre Application est conçue pour répondre aux besoins des établissements  en matière de gestion.
          Nous mettons à votre disposition une plateforme performante et sécurisée, conçue 
          pour faciliter la gestion de vos ressources.Innovation, efficacité et sécurité pour
          offrir la meilleure expérience utilisateur.
        </p>
      </section>
    </main>
  );
}

export default Home;
