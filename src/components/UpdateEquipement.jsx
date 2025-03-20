import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateEquipement } from "../redux/EquipementSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateEquipement = ({ equipement, onEquipementUpdated, onClose }) => {
  const dispatch = useDispatch();

  // Stocker les informations mises à jour
  const [updatedEquipement, setUpdatedEquipement] = useState({
    nom: equipement.nom || "",
    modele: equipement.modele || "",
    description: equipement.description || "",
    LaboratoryId: equipement.LaboratoryId || "",
    image: null, // Image sélectionnée (si modifiée)
  });

  const [imageUpdated, setImageUpdated] = useState(false);
  const [errors, setErrors] = useState({});

  //  Validation du formulaire
  const validateForm = () => {
    let formErrors = {};
    if (!updatedEquipement.nom) formErrors.nom = "Le nom est requis.";
    if (!updatedEquipement.modele) formErrors.modele = "Le modèle est requis.";
    if (!updatedEquipement.description) formErrors.description = "La description est requise.";
    if (!updatedEquipement.LaboratoryId) formErrors.LaboratoryId = "L'ID du laboratoire est requis.";
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setUpdatedEquipement({ ...updatedEquipement, image: files[0] });
      setImageUpdated(true);
    } else {
      setUpdatedEquipement({ ...updatedEquipement, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des erreurs avant l'envoi
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Création de l'objet FormData
    const formData = new FormData();
    formData.append("nom", updatedEquipement.nom);
    formData.append("modele", updatedEquipement.modele);
    formData.append("description", updatedEquipement.description);
    formData.append("LaboratoryId", updatedEquipement.LaboratoryId);

    // Ajouter l'image seulement si elle a été modifiée
    if (imageUpdated && updatedEquipement.image) {
      formData.append("image", updatedEquipement.image);
    }

    console.log("🚀 Données envoyées à Redux :", formData);

    // Dispatch de la mise à jour avec Redux
    dispatch(updateEquipement({ id: equipement.id, updatedData: formData })).then((action) => {
      if (action.payload) {
        console.log("✅ Équipement mis à jour :", action.payload);
        onEquipementUpdated(action.payload);
        onClose();
      } else {
        console.error("❌ Erreur lors de la mise à jour.");
      }
    });
  };

  return (
    <div className="container">
      <h3 className="mb-4 text-center">✏️ Modifier un Équipement</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        
        {/* Nom */}
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input 
            type="text" 
            className={`form-control ${errors.nom ? 'is-invalid' : ''}`} 
            name="nom" 
            value={updatedEquipement.nom} 
            onChange={handleChange} 
          />
          {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
        </div>

        {/* Modèle */}
        <div className="mb-3">
          <label className="form-label">Modèle</label>
          <select 
            className={`form-control ${errors.modele ? 'is-invalid' : ''}`} 
            name="modele" 
            value={updatedEquipement.modele} 
            onChange={handleChange}
          >
            <option value="">-- Sélectionner un modèle --</option>
            <option value="nouveau">Nouveau</option>
            <option value="ancien">Ancien</option>
            <option value="refait">Refait</option>
          </select>
          {errors.modele && <div className="invalid-feedback">{errors.modele}</div>}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea 
            className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
            name="description" 
            value={updatedEquipement.description} 
            onChange={handleChange} 
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        {/* ID du laboratoire */}
        <div className="mb-3">
          <label className="form-label">ID du Laboratoire</label>
          <input 
            type="text" 
            className={`form-control ${errors.LaboratoryId ? 'is-invalid' : ''}`} 
            name="LaboratoryId" 
            value={updatedEquipement.LaboratoryId} 
            onChange={handleChange} 
          />
          {errors.LaboratoryId && <div className="invalid-feedback">{errors.LaboratoryId}</div>}
        </div>

        {/* Gérer l'upload d'image */}
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input 
            type="file" 
            className="form-control" 
            name="image" 
            accept="image/*" 
            onChange={handleChange} 
          />
          {equipement.image && !imageUpdated && (
            <p className="mt-2">📷 Image actuelle : <strong>{equipement.image}</strong></p>
          )}
        </div>

        {/* Boutons */}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success">
            ✅ Mettre à jour
          </button>
          <button type="button" className="btn btn-danger" onClick={onClose}>
            ❌ Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEquipement;
