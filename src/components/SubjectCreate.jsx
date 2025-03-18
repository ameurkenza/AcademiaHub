import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubject, fetchSubjects } from "../redux/subjectSlice";

const SubjectCreate = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.subjects);

  const [newSubject, setNewSubject] = useState({
    nom: "",
    code: "",
    description: "",
    statut: "optionnel",
    DepartmentId: "",
    LaboratoryId: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Validation du formulaire
  const validateForm = () => {
    let formErrors = {};
    if (!newSubject.nom) formErrors.nom = "Le nom est requis.";
    if (!newSubject.code) formErrors.code = "Le code est requis.";
    if (!newSubject.description) formErrors.description = "La description est requise.";
    if (!newSubject.DepartmentId) formErrors.DepartmentId = "Le département est requis.";
    return formErrors;
  };

  // ✅ Gestion de la saisie des champs
  const handleInputChange = (e) => {
    setNewSubject({ ...newSubject, [e.target.name]: e.target.value });
  };

  // ✅ Soumission du formulaire (mise à jour instantanée)
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    dispatch(createSubject(newSubject)).then((action) => {
      if (action.payload) {
        dispatch(fetchSubjects()); // ✅ Met à jour instantanément la liste
        setNewSubject({ nom: "", code: "", description: "", statut: "optionnel", DepartmentId: "", LaboratoryId: "" });
        setErrors({});
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="card border-primary">
        <div className="card-header bg-primary text-white">➕ Ajouter une Matière</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input type="text" className="form-control" name="nom" value={newSubject.nom} onChange={handleInputChange} />
              {errors.nom && <div className="text-danger">{errors.nom}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Code</label>
              <input type="text" className="form-control" name="code" value={newSubject.code} onChange={handleInputChange} />
              {errors.code && <div className="text-danger">{errors.code}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={newSubject.description} onChange={handleInputChange}></textarea>
              {errors.description && <div className="text-danger">{errors.description}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">ID Département</label>
              <input type="text" className="form-control" name="DepartmentId" value={newSubject.DepartmentId} onChange={handleInputChange} />
              {errors.DepartmentId && <div className="text-danger">{errors.DepartmentId}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Ajout en cours..." : "Créer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubjectCreate;
