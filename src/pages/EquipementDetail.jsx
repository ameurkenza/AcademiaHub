/*EquipementDetail*/
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const EquipementDetail = () => {
    const { id } = useParams();
    const [equipement, setEquipement] = useState(null);

    useEffect(() => {
        axios.get(`http://10.255.193.252:5000/api/equipment/${id}`)
            .then(response => setEquipement(response.data.data))
            .catch(error => console.error("Erreur lors du chargement de l'équipement :", error));
    }, [id]);

    if (!equipement) {
        return <h2>Chargement...</h2>;
    }

    return (
        <div className="container">
            <h2>{equipement.nom}</h2>
            <p><strong>Modèle :</strong> {equipement.modele}</p>
            <p><strong>Description :</strong> {equipement.description}</p>
        </div>
    );
};

export default EquipementDetail;
