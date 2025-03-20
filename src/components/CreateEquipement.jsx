import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createEquipement, fetchEquipements } from "../redux/EquipementSlice";

const CreateEquipement = ({ onEquipementCreated }) => {
  const dispatch = useDispatch();
  const [newEquipement, setNewEquipement] = useState({
    nom: "",
    modele: "",
    description: "",
    image: null,
    LaboratoryId: "",
  });

  const [errors, setErrors] = useState({});

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

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formData = new FormData();
    formData.append("nom", newEquipement.nom);
    formData.append("modele", newEquipement.modele);
    formData.append("description", newEquipement.description);
    if (newEquipement.image) formData.append("image", newEquipement.image);
    formData.append("LaboratoryId", newEquipement.LaboratoryId);

    dispatch(createEquipement(formData)).then((action) => {
      if (action.payload) {
        dispatch(fetchEquipements());
        if (onEquipementCreated) onEquipementCreated(action.payload);
      }
    });

    setNewEquipement({ nom: "", modele: "", description: "", image: null, LaboratoryId: "" });
    setErrors({});
  };

  return (
    <div className="container mt-4">
      <div className="card border-primary">
        <div className="card-header bg-primary text-white">Ajouter un Équipement</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input type="text" className="form-control" name="nom" value={newEquipement.nom} onChange={handleChange} />
              {errors.nom && <div className="text-danger">{errors.nom}</div>}
            </div>

            <div className="mb-3">
  <label className="form-label">Modèle</label>
  <select className="form-control" name="modele" value={newEquipement.modele} onChange={handleChange}>
    <option value="">-- Sélectionner un modèle --</option>
    <option value="nouveau">Nouveau</option>
    <option value="ancien">Ancien</option>
    <option value="refait">Refait</option>
  </select>
  {errors.modele && <div className="text-danger">{errors.modele}</div>}
</div>


            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={newEquipement.description} onChange={handleChange}></textarea>
              {errors.description && <div className="text-danger">{errors.description}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
              {newEquipement.image && <p className="text-muted mt-2">🖼️ Image sélectionnée : {newEquipement.image.name}</p>}
            </div>

            <div className="mb-3">
              <label className="form-label">ID Laboratoire</label>
              <input type="text" className="form-control" name="LaboratoryId" value={newEquipement.LaboratoryId} onChange={handleChange} />
              {errors.LaboratoryId && <div className="text-danger">{errors.LaboratoryId}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100">Créer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEquipement;
