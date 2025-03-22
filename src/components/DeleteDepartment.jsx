import React from "react";
import { useDispatch } from "react-redux";
import { deleteDepartment } from "../redux/departmentSlice";

const DeleteDepartment = ({ department, onClose }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteDepartment(department.id));
    onClose();
  };

  return (
    <div className="delete-modal">
      <h3> Supprimer le Département</h3>
      <p>Es-tu sûr de vouloir supprimer <strong>{department.nom}</strong> ?</p>
      <p>Cette action est irréversible.</p>
      
      <div className="d-flex justify-content-end">
        <button className="btn btn-danger me-2" onClick={handleDelete}> Confirmer</button>
        <button className="btn btn-secondary" onClick={onClose}> Annuler</button>
      </div>
    </div>
  );
};

export default DeleteDepartment;
