
import React, { useState, useRef } from 'react';
import axios from 'axios';

const DOMAIN_URL = import.meta.env.VITE_API_URL; // Ajustez si besoin

const CreateDepartment = () => {
  // État local pour les champs texte
  const [department, setDepartment] = useState({
    nom: '',
    histoire: '',
    domaine: '',
  });

  // État pour le fichier
  const [selectedFile, setSelectedFile] = useState(null);

  // État pour afficher le nom du fichier
  const [fileName, setFileName] = useState('');

  // Ref pour vider l’input file après soumission
  const fileInputRef = useRef(null);

  // Gérer la saisie dans les champs texte
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  };

  // Gérer la sélection de fichier
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1) FormData => multipart/form-data
      const formData = new FormData();
      formData.append('nom', department.nom);        // IMPORTANT
      formData.append('histoire', department.histoire);
      formData.append('domaine', department.domaine);

      if (selectedFile) {
        formData.append('image', selectedFile);      // "image" => Multer
      }

      // 2) POST vers /departments
      await axios.post(`${DOMAIN_URL}/departments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert("Département créé avec succès !");

      // 3) Reset
      setDepartment({ nom: '', histoire: '', domaine: '' });
      setSelectedFile(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du département.");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>Nom :</label>
        <input
          type="text"
          name="nom"
          value={department.nom}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Histoire :</label>
        <textarea
          name="histoire"
          value={department.histoire}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Domaine :</label>
        <select
          name="domaine"
          value={department.domaine}
          onChange={handleChange}
          required
        >
          <option value="">-- Sélectionnez un domaine --</option>
          <option value="sciences">Sciences</option>
          <option value="literature">Littérature</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label>Image :</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        {fileName && <p>📷 Image sélectionnée : {fileName}</p>}
      </div>

      <button type="submit">Créer Département</button>
    </form>
  );
};

export default CreateDepartment;
