import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchUserById, deleteUser } from "../redux/userSlice";
import UpdateUser from "./UpdateUser"; // ✅ Import du composant de mise à jour
import { updateUser, updateUserPhoto } from "../redux/userSlice"; // ✅ Import des actions Redux
import { addUserRole, addUserSubject } from "../redux/userSlice";


const UserList = () => {
  const dispatch = useDispatch();

  // États pour la gestion de la modale
const [showModal, setShowModal] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);
const [showUpdateModal, setShowUpdateModal] = useState(false); // ✅ État pour la modale de mise à jour


  // Récupération des données du Redux store
  const { users = [], loading, error, selectedUser } = useSelector((state) => state.users);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("❌ Aucun token trouvé, veuillez vous reconnecter.");
      return;
    }
    dispatch(fetchUsers()); // Charger les utilisateurs
  }, [dispatch]);

  // ✅ Ouvre la modale et charge les détails de l'utilisateur sélectionné
  const handleUserClick = (id) => {
    setSelectedUserId(id);
    dispatch(fetchUserById(id)); // Charge les détails
    setShowModal(true); // Affiche la modale
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      dispatch(deleteUser(id));
      closeModal(); // ✅ Ferme la modale après suppression
    }
  };
  // ✅ Ajoute un rôle à l'utilisateur
  const handleAddRole = () => {
    const roleIds = prompt("Entrez les IDs des rôles à ajouter (séparés par des virgules) :")
      ?.split(",")
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));
  
    if (roleIds.length > 0) {
      dispatch(addUserRole({ id: selectedUserId, roleIds }));
    }
  };

// ✅ Ajoute une matière à l'utilisateur
const handleAddSubject = () => {
  const subjectIds = prompt("Entrez les IDs des matières à ajouter (séparés par des virgules) :")
    ?.split(",")
    .map(id => parseInt(id.trim()))
    .filter(id => !isNaN(id));

  if (subjectIds.length > 0) {
    dispatch(addUserSubject({ id: selectedUserId, subjectIds }));
  }
};


  // ✅ Ferme la modale
  const closeModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    console.log("👀 Utilisateur mis à jour :", selectedUser);
  }, [selectedUser]);
  
  return (
    <div className="container mt-4">
      <div className="card border-primary shadow">
        <div className="card-header bg-primary text-white text-center fw-bold">
          Liste des Utilisateurs
        </div>
        <div className="card-body">
          {loading && <p className="text-center text-muted">⏳ Chargement...</p>}
          {error && <p className="alert alert-danger">❌ {error}</p>}
          {!loading && !error && users.length === 0 && (
            <p className="text-center text-muted">Aucun utilisateur trouvé.</p>
          )}
          {!loading && !error && users.length > 0 && (
            <ul className="list-group">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleUserClick(user.id)} // ✅ Ouvre la modale
                >
                  <span className="fw-bold">{user.nom} {user.prenom}</span> 
                  <span className="text-muted">{user.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
  
      {/* ✅ Modale d'affichage des détails de l'utilisateur */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Détails de l'Utilisateur</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {selectedUserId && !selectedUser ? (
                  <p className="text-center text-muted">⏳ Chargement des détails...</p>
                ) : selectedUser?.data ? (
                  <div>
                    {/* ✅ Affichage de l'image */}
                    {selectedUser.data.photo ? (
                      <div className="text-center mb-3">
                        <img 
                          src={selectedUser.data.photo.replace("http://localhost:5000", "")}
                          alt={`${selectedUser.data.nom} ${selectedUser.data.prenom}`} 
                          className="img-fluid rounded-circle"
                          style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <p>📷 Aucune image disponible</p>
                    )}
  
                    {/* ✅ Informations personnelles */}
                    <p><strong>Nom :</strong> {selectedUser.data.nom} {selectedUser.data.prenom}</p>
                    <p><strong>Email :</strong> {selectedUser.data.email}</p>
                    <p><strong>Date de naissance :</strong> {selectedUser.data.naissance}</p>
                    <p><strong>Biographie :</strong> {selectedUser.data.biographie}</p>
                    <p><strong>Conduite :</strong> {selectedUser.data.conduite}</p>
  
                    {/* ✅ Département */}
                    {selectedUser.data.Department && (
                      <div className="mt-3">
                        <h6 className="text-primary">Département</h6>
                        <p><strong>Nom :</strong> {selectedUser.data.Department.nom}</p>
                        <p><strong>Histoire :</strong> {selectedUser.data.Department.histoire}</p>
                        <p><strong>Domaine :</strong> {selectedUser.data.Department.domaine}</p>
                      </div>
                    )}
  
                    {/* ✅ Rôles */}
                    {/* ✅ Rôles affichés correctement */}
{selectedUser.data.Roles.length > 0 ? (
  <div className="mt-3">
    <h6 className="text-success">Rôles</h6>
    <ul className="list-group">
      {selectedUser.data.Roles.map((role, index) => (
        <li key={index} className="list-group-item">{role.titre}</li> // ✅ Assure-toi d'afficher le bon champ
      ))}
    </ul>
  </div>
) : (
  <p className="text-muted">Aucun rôle attribué</p>
)}



  
                    {/* ✅ Matières (Subjects) */}
                    {selectedUser.data.Subjects.length > 0 && (
                      <div className="mt-3">
                        <h6 className="text-info">Matières</h6>
                        <ul className="list-group">
                          {selectedUser.data.Subjects.map((subject, index) => (
                            <li key={index} className="list-group-item">{subject.nom}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-danger">❌ Impossible de charger les détails.</p>
                )}
              </div>
              <div className="modal-footer">
                {/* 🟢 Bouton Ajouter un rôle */}
<button className="btn btn-info" onClick={handleAddRole}>
  ➕ Ajouter Rôle
</button>

{/* 🟣 Bouton Ajouter une matière */}
<button className="btn btn-success" onClick={handleAddSubject}>
  ➕ Ajouter Matière
</button>


                {/* 🗑️ Bouton Supprimer */}
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(selectedUserId)}
                >
                  Supprimer
                </button>
  
                {/* 📝 Bouton Modifier */}
                <button 
                  className="btn btn-warning"
                  onClick={() => setShowUpdateModal(true)}
                >
                  ✏️ Modifier
                </button>
  
                {/* ❌ Bouton Fermer */}
                <button 
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* ✅ Modale de mise à jour de l'utilisateur */}
      {showUpdateModal && selectedUser?.data && (
        <UpdateUser 
          user={selectedUser.data} 
          onClose={() => setShowUpdateModal(false)} 
        />
      )}
    </div>
  );
};

export default UserList; 