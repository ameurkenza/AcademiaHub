// src/pages/UtilisateursRoles.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UtilisateursRoles.css';

const DOMAIN_URL = import.meta.env.VITE_SERVER_URL;




/**
 * Charge une image depuis un chemin ou une URL fournie.
 * Si l'argument n'est pas une chaîne, est vide ou contient "undefined", retourne null.
 */
const chargerImage = async (imagePath) => {
  if (!imagePath) return null;
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




/**
 * Construit l'URL finale pour l'affichage d'une image.
 * Si la chaîne est vide, nulle ou contient "undefined", retourne null.
 */


// ===================== FONCTIONS POUR LES EFFETS =====================
const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  const birthDate = new Date(birthdate);
  const diffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const getConduiteStyle = (conduite) => {
  if (!conduite) return {};
  const lower = conduite.toLowerCase();
  if (lower.includes('excellente')) {
    return { backgroundColor: 'green', color: 'white', padding: '2px 5px' };
  } else if (lower.includes('bonne')) {
    return { backgroundColor: 'lightgreen', color: 'black', padding: '2px 5px' };
  }
  return {};
};

const getAgeStyle = (age) => {
  if (age === null) return {};
  if (age < 18) return { color: 'red' };
  if (age >= 18 && age < 50) return { color: 'blue' };
  return { color: 'purple' };
};

const getStatutStyle = (statut) => {
  if (!statut) return {};
  const lower = statut.toLowerCase();
  if (lower === 'actif' || lower === 'active') {
    return { backgroundColor: 'green', color: 'white', padding: '2px 5px' };
  } else if (lower === 'inactif' || lower === 'inactive') {
    return { backgroundColor: 'red', color: 'white', padding: '2px 5px' };
  }
  return {};
};

const UtilisateursRoles = () => {
  /*** GESTION DES UTILISATEURS ***/
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({});
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    mot_de_passe: '',
    photo: null,
    email: '',
    naissance: '',
    biographie: '',
    conduite: '',
    DepartmentId: ''
  });
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [userDepartment, setUserDepartment] = useState({});
  const [userSubjects, setUserSubjects] = useState({});
  const [selectedUserRoles, setSelectedUserRoles] = useState([]);
  const [selectedUserSubjects, setSelectedUserSubjects] = useState([]);

  /*** GESTION DES RÔLES ***/
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);
  const [expandedRole, setExpandedRole] = useState(null);
  const [roleDetails, setRoleDetails] = useState({});
  const [newRole, setNewRole] = useState({ titre: '' });

  /*** GESTION DES MATIÈRES ***/
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
    LaboratoryId: ''
  });
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editSubjectData, setEditSubjectData] = useState({});
  const [subjectImageFile, setSubjectImageFile] = useState(null);

  /*** GESTION DES DÉPARTEMENTS ET LABORATOIRES ***/
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState(null);

  const [laboratories, setLaboratories] = useState([]);
  const [laboratoriesLoading, setLaboratoriesLoading] = useState(true);
  const [laboratoriesError, setLaboratoriesError] = useState(null);

  useEffect(() => {
    // Charger les utilisateurs
    axios.get(`${DOMAIN_URL}/users`)
      .then(response => {
        setUsers(response.data?.data?.users || []);
        setUsersLoading(false);
      })
      .catch(err => {
        console.error("⚠️ Erreur lors du chargement des utilisateurs :", err);
        setUsersError(err);
        setUsersLoading(false);
      });
  //Charger les roles
  axios.get(`${DOMAIN_URL}/roles`)
  .then(response => {
    console.log("✅ Rôles récupérés :", response.data);
    const rolesData = response.data.data || [];
    setRoles(rolesData);
    setRolesLoading(false);

    // 🔄 **Nouvelle étape** : Récupération des utilisateurs pour chaque rôle
    Promise.all(
      rolesData.map(role =>
        axios.get(`${DOMAIN_URL}/roles/${role.id}/users`)
          .then(res => ({
            ...role,
            users: res.data.users || [] // Ajout des utilisateurs au rôle
          }))
          .catch(err => {
            console.error(`⚠️ Erreur lors du chargement des utilisateurs pour le rôle ${role.id}:`, err);
            return { ...role, users: [] }; // Assure que chaque rôle a une liste vide si erreur
          })
      )
    ).then(rolesWithUsers => {
      const roleDetailsMap = {};
      rolesWithUsers.forEach(role => {
        roleDetailsMap[role.id] = role; // Stocke chaque rôle avec ses utilisateurs
      });

      console.log("✅ Détails des rôles mis à jour :", roleDetailsMap); // Vérifie si les utilisateurs sont bien là
      setRoleDetails(roleDetailsMap);

      // ✅ Ajout du console.log pour voir `roleDetails` après la mise à jour
      console.log("👀 Utilisateurs pour chaque rôle :", roleDetailsMap);
    });
  })
  .catch(err => {
    console.error("⚠️ Erreur lors du chargement des rôles :", err);
    setRolesError(err);
    setRolesLoading(false);
  });

    
  
    // Charger les matières
    axios.get(`${DOMAIN_URL}/subjects`)
      .then(response => {
        setSubjects(response.data?.data?.subjects || []);
        setSubjectsLoading(false);
      })
      .catch(err => {
        console.error("⚠️ Erreur lors du chargement des matières :", err);
        setSubjectsError(err);
        setSubjectsLoading(false);
      });
  
    // Charger les départements
    axios.get(`${DOMAIN_URL}/departments`)
      .then(response => {
        setDepartments(response.data?.data?.departments || []);
        setDepartmentsLoading(false);
      })
      .catch(err => {
        console.error("⚠️ Erreur lors du chargement des départements :", err);
        setDepartmentsError(err);
        setDepartmentsLoading(false);
      });
  
    // Charger les laboratoires
    axios.get(`${DOMAIN_URL}/laboratories`)
      .then(response => {
        setLaboratories(response.data?.data?.laboratories || []);
        setLaboratoriesLoading(false);
      })
      .catch(err => {
        console.error("⚠️ Erreur lors du chargement des laboratoires :", err);
        setLaboratoriesError(err);
        setLaboratoriesLoading(false);
      });
  
  }, []);
  
  /* ===================== FONCTIONS UTILISATEURS ===================== */
  const toggleUserDetails = async (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }
    setExpandedUser(userId);
    try {
      const res = await axios.get(`${DOMAIN_URL}/users/${userId}`);
      let data = res.data?.data || res.data;
      if (data.photo) {
        data.photo = await chargerImage(data.photo);
      }
      setUserDetails(prev => ({ ...prev, [userId]: data }));

      const resDept = await axios.get(`${DOMAIN_URL}/users/${userId}/department`);
      setUserDepartment(prev => ({ ...prev, [userId]: resDept.data?.data || resDept.data }));

      const resSubs = await axios.get(`${DOMAIN_URL}/users/${userId}/subjects`);
      let subsData = resSubs.data?.data?.subjects || resSubs.data;
      if (!Array.isArray(subsData)) subsData = [subsData];
      setUserSubjects(prev => ({ ...prev, [userId]: subsData }));
    } catch (err) {
      console.error("⚠️ Erreur lors du chargement des détails de l'utilisateur :", err);
    }
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUserFileChange = (e) => {
    setNewUser(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newUser).forEach(([key, val]) => {
      formData.append(key, key === 'DepartmentId' ? Number(val) : val);
    });
    axios.post(`${DOMAIN_URL}/users`, formData)
      .then(response => {
        const createdUser = response.data.data?.user || response.data.data || { ...newUser, id: Date.now() };
        setUsers(prev => [...prev, createdUser]);
        setNewUser({
          nom: '',
          prenom: '',
          mot_de_passe: '',
          photo: null,
          email: '',
          naissance: '',
          biographie: '',
          conduite: '',
          DepartmentId: ''
        });
      })
      .catch(err => console.error("⚠️ Erreur lors de l'ajout de l'utilisateur :", err));
  };

  const startEditingUser = (userId) => {
    setEditingUserId(userId);
    const user = userDetails[userId] || users.find(u => u.id === userId);
    setEditUserData({
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      mot_de_passe: '',
      naissance: user?.naissance || '',
      biographie: user?.biographie || '',
      conduite: user?.conduite || '',
      DepartmentId: user?.DepartmentId || ''
    });
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditUserSubmit = (userId) => {
    axios.put(`${DOMAIN_URL}/users/${userId}`, editUserData)
      .then(response => {
        const updated = response.data.data || response.data;
        setUsers(prev => prev.map(u => (u.id === userId ? updated : u)));
        setEditingUserId(null);
      })
      .catch(err => console.error("⚠️ Erreur lors de la mise à jour de l'utilisateur :", err));
  };

  const handleUserPhotoSubmit = async (userId, e) => {
    e.preventDefault();
    if (userPhotoFile) {
      const formData = new FormData();
      formData.append('photo', userPhotoFile);
      axios.put(`${DOMAIN_URL}/users/${userId}/photo`, formData)
        .then(async response => {
          const newPhotoPath = response.data.data?.photo || response.data.photo;
          const updatedPhoto = await chargerImage(newPhotoPath);
          setUserDetails(prev => ({
            ...prev,
            [userId]: { ...prev[userId], photo: updatedPhoto }
          }));
          setUserPhotoFile(null);
        })
        .catch(err => console.error("⚠️ Erreur lors de la mise à jour de la photo :", err));
    }
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`${DOMAIN_URL}/users/${userId}`)
      .then(() => {
        setUsers(prev => prev.filter(u => u.id !== userId));
      })
      .catch(err => console.error("⚠️ Erreur lors de la suppression de l'utilisateur :", err));
  };

  const handleAssignRoles = (userId) => {
    axios.post(`${DOMAIN_URL}/users/${userId}/roles`, { ids: selectedUserRoles })
      .then(() => {
        alert('Rôles assignés avec succès');
      })
      .catch(err => console.error("⚠️ Erreur lors de l'affectation des rôles :", err));
  };

  const handleAssignSubjects = (userId) => {
    axios.post(`${DOMAIN_URL}/users/${userId}/subjects`, { ids: selectedUserSubjects })
      .then(() => {
        alert('Matières assignées avec succès');
        axios.get(`${DOMAIN_URL}/users/${userId}/subjects`)
          .then(response => {
            let subsData = response.data.data?.subjects || response.data;
            if (!Array.isArray(subsData)) subsData = [subsData];
            setUserSubjects(prev => ({ ...prev, [userId]: subsData }));
          });
      })
      .catch(err => console.error("⚠️ Erreur lors de l'affectation des matières :", err));
  };

  /* ===================== FONCTIONS RÔLES ===================== */
  const handleRoleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${DOMAIN_URL}/roles`, newRole)
      .then(response => {
        const createdRole = response.data.data?.role || response.data.data || { ...newRole, id: Date.now() };
        setRoles(prev => [...prev, createdRole]);
        setNewRole({ titre: '' });
      })
      .catch(err => console.error("⚠️ Erreur lors de la création du rôle :", err));
  };

  const toggleRoleDetails = (roleId) => {
    if (expandedRole === roleId) {
      setExpandedRole(null);
    } else {
      setExpandedRole(roleId);
      axios.get(`${DOMAIN_URL}/roles/${roleId}`)
        .then(response => {
          setRoleDetails(prev => ({ ...prev, [roleId]: response.data.data || response.data }));
        })
        .catch(err => console.error("⚠️ Erreur lors du chargement des détails du rôle :", err));
    }
  };

  const handleDeleteRole = (roleId) => {
    axios.delete(`${DOMAIN_URL}/roles/${roleId}`)
      .then(() => {
        setRoles(prev => prev.filter(r => r.id !== roleId));
      })
      .catch(err => console.error("⚠️ Erreur lors de la suppression du rôle :", err));
  };

  /* ===================== FONCTIONS MATIÈRES ===================== */
  const handleSubjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectFileChange = (e) => {
    setNewSubject(prev => ({ ...prev, image: e.target.files[0] }));
  };

  // Version simplifiée et explicite de handleSubjectSubmit
  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    // Validation préalable des champs obligatoires
    if (
      !newSubject.nom ||
      !newSubject.code ||
      !newSubject.statut ||
      !newSubject.DepartmentId ||
      !newSubject.LaboratoryId
    ) {
      console.error("⚠️ Tous les champs obligatoires doivent être renseignés.");
      return;
    }

    const formData = new FormData();
    formData.append('nom', newSubject.nom);
    formData.append('code', newSubject.code);
    formData.append('description', newSubject.description);
    formData.append('statut', newSubject.statut);
    formData.append('DepartmentId', Number(newSubject.DepartmentId));
    formData.append('LaboratoryId', Number(newSubject.LaboratoryId));
    if (newSubject.image) {
      formData.append('image', newSubject.image);
    }

    axios.post(`${DOMAIN_URL}/subjects`, formData)
      .then(response => {
        const createdSubject = response.data.data?.subject || response.data.data || { ...newSubject, id: Date.now() };
        setSubjects(prev => [...prev, createdSubject]);
        // Réinitialisation du formulaire
        setNewSubject({
          nom: '',
          code: '',
          description: '',
          statut: '',
          image: null,
          DepartmentId: '',
          LaboratoryId: ''
        });
      })
      .catch(err => console.error("⚠️ Erreur lors de la création de la matière :", err));
  };

  const toggleSubjectDetails = (subjectId) => {
    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
    } else {
      setExpandedSubject(subjectId);
      axios.get(`${DOMAIN_URL}/subjects/${subjectId}`)
        .then(response => {
          setSubjectDetails(prev => ({ ...prev, [subjectId]: response.data.data || response.data }));
        })
        .catch(err => console.error("⚠️ Erreur lors du chargement des détails de la matière :", err));
    }
  };

  const startEditingSubject = (subjectId) => {
    setEditingSubjectId(subjectId);
    const subject = subjectDetails[subjectId] || subjects.find(s => s.id === subjectId);
    setEditSubjectData({
      nom: subject?.nom || '',
      code: subject?.code || '',
      description: subject?.description || '',
      statut: subject?.statut || '',
      DepartmentId: subject?.DepartmentId || '',
      LaboratoryId: subject?.LaboratoryId || ''
    });
  };

  const handleEditSubjectChange = (e) => {
    const { name, value } = e.target;
    setEditSubjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubjectSubmit = (subjectId) => {
    axios.put(`${DOMAIN_URL}/subjects/${subjectId}`, editSubjectData)
      .then(response => {
        const updated = response.data.data || response.data;
        setSubjects(prev => prev.map(s => (s.id === subjectId ? updated : s)));
        setEditingSubjectId(null);
      })
      .catch(err => console.error("⚠️ Erreur lors de la mise à jour de la matière :", err));
  };

  const handleSubjectImageSubmit = (subjectId, e) => {
    e.preventDefault();
    if (subjectImageFile) {
      const formData = new FormData();
      formData.append('image', subjectImageFile);
      axios.put(`${DOMAIN_URL}/subjects/${subjectId}/image`, formData)
        .then(async response => {
          const newImagePath = response.data.data?.image || response.data.image;
          const updatedImage = await chargerImage(newImagePath);
          setSubjectDetails(prev => ({
            ...prev,
            [subjectId]: { ...prev[subjectId], image: updatedImage }
          }));
          setSubjects(prev =>
            prev.map(s => (s.id === subjectId ? { ...s, image: updatedImage } : s))
          );
          setSubjectImageFile(null);
        })
        .catch(err => console.error("⚠️ Erreur lors de la mise à jour de l'image de la matière :", err));
    }
  };

  const handleDeleteSubject = (subjectId) => {
    axios.delete(`${DOMAIN_URL}/subjects/${subjectId}`)
      .then(() => {
        setSubjects(prev => prev.filter(s => s.id !== subjectId));
      })
      .catch(err => console.error("⚠️ Erreur lors de la suppression de la matière :", err));
  };

  console.log("🎯 Rôles:", roles);
console.log("📌 Détails des rôles:", roleDetails);

  /* ===================== RENDU (JSX) ===================== */
  return (
    <div className="utilisateurs-roles-page">
      <h1 className="page-title">Gestion des Utilisateurs & Rôles</h1>
      <div className="columns-container">
        {/* COLONNE UTILISATEURS */}
        <div className="user-column">
          <h2 className="column-header">Utilisateurs</h2>
          <div className="form-container">
            <h3>Ajouter un Utilisateur</h3>
            <form onSubmit={handleUserSubmit}>
              <input type="text" name="nom" placeholder="Nom" value={newUser.nom} onChange={handleUserInputChange} required />
              <input type="text" name="prenom" placeholder="Prénom" value={newUser.prenom} onChange={handleUserInputChange} required />
              <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleUserInputChange} required />
              <input type="password" name="mot_de_passe" placeholder="Mot de passe" value={newUser.mot_de_passe} onChange={handleUserInputChange} required />
              <input type="date" name="naissance" placeholder="Naissance" value={newUser.naissance} onChange={handleUserInputChange} required />
              <textarea name="biographie" placeholder="Biographie" value={newUser.biographie} onChange={handleUserInputChange}></textarea>
              <input type="text" name="conduite" placeholder="Conduite" value={newUser.conduite} onChange={handleUserInputChange} />
              {departmentsLoading ? (
                <p>Chargement des départements...</p>
              ) : (
                <select name="DepartmentId" value={newUser.DepartmentId} onChange={handleUserInputChange} required>
                  <option value="">Sélectionnez un département</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.nom}</option>
                  ))}
                </select>
              )}
              <input type="file" accept="image/*" onChange={handleUserFileChange} />
              <button type="submit">Ajouter</button>
            </form>
          </div>
          <div className="list-container">
            {usersLoading && <p>Chargement des utilisateurs...</p>}
            {usersError && <p>Erreur : {usersError.message}</p>}
            {!usersLoading && !usersError && (
              <ul>
                {users.map(user => (
                  <li key={user.id} className="item">
                    <div className="item-header" onClick={() => toggleUserDetails(user.id)}>
                      <span>{user.nom} {user.prenom}</span>
                      <button className="toggle-button">
                        {expandedUser === user.id ? '▼' : '▶'}
                      </button>
                    </div>
                    {expandedUser === user.id && (
                      <div className="item-details">
                        {editingUserId === user.id ? (
                          <div className="form-container">
                            <h3>Modifier Utilisateur</h3>
                            <input type="text" name="nom" placeholder="Nom" value={editUserData.nom || ''} onChange={handleEditUserChange} />
                            <input type="text" name="prenom" placeholder="Prénom" value={editUserData.prenom || ''} onChange={handleEditUserChange} />
                            <input type="email" name="email" placeholder="Email" value={editUserData.email || ''} onChange={handleEditUserChange} />
                            <input type="password" name="mot_de_passe" placeholder="Mot de passe" value={editUserData.mot_de_passe || ''} onChange={handleEditUserChange} />
                            <input type="date" name="naissance" placeholder="Naissance" value={editUserData.naissance || ''} onChange={handleEditUserChange} />
                            <textarea name="biographie" placeholder="Biographie" value={editUserData.biographie || ''} onChange={handleEditUserChange}></textarea>
                            <input type="text" name="conduite" placeholder="Conduite" value={editUserData.conduite || ''} onChange={handleEditUserChange} />
                            {departmentsLoading ? (
                              <p>Chargement des départements...</p>
                            ) : (
                              <select name="DepartmentId" value={editUserData.DepartmentId || ''} onChange={handleEditUserChange} required>
                                <option value="">Sélectionnez un département</option>
                                {departments.map(dept => (
                                  <option key={dept.id} value={dept.id}>{dept.nom}</option>
                                ))}
                              </select>
                            )}
                            <button onClick={() => handleEditUserSubmit(user.id)}>Enregistrer</button>
                          </div>
                        ) : (
                          <>
                            <p><strong>ID :</strong> {userDetails[user.id]?.id}</p>
                            <p><strong>Email :</strong> {userDetails[user.id]?.email}</p>
                            <p><strong>Naissance :</strong> {userDetails[user.id]?.naissance}</p>
                            {userDetails[user.id]?.naissance && (
                              <p>
                                <strong>Âge :</strong> <span style={getAgeStyle(calculateAge(userDetails[user.id]?.naissance))}>
                                  {calculateAge(userDetails[user.id]?.naissance)} ans
                                </span>
                              </p>
                            )}
                            <p><strong>Biographie :</strong> {userDetails[user.id]?.biographie}</p>
                            <p>
                              <strong>Conduite :</strong> <span style={getConduiteStyle(userDetails[user.id]?.conduite)}>
                                {userDetails[user.id]?.conduite}
                              </span>
                            </p>
                            {userDepartment[user.id] && (
                              <p><strong>Département :</strong> {userDepartment[user.id].nom}</p>
                            )}
                            {userDetails[user.id]?.photo && getPhotoUrl(userDetails[user.id].photo) ? (
                              <img src={getPhotoUrl(userDetails[user.id].photo)} alt="Photo utilisateur" className="media" />
                            ) : (
                              <p>Aucune photo disponible</p>
                            )}
                            <div>
                              <button className="edit-button" onClick={() => startEditingUser(user.id)}>Éditer</button>
                              <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                            </div>
                            <div className="file-update-form">
                              <form onSubmit={(e) => handleUserPhotoSubmit(user.id, e)}>
                                <input type="file" accept="image/*" onChange={(e) => setUserPhotoFile(e.target.files[0])} />
                                <button type="submit">Mettre à jour photo</button>
                              </form>
                            </div>
                            <div className="form-container">
                              <h3>Affecter des Rôles</h3>
                              <select multiple className="multi-select" onChange={(e) => {
                                  const opts = Array.from(e.target.selectedOptions);
                                  setSelectedUserRoles(opts.map(opt => opt.value));
                                }}>
                                {roles.map(r => (
                                  <option key={r.id} value={r.id}>{r.titre}</option>
                                ))}
                              </select>
                              <button onClick={() => handleAssignRoles(user.id)}>Affecter Rôles</button>
                            </div>
                            <div className="form-container">
                              <h3>Affecter des Matières</h3>
                              <select multiple className="multi-select" onChange={(e) => {
                                  const opts = Array.from(e.target.selectedOptions);
                                  setSelectedUserSubjects(opts.map(opt => opt.value));
                                }}>
                                {subjects.map(s => (
                                  <option key={s.id} value={s.id}>{s.nom}</option>
                                ))}
                              </select>
                              <button onClick={() => handleAssignSubjects(user.id)}>Affecter Matières</button>
                            </div>
                            {userSubjects[user.id] && (
                              <div>
                                <h3>Matières associées :</h3>
                                <ul>
                                  {Array.isArray(userSubjects[user.id])
                                    ? userSubjects[user.id].map(s => (
                                        <li key={s.id}>{s.nom}</li>
                                      ))
                                    : <li>{userSubjects[user.id].nom}</li>}
                                </ul>
                              </div>
                            )}
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

        {/* COLONNE RÔLES */}
        <div className="role-column">
          <h2 className="column-header">Rôles</h2>
          <div className="form-container">
            <h3>Créer un Rôle</h3>
            <form onSubmit={handleRoleSubmit}>
              <input type="text" name="titre" placeholder="Titre du rôle" value={newRole.titre} onChange={handleRoleInputChange} required />
              <button type="submit">Créer</button>
            </form>
          </div>
          <div className="list-container">
            {rolesLoading && <p>Chargement des rôles...</p>}
            {rolesError && <p>Erreur : {rolesError.message}</p>}
            {!rolesLoading && !rolesError && (
              <ul>
                {roles.map((role, index) => (
                  <li key={role.id || index} className="item">
                    <div className="item-header" onClick={() => toggleRoleDetails(role.id)}>
                      <span>{role.titre}</span>
                      <button className="toggle-button">
                        {expandedRole === role.id ? '▼' : '▶'}
                      </button>
                    </div>
                    {expandedRole === role.id && roleDetails[role.id] && (
                      <div className="item-details">
                      <p><strong>ID :</strong> {roleDetails[role.id].id}</p>
                      {console.log(`👀 Affichage des utilisateurs pour le rôle ${role.id}:`, roleDetails[role.id].users)}
                      {roleDetails[role.id].users && roleDetails[role.id].users.length > 0 ? (
                        <div>
                          <h3>Utilisateurs associés :</h3>
                          <ul>
                            {roleDetails[role.id].users.map(u => (
                              <li key={u.id || u.email || Math.random()}>{u.nom} {u.prenom} ({u.email})</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>❌ Aucun utilisateur associé</p>
                      )}
                      
                      <button className="delete-button" onClick={() => handleDeleteRole(role.id)}>Supprimer</button>
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
            <h3>Ajouter une Matière</h3>
            <form onSubmit={handleSubjectSubmit}>
              <input type="text" name="nom" placeholder="Nom" value={newSubject.nom} onChange={handleSubjectInputChange} required />
              <input type="text" name="code" placeholder="Code" value={newSubject.code} onChange={handleSubjectInputChange} required />
              <textarea name="description" placeholder="Description" value={newSubject.description} onChange={handleSubjectInputChange}></textarea>
              <input type="text" name="statut" placeholder="Statut" value={newSubject.statut} onChange={handleSubjectInputChange} required />
              <select name="DepartmentId" value={newSubject.DepartmentId} onChange={handleSubjectInputChange} required>
                <option value="">Sélectionnez un département</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.nom}</option>
                ))}
              </select>
              <select name="LaboratoryId" value={newSubject.LaboratoryId} onChange={handleSubjectInputChange} required>
                <option value="">Sélectionnez un laboratoire</option>
                {laboratories.map(lab => (
                  <option key={lab.id} value={lab.id}>{lab.nom}</option>
                ))}
              </select>
              <input type="file" name="image" accept="image/*" onChange={handleSubjectFileChange} />
              <button type="submit">Ajouter</button>
            </form>
          </div>
          <div className="list-container">
            {subjectsLoading && <p>Chargement des matières...</p>}
            {subjectsError && <p>Erreur : {subjectsError.message}</p>}
            {!subjectsLoading && !subjectsError && (
              <ul>
                {subjects.map((sub, index) => (
                  <li key={sub.id || index} className="item">
                    <div className="item-header" onClick={() => toggleSubjectDetails(sub.id)}>
                      <span>{sub.nom}</span>
                      <button className="toggle-button">
                        {expandedSubject === sub.id ? '▼' : '▶'}
                      </button>
                    </div>
                    {expandedSubject === sub.id && (
                      <div className="item-details">
                        {editingSubjectId === sub.id ? (
                          <div className="form-container">
                            <h3>Modifier Matière</h3>
                            <input type="text" name="nom" placeholder="Nom" value={editSubjectData.nom || ''} onChange={handleEditSubjectChange} />
                            <input type="text" name="code" placeholder="Code" value={editSubjectData.code || ''} onChange={handleEditSubjectChange} />
                            <textarea name="description" placeholder="Description" value={editSubjectData.description || ''} onChange={handleEditSubjectChange}></textarea>
                            <input type="text" name="statut" placeholder="Statut" value={editSubjectData.statut || ''} onChange={handleEditSubjectChange} required />
                            <select name="DepartmentId" value={editSubjectData.DepartmentId || ''} onChange={handleEditSubjectChange} required>
                              <option value="">Sélectionnez un département</option>
                              {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.nom}</option>
                              ))}
                            </select>
                            <select name="LaboratoryId" value={editSubjectData.LaboratoryId || ''} onChange={handleEditSubjectChange} required>
                              <option value="">Sélectionnez un laboratoire</option>
                              {laboratories.map(lab => (
                                <option key={lab.id} value={lab.id}>{lab.nom}</option>
                              ))}
                            </select>
                            <button onClick={() => handleEditSubjectSubmit(sub.id)}>Enregistrer</button>
                          </div>
                        ) : (
                          <>
                            <p><strong>ID :</strong> {subjectDetails[sub.id]?.id}</p>
<p><strong>Code :</strong> {subjectDetails[sub.id]?.code}</p>
<p><strong>Description :</strong> {subjectDetails[sub.id]?.description}</p>
<p>
  <strong>Statut :</strong> 
  <span style={getStatutStyle(subjectDetails[sub.id]?.statut)}>
    {subjectDetails[sub.id]?.statut}
  </span>
</p>

{/* ✅ Remplacement de <img> par <iframe> */}
{subjectDetails[sub.id]?.image && getPhotoUrl(subjectDetails[sub.id].image) ? (
  <img 
    src={getPhotoUrl(subjectDetails[sub.id].image)} 
    alt="Image matière"
    className="media"
    crossOrigin="anonymous"  
    referrerPolicy="no-referrer" 
    onError={(e) => {
      console.error("⚠️ Image non chargée :", e.target.src);
      e.target.style.display = "none";
    }}
  />
) : (
  <p>Aucune image</p>
)}


                            <div>
                              <button className="edit-button" onClick={() => startEditingSubject(sub.id)}>Éditer</button>
                              <button className="delete-button" onClick={() => handleDeleteSubject(sub.id)}>Supprimer</button>
                            </div>
                            <div className="file-update-form">
                              <form onSubmit={(e) => handleSubjectImageSubmit(sub.id, e)}>
                                <input type="file" accept="image/*" onChange={(e) => setSubjectImageFile(e.target.files[0])} />
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

export default UtilisateursRoles;