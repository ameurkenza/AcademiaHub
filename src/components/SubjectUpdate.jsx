// src/components/SubjectUpdate.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSubject } from "../redux/subjectSlice";

const SubjectUpdate = ({ subject, onSubjectUpdated, onClose }) => {
  const dispatch = useDispatch();
  const [updatedSubject, setUpdatedSubject] = useState({ ...subject });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    if (!updatedSubject.nom) formErrors.nom = "Le nom est requis.";
    if (!updatedSubject.code) formErrors.code = "Le code est requis.";
    if (!updatedSubject.description) formErrors.description = "La description est requise.";
    if (!updatedSubject.DepartmentId) formErrors.DepartmentId = "Le département est requis.";
    return formErrors;
  };

  const handleChange = (e) => {
    setUpdatedSubject({ ...updatedSubject, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    dispatch(updateSubject({ id: updatedSubject.id, updatedData: updatedSubject })).then((action) => {
      if (action.payload) {
        onSubjectUpdated(action.payload); // ✅ Met à jour la liste immédiatement
        onClose(); // ✅ Ferme le formulaire après mise à jour
      }
    });
  };

  return (
    <div className="edit-container">
      <h3>✏️ Modifier la Matière</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" value={updatedSubject.nom} onChange={handleChange} />
        {errors.nom && <p className="error">{errors.nom}</p>}

        <input type="text" name="code" placeholder="Code" value={updatedSubject.code} onChange={handleChange} />
        {errors.code && <p className="error">{errors.code}</p>}

        <textarea name="description" placeholder="Description" value={updatedSubject.description} onChange={handleChange} />
        {errors.description && <p className="error">{errors.description}</p>}

        <button type="submit">Mettre à jour</button>
        <button type="button" className="cancel-button" onClick={onClose}>❌ Annuler</button>
      </form>
    </div>
  );
};

export default SubjectUpdate;
