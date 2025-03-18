import React from "react";
import DepartmentList from "../components/DepartmentList";
import SubjectList from "../components/SubjectList"; // ✅ Liste des matières

const DepartementsMatieres = () => {
  return (
    <div className="container">

      <div className="row">
        
        <div className="col-md-6">
          <DepartmentList />
        </div>

       
        <div className="col-md-6">
          <SubjectList />
        </div>
      </div>
    </div>
  );
};

export default DepartementsMatieres;
