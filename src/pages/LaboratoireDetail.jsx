import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const LaboratoireDetail = () => {
    const { id } = useParams();
    const [laboratoire, setLaboratoire] = useState(null);
    const [equipements, setEquipements] = useState([]);

    useEffect(() => {
        axios.get(`http://192.168.2.88:5000/api/laboratories/${id}`)
            .then(response => setLaboratoire(response.data))
            .catch(error => console.error("Erreur :", error));

        axios.get(`http://192.168.2.88:5000/api/laboratories/${id}/equipment`)
            .then(response => setEquipements(response.data))
            .catch(error => console.error("Erreur :", error));
    }, [id]);

    if (!laboratoire) return <p>Chargement...</p>;

    return (
        <div>
            <h2>{laboratoire.nom}</h2>
            <p>{laboratoire.information}</p>
            <h3>Équipements :</h3>
            <ul>
                {equipements.map(e => (
                    <li key={e.id}>{e.nom} - {e.modele}</li>
                ))}
            </ul>
        </div>
    );
};

export default LaboratoireDetail;
