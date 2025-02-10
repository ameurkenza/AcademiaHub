import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DepartementsMatieres.css';

const DepartementsMatieres = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDepartment, setExpandedDepartment] = useState(null);
  const [users, setUsers] = useState({});
  const [departmentDetails, setDepartmentDetails] = useState({});
  const [subjects, setSubjects] = useState({});
  const [newDepartment, setNewDepartment] = useState({
    nom: '',
    histoire: '',
    domaine: '',
    image: null
  });

  useEffect(() => {
    axios.get('http://192.168.106.94:5000/api/departments')
      .then(response => {
        console.log("Liste des départements reçue :", response.data);
        setDepartments(response.data?.data?.departments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des départements :", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const toggleDepartmentDetails = (deptId) => {
    if (expandedDepartment === deptId) {
      setExpandedDepartment(null);
    } else {
      setExpandedDepartment(deptId);

      axios.get(`http://192.168.106.94:5000/api/departments/${deptId}`)
        .then(response => {
          setDepartmentDetails(prevDetails => ({
            ...prevDetails,
            [deptId]: response.data.data
          }));
        })
        .catch(err => console.error(`Erreur lors de la récupération des détails du département ${deptId} :`, err));

      if (!users[deptId]) {
        axios.get(`http://192.168.106.94:5000/api/departments/${deptId}/users`)
          .then(response => {
            setUsers(prevUsers => ({
              ...prevUsers,
              [deptId]: response.data.data || []
            }));
          })
          .catch(err => console.error(`Erreur lors de la récupération des utilisateurs du département ${deptId} :`, err));
      }

      axios.get(`http://192.168.106.94:5000/api/departments/${deptId}/subjects`)
        .then(response => {
          setSubjects(prevSubjects => ({
            ...prevSubjects,
            [deptId]: response.data.data || []
          }));
        })
        .catch(err => console.error(`Erreur lors de la récupération des matières du département ${deptId} :`, err));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setNewDepartment(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', newDepartment.nom);
    formData.append('histoire', newDepartment.histoire);
    formData.append('domaine', newDepartment.domaine);
    if (newDepartment.image) {
      formData.append('image', newDepartment.image);
    }

    axios.post('http://192.168.106.94:5000/api/departments', formData)
      .then(response => {
        console.log("Département ajouté :", response.data);
        setDepartments(prevDepartments => [...prevDepartments, response.data.data]);
        setNewDepartment({ nom: '', histoire: '', domaine: '', image: null });
      })
      .catch(err => console.error("Erreur lors de l'ajout du département :", err));
  };

  return (
    <div className="departments-page">
      <h1 className="page-title">Gestion des Départements & Matières</h1>

      <div className="columns-container">
        {/* 📌 Colonne des départements */}
        <div className="department-column">
          <div className="column-header">
            <h2>Départements</h2>
          </div>

          <div className="list-container">
            {loading && <p>Chargement des départements...</p>}
            {error && <p>Erreur: {error.message}</p>}
            {!loading && !error && (
              <ul>
                {departments.map(dept => (
                  <li key={dept.id} className="department-item">
                    <div className="department-header" onClick={() => toggleDepartmentDetails(dept.id)}>
                      <span>{dept.nom}</span>
                      <button className="toggle-button">
                        {expandedDepartment === dept.id ? "▼" : "▶"}
                      </button>
                    </div>

                    {expandedDepartment === dept.id && departmentDetails[dept.id] && (
                      <div className="department-details">
                        <p><strong>ID:</strong> {departmentDetails[dept.id].id}</p>
                        <p><strong>Nom:</strong> {departmentDetails[dept.id].nom}</p>
                        <p><strong>Histoire:</strong> {departmentDetails[dept.id].histoire}</p>
                        <p><strong>Domaine:</strong> {departmentDetails[dept.id].domaine}</p>

                        {departmentDetails[dept.id].image ? (
                          <img src={`http://192.168.106.94:5000/${departmentDetails[dept.id].image}`} 
                            alt="Image du département" 
                            className="department-image" />
                        ) : (
                          <p>Aucune image disponible.</p>
                        )}

                        <h4>Utilisateurs :</h4>
                        {users[dept.id] ? (
                          users[dept.id].length > 0 ? (
                            <ul className="user-list">
                              {users[dept.id].map(user => (
                                <li key={user.id} className="user-item">
                                  {user.nom} {user.prenom} ({user.email})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>Aucun utilisateur dans ce département.</p>
                          )
                        ) : (
                          <p>Chargement des utilisateurs...</p>
                        )}

                        <h4>Matières :</h4>
                        {subjects[dept.id] && subjects[dept.id].length > 0 ? (
                          <ul className="subject-list">
                            {subjects[dept.id].map(subject => (
                              <li key={subject.id} className="subject-item">
                                <strong>{subject.nom}</strong> ({subject.code})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Aucune matière disponible.</p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 📌 Formulaire d'ajout de département */}
          <div className="department-form">
            <h3>Ajouter un Département</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="nom" placeholder="Nom du département" value={newDepartment.nom} onChange={handleInputChange} required />
              <input type="text" name="histoire" placeholder="Histoire" value={newDepartment.histoire} onChange={handleInputChange} />
              <input type="text" name="domaine" placeholder="Domaine" value={newDepartment.domaine} onChange={handleInputChange} required />
              <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
              <button type="submit">Ajouter</button>
            </form>
          </div>
        </div>

        {/* ✅ 📌 Colonne des matières restaurée */}
        <div className="subject-column">
          <div className="column-header">
            <h2>Matières</h2>
            <button className="create-button">+ Nouvelle Matière</button>
          </div>
          <div className="list-container">
            {/* 🔹 Zone pour l'affichage des matières (à implémenter plus tard) */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartementsMatieres;
