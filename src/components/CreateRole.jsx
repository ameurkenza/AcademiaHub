import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createRole } from "../redux/roleSlice";

const CreateRole = () => {
  const dispatch = useDispatch();

  //  États pour stocker les valeurs du formulaire
  const [newRole, setNewRole] = useState({
    titre: "",
    description: "",
  });

  // gestion des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  //  Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRole.titre || !newRole.description) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    dispatch(createRole(newRole));
    setNewRole({ titre: "", description: "" }); // Réinitialisation du formulaire
  };

  return (
    <div className="form-container">
      <h3> Ajouter un Rôle</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="titre"
          placeholder="Titre du rôle"
          value={newRole.titre}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newRole.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CreateRole;
