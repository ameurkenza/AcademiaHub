import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, createDepartment, deleteDepartment, updateDepartment } from "../redux/departmentSlice";

const DepartmentList = () => {
  const dispatch = useDispatch();
  const { list: departments, loading, error } = useSelector((state) => state.departments);

  const [newDepartment, setNewDepartment] = useState({ nom: "", histoire: "", domaine: "" });
  const [editDepartment, setEditDepartment] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const validateFields = (department) => {
    let newErrors = {};
    if (!department.nom.trim()) newErrors.nom = "Le nom du département est requis.";
    if (!department.domaine.trim()) newErrors.domaine = "Le domaine est requis.";
    if (department.histoire.length < 10) newErrors.histoire = "L’histoire doit contenir au moins 10 caractères.";
    return newErrors;
  };

  const handleInputChange = (e) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateFields(newDepartment);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    dispatch(createDepartment(newDepartment));
    setNewDepartment({ nom: "", histoire: "", domaine: "" });
  };

  const handleEditChange = (e) => {
    setEditDepartment({ ...editDepartment, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const validationErrors = validateFields(editDepartment);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    dispatch(updateDepartment({ id: editDepartment.id, updatedData: editDepartment }));
    setEditDepartment(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Liste des Départements</h2>

      {loading && <p className="text-center text-primary">⏳ Chargement en cours...</p>}
      {error && <p className="alert alert-danger text-center">{typeof error === "string" ? error : "Une erreur est survenue."}</p>}

      {/* Formulaire d'ajout */}
      <div className="card border-primary mb-4">
        <div className="card-header bg-primary text-white">Ajouter un Département</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" className="form-control" name="nom" placeholder="Nom du département" value={newDepartment.nom} onChange={handleInputChange} required />
              {errors.nom && <div className="text-danger">{errors.nom}</div>}
            </div>

            <div className="mb-3">
              <textarea className="form-control" name="histoire" placeholder="Histoire du département (min 10 caractères)" value={newDepartment.histoire} onChange={handleInputChange} required />
              {errors.histoire && <div className="text-danger">{errors.histoire}</div>}
            </div>

            <div className="mb-3">
              <input type="text" className="form-control" name="domaine" placeholder="Domaine" value={newDepartment.domaine} onChange={handleInputChange} required />
              {errors.domaine && <div className="text-danger">{errors.domaine}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100">Créer</button>
          </form>
        </div>
      </div>

      {/* Liste des départements */}
      {!loading && !error && departments.length === 0 && <p className="alert alert-warning text-center">⚠️ Aucun département disponible.</p>}

      {!loading && !error && departments.length > 0 && (
        <ul className="list-group">
          {departments.map((dept, index) => (
            <li key={`${dept.id}-${index}`} className="list-group-item d-flex justify-content-between align-items-center border">
              <button className="btn btn-outline-primary" onClick={() => setEditDepartment(dept)}>{dept.nom}</button>
              <button className="btn btn-danger" onClick={() => dispatch(deleteDepartment(dept.id))}>❌ Supprimer</button>
            </li>
          ))}
        </ul>
      )}

      {/* Formulaire de mise à jour */}
      {editDepartment && (
        <div className="card border-warning mt-4">
          <div className="card-header bg-warning text-dark">✏️ Modifier Département</div>
          <div className="card-body">
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <input type="text" className="form-control" name="nom" placeholder="Nom du département" value={editDepartment.nom} onChange={handleEditChange} required />
                {errors.nom && <div className="text-danger">{errors.nom}</div>}
              </div>

              <div className="mb-3">
                <textarea className="form-control" name="histoire" placeholder="Histoire du département (min 10 caractères)" value={editDepartment.histoire} onChange={handleEditChange} required />
                {errors.histoire && <div className="text-danger">{errors.histoire}</div>}
              </div>

              <div className="mb-3">
                <input type="text" className="form-control" name="domaine" placeholder="Domaine" value={editDepartment.domaine} onChange={handleEditChange} required />
                {errors.domaine && <div className="text-danger">{errors.domaine}</div>}
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-warning">Mettre à jour</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditDepartment(null)}>❌ Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
