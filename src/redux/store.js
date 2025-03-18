import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import departmentReducer from "./departmentSlice";
import subjectReducer from "./subjectSlice";
import laboReducer from "./LaboSlice";
import equipementReducer from "./EquipementSlice";
import roleReducer from "./roleSlice"; 
import userReducer from "./userSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer, 
    subjects: subjectReducer,
    labos: laboReducer,
    equipements: equipementReducer,
    roles: roleReducer,
    users: userReducer,
  },
});
