import React from "react";
import { useParams, useLocation } from "react-router-dom"; // ✅ Import pour détecter la route
import UserList from "../components/UserList"; 
import RoleList from "../components/RoleList"; 


const UtilisateursRoles = () => {
  const { id } = useParams(); // ✅ Récupère l'ID de l'URL
  const location = useLocation(); // ✅ Vérifie la route actuelle

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <UserList />
          
        </div>
        <div className="col-md-6">
          <RoleList /> 
        </div>
      </div>
    </div>
  );
};

export default UtilisateursRoles;
