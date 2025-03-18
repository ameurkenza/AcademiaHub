import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEquipement, fetchEquipements } from "../redux/EquipementSlice.js";

const CreateEquipement = ({ onEquipementCreated }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [newEquipement, setNewEquipement] = useState({
    nom: "",
    modele: "",
    description: "",
    LaboratoryId: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let formErrors = {};
    if (!newEquipement.nom) formErrors.nom = "Le nom est requis.";
    if (!newEquipement.modele) formErrors.modele = "Le modèle est requis.";
    if (!newEquipement.description) formErrors.description = "La description est requise.";
    if (!newEquipement.LaboratoryId) formErrors.LaboratoryId = "L'ID du laboratoire est requis.";
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setNewEquipement({ ...newEquipement, image: files[0] });
    } else {
      setNewEquipement({ ...newEquipement, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("nom", newEquipement.nom);
    formData.append("modele", newEquipement.modele);
    formData.append("description", newEquipement.description);
    formData.append("LaboratoryId", newEquipement.LaboratoryId);
    if (newEquipement.image) {
      formData.append("image", newEquipement.image);
    }

    dispatch(createEquipement(formData)).then((action) => {
      if (action.payload) {
        dispatch(fetchEquipements());
        if (onEquipementCreated) onEquipementCreated(action.payload);
        setNewEquipement({ nom: "", modele: "", description: "", LaboratoryId: "", image: null });
      }
      setLoading(false);
    });
  };

  return (
    <div className="container mt-4">
      <div className="card border-primary">
        <div className="card-header bg-primary text-white"> Ajouter un Équipement</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Nom de l'équipement</label>
              <input type="text" className="form-control" name="nom" value={newEquipement.nom} onChange={handleChange} />
              {errors.nom && <div className="text-danger">{errors.nom}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Modèle</label>
              <input type="text" className="form-control" name="modele" value={newEquipement.modele} onChange={handleChange} />
              {errors.modele && <div className="text-danger">{errors.modele}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={newEquipement.description} onChange={handleChange}></textarea>
              {errors.description && <div className="text-danger">{errors.description}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">ID du Laboratoire</label>
              <input type="text" className="form-control" name="LaboratoryId" value={newEquipement.LaboratoryId} onChange={handleChange} />
              {errors.LaboratoryId && <div className="text-danger">{errors.LaboratoryId}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
              {newEquipement.image && <p className="text-muted mt-2">🖼️ Image sélectionnée : {newEquipement.image.name}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Ajout en cours..." : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEquipement;