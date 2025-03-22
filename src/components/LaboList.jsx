import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLabos, updateLabo, deleteLabo } from "../redux/LaboSlice";
import CreateLabo from "./CreateLabo";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const DOMAIN_URL = import.meta.env.VITE_API_URL;
// Remplit les champs du formulaire d'édition avec les données du labo sélectionné
const LaboList = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { list: reduxLabos, loading, error } = useSelector((state) => state.labos);

  const [selectedLabo, setSelectedLabo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedLabo, setUpdatedLabo] = useState({
    nom: "",
    salle: "",
    information: "",
    DepartmentId: "",
    image: null,
  });

  const [imageUpdated, setImageUpdated] = useState(false);

  useEffect(() => {
    dispatch(fetchLabos());
  }, [dispatch]);

  const handleLaboCreated = (newLabo) => {
    if (newLabo) {
      dispatch(fetchLabos());
    }
  };

  const handleEditClick = (labo) => {
    setSelectedLabo(labo);
    setUpdatedLabo({
      nom: labo.nom,
      salle: labo.salle,
      information: labo.information,
      DepartmentId: labo.DepartmentId,
      image: null,
    });
    setImageUpdated(false);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setUpdatedLabo({ ...updatedLabo, image: files[0] });
      setImageUpdated(true);
    } else {
      setUpdatedLabo({ ...updatedLabo, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
//mise a jour de l,img
    if (imageUpdated && updatedLabo.image) {
      const formData = new FormData();
      formData.append("image", updatedLabo.image);

      await axios.put(`${DOMAIN_URL}/laboratories/${selectedLabo.id}/image`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
    }
//mise a jour des champs texte d'un lab
    const updatedTextData = {
      nom: updatedLabo.nom,
      salle: updatedLabo.salle,
      information: updatedLabo.information,
      DepartmentId: updatedLabo.DepartmentId,
    };

    dispatch(updateLabo({ id: selectedLabo.id, updatedData: updatedTextData })).then(() => {
      dispatch(fetchLabos());
      setIsEditing(false);
      setSelectedLabo(null);
    });
  };
//Supprimer un utilsiateur apres confirmation
  const handleDeleteLabo = (id) => {
    if (window.confirm("❗ Es-tu sûr de vouloir supprimer ce laboratoire ?")) {
      dispatch(deleteLabo(id)).then(() => {
        dispatch(fetchLabos());
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Liste des Laboratoires</h2>

      {loading && <p className="text-center text-primary">Chargement en cours...</p>}
      {error && <p className="text-center text-danger">{typeof error === "string" ? error : "Une erreur est survenue."}</p>}

      <CreateLabo onLaboCreated={handleLaboCreated} />

      {!loading && !error && reduxLabos.length === 0 && <p className="text-center">Aucun laboratoire disponible.</p>}

      <div className="d-flex flex-column align-items-center mt-4">
  {reduxLabos.map((labo, index) => (
    <div key={`labo-${labo.id}-${index}`} className="w-100 mb-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{labo.nom} ({labo.salle})</h5>
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary btn-sm" onClick={() => setSelectedLabo(labo)}>Détails</button>
            <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(labo)}>Modifier</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteLabo(labo.id)}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


      {selectedLabo && !isEditing && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails du Laboratoire</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedLabo(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID :</strong> {selectedLabo.id}</p>
                <p><strong>Nom :</strong> {selectedLabo.nom}</p>
                <p><strong>Salle :</strong> {selectedLabo.salle}</p>
                <p><strong>Informations :</strong> {selectedLabo.information || "Pas d'informations disponibles"}</p>
                <p><strong>Département :</strong> ID {selectedLabo.DepartmentId}</p>

                {selectedLabo.image ? (
                  <img src={selectedLabo.image.replace("http://localhost:5000", "")} alt={`Image de ${selectedLabo.nom}`} className="img-fluid" />
                ) : (
                  <p>Aucune image disponible</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedLabo(null)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le Laboratoire</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate} encType="multipart/form-data">
                  <div className="mb-2">
                    <input type="text" className="form-control" name="nom" value={updatedLabo.nom} onChange={handleChange} required placeholder="Nom" />
                  </div>
                  <div className="mb-2">
                    <input type="text" className="form-control" name="salle" value={updatedLabo.salle} onChange={handleChange} required placeholder="Salle" />
                  </div>
                  <div className="mb-2">
                    <textarea className="form-control" name="information" value={updatedLabo.information} onChange={handleChange} placeholder="Informations"></textarea>
                  </div>
                  <div className="mb-2">
                    <input type="text" className="form-control" name="DepartmentId" value={updatedLabo.DepartmentId} onChange={handleChange} required placeholder="ID Département" />
                  </div>
                  <div className="mb-2">
                    <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
                  </div>
                  <button type="submit" className="btn btn-success w-100">Enregistrer</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboList;
