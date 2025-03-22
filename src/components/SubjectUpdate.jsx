
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSubject } from "../redux/subjectSlice";
import axios from "axios";

const SubjectUpdate = ({ subject, onSubjectUpdated, onClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const DOMAIN_URL = import.meta.env.VITE_API_URL;

  // Initialiser les champs du formulaire avec les valeurs existantes
  const [updatedSubject, setUpdatedSubject] = useState({
    nom: subject.nom || "",
    code: subject.code || "",
    description: subject.description || "",
    statut: subject.statut || "optionnel",
    DepartmentId: subject.DepartmentId || "",
    LaboratoryId: subject.LaboratoryId || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Validation du formulaire
  const validateForm = () => {
    let formErrors = {};
    if (!updatedSubject.nom) formErrors.nom = "Le nom est requis.";
    if (!updatedSubject.code) formErrors.code = "Le code est requis.";
    if (!updatedSubject.description)
      formErrors.description = "La description est requise.";
    if (!updatedSubject.DepartmentId)
      formErrors.DepartmentId = "Le département est requis.";
    return formErrors;
  };

  const handleChange = (e) => {
    setUpdatedSubject({ ...updatedSubject, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire de mise à jour
  const handleSubmit = (e) => {
    e.preventDefault();

    // Demande de confirmation
    if (!window.confirm("Voulez-vous vraiment modifier cette matière ?")) {
      return;
    }

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Mettre à jour la matière (hors image)
    dispatch(updateSubject({ id: subject.id, updatedData: updatedSubject }))
      .then(async () => {
        let imageUpdateMessage = "";
        // Si une nouvelle image est sélectionnée, on met à jour la photo
        if (imageFile) {
          const formData = new FormData();
          formData.append("image", imageFile);
          formData.append("nom", updatedSubject.nom);

          // ✅ Ajout d'un console.log pour debug
          console.log("🔎 Mise à jour de la photo : ", {
            id: subject.id,
            nom: updatedSubject.nom,
            file: imageFile.name,
          });

          try {
            const response = await axios.put(
              `${DOMAIN_URL}/subjects/${subject.id}/image`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            imageUpdateMessage = response.data.message;
          } catch (error) {
            imageUpdateMessage = "Erreur lors de la mise à jour de l'image";
          }
        }

        setConfirmationMessage(
          "Matière modifiée avec succès" +
            (imageUpdateMessage ? " - " + imageUpdateMessage : "")
        );
        // On rafraîchit la liste via le callback fourni par le parent
        onSubjectUpdated();
        // Réinitialisation du champ image
        setImageFile(null);
        // Fermeture de la modale après un court délai
        setTimeout(() => {
          onClose();
        }, 2000);
      });
  };

  return (
    <div className="edit-container">
      <h3>✏️ Modifier la Matière</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Nom */}
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            name="nom"
            className="form-control"
            placeholder="Nom"
            value={updatedSubject.nom}
            onChange={handleChange}
          />
          {errors.nom && <p className="text-danger">{errors.nom}</p>}
        </div>

        {/* Code */}
        <div className="mb-3">
          <label className="form-label">Code</label>
          <input
            type="text"
            name="code"
            className="form-control"
            placeholder="Code"
            value={updatedSubject.code}
            onChange={handleChange}
          />
          {errors.code && <p className="text-danger">{errors.code}</p>}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            placeholder="Description"
            value={updatedSubject.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="text-danger">{errors.description}</p>
          )}
        </div>

        {/* Statut */}
        <div className="mb-3">
          <label className="form-label">Statut</label>
          <select
            name="statut"
            className="form-select"
            value={updatedSubject.statut}
            onChange={handleChange}
          >
            <option value="optionnel">Optionnel</option>
            <option value="requis">Requis</option>
          </select>
        </div>

        {/* Département */}
        <div className="mb-3">
          <label className="form-label">ID Département</label>
          <input
            type="text"
            name="DepartmentId"
            className="form-control"
            placeholder="ID Département"
            value={updatedSubject.DepartmentId}
            onChange={handleChange}
          />
          {errors.DepartmentId && (
            <p className="text-danger">{errors.DepartmentId}</p>
          )}
        </div>

        {/* Laboratoire */}
        <div className="mb-3">
          <label className="form-label">ID Laboratoire</label>
          <input
            type="text"
            name="LaboratoryId"
            className="form-control"
            placeholder="ID Laboratoire"
            value={updatedSubject.LaboratoryId}
            onChange={handleChange}
          />
        </div>

        {/* Champ d'upload pour l'image */}
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            name="image"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
          {imageFile && (
            <div className="mt-2">
              <small>Fichier sélectionné : {imageFile.name}</small>
            </div>
          )}
        </div>

        {/* Boutons */}
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            Mettre à jour
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={onClose}
          >
            ❌ Annuler
          </button>
        </div>
      </form>

      {/* Message de confirmation */}
      {confirmationMessage && (
        <div className="alert alert-success mt-3">{confirmationMessage}</div>
      )}
    </div>
  );
};

export default SubjectUpdate;
