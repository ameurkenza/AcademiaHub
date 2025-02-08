import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const EquipementDetail = () => {
    const { id } = useParams();
    const [equipement, setEquipement] = useState(null);

    useEffect(() => {
        axios.get(`http://192.168.2.88:5000/api/equipment/${id}`)
            .then(response => setEquipement(response.data))
            .catch(error => console.error("Erreur :", error));
    }, [id]);

    if (!equipement) return <p>Chargement...</p>;

    return (
        <div>
            <h2>{equipement.nom}</h2>
            <p>Modèle : {equipement.modele}</p>
            <p>Description : {equipement.description}</p>
        </div>
    );
};

export default EquipementDetail;
