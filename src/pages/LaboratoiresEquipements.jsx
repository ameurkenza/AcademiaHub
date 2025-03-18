import React from "react";
import LaboList from "../components/LaboList"; // ✅ Liste des laboratoires
import EquipementList from "../components/EquipementList"; // ✅ Liste des équipements (à créer)

const LaboratoiresEquipements = () => {
  return (
    <div className="container">
      
      <div className="row">

      <div className="col-md-6">
        <LaboList />
      </div>
      <div className="col-md-6">
      <EquipementList /> 
    </div>
    </div>
    </div>
  );
};

export default LaboratoiresEquipements;
