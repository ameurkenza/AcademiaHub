// src/pages/LaboratoiresEquipements.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LaboratoiresEquipements.css';

const DOMAIN_URL = 'http://192.168.2.27:5000/api';

/**
 * Tente de charger une image en blob URL.
 * Si ce n'est pas une chaîne ou si c'est vide/null, retourne null.
 */
const chargerImage = async (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return null;
  }
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

/**
 * Construit l'URL finale pour un élément <img />.
 */
const getPhotoUrl = (photo) => {
  if (!photo || typeof photo !== 'string') {
    return '';
  }
  if (photo.includes('undefined')) {
    return '';
  }
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

const LaboratoiresEquipements = () => {
  /* ========================= ÉTATS LABORATOIRES ========================= */
  const [labs, setLabs] = useState([]);
  const [labsLoading, setLabsLoading] = useState(true);
  const [labsError, setLabsError] = useState(null);
  const [expandedLab, setExpandedLab] = useState(null);

  const [newLab, setNewLab] = useState({
    nom: '',
    salle: '',
    information: '',
    DepartmentId: '',
    image: null,
  });
  const [editingLabId, setEditingLabId] = useState(null);
  const [editLabData, setEditLabData] = useState({
    nom: '',
    salle: '',
    information: '',
    DepartmentId: '',
  });
  const [labImageFile, setLabImageFile] = useState(null);

  /* ========================= ÉTATS ÉQUIPEMENTS ========================= */
  const [equips, setEquips] = useState([]);
  const [equipsLoading, setEquipsLoading] = useState(true);
  const [equipsError, setEquipsError] = useState(null);
  const [expandedEquip, setExpandedEquip] = useState(null);

  const [newEquip, setNewEquip] = useState({
    nom: '',
    modele: '',
    description: '',
    image: null,
  });
  const [editingEquipId, setEditingEquipId] = useState(null);
  const [editEquipData, setEditEquipData] = useState({
    nom: '',
    modele: '',
    description: '',
  });
  const [equipImageFile, setEquipImageFile] = useState(null);

  /* ========================= CHARGEMENT INITIAL ========================= */
  useEffect(() => {
    // Charger laboratoires
    const fetchLabs = async () => {
      try {
        const res = await axios.get(`${DOMAIN_URL}/laboratories`);
        let labsData = res.data?.data?.laboratories || [];
        const loadedLabs = await Promise.all(
          labsData.map(async (lab) => {
            if (typeof lab.image === 'string') {
              const blobUrl = await chargerImage(lab.image);
              return { ...lab, image: blobUrl };
            }
            return lab;
          })
        );
        setLabs(loadedLabs);
        setLabsLoading(false);
      } catch (err) {
        console.error('Error fetching laboratories:', err);
        setLabsError(err);
        setLabsLoading(false);
      }
    };

    // Charger équipements
    const fetchEquips = async () => {
      try {
        const res = await axios.get(`${DOMAIN_URL}/equipment`);
        let equipsData = res.data?.data?.equipments || [];
        const loadedEquips = await Promise.all(
          equipsData.map(async (equip) => {
            if (typeof equip.image === 'string') {
              const blobUrl = await chargerImage(equip.image);
              return { ...equip, image: blobUrl };
            }
            return equip;
          })
        );
        setEquips(loadedEquips);
        setEquipsLoading(false);
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setEquipsError(err);
        setEquipsLoading(false);
      }
    };

    fetchLabs();
    fetchEquips();
  }, []);

  /* ========================= FONCTIONS LABORATOIRES ========================= */
  const toggleLabDetails = (labId) => {
    setExpandedLab((prev) => (prev === labId ? null : labId));
  };

  const handleNewLabChange = (e) => {
    const { name, value } = e.target;
    setNewLab((prev) => ({ ...prev, [name]: value }));
  };
  const handleLabFileChange = (e) => {
    setNewLab((prev) => ({ ...prev, image: e.target.files[0] }));
  };
  const handleLabSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newLab).forEach(([key, val]) => {
      if (key === 'DepartmentId' && val !== '') {
        formData.append(key, parseInt(val, 10));
      } else {
        formData.append(key, val);
      }
    });
    try {
      const response = await axios.post(`${DOMAIN_URL}/laboratories`, formData);
      const createdLab =
        response.data?.data?.laboratory ||
        response.data?.data ||
        { ...newLab, id: Date.now() };
      if (typeof createdLab.image === 'string') {
        const finalImage = await chargerImage(createdLab.image);
        createdLab.image = finalImage;
      }
      setLabs((prev) => [...prev, createdLab]);
      setNewLab({
        nom: '',
        salle: '',
        information: '',
        DepartmentId: '',
        image: null,
      });
    } catch (err) {
      console.error('Error creating laboratory:', err);
    }
  };

  const startEditingLab = (labId) => {
    setEditingLabId(labId);
    const lab = labs.find((l) => l.id === labId);
    if (lab) {
      setEditLabData({
        nom: lab.nom || '',
        salle: lab.salle || '',
        information: lab.information || '',
        DepartmentId: lab.DepartmentId || '',
      });
    }
  };
  const handleEditLabChange = (e) => {
    const { name, value } = e.target;
    setEditLabData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditLabSubmit = async (labId) => {
    try {
      const payload = {
        ...editLabData,
        DepartmentId: editLabData.DepartmentId ? parseInt(editLabData.DepartmentId, 10) : null,
      };
      const response = await axios.put(`${DOMAIN_URL}/laboratories/${labId}`, payload);
      const updatedLab = response.data?.data || response.data;
      const oldLab = labs.find((l) => l.id === labId);
      const oldImage = oldLab?.image || null;
      setLabs((prev) =>
        prev.map((l) => (l.id === labId ? { ...updatedLab, image: oldImage } : l))
      );
      setEditingLabId(null);
    } catch (err) {
      console.error('Error updating laboratory:', err);
    }
  };

  const handleLabImageSubmit = async (labId, e) => {
    e.preventDefault();
    if (!labImageFile) return;
    try {
      const formData = new FormData();
      formData.append('image', labImageFile);
      const response = await axios.put(`${DOMAIN_URL}/laboratories/${labId}/image`, formData);
      const newImagePath = response.data?.data?.image || response.data.image;
      const newBlob = await chargerImage(newImagePath);
      setLabs((prev) =>
        prev.map((l) => (l.id === labId ? { ...l, image: newBlob } : l))
      );
      setLabImageFile(null);
    } catch (err) {
      console.error('Error updating lab image:', err);
    }
  };

  const handleDeleteLab = async (labId) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce laboratoire ?')) {
      try {
        await axios.delete(`${DOMAIN_URL}/laboratories/${labId}`);
        setLabs((prev) => prev.filter((l) => l.id !== labId));
      } catch (err) {
        console.error('Error deleting laboratory:', err);
      }
    }
  };

  /* ========================= FONCTIONS ÉQUIPEMENTS ========================= */
  const toggleEquipDetails = (equipId) => {
    setExpandedEquip((prev) => (prev === equipId ? null : equipId));
  };

  const handleNewEquipChange = (e) => {
    const { name, value } = e.target;
    setNewEquip((prev) => ({ ...prev, [name]: value }));
  };
  const handleEquipFileChange = (e) => {
    setNewEquip((prev) => ({ ...prev, image: e.target.files[0] }));
  };
  const handleEquipSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newEquip).forEach(([key, val]) => {
      formData.append(key, val);
    });
    try {
      const response = await axios.post(`${DOMAIN_URL}/equipment`, formData);
      const createdEquip =
        response.data?.data?.equipment ||
        response.data?.data ||
        { ...newEquip, id: Date.now() };
      if (typeof createdEquip.image === 'string') {
        const finalImage = await chargerImage(createdEquip.image);
        createdEquip.image = finalImage;
      }
      setEquips((prev) => [...prev, createdEquip]);
      setNewEquip({
        nom: '',
        modele: '',
        description: '',
        image: null,
      });
    } catch (err) {
      console.error('Error creating equipment:', err);
    }
  };

  const startEditingEquip = (equipId) => {
    setEditingEquipId(equipId);
    const equip = equips.find((e) => e.id === equipId);
    if (equip) {
      setEditEquipData({
        nom: equip.nom || '',
        modele: equip.modele || '',
        description: equip.description || '',
      });
    }
  };
  const handleEditEquipChange = (e) => {
    const { name, value } = e.target;
    setEditEquipData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditEquipSubmit = async (equipId) => {
    try {
      const response = await axios.put(`${DOMAIN_URL}/equipment/${equipId}`, editEquipData);
      const updatedEquip = response.data?.data || response.data;
      const oldEquip = equips.find((eq) => eq.id === equipId);
      const oldImage = oldEquip?.image || null;
      setEquips((prev) =>
        prev.map((eq) => (eq.id === equipId ? { ...updatedEquip, image: oldImage } : eq))
      );
      setEditingEquipId(null);
    } catch (err) {
      console.error('Error updating equipment:', err);
    }
  };

  const handleEquipImageSubmit = async (equipId, e) => {
    e.preventDefault();
    if (!equipImageFile) return;
    try {
      const formData = new FormData();
      formData.append('image', equipImageFile);
      const response = await axios.put(`${DOMAIN_URL}/equipment/${equipId}/image`, formData);
      const newImagePath = response.data?.data?.image || response.data.image;
      const newBlob = await chargerImage(newImagePath);
      setEquips((prev) =>
        prev.map((eq) => (eq.id === equipId ? { ...eq, image: newBlob } : eq))
      );
      setEquipImageFile(null);
    } catch (err) {
      console.error('Error updating equipment image:', err);
    }
  };

  const handleDeleteEquip = async (equipId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet équipement ?')) {
      try {
        await axios.delete(`${DOMAIN_URL}/equipment/${equipId}`);
        setEquips((prev) => prev.filter((e) => e.id !== equipId));
      } catch (err) {
        console.error('Error deleting equipment:', err);
      }
    }
  };

  return (
    <div className="laboratoires-equipements-page">
      <h1 className="page-title">Gestion des Laboratoires & Équipements</h1>
      <div className="columns-container">
        {/* COLONNE LABORATOIRES */}
        <div className="lab-column">
          <div className="column-header">
            <h2>Laboratoires</h2>
          </div>
          <div className="form-container">
            <h3>Ajouter un Laboratoire</h3>
            <form onSubmit={handleLabSubmit}>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={newLab.nom}
                onChange={handleNewLabChange}
                required
              />
              <input
                type="text"
                name="salle"
                placeholder="Salle"
                value={newLab.salle}
                onChange={handleNewLabChange}
                required
              />
              <input
                type="text"
                name="information"
                placeholder="Information"
                value={newLab.information}
                onChange={handleNewLabChange}
                required
              />
              <input
                type="text"
                name="DepartmentId"
                placeholder="ID Département"
                value={newLab.DepartmentId}
                onChange={handleNewLabChange}
              />
              <label className="file-label">
                Choisir un fichier
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleLabFileChange}
                />
              </label>
              <button type="submit">Ajouter</button>
            </form>
          </div>
          <div className="list-container">
            {labsLoading && <p>Chargement des laboratoires...</p>}
            {labsError && <p>Erreur : {labsError.message}</p>}
            {!labsLoading && !labsError && (
              <ul>
                {labs.map((lab, index) => lab && (
                  <li key={lab.id || index} className="item">
                    <div className="item-header" onClick={() => toggleLabDetails(lab.id)}>
                      <span>{lab.nom}</span>
                      <button type="button" className="toggle-button">
                        {expandedLab === lab.id ? '▲' : '▼'}
                      </button>
                    </div>
                    {expandedLab === lab.id && (
                      <div className="item-details">
                        {editingLabId === lab.id ? (
                          <div className="form-container">
                            <h3>Modifier Laboratoire</h3>
                            <input
                              type="text"
                              name="nom"
                              placeholder="Nom"
                              value={editLabData.nom}
                              onChange={handleEditLabChange}
                            />
                            <input
                              type="text"
                              name="salle"
                              placeholder="Salle"
                              value={editLabData.salle}
                              onChange={handleEditLabChange}
                            />
                            <input
                              type="text"
                              name="information"
                              placeholder="Information"
                              value={editLabData.information}
                              onChange={handleEditLabChange}
                            />
                            <input
                              type="text"
                              name="DepartmentId"
                              placeholder="ID Département"
                              value={editLabData.DepartmentId}
                              onChange={handleEditLabChange}
                            />
                            <button type="button" onClick={() => handleEditLabSubmit(lab.id)}>
                              Enregistrer
                            </button>
                          </div>
                        ) : (
                          <>
                            <p><strong>ID :</strong> {lab.id}</p>
                            <p><strong>Salle :</strong> {lab.salle}</p>
                            <p><strong>Information :</strong> {lab.information}</p>
                            {lab.image ? (
                              <img
                                src={getPhotoUrl(lab.image)}
                                alt="Image laboratoire"
                                className="media"
                              />
                            ) : (
                              <p>Aucune image disponible.</p>
                            )}
                            <div>
                              <button type="button" className="edit-button" onClick={() => startEditingLab(lab.id)}>
                                Éditer
                              </button>
                              <button type="button" className="delete-button" onClick={() => handleDeleteLab(lab.id)}>
                                Supprimer
                              </button>
                            </div>
                            <div className="file-update-form">
                              <form onSubmit={(e) => handleLabImageSubmit(lab.id, e)}>
                                <label className="file-label">
                                  Choisir un fichier
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setLabImageFile(e.target.files[0])}
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

        {/* COLONNE ÉQUIPEMENTS */}
        <div className="equip-column">
          <div className="column-header">
            <h2>Équipements</h2>
          </div>
          <div className="form-container">
            <h3>Ajouter un Équipement</h3>
            <form onSubmit={handleEquipSubmit}>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={newEquip.nom}
                onChange={handleNewEquipChange}
                required
              />
              <input
                type="text"
                name="modele"
                placeholder="Modèle"
                value={newEquip.modele}
                onChange={handleNewEquipChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newEquip.description}
                onChange={handleNewEquipChange}
                required
              />
              <label className="file-label">
                Choisir un fichier
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleEquipFileChange}
                />
              </label>
              <button type="submit">Ajouter</button>
            </form>
          </div>
          <div className="list-container">
            {equipsLoading && <p>Chargement des équipements...</p>}
            {equipsError && <p>Erreur : {equipsError.message}</p>}
            {!equipsLoading && !equipsError && (
              <ul>
                {equips.map((equip, index) => equip && (
                  <li key={equip.id || index} className="item">
                    <div className="item-header" onClick={() => toggleEquipDetails(equip.id)}>
                      <span>{equip.nom}</span>
                      <button type="button" className="toggle-button">
                        {expandedEquip === equip.id ? '▲' : '▼'}
                      </button>
                    </div>
                    {expandedEquip === equip.id && (
                      <div className="item-details">
                        {editingEquipId === equip.id ? (
                          <div className="form-container">
                            <h3>Modifier Équipement</h3>
                            <input
                              type="text"
                              name="nom"
                              placeholder="Nom"
                              value={editEquipData.nom}
                              onChange={handleEditEquipChange}
                            />
                            <input
                              type="text"
                              name="modele"
                              placeholder="Modèle"
                              value={editEquipData.modele}
                              onChange={handleEditEquipChange}
                            />
                            <input
                              type="text"
                              name="description"
                              placeholder="Description"
                              value={editEquipData.description}
                              onChange={handleEditEquipChange}
                            />
                            <button type="button" onClick={() => handleEditEquipSubmit(equip.id)}>
                              Enregistrer
                            </button>
                          </div>
                        ) : (
                          <>
                            <p><strong>ID :</strong> {equip.id}</p>
                            <p><strong>Modèle :</strong> {equip.modele}</p>
                            <p><strong>Description :</strong> {equip.description}</p>
                            {equip.image ? (
                              <img
                                src={getPhotoUrl(equip.image)}
                                alt="Image équipement"
                                className="media"
                              />
                            ) : (
                              <p>Aucune image disponible.</p>
                            )}
                            <div>
                              <button type="button" className="edit-button" onClick={() => startEditingEquip(equip.id)}>
                                Éditer
                              </button>
                              <button type="button" className="delete-button" onClick={() => handleDeleteEquip(equip.id)}>
                                Supprimer
                              </button>
                            </div>
                            <div className="file-update-form">
                              <form onSubmit={(e) => handleEquipImageSubmit(equip.id, e)}>
                                <label className="file-label">
                                  Choisir un fichier
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEquipImageFile(e.target.files[0])}
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

export default LaboratoiresEquipements;
