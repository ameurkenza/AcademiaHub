import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, deleteRole } from "../redux/roleSlice";

const RoleList = () => {
  const dispatch = useDispatch();
  const { list: roles, loading, error } = useSelector((state) => state.roles);

  // ✅ Charger la liste des rôles au chargement du composant
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // ✅ Fonction pour supprimer un rôle
  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce rôle ?")) {
      dispatch(deleteRole(id));
    }
  };

  return (
    <div className="container mt-4">
  <div className="card border-warning shadow">
    <div className="card-header bg-warning text-dark fw-bold text-center">
       Liste des Rôles
    </div>

    <div className="card-body">
      {/* ✅ Gestion du chargement et des erreurs */}
      {loading && <p className="text-center text-muted">⏳ Chargement des rôles...</p>}
      {error && <p className="alert alert-danger">❌ {error}</p>}

      {/* ✅ Affichage des rôles */}
      {!loading && !error && roles.length === 0 && (
        <p className="text-center text-muted">Aucun rôle disponible.</p>
      )}

      {!loading && !error && roles.length > 0 && (
        <ul className="list-group">
          {roles.map((role) => (
            <li key={role.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span className="fw-bold">{role.titre} - <span className="text-muted">{role.description}</span></span>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(role.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</div>

  );
};

export default RoleList;
