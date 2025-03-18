// src/redux/subjectSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const DOMAIN_URL = import.meta.env.VITE_API_URL;

// ✅ Action pour récupérer les matières
export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");
      const response = await axios.get(`${DOMAIN_URL}/subjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.data?.subjects || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

// ✅ Création d'une matière
export const createSubject = createAsyncThunk(
  "subjects/createSubject",
  async (newSubject, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      const response = await axios.post(`${DOMAIN_URL}/subjects`, {
        nom: newSubject.nom,
        code: newSubject.code,
        description: newSubject.description,
        statut: newSubject.statut || "optionnel",
        DepartmentId: parseInt(newSubject.DepartmentId),
        LaboratoryId: newSubject.LaboratoryId ? parseInt(newSubject.LaboratoryId) : null
      }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      console.log("✅ Matière créée :", response.data?.data);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Erreur de création");
    }
  }
);

// ✅ Mise à jour d'une matière
export const updateSubject = createAsyncThunk(
    "subjects/updateSubject",
    async ({ id, updatedData }, { getState, rejectWithValue }) => {
      try {
        const token = getState().auth.token;
        if (!token) throw new Error("Utilisateur non authentifié !");
  
        const response = await axios.put(`${DOMAIN_URL}/subjects/${id}`, updatedData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
  
        console.log("✅ Matière mise à jour :", response.data?.data);
        return response.data?.data || response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour");
      }
    }
  );

// ✅ Suppression d'une matière
export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (subjectId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");
      await axios.delete(`${DOMAIN_URL}/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`✅ Matière supprimée (ID: ${subjectId})`);
      return subjectId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de suppression");
    }
  }
);

// ✅ Création du Slice Redux
const subjectSlice = createSlice({
  name: "subjects",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.list = state.list.map((subject) =>
          subject.id === action.payload.id ? { ...subject, ...action.payload } : subject
        );
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.list = state.list.filter((subject) => subject.id !== action.payload);
      });
  },
});

export default subjectSlice.reducer;
