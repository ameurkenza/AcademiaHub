/*detailles de la page Laboratoire*/
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const LaboratoireDetail = () => {
    const { id } = useParams();
    const [laboratoire, setLaboratoire] = useState(null);

    useEffect(() => {
        axios.get(`http://10.255.193.252:5000/api/laboratories/${id}`)
            .then(response => setLaboratoire(response.data.data))
            .catch(error => console.error("Erreur lors du chargement du laboratoire :", error));
    }, [id]);

    if (!laboratoire) {
        return <h2>Chargement...</h2>;
    }

    return (
        <div className="container">
            <h2>{laboratoire.nom}</h2>
            <p><strong>Salle :</strong> {laboratoire.salle}</p>
            <p><strong>Informations :</strong> {laboratoire.information}</p>
        </div>
    );
};

export default LaboratoireDetail;
