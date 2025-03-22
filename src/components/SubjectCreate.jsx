
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubject, fetchSubjects } from "../redux/subjectSlice";

const SubjectCreate = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.subjects);

  const initialState = {
    nom: "",
    code: "",
    description: "",
    statut: "optionnel",
    DepartmentId: "",
    LaboratoryId: "",
  };

  const [newSubject, setNewSubject] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);

  //  Référence vers l'input file pour le réinitialiser
  const fileInputRef = useRef(null);

  //  Erreurs côté front (local)
  const [localErrors, setLocalErrors] = useState({});
  //  Message de confirmation si succès
  const [confirmationMessage, setConfirmationMessage] = useState("");

  //  Validation locale (avant même l'appel backend)
  const validateForm = () => {
    let formErrors = {};
    if (!newSubject.nom) formErrors.nom = "Le nom est requis.";
    if (!newSubject.code) formErrors.code = "Le code est requis.";
    if (!newSubject.description) formErrors.description = "La description est requise.";
    if (!newSubject.DepartmentId) formErrors.DepartmentId = "Le département est requis.";
    return formErrors;
  };

  // Gestion des changements sur les champs texte
  const handleInputChange = (e) => {
    setNewSubject({ ...newSubject, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1) Vérif locale
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setLocalErrors(formErrors);
      return;
    }

    // 2) Construction du FormData
    const formData = new FormData();
    formData.append("nom", newSubject.nom);
    formData.append("code", newSubject.code);
    formData.append("description", newSubject.description);
    formData.append("statut", newSubject.statut);
    formData.append("DepartmentId", newSubject.DepartmentId);
    formData.append("LaboratoryId", newSubject.LaboratoryId);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // 3) Appel Redux
    dispatch(createSubject(formData)).then((action) => {
      //  Si c'est un succès
      if (action.type === "subjects/createSubject/fulfilled") {
        dispatch(fetchSubjects());
        setConfirmationMessage("Matière créée avec succès");
        setNewSubject(initialState);
        setLocalErrors({});
        // Réinitialiser le file input
        setImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // On efface le message de confirmation après 3 secondes
        setTimeout(() => {
          setConfirmationMessage("");
        }, 3000);
      }

      //  Si c'est un échec (ex: foreign key constraint fails, code unique, etc.)
      if (action.type === "subjects/createSubject/rejected") {
        setConfirmationMessage(""); // On enlève le message de succès

        // On part du principe que l'erreur backend est dans action.payload
        const backendError = action.payload?.toString() || "";

        // On copie nos erreurs locales
        let newErrors = {};

        // Si le backend dit "foreign key constraint fails", on met "Donnée incorrecte"
        // sous ID Département ET ID Laboratoire
        if (backendError.includes("foreign key constraint fails")) {
          newErrors.DepartmentId = "Donnée incorrecte";
          newErrors.LaboratoryId = "Donnée incorrecte";
        }

        //  Gestion de "Code doit etre unique" => on affiche un message sous Code
        if (backendError.includes("Code doit etre unique")) {
          newErrors.code = "Le code est déjà occupé, choisis-en un autre";
        }

        setLocalErrors(newErrors);
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="card border-primary">
        <div className="card-header bg-primary text-white">
          ➕ Ajouter une Matière
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Nom */}
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className={`form-control ${localErrors.nom ? "is-invalid" : ""}`}
                name="nom"
                placeholder="Ex : Mathématiques"
                value={newSubject.nom}
                onChange={handleInputChange}
              />
              {localErrors.nom && (
                <div className="text-danger">{localErrors.nom}</div>
              )}
            </div>

            {/* Code */}
            <div className="mb-3">
              <label className="form-label">Code</label>
              <input
                type="text"
                className={`form-control ${localErrors.code ? "is-invalid" : ""}`}
                name="code"
                placeholder="Ex : 101"
                value={newSubject.code}
                onChange={handleInputChange}
              />
              {/* Affichage de l’erreur si code déjà occupé */}
              {localErrors.code && (
                <div className="text-danger">{localErrors.code}</div>
              )}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className={`form-control ${localErrors.description ? "is-invalid" : ""}`}
                name="description"
                placeholder="Ex : Cours d'introduction à ..."
                value={newSubject.description}
                onChange={handleInputChange}
              ></textarea>
              {localErrors.description && (
                <div className="text-danger">{localErrors.description}</div>
              )}
            </div>

            {/* Statut */}
            <div className="mb-3">
              <label className="form-label">Statut</label>
              <select
                className="form-select"
                name="statut"
                value={newSubject.statut}
                onChange={handleInputChange}
              >
                <option value="optionnel">Optionnel</option>
                <option value="requis">Requis</option>
              </select>
            </div>

            {/* Department */}
            <div className="mb-3">
              <label className="form-label">ID Département</label>
              <input
                type="text"
                className={`form-control ${localErrors.DepartmentId ? "is-invalid" : ""}`}
                name="DepartmentId"
                placeholder="Ex : 1"
                value={newSubject.DepartmentId}
                onChange={handleInputChange}
              />
              {localErrors.DepartmentId && (
                <div className="text-danger">{localErrors.DepartmentId}</div>
              )}
            </div>

            {/* Laboratory */}
            <div className="mb-3">
              <label className="form-label">ID Laboratoire</label>
              <input
                type="text"
                className={`form-control ${localErrors.LaboratoryId ? "is-invalid" : ""}`}
                name="LaboratoryId"
                placeholder="Ex : 1"
                value={newSubject.LaboratoryId}
                onChange={handleInputChange}
                ref={fileInputRef}
              />
              {localErrors.LaboratoryId && (
                <div className="text-danger">{localErrors.LaboratoryId}</div>
              )}
            </div>

            {/* Image */}
            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Ajout en cours..." : "Créer"}
            </button>
          </form>

          {/* Message de confirmation si succès */}
          {confirmationMessage && (
            <div className="alert alert-success mt-3">{confirmationMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectCreate;
