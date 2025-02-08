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
import LaboratoireDetail from './pages/LaboratoireDetail';
import EquipementDetail from './pages/EquipementDetail';
function App() {
  return (
    <>
    <Navbar />
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/departements-matieres" element={<DepartementsMatieres />} />
        <Route path="/utilisateurs-roles" element={<UtilisateursRoles />} />
        <Route path="/laboratoires-equipements" element={<LaboratoiresEquipements />} />
        <Route path="/laboratoire/:id" element={<LaboratoireDetail />} />
        <Route path="/equipement/:id" element={<EquipementDetail />} />
    </Routes>
    <Footer />
    </>
  ); 
}




export default App
