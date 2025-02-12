// Importation des modules React et des bibliothèques nécessaires
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DepartementsMatieres.css';

// Définition de l'URL de l'API à partir des variables d'environnement
const DOMAIN_URL = import.meta.env.VITE_SERVER_URL;

/** 
 * Charge une image à partir d'une URL ou d'un chemin de fichier.
 * Convertit l'image en Blob URL pour un affichage plus rapide et sans appel réseau supplémentaire.
 */
const chargerImage = async (imagePath) => {
  console.log("🖼️ imagePath reçu :", imagePath, typeof imagePath); // 🔍 Debug

  if (!imagePath) {
    console.error("⚠️ imagePath est vide ou invalide.");
    return null;
  }

  // Si c'est un objet `File`, il faut créer une URL locale temporaire
  if (imagePath instanceof File) {
    console.log("📂 L'image est un fichier, on génère une URL temporaire.");
    return URL.createObjectURL(imagePath);
  }

  // Vérification que `imagePath` est bien une chaîne
  if (typeof imagePath !== 'string') {
    console.error("⚠️ Erreur : imagePath doit être une chaîne de caractères ou un fichier.", imagePath);
    return null;
  }

  try {
    const fullUrl =
      imagePath.startsWith('http://') || imagePath.startsWith('https://')
        ? imagePath
        : `${DOMAIN_URL}/${imagePath.replace(/^\/+/, '')}`;
    
    const response = await fetch(fullUrl, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('⚠️ Erreur lors du chargement de l’image :', error);
    return null;
  }
};



/** 
 * Génère l'URL correcte d'une image.
 * Vérifie si l'image est déjà une URL complète ou un Blob et sinon, la concatène avec `DOMAIN_URL`.
 */
const getPhotoUrl = (photo) => {
  if (!photo) return '';
  const trimmed = photo.trim();
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }
  return `${DOMAIN_URL}/${trimmed.replace(/^\/+/, '')}`;
};

const DepartementsMatieres = () => {
  /*** 🌟 ÉTATS POUR LES DÉPARTEMENTS ***/
  const [departments, setDepartments] = useState([]); // Stocke la liste des départements
  const [departmentsLoading, setDepartmentsLoading] = useState(true); // Indique si le chargement est en cours
  const [departmentsError, setDepartmentsError] = useState(null); // Stocke les erreurs éventuelles
  const [expandedDepartment, setExpandedDepartment] = useState(null); // Gère l'affichage des détails d'un département

  // États pour la création et l'édition d'un département
  const [newDepartment, setNewDepartment] = useState({
    nom: '',
    histoire: '',
    domaine: '',
    image: null,
  });
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editDepartmentData, setEditDepartmentData] = useState({
    nom: '',
    histoire: '',
    domaine: '',
  });
  const [departmentImageFile, setDepartmentImageFile] = useState(null);

  /*** 🌟 ÉTATS POUR LES MATIÈRES ***/
  const [subjects, setSubjects] = useState([]); // Stocke la liste des matières
  const [subjectsLoading, setSubjectsLoading] = useState(true); // Indique si le chargement est en cours
  const [subjectsError, setSubjectsError] = useState(null); // Stocke les erreurs éventuelles
  const [expandedSubject, setExpandedSubject] = useState(null); // Gère l'affichage des détails d'une matière
  const [subjectDetails, setSubjectDetails] = useState({}); // Stocke les détails d'une matière

  // États pour la création et l'édition d'une matière
  const [newSubject, setNewSubject] = useState({
    nom: '',
    code: '',
    description: '',
    statut: '',
    image: null,
    DepartmentId: '',
  });
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editSubjectData, setEditSubjectData] = useState({
    nom: '',
    code: '',
    description: '',
    statut: '',
    DepartmentId: '',
  });
  const [subjectImageFile, setSubjectImageFile] = useState(null);

  /* ===================== CHARGEMENT INITIAL DES DONNÉES ===================== */
  useEffect(() => {
    /** 
     * Récupère la liste des départements depuis l'API.
     * Charge aussi les images de chaque département si elles existent.
     */
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${DOMAIN_URL}/departments`);
        let deptData = response.data?.data?.departments || [];
        const loadedDepts = await Promise.all(
          deptData.map(async (dept) => {
            if (dept.image) {
              const blobUrl = await chargerImage(dept.image);
              return { ...dept, image: blobUrl };
            }
            return dept;
          })
        );
        setDepartments(loadedDepts);
        setDepartmentsLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des départements :', err);
        setDepartmentsError(err);
        setDepartmentsLoading(false);
      }
    };

    /** 
     * Récupère la liste des matières depuis l'API.
     * Charge aussi les images de chaque matière si elles existent.
     */
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${DOMAIN_URL}/subjects`);
        let subsData = response.data?.data?.subjects || [];
        const loadedSubs = await Promise.all(
          subsData.map(async (sub) => {
            if (sub.image) {
              const blobUrl = await chargerImage(sub.image);
              return { ...sub, image: blobUrl };
            }
            return sub;
          })
        );
        setSubjects(loadedSubs);
        setSubjectsLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des matières :', err);
        setSubjectsError(err);
        setSubjectsLoading(false);
      }
    };

    // Exécute les deux fonctions de chargement lors du montage du composant
    fetchDepartments();
    fetchSubjects();
  }, []);

  /* ===================== 📌 FONCTIONS POUR LES DÉPARTEMENTS ===================== */

  /** 
   * Permet d'afficher ou cacher les détails d'un département.
   */
  const toggleDepartmentDetails = (deptId) => {
    setExpandedDepartment((prev) => (prev === deptId ? null : deptId));
  };

  /** 
   * Met à jour l'état lors de la saisie d'un nouveau département.
   */
  const handleNewDepartmentChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  /** 
   * Met à jour l'état de l'image pour un département.
   */
  const handleDepartmentFileChange = (e) => {
    setNewDepartment((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  /** 
   * Envoie un nouveau département à l'API.
   */
  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newDepartment).forEach(([key, val]) => {
      formData.append(key, val);
    });
    try {
      const response = await axios.post(`${DOMAIN_URL}/departments`, formData);
      const createdDept = response.data?.data?.department || { ...newDepartment, id: Date.now() };
      let finalImage = null;
      if (createdDept.image) {
        finalImage = await chargerImage(createdDept.image);
      }
      setDepartments((prev) => [...prev, { ...createdDept, image: finalImage }]);
      setNewDepartment({ nom: '', histoire: '', domaine: '', image: null });
    } catch (err) {
      console.error('Erreur lors de la création du département :', err);
    }
  };


  const startEditingDepartment = (deptId) => {
    setEditingDepartmentId(deptId);
    const dept = departments.find((d) => d.id === deptId);
    if (dept) {
      setEditDepartmentData({
        nom: dept.nom || '',
        histoire: dept.histoire || '',
        domaine: dept.domaine || '',
      });
    }
  };


  


  const handleEditDepartmentChange = (e) => {
    const { name, value } = e.target;
    setEditDepartmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditDepartmentSubmit = async (deptId) => {
    try {
      const response = await axios.put(`${DOMAIN_URL}/departments/${deptId}`, editDepartmentData);
      const updatedDept = response.data?.data || response.data;
      const oldDept = departments.find((d) => d.id === deptId);
      const finalImage = oldDept?.image || null;
      setDepartments((prev) =>
        prev.map((d) => (d.id === deptId ? { ...updatedDept, image: finalImage } : d))
      );
      setEditingDepartmentId(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du département :', err);
    }
  };




  const handleDeleteDepartment = (deptId) => {
    axios.delete(`${DOMAIN_URL}/departments/${deptId}`)
      .then(() => {
        setDepartments((prev) => prev.filter((d) => d.id !== deptId));
      })
      .catch((err) => console.error('Erreur lors de la suppression du département :', err));
  };

  
/* ===================== 📚 GESTION DES MATIÈRES ===================== */

/**
 * Met à jour l'état `newSubject` lors de la saisie d'une nouvelle matière.
 * Permet de stocker temporairement les valeurs entrées par l'utilisateur.
 */
const handleNewSubjectChange = (e) => {
  const { name, value } = e.target;
  setNewSubject((prev) => ({ ...prev, [name]: value }));
};

/**
 * Gère l'ajout d'un fichier image pour une nouvelle matière.
 * Stocke temporairement l'image sélectionnée par l'utilisateur.
 */
const handleSubjectFileChange = (e) => {
  setNewSubject((prev) => ({ ...prev, image: e.target.files[0] }));
};

/**
 * Envoie une nouvelle matière à l'API et met à jour l'état `subjects`.
 */
const handleSubjectSubmit = async (e) => {
  e.preventDefault();

  // Vérifie si un département a été sélectionné avant de créer la matière.
  if (!newSubject.DepartmentId) {
    console.error("Aucun département sélectionné. Impossible de créer la matière.");
    return;
  }
  const deptIdNumber = parseInt(newSubject.DepartmentId, 10);
  if (!deptIdNumber || deptIdNumber < 1) {
    console.error(`DepartmentId invalide : ${deptIdNumber}`);
    return;
  }

  // Préparation des données à envoyer via FormData
  const formData = new FormData();
  Object.entries(newSubject).forEach(([key, val]) => {
    if (key === 'DepartmentId') {
      formData.append(key, deptIdNumber);
    } else {
      formData.append(key, val);
    }
  });

  try {
    // Envoi de la requête POST à l'API
    const response = await axios.post(`${DOMAIN_URL}/subjects`, formData);
    const createdSubject = response.data?.data?.subject || response.data?.data || { ...newSubject, id: Date.now() };

    // Chargement de l'image si elle existe
    let finalImage = null;
    if (createdSubject.image) {
      finalImage = await chargerImage(createdSubject.image);
    }

    // Mise à jour de la liste des matières
    setSubjects((prev) => [...prev, { ...createdSubject, image: finalImage }]);

    // Réinitialisation du formulaire après l'ajout
    setNewSubject({
      nom: '',
      code: '',
      description: '',
      statut: '',
      image: null,
      DepartmentId: '',
    });
  } catch (err) {
    console.error('Erreur lors de la création de la matière :', err.response ? err.response.data : err);
  }
};

/**
 * Gère l'affichage des détails d'une matière sélectionnée.
 * Si la matière est déjà affichée, elle est masquée.
 */
const toggleSubjectDetails = async (subjectId) => {
  if (expandedSubject === subjectId) {
    setExpandedSubject(null);
    return;
  }
  setExpandedSubject(subjectId);

  try {
    // Récupération des détails de la matière depuis l'API
    const response = await axios.get(`${DOMAIN_URL}/subjects/${subjectId}`);
    let data = response.data?.data || response.data;

    // Chargement de l'image si elle existe
    if (data.image) {
      data.image = await chargerImage(data.image);
    }

    // Mise à jour des détails de la matière
    setSubjectDetails((prev) => ({ ...prev, [subjectId]: data }));
  } catch (err) {
    console.error('Erreur lors de la récupération des détails de la matière :', err);
  }
};

/**
 * Prépare l'édition d'une matière en récupérant ses données actuelles.
 */
const startEditingSubject = (subjectId) => {
  setEditingSubjectId(subjectId);
  
  // Récupération des données de la matière à éditer
  const subject = subjectDetails[subjectId] || subjects.find((s) => s.id === subjectId);
  
  if (subject) {
    setEditSubjectData({
      nom: subject.nom || '',
      code: subject.code || '',
      description: subject.description || '',
      statut: subject.statut || '',
      DepartmentId: subject.DepartmentId || '',
    });
  }
};

/**
 * Met à jour l'état `editSubjectData` lorsqu'un champ du formulaire d'édition est modifié.
 */
const handleEditSubjectChange = (e) => {
  const { name, value } = e.target;
  setEditSubjectData((prev) => ({ ...prev, [name]: value }));
};

/**
 * Envoie les modifications d'une matière à l'API et met à jour la liste.
 */
const handleEditSubjectSubmit = async (subjectId) => {
  try {
    const deptIdNumber = parseInt(editSubjectData.DepartmentId, 10) || null;
    const payload = { ...editSubjectData, DepartmentId: deptIdNumber };

    // Envoi de la mise à jour à l'API
    const response = await axios.put(`${DOMAIN_URL}/subjects/${subjectId}`, payload);
    const updatedSubject = response.data?.data || response.data;

    // Récupération de l'ancienne image si elle existait
    const oldSubject = subjects.find((s) => s.id === subjectId);
    const finalImage = oldSubject?.image || null;

    // Mise à jour de la liste des matières
    setSubjects((prev) =>
      prev.map((s) => (s.id === subjectId ? { ...updatedSubject, image: finalImage } : s))
    );

    // Sortir du mode édition
    setEditingSubjectId(null);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la matière :', err);
  }
};

/**
 * Met à jour l'image d'une matière en envoyant un fichier à l'API.
 */
const handleSubjectImageSubmit = async (subjectId, e) => {
  e.preventDefault();
  if (!subjectImageFile) return;

  try {
    const formData = new FormData();
    formData.append('image', subjectImageFile);

    // Envoi de la mise à jour de l'image à l'API
    const response = await axios.put(`${DOMAIN_URL}/subjects/${subjectId}/image`, formData);
    const newImagePath = response.data?.data?.image || response.data.image;

    // Chargement de la nouvelle image
    const newBlob = await chargerImage(newImagePath);

    // Mise à jour de l'image dans les détails et la liste des matières
    setSubjectDetails((prev) => ({
      ...prev,
      [subjectId]: { ...prev[subjectId], image: newBlob },
    }));

    setSubjects((prev) =>
      prev.map((s) => (s.id === subjectId ? { ...s, image: newBlob } : s))
    );

    // Réinitialisation du fichier sélectionné
    setSubjectImageFile(null);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'image de la matière :", err);
  }
};

/**
 * Supprime une matière de la liste et de l'API.
 */
const handleDeleteSubject = (subjectId) => {
  axios.delete(`${DOMAIN_URL}/subjects/${subjectId}`)
    .then(() => {
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    })
    .catch((err) => console.error('Erreur lors de la suppression de la matière :', err));
};



 

  return (
    <div className="departements-matieres-page">
      <h1 className="page-title">Gestion des Départements & Matières</h1>
      <div className="columns-container">
        {/* COLONNE DÉPARTEMENTS */}
        <div className="department-column">
          <h2 className="column-header">Départements</h2>
          <div className="form-container">
            <h3>Créer un Département</h3>
            <form onSubmit={handleDepartmentSubmit}>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={newDepartment.nom}
                onChange={handleNewDepartmentChange}
                required
              />
              <textarea
                name="histoire"
                placeholder="Histoire"
                value={newDepartment.histoire}
                onChange={handleNewDepartmentChange}
                required
              />
              <input
                type="text"
                name="domaine"
                placeholder="Domaine"
                value={newDepartment.domaine}
                onChange={handleNewDepartmentChange}
                required
              />
              <label className="file-label">
                Choisir un fichier
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleDepartmentFileChange}
                />
              </label>
              <button type="submit">Créer Département</button>
            </form>
          </div>
          <div className="list-container">
            {departmentsLoading && <p>Chargement des départements...</p>}
            {departmentsError && <p>Erreur : {departmentsError.message}</p>}
            {!departmentsLoading && !departmentsError && (
              <ul>
                {departments.map((dept, index) => dept && (
                  <li key={dept.id || index} className="item">
                    <div className="item-header" onClick={() => toggleDepartmentDetails(dept.id)}>
                      <span>{dept.nom}</span>
                      <button type="button" className="toggle-button">
                        {expandedDepartment === dept.id ? '▲' : '▼'}
                      </button>
                    </div>
                    {expandedDepartment === dept.id && (
                      <div className="item-details">
                        {editingDepartmentId === dept.id ? (
                          <div className="form-container">
                            <h3>Modifier Département</h3>
                            <input
                              type="text"
                              name="nom"
                              placeholder="Nom"
                              value={editDepartmentData.nom}
                              onChange={handleEditDepartmentChange}
                            />
                            <textarea
                              name="histoire"
                              placeholder="Histoire"
                              value={editDepartmentData.histoire}
                              onChange={handleEditDepartmentChange}
                            />
                            <input
                              type="text"
                              name="domaine"
                              placeholder="Domaine"
                              value={editDepartmentData.domaine}
                              onChange={handleEditDepartmentChange}
                            />
                            <button type="button" onClick={() => handleEditDepartmentSubmit(dept.id)}>
                              Enregistrer
                            </button>
                          </div>
                        ) : (
                          <>
                            <p><strong>ID :</strong> {dept.id}</p>
                            <p><strong>Histoire :</strong> {dept.histoire}</p>
                            <p><strong>Domaine :</strong> {dept.domaine}</p>
                            {dept.image ? (
                              <img
                                src={getPhotoUrl(dept.image)}
                                alt="Image département"
                                className="media"
                              />
                            ) : (
                              <p>Aucune image disponible.</p>
                            )}
                            <div>
                              <button type="button" className="edit-button" onClick={() => startEditingDepartment(dept.id)}>
                                Modifier
                              </button>
                              <button type="button" className="delete-button" onClick={() => handleDeleteDepartment(dept.id)}>
                                Supprimer
                              </button>
                            </div>
                            <div className="file-update-form">
                              <form onSubmit={(e) => handleDepartmentImageSubmit(dept.id, e)}>
                                <label className="file-label">
                                  Choisir un fichier
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setDepartmentImageFile(e.target.files[0])}
                                  />
                                </label>
                                <button type="submit">Mettre à jour image</button>
                              </form>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* COLONNE MATIÈRES */}
        <div className="subject-column">
          <h2 className="column-header">Matières</h2>
          <div className="form-container">
            <h3>Créer une Matière</h3>
            <form onSubmit={handleSubjectSubmit}>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={newSubject.nom}
                onChange={handleNewSubjectChange}
                required
              />
              <input
                type="text"
                name="code"
                placeholder="Code"
                value={newSubject.code}
                onChange={handleNewSubjectChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newSubject.description}
                onChange={handleNewSubjectChange}
              />
              <select
                name="statut"
                value={newSubject.statut}
                onChange={handleNewSubjectChange}
                required
              >
                <option value="">Sélectionnez un statut</option>
                <option value="optionnel">Optionnel</option>
                <option value="requis">Requis</option>
              </select>
              <select
                name="DepartmentId"
                value={newSubject.DepartmentId}
                onChange={handleNewSubjectChange}
                required
              >
                <option value="">Sélectionnez un département</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nom}
                  </option>
                ))}
              </select>
              <label className="file-label">
                Choisir un fichier
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleSubjectFileChange}
                />
              </label>
              <button type="submit">Créer Matière</button>
            </form>
          </div>
          <div className="list-container">
            {subjectsLoading && <p>Chargement des matières...</p>}
            {subjectsError && <p>Erreur : {subjectsError.message}</p>}
            {!subjectsLoading && !subjectsError && (
              <ul>
                {subjects.map((sub, index) => sub && (
                  <li key={sub.id || index} className="item">
                    <div className="item-header" onClick={() => toggleSubjectDetails(sub.id)}>
                      <span>{sub.nom}</span>
                      <button type="button" className="toggle-button">
                        {expandedSubject === sub.id ? '▼' : '▶'}
                      </button>
                    </div>
                    {expandedSubject === sub.id && (
                      <div className="item-details">
                        {editingSubjectId === sub.id ? (
                          <div className="form-container">
                            <h3>Modifier Matière</h3>
                            <input
                              type="text"
                              name="nom"
                              placeholder="Nom"
                              value={editSubjectData.nom}
                              onChange={handleEditSubjectChange}
                            />
                            <input
                              type="text"
                              name="code"
                              placeholder="Code"
                              value={editSubjectData.code}
                              onChange={handleEditSubjectChange}
                            />
                            <textarea
                              name="description"
                              placeholder="Description"
                              value={editSubjectData.description}
                              onChange={handleEditSubjectChange}
                            />
                            <select
                              name="statut"
                              value={editSubjectData.statut}
                              onChange={handleEditSubjectChange}
                              required
                            >
                              <option value="">Sélectionnez un statut</option>
                              <option value="optionnel">Optionnel</option>
                              <option value="requis">Requis</option>
                            </select>
                            <select
                              name="DepartmentId"
                              value={editSubjectData.DepartmentId}
                              onChange={handleEditSubjectChange}
                              required
                            >
                              <option value="">Sélectionnez un département</option>
                              {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                  {dept.nom}
                                </option>
                              ))}
                            </select>
                            <button type="button" onClick={() => handleEditSubjectSubmit(sub.id)}>
                              Enregistrer
                            </button>
                          </div>
                        ) : (
                          <>
                            <p><strong>ID :</strong> {subjectDetails[sub.id]?.id}</p>
                            <p><strong>Code :</strong> {subjectDetails[sub.id]?.code}</p>
                            <p><strong>Description :</strong> {subjectDetails[sub.id]?.description}</p>
                            <p><strong>Statut :</strong> {subjectDetails[sub.id]?.statut}</p>
                            {subjectDetails[sub.id]?.image ? (
                              <img
                                src={getPhotoUrl(subjectDetails[sub.id].image)}
                                alt="Image matière"
                                className="media"
                              />
                            ) : (
                              <p>Aucune image</p>
                            )}
                            <div>
                              <button type="button" className="edit-button" onClick={() => startEditingSubject(sub.id)}>
                                Modifier
                              </button>
                              <button type="button" className="delete-button" onClick={() => handleDeleteSubject(sub.id)}>
                                Supprimer
                              </button>
                            </div>
                            <div className="file-update-form">
                              <form onSubmit={(e) => handleSubjectImageSubmit(sub.id, e)}>
                                <label className="file-label">
                                  Choisir un fichier
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSubjectImageFile(e.target.files[0])}
                                  />
                                </label>
                                <button type="submit">Mettre à jour image</button>
                              </form>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartementsMatieres;
