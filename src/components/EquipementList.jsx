import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipements, deleteEquipement } from "../redux/EquipementSlice";
import CreateEquipement from "./CreateEquipement";
import UpdateEquipement from "./UpdateEquipement";
import "bootstrap/dist/css/bootstrap.min.css";

const EquipementsList = () => {
  const dispatch = useDispatch();
  const { list: reduxEquipements, loading, error } = useSelector((state) => state.equipements);

  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchEquipements());
  }, [dispatch]);

  // Rafraîchir la liste après création d'un équipement
  const handleEquipementCreated = () => {
    dispatch(fetchEquipements());
  };

  // Fermer la modale après mise à jour
  const handleEquipementUpdated = () => {
    dispatch(fetchEquipements());
    setIsUpdating(false);
    setSelectedEquipement(null);
  };

  // Fonction pour supprimer un équipement
  const handleDeleteEquipement = (id) => {
    if (window.confirm("Es-tu sûr de vouloir supprimer cet équipement ?")) {
      dispatch(deleteEquipement(id));
    }
  };

  // Fonction pour fermer la modale de mise à jour
  const handleCloseModal = () => {
    setIsUpdating(false);
    setSelectedEquipement(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Liste des Équipements</h2>

      {/* Formulaire de création */}
      <CreateEquipement onEquipementCreated={handleEquipementCreated} />

      {loading && <p className="text-center text-primary">Chargement en cours...</p>}
      {error && <p className="text-center text-danger">{typeof error === "string" ? error : "Une erreur est survenue."}</p>}

      {!loading && !error && reduxEquipements.length === 0 && (
        <p className="text-center">Aucun équipement disponible.</p>
      )}

      <div className="d-flex flex-column align-items-center mt-4">
        {reduxEquipements.map((equipement, index) => (
          <div key={`equipement-${equipement.id}-${index}`} className="w-100 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{equipement.nom} ({equipement.modele})</h5>
                <button className="btn btn-primary btn-sm" onClick={() => setSelectedEquipement(equipement)}>
                  Détails
                </button>
                <button
                  className="btn btn-warning btn-sm ms-2"
                  onClick={() => {
                    setSelectedEquipement(equipement);
                    setIsUpdating(true);
                  }}
                >
                  Modifier
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteEquipement(equipement.id)}
                >
                  🗑 Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fenêtre modale des détails */}
      {selectedEquipement && !isUpdating && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails de l'Équipement</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedEquipement(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID :</strong> {selectedEquipement.id}</p>
                <p><strong>Nom :</strong> {selectedEquipement.nom}</p>
                <p><strong>Modèle :</strong> {selectedEquipement.modele}</p>
                <p><strong>Description :</strong> {selectedEquipement.description || "Pas de description disponible"}</p>
                <p><strong>Laboratoire ID :</strong> {selectedEquipement.LaboratoryId}</p>

                {selectedEquipement.image ? (
                  <img
                    src={selectedEquipement.image.replace("http://localhost:5000", "")}
                    alt={`Image de ${selectedEquipement.nom}`}
                    className="img-fluid"
                  />
                ) : (
                  <p>Aucune image disponible</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedEquipement(null)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fenêtre modale de mise à jour */}
      {isUpdating && selectedEquipement && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier l'Équipement</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <UpdateEquipement
                  equipement={selectedEquipement}
                  onEquipementUpdated={handleEquipementUpdated}
                  onClose={handleCloseModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipementsList;
