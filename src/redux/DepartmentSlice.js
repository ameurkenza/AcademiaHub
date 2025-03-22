// src/redux/departmentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const DOMAIN_URL = import.meta.env.VITE_API_URL;

// ✅ Récupérer la liste des départements
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      const response = await axios.get(`${DOMAIN_URL}/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data?.data?.departments || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

// Supprimer un département
export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (deptId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      await axios.delete(`${DOMAIN_URL}/departments/${deptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return deptId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur suppression");
    }
  }
);

// Créer un département
export const createDepartment = createAsyncThunk(
  "departments/createDepartment",
  async (newDepartment, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      // On envoie le "newDepartment" (champs texte) en JSON,
      // comme tu le fais déjà.
      const response = await axios.post(`${DOMAIN_URL}/departments`, newDepartment, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      // Le backend renvoie : { message: "Departement cree", data: { ... } }
      // On retourne l'objet { id, nom, histoire, ... }
      // =========================== CHANGÉ ICI ==============================
      return response.data?.data || response.data;
      // ====================================================================
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de création");
    }
  }
);

// Mettre à jour un département
export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      // Ici, on met à jour UNIQUEMENT les champs texte,
      // car l’image est gérée séparément par un PUT /departments/:id/image
      const response = await axios.put(`${DOMAIN_URL}/departments/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour");
    }
  }
);

//  Slice Redux
const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Récupérer liste
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Supprimer
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        const deptId = action.payload;
        state.list = state.list.filter((dept) => dept.id !== deptId);
      })

      // Créer
      .addCase(createDepartment.fulfilled, (state, action) => {
        // action.payload doit être l'objet du nouveau département
        // ex: { id: 8, nom: "Sante", ... }
        const newDept = action.payload;
        state.list.push(newDept);
      })

      // Mettre à jour
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const updatedDept = action.payload; 
        // Dans ton backend, tu renvoies (ou pas) l'objet complet ?
        // S’il n’y a pas l’objet complet, il faut juste rafraîchir la liste
        // Pour l’exemple, on fait comme si on récupérait l’objet complet
        if (updatedDept && updatedDept.id) {
          state.list = state.list.map((dept) =>
            dept.id === updatedDept.id ? updatedDept : dept
          );
        }
      });
  },
});

export default departmentSlice.reducer;
