import React, { useState } from 'react';

const CreateDepartment = ({ onSubmit }) => {
  const [department, setDepartment] = useState({
    nom: '',
    histoire: '',
    domaine: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDepartment((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(department);
    }
    // Réinitialisation du formulaire après soumission
    setDepartment({ nom: '', histoire: '', domaine: '', image: null });
  };

  return (
    <div className="form-container">
      <h3>Créer un Département</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={department.nom}
          onChange={handleChange}
          required
        />
        <textarea
          name="histoire"
          placeholder="Histoire"
          value={department.histoire}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="domaine"
          placeholder="Domaine"
          value={department.domaine}
          onChange={handleChange}
          required
        />
        <label className="file-label">
          Choisir une image
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <button type="submit">Créer Département</button>
      </form>
    </div>
  );
};

export default CreateDepartment;
