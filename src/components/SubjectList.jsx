import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubjects, deleteSubject } from "../redux/subjectSlice";
import SubjectCreate from "./SubjectCreate";
import SubjectUpdate from "./SubjectUpdate";

const SubjectList = () => {
  const dispatch = useDispatch();
  const { list: subjects, loading, error } = useSelector((state) => state.subjects);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editSubject, setEditSubject] = useState(null);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleSubjectUpdated = (updatedSubject) => {
    setEditSubject(null);
  };

  const handleDelete = (subjectId) => {
    dispatch(deleteSubject(subjectId));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Liste des Matières</h2>

      {loading && <p className="text-center text-primary">⏳ Chargement en cours...</p>}
      {error && <p className="alert alert-danger text-center">❌ {typeof error === "string" ? error : "Une erreur est survenue."}</p>}

      <div className="mb-4">
        <SubjectCreate />
      </div>

      {!loading && !error && subjects.length === 0 && <p className="alert alert-warning text-center">⚠️ Aucune matière disponible.</p>}

      {!loading && !error && subjects.length > 0 && (
        <ul className="list-group">
          {subjects.map((subject) => (
            <li key={subject.id} className="list-group-item d-flex justify-content-between align-items-center border">
              <button className="btn btn-outline-primary" onClick={() => setSelectedSubject(subject)}>
                {subject.nom} ({subject.code})
              </button>
              <div>
                <button className="btn btn-warning me-2" onClick={() => setEditSubject(subject)}>✏️ Modifier</button>
                <button className="btn btn-danger" onClick={() => handleDelete(subject.id)}>❌ Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedSubject && (
        <div className="card border-info mt-4">
          <div className="card-header bg-info text-white">Détails de la Matière</div>
          <div className="card-body">
            <p><strong>ID :</strong> {selectedSubject.id}</p>
            <p><strong>Nom :</strong> {selectedSubject.nom}</p>
            <p><strong>Code :</strong> {selectedSubject.code}</p>
            <p><strong>Description :</strong> {selectedSubject.description || "Pas de description"}</p>
            <p><strong>Statut :</strong> {selectedSubject.statut}</p>
            <p><strong>Département :</strong> ID {selectedSubject.DepartmentId}</p>
            <p><strong>Laboratoire :</strong> ID {selectedSubject.LaboratoryId}</p>
            <button className="btn btn-secondary w-100" onClick={() => setSelectedSubject(null)}>❌ Fermer</button>
          </div>
        </div>
      )}

      {editSubject && (
        <div className="card border-warning mt-4">
          <div className="card-header bg-warning text-dark">✏️ Modifier Matière</div>
          <div className="card-body">
            <SubjectUpdate subject={editSubject} onSubjectUpdated={handleSubjectUpdated} onClose={() => setEditSubject(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectList;
