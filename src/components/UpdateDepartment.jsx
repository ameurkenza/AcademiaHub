
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateDepartment } from "../redux/departmentSlice";

const UpdateDepartment = ({ department, onClose }) => {
  const dispatch = useDispatch();

  const [updatedData, setUpdatedData] = useState({
    nom: department.nom,
    histoire: department.histoire,
    domaine: department.domaine,
  });
  const [customDomaine, setCustomDomaine] = useState("");
  const [image, setImage] = useState(null);
  const [imageUpdated, setImageUpdated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setUpdatedData((prev) => ({ ...prev, domaine: value }));
    if (value !== "autre") {
      setCustomDomaine("");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
      setImageUpdated(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom", updatedData.nom);
    formData.append("histoire", updatedData.histoire);
    const domaineValue =
      updatedData.domaine === "autre" && customDomaine.trim() !== ""
        ? customDomaine
        : updatedData.domaine;
    formData.append("domaine", domaineValue);
    if (imageUpdated && image) {
      formData.append("image", image);
      formData.append("imageUpdated", "true");
    }

    dispatch(updateDepartment({ id: department.id, updatedData: formData }))
      .then(() => {
        alert("Département mis à jour avec succès.");
        onClose();
      })
      .catch(() => {
        alert("Une erreur s'est produite lors de la mise à jour du département.");
      });
  };

  return (
    <div className="update-modal">
      <h2>✏️ Modifier le Département</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="nom"
          value={updatedData.nom}
          onChange={handleChange}
          required
        />
        <textarea
          name="histoire"
          value={updatedData.histoire}
          onChange={handleChange}
          required
        />
        <label>
          Domaine:
          <select
            name="domaine"
            value={updatedData.domaine}
            onChange={handleSelectChange}
            required
          >
            <option value="">-- Sélectionnez un domaine --</option>
            <option value="sciences">sciences</option>
            <option value="literature">literature</option>
            <option value="autre">autre</option>
          </select>
        </label>
        {updatedData.domaine === "autre" && (
          <input
            type="text"
            name="customDomaine"
            placeholder="Précisez le domaine"
            value={customDomaine}
            onChange={(e) => setCustomDomaine(e.target.value)}
            required
          />
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {department.image && !imageUpdated && (
          <p>📷 Image actuelle : {department.image}</p>
        )}
        <button type="submit"> Mettre à jour</button>
        <button type="button" onClick={onClose}>
           Annuler
        </button>
      </form>
    </div>
  );
};

export default UpdateDepartment;
