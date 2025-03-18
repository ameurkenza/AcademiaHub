import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DepartementsMatieres from './pages/DepartementsMatieres';
import UtilisateursRoles from './pages/UtilisateursRoles';
import LaboratoiresEquipements from './pages/LaboratoiresEquipements';
import Login from './pages/Login';
import SignIn from './pages/SignIn';
import ProtectedRoute from './components/ProtectedRoute'; 
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* 🏠 Accès libre pour tous */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} /> 
        {/* 🔒 Routes protégées : accessibles uniquement si connecté */}
        <Route 
          path="/departements-matieres" 
          element={<ProtectedRoute><DepartementsMatieres /></ProtectedRoute>} 
        />
        <Route 
          path="/utilisateurs-roles" 
          element={<ProtectedRoute><UtilisateursRoles /></ProtectedRoute>} 
        />
        <Route 
          path="/laboratoires-equipements" 
          element={<ProtectedRoute><LaboratoiresEquipements /></ProtectedRoute>} 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
