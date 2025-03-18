import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const DOMAIN_URL = import.meta.env.VITE_API_URL;

// ✅ Action pour récupérer les départements
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

// ✅ Action pour supprimer un département
export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (deptId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      await axios.delete(`${DOMAIN_URL}/departments/${deptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`✅ Département supprimé (ID: ${deptId})`);
      return deptId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur suppression");
    }
  }
);

// ✅ Action pour créer un département
export const createDepartment = createAsyncThunk(
  "departments/createDepartment",
  async (newDepartment, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      const response = await axios.post(`${DOMAIN_URL}/departments`, newDepartment, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      return response.data?.data?.department || response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de création");
    }
  }
);

// ✅ Action pour mettre à jour un département
export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

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

// ✅ Création du Slice Redux
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
      // ✅ Suppression d’un département
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.list = state.list.filter((dept) => dept.id !== action.payload);
      })
      // ✅ Création d’un département
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // ✅ Mise à jour d’un département
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const updatedDept = action.payload; // ✅ Récupère les nouvelles données du département
        state.list = state.list.map((dept) =>
            dept.id === updatedDept.id ? updatedDept : dept
        );
    });    
  },
});

// ✅ Exportation correcte
export default departmentSlice.reducer;
