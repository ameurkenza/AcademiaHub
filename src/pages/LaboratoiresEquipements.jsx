import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LaboratoiresEquipements = () => {
    const [laboratoires, setLaboratoires] = useState([]);
    const [equipements, setEquipements] = useState([]);

    useEffect(() => {
        // Récupérer la liste des laboratoires
        axios.get("http://192.168.2.88:5000/api/laboratories")
            .then(response => setLaboratoires(response.data))
            .catch(error => console.error("Erreur lors du chargement des laboratoires :", error));

        // Récupérer la liste des équipements
        axios.get("http://192.168.2.88:5000/api/equipment")
            .then(response => setEquipements(response.data))
            .catch(error => console.error("Erreur lors du chargement des équipements :", error));
    }, []);

    return (
        <div>
            <h2>Liste des Laboratoires</h2>
            <ul>
                {laboratoires.map(lab => (
                    <li key={lab.id}>
                        <Link to={`/laboratoire/${lab.id}`}>{lab.nom} - Salle {lab.salle}</Link>
                    </li>
                ))}
            </ul>

            <h2>Liste des Équipements</h2>
            <ul>
                {equipements.map(eq => (
                    <li key={eq.id}>
                        <Link to={`/equipement/${eq.id}`}>{eq.nom} - {eq.modele}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LaboratoiresEquipements;
