
/*page LaboratoiresEquipements.jsx*/
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

const LaboratoiresEquipements = () => {
    const [laboratoires, setLaboratoires] = useState([]);
    const [equipements, setEquipements] = useState([]);

    // États pour afficher les formulaires d'ajout
    const [showLabForm, setShowLabForm] = useState(false);
    const [showEquipForm, setShowEquipForm] = useState(false);

    // États pour stocker les données du formulaire
    const [nouveauLab, setNouveauLab] = useState({ nom: "", salle: "", information: "", image: "", departmentId: "" });
    const [nouvelEquipement, setNouvelEquipement] = useState({ nom: "", modele: "", description: "", image: "", laboratoireId: "" });

    // Charger les laboratoires et équipements au montage du composant
    useEffect(() => {
        fetchLaboratoires();
        fetchEquipements();
    }, []);

    // Fonction pour récupérer les laboratoires
    const fetchLaboratoires = () => {
        axios.get("http://10.255.193.252:5000/api/laboratories")
            .then(response => setLaboratoires(response.data.data.laboratories))
            .catch(error => console.error("Erreur chargement laboratoires :", error));
    };

    // Fonction pour récupérer les équipements
    const fetchEquipements = () => {
        axios.get("http://10.255.193.252:5000/api/equipment")
            .then(response => setEquipements(response.data.data.equipments))
            .catch(error => console.error("Erreur chargement équipements :", error));
    };

    // Ajouter un laboratoire
    const ajouterLaboratoire = (e) => {
        e.preventDefault();
        axios.post("http://10.255.193.252:5000/api/laboratories", nouveauLab)
            .then(() => {
                fetchLaboratoires();
                setShowLabForm(false);
                setNouveauLab({ nom: "", salle: "", information: "", image: "", departmentId: "" });
            })
            .catch(error => console.error("Erreur ajout laboratoire :", error));
    };

    // Ajouter un équipement
    const ajouterEquipement = (e) => {
        e.preventDefault();
        axios.post("http://10.255.193.252:5000/api/equipment", nouvelEquipement)
            .then(() => {
                fetchEquipements();
                setShowEquipForm(false);
                setNouvelEquipement({ nom: "", modele: "", description: "", image: "", laboratoireId: "" });
            })
            .catch(error => console.error("Erreur ajout équipement :", error));
    };

    // Supprimer un laboratoire
    const supprimerLaboratoire = (id) => {
        axios.delete(`http://10.255.193.252:5000/api/laboratories/${id}`)
            .then(() => fetchLaboratoires())
            .catch(error => console.error("Erreur suppression laboratoire :", error));
    };

    // Supprimer un équipement
    const supprimerEquipement = (id) => {
        axios.delete(`http://10.255.193.252:5000/api/equipment/${id}`)
            .then(() => fetchEquipements())
            .catch(error => console.error("Erreur suppression équipement :", error));
    };

    return (
        <div className="container">
            <h1 className="header">Gestion des Laboratoires & Équipements</h1>
            <div className="content">
                {/* Section Équipements */}
                <div className="section equipements">
                    <h2>Équipements</h2>
                    <button className="btn-add" onClick={() => setShowEquipForm(!showEquipForm)}>+ Ajouter</button>
                    {showEquipForm && (
                        <form className="form-ajout" onSubmit={ajouterEquipement}>
                            <input type="text" placeholder="Nom" required value={nouvelEquipement.nom} 
                                onChange={(e) => setNouvelEquipement({ ...nouvelEquipement, nom: e.target.value })} />
                            <button type="submit" className="btn-add">Confirmer</button>
                        </form>
                    )}
                    <ul>
                        {equipements.map(eq => (
                            <li key={eq.id}>
                                <Link to={`/equipement/${eq.id}`}>{eq.nom}</Link>
                                <button className="btn-delete" onClick={() => supprimerEquipement(eq.id)}>Supprimer</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Section Laboratoires */}
                <div className="section laboratoires">
                    <h2>Laboratoires</h2>
                    <button className="btn-add" onClick={() => setShowLabForm(!showLabForm)}>+ Ajouter</button>
                    {showLabForm && (
                        <form className="form-ajout" onSubmit={ajouterLaboratoire}>
                            <input type="text" placeholder="Nom" required value={nouveauLab.nom} 
                                onChange={(e) => setNouveauLab({ ...nouveauLab, nom: e.target.value })} />
                            <button type="submit" className="btn-add">Confirmer</button>
                        </form>
                    )}
                    <ul>
                        {laboratoires.map(lab => (
                            <li key={lab.id}>
                                <Link to={`/laboratoire/${lab.id}`}>{lab.nom}</Link>
                                <button className="btn-delete" onClick={() => supprimerLaboratoire(lab.id)}>Supprimer</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LaboratoiresEquipements;
