// src/redux/equipementSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const DOMAIN_URL = import.meta.env.VITE_API_URL;

// ✅ Action pour récupérer les équipements (GET)
export const fetchEquipements = createAsyncThunk(
  "equipements/fetchEquipements",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié");

      const response = await axios.get(`${DOMAIN_URL}/equipment`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data?.data?.equipments || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement des équipements");
    }
  }
);

// ✅ Action pour créer un équipement (POST)
export const createEquipement = createAsyncThunk(
  "equipements/createEquipement",
  async (newEquipement, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié");

      const response = await axios.post(`${DOMAIN_URL}/equipment`, newEquipement, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de création de l'équipement");
    }
  }
);

// ✅ Action pour mettre à jour les champs d'un équipement (PUT)
export const updateEquipement = createAsyncThunk(
  "equipements/updateEquipement",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié");

      const response = await axios.put(`${DOMAIN_URL}/equipment/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return { id, updatedData: response.data?.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour de l'équipement");
    }
  }
);

// ✅ Action pour mettre à jour l'image d'un équipement (PUT)
export const updateEquipementImage = createAsyncThunk(
  "equipements/updateEquipementImage",
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${DOMAIN_URL}/equipment/${id}/image`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        },
      });

      return response.data; // ✅ Retourne la réponse du serveur
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la mise à jour de l'image");
    }
  }
);

  

// ✅ Action pour supprimer un équipement (DELETE)
export const deleteEquipement = createAsyncThunk(
  "equipements/deleteEquipement",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié");

      await axios.delete(`${DOMAIN_URL}/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la suppression de l'équipement");
    }
  }
);

// ✅ Création du slice Redux
const equipementSlice = createSlice({
  name: "equipements",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Gestion de la récupération des équipements
      .addCase(fetchEquipements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEquipements.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEquipements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Gestion de la création d'un équipement
      .addCase(createEquipement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEquipement.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createEquipement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Gestion de la mise à jour d'un équipement
      .addCase(updateEquipement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEquipement.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updatedData } = action.payload;
        const index = state.list.findIndex((equip) => equip.id === id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...updatedData };
        }
      })
      .addCase(updateEquipement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Gestion de la mise à jour de l'image
      .addCase(updateEquipementImage.fulfilled, (state, action) => {
        const { id, imageUrl } = action.payload;  // ✅ Assurez-vous que l'API renvoie bien une URL d'image
        const index = state.list.findIndex((equipement) => equipement.id === id);
        if (index !== -1) {
          state.list[index].image = imageUrl;  // ✅ Stocke uniquement l’URL de l’image
        }
      })
      

      // 🔹 Gestion de la suppression d'un équipement
      .addCase(deleteEquipement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEquipement.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((equip) => equip.id !== action.payload);
      })
      .addCase(deleteEquipement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Exportation du reducer
export default equipementSlice.reducer;
