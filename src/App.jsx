import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import Home from './pages/Home';
import DepartementsMatieres from './pages/DepartementsMatieres';
import UtilisateursRoles from './pages/UtilisateursRoles';
import LaboratoiresEquipements from './pages/LaboratoiresEquipements';

function App() {
  return (
    <>
    <Navbar />
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/departements-matieres" element={<DepartementsMatieres />} />
        <Route path="/utilisateurs-roles" element={<UtilisateursRoles />} />
        <Route path="/laboratoires-equipements" element={<LaboratoiresEquipements />} />
    </Routes>
    <Footer />
    </>
  ); 
}




export default App
