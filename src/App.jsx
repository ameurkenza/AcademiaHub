// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DepartementsMatieres from './pages/DepartementsMatieres';
import UtilisateursRoles from './pages/UtilisateursRoles';
import LaboratoiresEquipements from './pages/LaboratoiresEquipements';
import Login from './pages/login.jsx';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/departements-matieres" element={<DepartementsMatieres />} />
        <Route path="/utilisateurs-roles" element={<UtilisateursRoles />} />
        <Route path="/laboratoires-equipements" element={<LaboratoiresEquipements />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
