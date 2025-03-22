import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createLabo, fetchLabos } from "../redux/LaboSlice";
// Composant pour créer un nouveau laboratoire
const CreateLabo = ({ onLaboCreated }) => {
  const dispatch = useDispatch();
  // État local pour les données du laboratoire à créer
  const [newLabo, setNewLabo] = useState({
    nom: "",
    salle: "",
    information: "",
    image: null,
    DepartmentId: "",
  });
// État pour les erreurs de validation
  const [errors, setErrors] = useState({});
// Fonction de validation du formulaire
  const validateForm = () => {
    let formErrors = {};
    if (!newLabo.nom) formErrors.nom = "Le nom est requis.";
    if (!newLabo.salle) formErrors.salle = "La salle est requise.";
    if (!newLabo.information) formErrors.information = "Les informations sont requises.";
    if (!newLabo.DepartmentId) formErrors.DepartmentId = "Le département est requis.";
    return formErrors;
  };
 // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setNewLabo({ ...newLabo, image: files[0] });
    } else {
      setNewLabo({ ...newLabo, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
// Préparation des données à envoyer via FormData
    const formData = new FormData();
    formData.append("nom", newLabo.nom);
    formData.append("salle", newLabo.salle);
    formData.append("information", newLabo.information);
    if (newLabo.image) formData.append("image", newLabo.image);
    formData.append("DepartmentId", newLabo.DepartmentId);
// Envoi de la requête de création et rafraîchissement de la liste
    dispatch(createLabo(formData)).then((action) => {
      if (action.payload && action.payload.message === "Lab cree") {
        dispatch(fetchLabos()); 
        if (onLaboCreated) onLaboCreated(action.payload);
      }
    });
// Réinitialisation du formulaire après soumission
    setNewLabo({ nom: "", salle: "", information: "", image: null, DepartmentId: "" });
    setErrors({});
  };

  return (
    <div className="container mt-4">
      <div className="card border-primary">
        <div className="card-header bg-primary text-white"> Ajouter un Laboratoire</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input type="text" className="form-control" name="nom" value={newLabo.nom} onChange={handleChange} />
              {errors.nom && <div className="text-danger">{errors.nom}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Salle</label>
              <input type="text" className="form-control" name="salle" value={newLabo.salle} onChange={handleChange} />
              {errors.salle && <div className="text-danger">{errors.salle}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Informations</label>
              <textarea className="form-control" name="information" value={newLabo.information} onChange={handleChange}></textarea>
              {errors.information && <div className="text-danger">{errors.information}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
              {newLabo.image && <p className="text-muted mt-2">🖼️ Image sélectionnée : {newLabo.image.name}</p>}
            </div>

            <div className="mb-3">
              <label className="form-label">ID Département</label>
              <input type="text" className="form-control" name="DepartmentId" value={newLabo.DepartmentId} onChange={handleChange} />
              {errors.DepartmentId && <div className="text-danger">{errors.DepartmentId}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100">Créer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLabo;