import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipements, deleteEquipement } from "../redux/EquipementSlice.js";
import UpdateEquipement from "./UpdateEquipement.jsx";
import CreateEquipement from "./CreateEquipement.jsx";

const EquipementList = () => {
  const dispatch = useDispatch();
  const { list: equipements, loading, error } = useSelector((state) => state.equipements);

  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchEquipements());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("❌ Voulez-vous vraiment supprimer cet équipement ?")) {
      dispatch(deleteEquipement(id)).then(() => {
        dispatch(fetchEquipements());
      });
    }
  };

  const handleEditClick = (equipement) => {
    setSelectedEquipement(equipement);
    setIsEditing(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Liste des Équipements</h2>
  
      {loading && <p className="text-center text-primary">⏳ Chargement en cours...</p>}
      {error && <p className="alert alert-danger text-center">❌ {error}</p>}
  
      <div className="mb-4">
        <CreateEquipement onEquipementCreated={() => dispatch(fetchEquipements())} />
      </div>
  
      {!loading && !error && equipements.length === 0 && (
        <p className="alert alert-warning text-center">Aucun équipement disponible.</p>
      )}
  
      {!loading && !error && equipements.length > 0 && (
        <div className="d-flex flex-column align-items-center w-100">
        {equipements.map((equipement) => (
          <div key={equipement.id} className="card shadow-sm w-100 mb-3">
            <div className="card-body">
              <h5 className="card-title">{equipement.nom} ({equipement.modele})</h5>
              
              <div className="d-flex justify-content-between">
                <button className="btn btn-primary btn-xs" onClick={() => setSelectedEquipement(equipement)}>Détails</button>
                <button className="btn btn-warning btn-xs" onClick={() => handleEditClick(equipement)}>Modifier</button>
                <button className="btn btn-danger btn-xs" onClick={() => handleDelete(equipement.id)}> Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      )}
  
      {/* ✅ Fenêtre modale pour afficher les détails */}
      {selectedEquipement && !isEditing && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🔍 Détails de l'Équipement</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedEquipement(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID :</strong> {selectedEquipement.id}</p>
                <p><strong>Nom :</strong> {selectedEquipement.nom}</p>
                <p><strong>Modèle :</strong> {selectedEquipement.modele}</p>
                <p><strong>Description :</strong> {selectedEquipement.description}</p>
                <p><strong>Laboratoire ID :</strong> {selectedEquipement.LaboratoryId}</p>
  
                {selectedEquipement.image ? (
                  <img
                    src={selectedEquipement.image.replace("http://localhost:5000", "")}
                    alt={`Image de ${selectedEquipement.nom}`}
                    className="img-fluid border mt-2"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                ) : (
                  <p>📷 Aucune image disponible</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedEquipement(null)}>❌ Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* ✅ Fenêtre modale pour l'édition */}
      {isEditing && selectedEquipement && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">✏️ Modifier l'Équipement</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>
              <div className="modal-body">
                <UpdateEquipement
                  equipement={selectedEquipement}
                  onClose={() => {
                    setIsEditing(false);
                    setSelectedEquipement(null);
                    dispatch(fetchEquipements());
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};  
export default EquipementList;
