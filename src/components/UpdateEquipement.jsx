// src/components/UpdateEquipement.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEquipement, updateEquipementImage, fetchEquipements } from "../redux/EquipementSlice.js";

const UpdateEquipement = ({ equipement, onClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // ✅ États pour stocker les modifications
  const [updatedEquipement, setUpdatedEquipement] = useState({
    nom: equipement.nom || "",
    modele: equipement.modele || "",
    description: equipement.description || "",
    LaboratoryId: equipement.LaboratoryId || "",
  });

  const [newImage, setNewImage] = useState(null);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Validation du formulaire
  const validateForm = () => {
    let formErrors = {};
    if (!updatedEquipement.nom) formErrors.nom = "Le nom est requis.";
    if (!updatedEquipement.modele) formErrors.modele = "Le modèle est requis.";
    if (!updatedEquipement.description) formErrors.description = "La description est requise.";
    if (!updatedEquipement.LaboratoryId) formErrors.LaboratoryId = "L'ID du laboratoire est requis.";
    return formErrors;
  };

  // ✅ Gestion des modifications des champs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setNewImage(files[0]);
      setImageUpdated(true);
    } else {
      setUpdatedEquipement({ ...updatedEquipement, [name]: value });
    }
  };

  // ✅ Gestion de la mise à jour des champs texte
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    console.log("📤 Envoi des données texte :", updatedEquipement);

    dispatch(updateEquipement({ id: equipement.id, updatedData: updatedEquipement })).then(() => {
      dispatch(fetchEquipements()); // 🔄 Rafraîchir Redux
      setLoading(false);
      onClose(); // 🔹 Fermer le formulaire
    });
  };

  // ✅ Gestion de la mise à jour de l’image
  const handleImageUpdate = async () => {
    if (!newImage) return;
  
    const formData = new FormData();
    formData.append("image", newImage);
  
    console.log("📤 Envoi de la nouvelle image :", newImage.name);
  
    dispatch(updateEquipementImage({ id: equipement.id, formData }))
      .then(() => {
        dispatch(fetchEquipements()); // 🔄 Rafraîchir Redux
        setImageUpdated(false);
        setNewImage(null);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de l'envoi de l'image :", error);
      });
  };
  

  return (
    <div className="container mt-4">
  <div className="card shadow-sm p-4">
    <h3 className="text-center mb-3">🛠 Modifier un Équipement</h3>
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      
      {/* Nom */}
      <div className="mb-3">
        <label className="form-label">Nom de l'équipement</label>
        <input type="text" className="form-control" name="nom" placeholder="Nom" value={updatedEquipement.nom} onChange={handleChange} />
        {errors.nom && <p className="text-danger small">{errors.nom}</p>}
      </div>

      {/* Modèle */}
      <div className="mb-3">
        <label className="form-label">Modèle</label>
        <input type="text" className="form-control" name="modele" placeholder="Modèle" value={updatedEquipement.modele} onChange={handleChange} />
        {errors.modele && <p className="text-danger small">{errors.modele}</p>}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" name="description" placeholder="Description" value={updatedEquipement.description} onChange={handleChange} />
        {errors.description && <p className="text-danger small">{errors.description}</p>}
      </div>

      {/* ID du Laboratoire */}
      <div className="mb-3">
        <label className="form-label">ID du Laboratoire</label>
        <input type="text" className="form-control" name="LaboratoryId" placeholder="ID du Laboratoire" value={updatedEquipement.LaboratoryId} onChange={handleChange} />
        {errors.LaboratoryId && <p className="text-danger small">{errors.LaboratoryId}</p>}
      </div>

      {/* Upload Image */}
      <div className="mb-3">
        <label className="form-label">Image</label>
        <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
        {equipement.image && !imageUpdated && <p className="small text-muted">📷 Image actuelle : {equipement.image}</p>}
      </div>

      {newImage && (
  <button 
    type="button" 
    className="btn btn-warning btn-sm mt-2 d-block mx-auto"
    onClick={handleImageUpdate}
  >
    📷 Modifier l’image
  </button>
)}



      {/* Boutons */}
      <div className="d-flex justify-content-between">
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Annuler</button>
      </div>

    </form>

    {/* Bouton pour mettre à jour l'image séparément */}
    {imageUpdated && (
      <button onClick={handleImageUpdate} className="btn btn-info btn-sm mt-3 w-100">
        📷 Mettre à jour l’image
      </button>
    )}
  </div>
</div>

  );
};

export default UpdateEquipement;
