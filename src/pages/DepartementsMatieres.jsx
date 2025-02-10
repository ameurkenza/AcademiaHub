// src/pages/DepartementsMatieres.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DepartementsMatieres.css';

const DOMAIN_URL = 'http://192.168.2.27:5000/api';

/** Charge un chemin d'image en blob URL. */
const chargerImage = async (imagePath) => {
  if (!imagePath) return null;
  try {
    const fullUrl =
      imagePath.startsWith('http://') || imagePath.startsWith('https://')
        ? imagePath
        : `http://192.168.2.27:5000/${imagePath.replace(/^\/+/, '')}`;
    const response = await fetch(fullUrl, { mode: 'cors' });
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('⚠️ Erreur lors du chargement de l’image :', error);
    return null;
  }
};

/** Construit l'URL finale pour un <img />. */
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
  return `http://192.168.2.27:5000/public/${trimmed.replace(/^\/+/, '')}`;
};

const DepartementsMatieres = () => {
  /*** ÉTATS DÉPARTEMENTS ***/
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState(null);
  const [expandedDepartment, setExpandedDepartment] = useState(null);

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

  /*** ÉTATS MATIÈRES ***/
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState({});

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

  /* ===================== CHARGEMENT INITIAL ===================== */
  useEffect(() => {
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

    fetchDepartments();
    fetchSubjects();
  }, []);

  /* ===================== DÉPARTEMENTS ===================== */
  const toggleDepartmentDetails = (deptId) => {
    setExpandedDepartment((prev) => (prev === deptId ? null : deptId));
  };

  const handleNewDepartmentChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentFileChange = (e) => {
    setNewDepartment((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newDepartment).forEach(([key, val]) => {
      formData.append(key, val);
    });
    try {
      const response = await axios.post(`${DOMAIN_URL}/departments`, formData);
      const createdDept =
        response.data?.data?.department ||
        response.data?.data ||
        { ...newDepartment, id: Date.now() };
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

  const handleDepartmentImageSubmit = async (deptId, e) => {
    e.preventDefault();
    if (!departmentImageFile) return;
    try {
      const formData = new FormData();
      formData.append('image', departmentImageFile);
      const response = await axios.put(`${DOMAIN_URL}/departments/${deptId}/image`, formData);
      const newImagePath = response.data?.data?.image || response.data.image;
      const newBlob = await chargerImage(newImagePath);
      setDepartments((prev) =>
        prev.map((d) => (d.id === deptId ? { ...d, image: newBlob } : d))
      );
      setDepartmentImageFile(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'image du département :", err);
    }
  };

  const handleDeleteDepartment = (deptId) => {
    axios.delete(`${DOMAIN_URL}/departments/${deptId}`)
      .then(() => {
        setDepartments((prev) => prev.filter((d) => d.id !== deptId));
      })
      .catch((err) => console.error('Erreur lors de la suppression du département :', err));
  };

  /* ===================== MATIÈRES ===================== */
  const handleNewSubjectChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectFileChange = (e) => {
    setNewSubject((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que DepartmentId est renseigné et correct
    if (!newSubject.DepartmentId) {
      console.error("Aucun département sélectionné. Impossible de créer la matière.");
      return;
    }
    const deptIdNumber = parseInt(newSubject.DepartmentId, 10);
    if (!deptIdNumber || deptIdNumber < 1) {
      console.error(`DepartmentId invalide : ${deptIdNumber}`);
      return;
    }

    const formData = new FormData();
    Object.entries(newSubject).forEach(([key, val]) => {
      if (key === 'DepartmentId') {
        formData.append(key, deptIdNumber);
      } else {
        formData.append(key, val);
      }
    });
    try {
      const response = await axios.post(`${DOMAIN_URL}/subjects`, formData);
      const createdSubject =
        response.data?.data?.subject ||
        response.data?.data ||
        { ...newSubject, id: Date.now() };
      let finalImage = null;
      if (createdSubject.image) {
        finalImage = await chargerImage(createdSubject.image);
      }
      setSubjects((prev) => [...prev, { ...createdSubject, image: finalImage }]);
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

  const toggleSubjectDetails = async (subjectId) => {
    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
      return;
    }
    setExpandedSubject(subjectId);
    try {
      const response = await axios.get(`${DOMAIN_URL}/subjects/${subjectId}`);
      let data = response.data?.data || response.data;
      if (data.image) {
        data.image = await chargerImage(data.image);
      }
      setSubjectDetails((prev) => ({ ...prev, [subjectId]: data }));
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de la matière :', err);
    }
  };

  const startEditingSubject = (subjectId) => {
    setEditingSubjectId(subjectId);
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

  const handleEditSubjectChange = (e) => {
    const { name, value } = e.target;
    setEditSubjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubjectSubmit = async (subjectId) => {
    try {
      const deptIdNumber = parseInt(editSubjectData.DepartmentId, 10) || null;
      const payload = { ...editSubjectData, DepartmentId: deptIdNumber };
      const response = await axios.put(`${DOMAIN_URL}/subjects/${subjectId}`, payload);
      const updatedSubject = response.data?.data || response.data;
      const oldSubject = subjects.find((s) => s.id === subjectId);
      const finalImage = oldSubject?.image || null;
      setSubjects((prev) =>
        prev.map((s) => (s.id === subjectId ? { ...updatedSubject, image: finalImage } : s))
      );
      setEditingSubjectId(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la matière :', err);
    }
  };

  const handleSubjectImageSubmit = async (subjectId, e) => {
    e.preventDefault();
    if (!subjectImageFile) return;
    try {
      const formData = new FormData();
      formData.append('image', subjectImageFile);
      const response = await axios.put(`${DOMAIN_URL}/subjects/${subjectId}/image`, formData);
      const newImagePath = response.data?.data?.image || response.data.image;
      const newBlob = await chargerImage(newImagePath);
      setSubjectDetails((prev) => ({
        ...prev,
        [subjectId]: { ...prev[subjectId], image: newBlob },
      }));
      setSubjects((prev) =>
        prev.map((s) => (s.id === subjectId ? { ...s, image: newBlob } : s))
      );
      setSubjectImageFile(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'image de la matière :", err);
    }
  };

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
