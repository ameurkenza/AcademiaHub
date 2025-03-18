import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateDepartment } from "../redux/departmentSlice";

const UpdateDepartment = ({ department, onClose }) => {
  const dispatch = useDispatch();
  const [updatedData, setUpdatedData] = useState({
    nom: department.nom,
    histoire: department.histoire,
    domaine: department.domaine,
  });

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDepartment({ id: department.id, updatedData }));
    onClose(); // Ferme le formulaire après la mise à jour
  };

  return (
    <div className="update-modal">
      <h2>✏️ Modifier le Département</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          value={updatedData.nom}
          onChange={handleChange}
          required
        />
        <textarea
          name="histoire"
          value={updatedData.histoire}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="domaine"
          value={updatedData.domaine}
          onChange={handleChange}
          required
        />
        <button type="submit">✅ Mettre à jour</button>
        <button type="button" onClick={onClose}>❌ Annuler</button>
      </form>
    </div>
  );
};

export default UpdateDepartment;
