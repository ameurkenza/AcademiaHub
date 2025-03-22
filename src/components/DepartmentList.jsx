
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../redux/departmentSlice";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const DOMAIN_URL = import.meta.env.VITE_API_URL;

const DepartmentList = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { list: departments, loading, error } = useSelector(
    (state) => state.departments
  );

  // État pour la création
  const [newDepartment, setNewDepartment] = useState({
    nom: "",
    histoire: "",
    domaine: "",
    image: null,
  });

  // État pour la modification
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDepartment, setUpdatedDepartment] = useState({
    nom: "",
    histoire: "",
    domaine: "",
    image: null,
  });
  const [imageUpdated, setImageUpdated] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // ──────────────────────────────────────────────────────────────
  // 1) GESTION FORMULAIRE CRÉATION
  // ──────────────────────────────────────────────────────────────
  const handleNewChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      setNewDepartment((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewDepartment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateFields = (dept) => {
    let errs = {};
    if (!dept.nom.trim()) errs.nom = "Le nom est requis.";
    if (dept.histoire.length < 10) {
      errs.histoire = "L’histoire doit contenir au moins 10 caractères.";
    }
    if (!dept.domaine.trim()) errs.domaine = "Le domaine est requis.";
    return errs;
  };

  // Pour réinitialiser le champ fichier, on utilise un ref
  const fileInputRef = React.useRef(null);

  const handleCreate = (e) => {
    e.preventDefault();
    const validationErrors = validateFields(newDepartment);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Envoi des champs texte en JSON
    dispatch(createDepartment(newDepartment)).then((action) => {
      const createdDept = action.payload;
      if (createdDept && createdDept.id && newDepartment.image) {
        // Si une image a été sélectionnée, on fait la requête PUT /departments/:id/image
        const formData = new FormData();
        formData.append("image", newDepartment.image);
        axios
          .put(`${DOMAIN_URL}/departments/${createdDept.id}/image`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            dispatch(fetchDepartments());
          })
          .catch((err) => console.error(err));
      } else {
        // Sinon, on recharge la liste
        dispatch(fetchDepartments());
      }
      // Affichage du message de confirmation
      alert("Département créé avec succès.");
      // Réinitialisation du formulaire
      setNewDepartment({ nom: "", histoire: "", domaine: "", image: null });
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  // ──────────────────────────────────────────────────────────────
  // 2) GESTION ÉDITION
  // ──────────────────────────────────────────────────────────────
  const handleEditClick = (dept) => {
    setSelectedDepartment(dept);
    setUpdatedDepartment({
      nom: dept.nom,
      histoire: dept.histoire,
      domaine: dept.domaine,
      image: null,
    });
    setImageUpdated(false);
    setIsEditing(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      setUpdatedDepartment((prev) => ({ ...prev, image: files[0] }));
      setImageUpdated(true);
    } else {
      setUpdatedDepartment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Si l’utilisateur a choisi une nouvelle image
    if (imageUpdated && updatedDepartment.image) {
      const formData = new FormData();
      formData.append("image", updatedDepartment.image);
      await axios.put(
        `${DOMAIN_URL}/departments/${selectedDepartment.id}/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }
    // Mise à jour des champs texte (on exclut le champ image)
    const { image, ...updatedTextData } = updatedDepartment;
    dispatch(
      updateDepartment({ id: selectedDepartment.id, updatedData: updatedTextData })
    ).then(() => {
      dispatch(fetchDepartments());
      alert("Département mis à jour avec succès.");
      // Fermer la modale d’édition et vider la sélection
      setIsEditing(false);
      setSelectedDepartment(null);
    });
  };

  // ──────────────────────────────────────────────────────────────
  // 3) SUPPRESSION
  // ──────────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    if (window.confirm("❗ Es-tu sûr de vouloir supprimer ce département ?")) {
      dispatch(deleteDepartment(id)).then(() => {
        dispatch(fetchDepartments());
      });
    }
  };

  // ──────────────────────────────────────────────────────────────
  // RENDU
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Liste des Départements</h2>
      {loading && <p className="text-center text-primary">Chargement en cours...</p>}
      {error && (
        <p className="alert alert-danger text-center">
          {typeof error === "string" ? error : "Une erreur est survenue."}
        </p>
      )}

      {/* ───────────── FORMULAIRE CRÉATION ───────────── */}
      <div className="card border-primary mb-4">
        <div className="card-header bg-primary text-white">
          Ajouter un Département
        </div>
        <div className="card-body">
          <form onSubmit={handleCreate}>
            <input
              type="text"
              className="form-control mb-2"
              name="nom"
              placeholder="Nom du département"
              value={newDepartment.nom}
              onChange={handleNewChange}
              required
            />
            {errors.nom && <div className="text-danger">{errors.nom}</div>}

            <textarea
              className="form-control mb-2"
              name="histoire"
              placeholder="Histoire du département (min 10 caractères)"
              value={newDepartment.histoire}
              onChange={handleNewChange}
              required
            />
            {errors.histoire && (
              <div className="text-danger">{errors.histoire}</div>
            )}

            <label className="mb-1">Domaine</label>
            <select
              className="form-control mb-2"
              name="domaine"
              value={newDepartment.domaine}
              onChange={handleNewChange}
              required
            >
              <option value="">-- Sélectionnez un domaine --</option>
              <option value="sciences">sciences</option>
              <option value="literature">literature</option>
              <option value="autre">autre</option>
            </select>
            {errors.domaine && (
              <div className="text-danger">{errors.domaine}</div>
            )}

            <label className="mb-1">Image (optionnelle)</label>
            <input
              type="file"
              className="form-control mb-2"
              name="image"
              accept="image/*"
              onChange={handleNewChange}
              ref={fileInputRef}
            />

            <button type="submit" className="btn btn-primary w-100">
              Créer
            </button>
          </form>
        </div>
      </div>

      {/* ───────────── LISTE DES DÉPARTEMENTS ───────────── */}
      <div className="d-flex flex-column align-items-center mt-4">
        {departments.map((dept, index) => (
          <div key={`dept-${dept.id}-${index}`} className="w-100 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {dept.nom} ({dept.domaine})
                </h5>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    Détails
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditClick(dept)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(dept.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ───────────── MODALE DÉTAILS ───────────── */}
      {selectedDepartment && !isEditing && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails du Département</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedDepartment(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>ID :</strong> {selectedDepartment.id}
                </p>
                <p>
                  <strong>Nom :</strong> {selectedDepartment.nom}
                </p>
                <p>
                  <strong>Domaine :</strong> {selectedDepartment.domaine}
                </p>
                <p>
                  <strong>Histoire :</strong>{" "}
                  {selectedDepartment.histoire ||
                    "Pas d'historique disponible"}
                </p>
                {selectedDepartment.image ? (
                  // Ajout d'un paramètre "t" (timestamp) pour forcer le rafraîchissement de l'image
                  <img
                    src={`${selectedDepartment.image.replace(
                      "http://localhost:5000",
                      ""
                    )}?t=${new Date().getTime()}`}
                    alt={`Image de ${selectedDepartment.nom}`}
                    className="img-fluid"
                  />
                ) : (
                  <p>Aucune image disponible</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedDepartment(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────── MODALE ÉDITION ───────────── */}
      {isEditing && selectedDepartment && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le Département</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedDepartment(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate} encType="multipart/form-data">
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="nom"
                    value={updatedDepartment.nom}
                    onChange={handleUpdateChange}
                    required
                    placeholder="Nom"
                  />
                  <textarea
                    className="form-control mb-2"
                    name="histoire"
                    value={updatedDepartment.histoire}
                    onChange={handleUpdateChange}
                    placeholder="Histoire du département (min 10 caractères)"
                  />
                  <label className="mb-1">Domaine</label>
                  <select
                    className="form-control mb-2"
                    name="domaine"
                    value={updatedDepartment.domaine}
                    onChange={handleUpdateChange}
                    required
                  >
                    <option value="">-- Sélectionnez un domaine --</option>
                    <option value="sciences">sciences</option>
                    <option value="literature">literature</option>
                    <option value="autre">autre</option>
                  </select>

                  <input
                    type="file"
                    className="form-control mb-2"
                    name="image"
                    accept="image/*"
                    onChange={handleUpdateChange}
                  />

                  <button type="submit" className="btn btn-success w-100">
                    Enregistrer
                  </button>
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
