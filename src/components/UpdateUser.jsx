import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser, updateUserPhoto } from "../redux/userSlice";

const UpdateUser = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    naissance: user.naissance || "",
    biographie: user.biographie || "",
    conduite: user.conduite || "",
  });

  const [photo, setPhoto] = useState(null);

  // 🎯 Gestion des changements de texte
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🎯 Gestion du fichier photo
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // 🎯 Soumettre les modifications
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: user.id, userData: formData }));
    if (photo) {
      dispatch(updateUserPhoto({ id: user.id, photoFile: photo }));
    }
    onClose(); // ✅ Fermer la modale après soumission
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Modifier l'Utilisateur</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body">
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="form-control mb-2" placeholder="Nom" required />
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="form-control mb-2" placeholder="Prénom" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control mb-2" placeholder="Email" required />
            <input type="date" name="naissance" value={formData.naissance} onChange={handleChange} className="form-control mb-2" />
            <textarea name="biographie" value={formData.biographie} onChange={handleChange} className="form-control mb-2" placeholder="Biographie"></textarea>
            <input type="text" name="conduite" value={formData.conduite} onChange={handleChange} className="form-control mb-2" placeholder="Conduite" />
            
            <label className="form-label mt-2">Photo de profil</label>
            <input type="file" className="form-control" onChange={handlePhotoChange} accept="image/*" />
          </form>
          <div className="modal-footer">
            <button type="submit" className="btn btn-success" onClick={handleSubmit}>Enregistrer</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
