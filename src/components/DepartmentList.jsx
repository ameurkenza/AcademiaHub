import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, createDepartment, deleteDepartment, updateDepartment } from "../redux/departmentSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const DepartmentList = () => {
  const dispatch = useDispatch();
  const { list: departments, loading, error } = useSelector((state) => state.departments);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ nom: "", histoire: "", domaine: "" });
  const [updatedDepartment, setUpdatedDepartment] = useState({ nom: "", histoire: "", domaine: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Gestion des changements des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDepartment({ ...updatedDepartment, [name]: value });
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment({ ...newDepartment, [name]: value });
  };

  // Validation des champs
  const validateFields = (department) => {
    let newErrors = {};
    if (!department.nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!department.domaine.trim()) newErrors.domaine = "Le domaine est requis.";
    if (department.histoire.length < 10) newErrors.histoire = "L’histoire doit contenir au moins 10 caractères.";
    return newErrors;
  };

  // Ajouter un département
  const handleCreate = (e) => {
    e.preventDefault();
    const validationErrors = validateFields(newDepartment);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(createDepartment(newDepartment)).then(() => {
      dispatch(fetchDepartments());
      setNewDepartment({ nom: "", histoire: "", domaine: "" });
      setErrors({});
    });
  };

  // Modifier un département
  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateDepartment({ id: selectedDepartment.id, updatedData: updatedDepartment })).then(() => {
      dispatch(fetchDepartments());
      setIsEditing(false);
      setSelectedDepartment(null);
    });
  };

  // Supprimer un département
  const handleDelete = (id) => {
    if (window.confirm("❗ Es-tu sûr de vouloir supprimer ce département ?")) {
      dispatch(deleteDepartment(id)).then(() => {
        dispatch(fetchDepartments());
      });
    }
  };

  // Préparer les données pour la modification
  const handleEditClick = (department) => {
    setSelectedDepartment(department);
    setUpdatedDepartment({
      nom: department.nom,
      histoire: department.histoire,
      domaine: department.domaine,
    });
    setIsEditing(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Liste des Départements</h2>

      {loading && <p className="text-center text-primary">⏳ Chargement en cours...</p>}
      {error && <p className="alert alert-danger text-center">{typeof error === "string" ? error : "Une erreur est survenue."}</p>}

      {/* Formulaire de création */}
      <div className="card border-primary mb-4">
        <div className="card-header bg-primary text-white">Ajouter un Département</div>
        <div className="card-body">
          <form onSubmit={handleCreate}>
            <input type="text" className="form-control mb-2" name="nom" placeholder="Nom du département" value={newDepartment.nom} onChange={handleNewChange} required />
            {errors.nom && <div className="text-danger">{errors.nom}</div>}

            <textarea className="form-control mb-2" name="histoire" placeholder="Histoire du département (min 10 caractères)" value={newDepartment.histoire} onChange={handleNewChange} required />
            {errors.histoire && <div className="text-danger">{errors.histoire}</div>}

            <input type="text" className="form-control mb-2" name="domaine" placeholder="Domaine" value={newDepartment.domaine} onChange={handleNewChange} required />
            {errors.domaine && <div className="text-danger">{errors.domaine}</div>}

            <button type="submit" className="btn btn-primary w-100">Créer</button>
          </form>
        </div>
      </div>

      {/* Liste des départements */}
      <div className="d-flex flex-column align-items-center mt-4">
        {departments.map((dept, index) => (
          <div key={`dept-${dept.id}-${index}`} className="w-100 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{dept.nom} ({dept.domaine})</h5>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-primary btn-sm" onClick={() => setSelectedDepartment(dept)}>Détails</button>
                  <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(dept)}>Modifier</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dept.id)}>Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modale Détails */}
      {selectedDepartment && !isEditing && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails du Département</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedDepartment(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID :</strong> {selectedDepartment.id}</p>
                <p><strong>Nom :</strong> {selectedDepartment.nom}</p>
                <p><strong>Domaine :</strong> {selectedDepartment.domaine}</p>
                <p><strong>Histoire :</strong> {selectedDepartment.histoire || "Pas d'historique disponible"}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedDepartment(null)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale Édition */}
      {isEditing && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le Département</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <input type="text" className="form-control mb-2" name="nom" value={updatedDepartment.nom} onChange={handleChange} required placeholder="Nom" />
                  <textarea className="form-control mb-2" name="histoire" value={updatedDepartment.histoire} onChange={handleChange} placeholder="Histoire"></textarea>
                  <input type="text" className="form-control mb-2" name="domaine" value={updatedDepartment.domaine} onChange={handleChange} required placeholder="Domaine" />
                  <button type="submit" className="btn btn-success w-100">Enregistrer</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DepartmentList;
