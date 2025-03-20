import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../redux/userSlice"; 

const Inscription = ({ onUserCreated }) => {
  const dispatch = useDispatch();
  
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    mot_de_passe: "",
    email: "",
    naissance: "",
    biographie: "",
    conduite: "", 
    DepartmentId: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
//Validations
  const validateForm = () => {
    let formErrors = {};
    if (!newUser.nom) formErrors.nom = "Le nom est requis.";
    if (!newUser.prenom) formErrors.prenom = "Le prénom est requis.";
    if (!newUser.mot_de_passe) formErrors.mot_de_passe = "Le mot de passe est requis.";
    if (!newUser.email) formErrors.email = "L'email est requis.";
    if (!newUser.naissance) formErrors.naissance = "La date de naissance est requise.";
    if (!newUser.biographie) formErrors.biographie = "La biographie est requise.";
    if (!newUser.conduite) formErrors.conduite = "Le comportement est requis."; // Vérification
    if (!newUser.DepartmentId) formErrors.DepartmentId = "L'ID du département est requis.";
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "photo" && files?.[0]) {
      setNewUser({ ...newUser, photo: files[0] });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("nom", newUser.nom);
    formData.append("prenom", newUser.prenom);
    formData.append("mot_de_passe", newUser.mot_de_passe);
    formData.append("email", newUser.email);
    formData.append("naissance", newUser.naissance);
    formData.append("biographie", newUser.biographie);
    formData.append("conduite", newUser.conduite); // Ajout du choix sélectionné
    formData.append("DepartmentId", newUser.DepartmentId);
    if (newUser.photo) {
      formData.append("photo", newUser.photo);
    }

    dispatch(createUser(formData)).then((action) => {
      if (action.payload) {
        if (onUserCreated) onUserCreated(action.payload);
        setNewUser({
          nom: "",
          prenom: "",
          mot_de_passe: "",
          email: "",
          naissance: "",
          biographie: "",
          conduite: "",
          DepartmentId: "",
          photo: null,
        });
      }
      setLoading(false);
    });
  };

  return (
    <div className="container mt-4">
      <div className="card border-primary">
        <div className="card-header bg-primary text-white"> Inscription </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/*  Nom */}
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input type="text" className="form-control" name="nom" value={newUser.nom} onChange={handleChange} />
              {errors.nom && <div className="text-danger">{errors.nom}</div>}
            </div>

            {/*  Prénom */}
            <div className="mb-3">
              <label className="form-label">Prénom</label>
              <input type="text" className="form-control" name="prenom" value={newUser.prenom} onChange={handleChange} />
              {errors.prenom && <div className="text-danger">{errors.prenom}</div>}
            </div>

            {/*  Mot de passe */}
            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input type="password" className="form-control" name="mot_de_passe" value={newUser.mot_de_passe} onChange={handleChange} />
              {errors.mot_de_passe && <div className="text-danger">{errors.mot_de_passe}</div>}
            </div>

            {/*  Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={newUser.email} onChange={handleChange} />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>

            {/* Date de naissance */}
            <div className="mb-3">
              <label className="form-label">Date de naissance</label>
              <input type="date" className="form-control" name="naissance" value={newUser.naissance} onChange={handleChange} />
              {errors.naissance && <div className="text-danger">{errors.naissance}</div>}
            </div>

            {/*  Biographie */}
            <div className="mb-3">
              <label className="form-label">Biographie</label>
              <textarea className="form-control" name="biographie" value={newUser.biographie} onChange={handleChange}></textarea>
              {errors.biographie && <div className="text-danger">{errors.biographie}</div>}
            </div>

            {/* Conduite (Dropdown) */}
            <div className="mb-3">
  <label className="form-label">Conduite</label>
  <select 
    className="form-control" 
    name="conduite" 
    value={newUser.conduite} 
    onChange={handleChange}
  >
    <option value="">Choisissez une option</option>
    <option value="Excellente">Excellente</option>
    <option value="Bonne">Bonne</option>
    <option value="Passable">Passable</option>
  </select>
  {errors.conduite && <div className="text-danger">{errors.conduite}</div>}
</div>


            {/*  ID du Département */}
            <div className="mb-3">
              <label className="form-label">ID du Département</label>
              <input type="text" className="form-control" name="DepartmentId" value={newUser.DepartmentId} onChange={handleChange} />
              {errors.DepartmentId && <div className="text-danger">{errors.DepartmentId}</div>}
            </div>

            {/*  Photo */}
            <div className="mb-3">
              <label className="form-label">Photo</label>
              <input type="file" className="form-control" name="photo" accept="image/*" onChange={handleChange} />
            </div>

            {/* Bouton de soumission */}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
