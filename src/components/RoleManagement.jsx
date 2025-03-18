import React from "react";
import RoleList from "../components/RoleList";
import CreateRole from "../components/CreateRole";

const RoleManagement = () => {
  return (
    <div>
      <h1>⚙️ Gestion des Rôles</h1>
      <CreateRole />  {/* ✅ Formulaire de création */}
      <RoleList />  {/* ✅ Liste des rôles */}
    </div>
  );
};

export default RoleManagement;
