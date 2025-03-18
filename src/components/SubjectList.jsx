import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubjects, deleteSubject } from "../redux/subjectSlice";
import SubjectCreate from "./SubjectCreate";
import SubjectUpdate from "./SubjectUpdate";
import "bootstrap/dist/css/bootstrap.min.css";

const SubjectList = () => {
  const dispatch = useDispatch();
  const { list: subjects, loading, error } = useSelector((state) => state.subjects);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editSubject, setEditSubject] = useState(null);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleSubjectUpdated = () => {
    setEditSubject(null);
    dispatch(fetchSubjects());
  };

  const handleDelete = (subjectId) => {
    if (window.confirm("❗ Es-tu sûr de vouloir supprimer cette matière ?")) {
      dispatch(deleteSubject(subjectId)).then(() => {
        dispatch(fetchSubjects());
        setSelectedSubject(null); // Fermer la modale après suppression
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Liste des Matières</h2>

      {loading && <p className="text-center text-primary">⏳ Chargement en cours...</p>}
      {error && <p className="alert alert-danger text-center">❌ {typeof error === "string" ? error : "Une erreur est survenue."}</p>}

      {/* Formulaire de création */}
      <div className="mb-4">
        <SubjectCreate />
      </div>

      {/* Liste des matières */}
      {!loading && !error && subjects.length === 0 && (
        <p className="alert alert-warning text-center">⚠️ Aucune matière disponible.</p>
      )}

      <div className="d-flex flex-column align-items-center">
        {subjects.map((subject) => (
          <div key={subject.id} className="w-100 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{subject.nom} ({subject.code})</h5>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-primary btn-sm" onClick={() => setSelectedSubject(subject)}>Détails</button>
                  <button className="btn btn-warning btn-sm" onClick={() => setEditSubject(subject)}>Modifier</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(subject.id)}>Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modale Détails avec boutons côte à côte */}
      {selectedSubject && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails de la Matière</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedSubject(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID :</strong> {selectedSubject.id}</p>
                <p><strong>Nom :</strong> {selectedSubject.nom}</p>
                <p><strong>Code :</strong> {selectedSubject.code}</p>
                <p><strong>Description :</strong> {selectedSubject.description || "Pas de description"}</p>
                <p><strong>Statut :</strong> {selectedSubject.statut}</p>
                <p><strong>Département :</strong> ID {selectedSubject.DepartmentId}</p>
                <p><strong>Laboratoire :</strong> ID {selectedSubject.LaboratoryId}</p>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button className="btn btn-warning" onClick={() => { setEditSubject(selectedSubject); setSelectedSubject(null); }}>✏️ Modifier</button>
                <button className="btn btn-danger" onClick={() => handleDelete(selectedSubject.id)}>🗑 Supprimer</button>
                <button className="btn btn-secondary" onClick={() => setSelectedSubject(null)}>❌ Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale Édition */}
      {editSubject && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier la Matière</h5>
                <button type="button" className="btn-close" onClick={() => setEditSubject(null)}></button>
              </div>
              <div className="modal-body">
                <SubjectUpdate
                  subject={editSubject}
                  onSubjectUpdated={handleSubjectUpdated}
                  onClose={() => setEditSubject(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectList;
