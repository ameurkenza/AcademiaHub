import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateEquipement, updateEquipementImage } from "../redux/EquipementSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateEquipement = ({ equipement, onEquipementUpdated, onClose }) => {
  const dispatch = useDispatch();

  // Stocker les informations mises à jour
  const [updatedEquipement, setUpdatedEquipement] = useState({
    nom: equipement.nom || "",
    modele: equipement.modele || "",
    description: equipement.description || "",
    LaboratoryId: equipement.LaboratoryId || "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  //  Validation du formulaire
  const validateForm = () => {
    let formErrors = {};
    if (!updatedEquipement.nom) formErrors.nom = "Le nom est requis.";
    if (!updatedEquipement.modele) formErrors.modele = "Le modèle est requis.";
    if (!updatedEquipement.description) formErrors.description = "La description est requise.";
    if (!updatedEquipement.LaboratoryId) formErrors.LaboratoryId = "L'ID du laboratoire est requis.";
    return formErrors;
  };

  // 🔹 Gérer les changements de texte et de fichier
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      console.log("📸 Image sélectionnée :", files[0]);
      setImage(files[0]);
    } else {
      setUpdatedEquipement({ ...updatedEquipement, [name]: value });
    }
  };

  // Soumission des données texte
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier les erreurs
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsUpdating(true);
    console.log(" Mise à jour des informations de l'équipement...");

    // Mettre à jour les champs texte
    dispatch(updateEquipement({ id: equipement.id, updatedData: updatedEquipement })).then((action) => {
      if (action.payload) {
        console.log("Mise à jour réussie :", action.payload);
        
        // Si une image a été sélectionnée, mise à jour de l'image
        if (image) {
          console.log(" Envoi de l'image...");
          const formData = new FormData();
          formData.append("image", image);

          dispatch(updateEquipementImage({ id: equipement.id, image })).then((imageAction) => {
            if (imageAction.payload) {
              console.log(" Image mise à jour :", imageAction.payload);
              onEquipementUpdated(imageAction.payload);
            } else {
              console.error(" Erreur lors de la mise à jour de l'image.");
            }
            setIsUpdating(false);
            onClose();
          });
        } else {
          setIsUpdating(false);
          onEquipementUpdated(action.payload);
          onClose();
        }
      } else {
        console.error(" Erreur lors de la mise à jour.");
        setIsUpdating(false);
      }
    });
  };

  return (
    <div className="container p-4 border rounded bg-light">
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

        {/* Image */}
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input 
            type="file" 
            className="form-control" 
            name="image" 
            accept="image/*" 
            onChange={handleChange} 
          />
          {equipement.image && (
            <p className="mt-2"> Image actuelle : <strong>{equipement.image}</strong></p>
          )}
        </div>

        {/* Boutons */}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success" disabled={isUpdating}>
            {isUpdating ? "Mise à jour..." : " Mettre à jour"}
          </button>
          <button type="button" className="btn btn-danger" onClick={onClose}>
             Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEquipement;
