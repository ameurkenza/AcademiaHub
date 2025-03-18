// src/components/UpdateLabo.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateLabo } from "../redux/LaboSlice";

const UpdateLabo = ({ labo, onLaboUpdated, onClose }) => {
  const dispatch = useDispatch();

  // ✅ Stocker les informations mises à jour
  const [updatedLabo, setUpdatedLabo] = useState({
    nom: labo.nom || "",
    salle: labo.salle || "",
    information: labo.information || "",
    image: null, // Image sélectionnée
    DepartmentId: labo.DepartmentId || "",
  });

  const [imageUpdated, setImageUpdated] = useState(false); // ✅ Indicateur d'image modifiée
  const [errors, setErrors] = useState({});

  // ✅ Validation du formulaire
  const validateForm = () => {
    let formErrors = {};
    if (!updatedLabo.nom) formErrors.nom = "Le nom est requis.";
    if (!updatedLabo.salle) formErrors.salle = "La salle est requise.";
    if (!updatedLabo.information) formErrors.information = "Les informations sont requises.";
    if (!updatedLabo.DepartmentId) formErrors.DepartmentId = "Le département est requis.";
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setUpdatedLabo({ ...updatedLabo, image: files[0] });
      setImageUpdated(true); // ✅ Marquer l'image comme modifiée
    } else {
      setUpdatedLabo({ ...updatedLabo, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // ✅ Préparation des données pour l'envoi
    const formData = new FormData();
    formData.append("nom", updatedLabo.nom);
    formData.append("salle", updatedLabo.salle);
    formData.append("information", updatedLabo.information);
    formData.append("DepartmentId", updatedLabo.DepartmentId);
    
    // ✅ Ajouter l’image si elle a été modifiée
    if (imageUpdated && updatedLabo.image) {
      formData.append("image", updatedLabo.image);
      formData.append("imageUpdated", "true"); // 🔹 Indiquer que l'image a changé
    }

    console.log("📤 Données envoyées à Redux depuis UpdateLabo :", Object.fromEntries(formData.entries()));


    // ✅ Dispatch Redux pour mise à jour
    dispatch(updateLabo({ id: labo.id, updatedData: formData })).then((action) => {
      if (action.payload) {
        console.log("✅ Labo mis à jour :", action.payload);
        onLaboUpdated(action.payload); // 🔄 Mise à jour immédiate de l'affichage
        onClose(); // 🔹 Fermer le formulaire après la mise à jour
      } else {
        console.error("❌ Erreur : La mise à jour a échoué.");
      }
    });
  };

  return (
    <div className="form-container">
      <h3>✏️ Modifier un Laboratoire</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="nom" placeholder="Nom" value={updatedLabo.nom} onChange={handleChange} />
        {errors.nom && <p className="error">{errors.nom}</p>}

        <input type="text" name="salle" placeholder="Salle" value={updatedLabo.salle} onChange={handleChange} />
        {errors.salle && <p className="error">{errors.salle}</p>}

        <textarea name="information" placeholder="Informations" value={updatedLabo.information} onChange={handleChange} />
        {errors.information && <p className="error">{errors.information}</p>}

        {/* ✅ Gérer l'upload d'image */}
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        {labo.image && !imageUpdated && <p>📷 Image actuelle : {labo.image}</p>}

        <input type="text" name="DepartmentId" placeholder="ID Département" value={updatedLabo.DepartmentId} onChange={handleChange} />
        {errors.DepartmentId && <p className="error">{errors.DepartmentId}</p>}

        <button type="submit">Mettre à jour</button>
        <button type="button" className="cancel-button" onClick={onClose}>Annuler</button>
      </form>
    </div>
  );
};

export default UpdateLabo;
