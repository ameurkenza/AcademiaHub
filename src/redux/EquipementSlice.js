import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const DOMAIN_URL = import.meta.env.VITE_API_URL;

//  Action pour récupérer les équipements (GET)
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

//  Action pour créer un équipement 
export const createEquipement = createAsyncThunk(
  "equipements/createEquipement",
  async (newEquipement, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

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

//  Action pour mettre à jour un équipement 
export const updateEquipement = createAsyncThunk(
  "equipements/updateEquipement",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      console.log(`🔄 Mise à jour des données de l'équipement ${id} :`, updatedData);

      await axios.put(`${DOMAIN_URL}/equipment/${id}`, updatedData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Mise à jour réussie, récupération des nouvelles données...");

      //  Étape 2 : Récupérer l'équipement mis à jour 
      const response = await axios.get(`${DOMAIN_URL}/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(" Équipement mis à jour récupéré :", response.data);
      return { id, updatedData: response.data.data };
    } catch (error) {
      console.error(" Erreur API :", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour de l'équipement");
    }
  }
);

// Action pour mettre à jour l'image séparément
export const updateEquipementImage = createAsyncThunk(
  "equipements/updateEquipementImage",
  async ({ id, image }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      const formData = new FormData();
      formData.append("image", image);

      console.log(` Envoi de l'image pour l'équipement ${id}...`);

      await axios.put(`${DOMAIN_URL}/equipment/${id}/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Image mise à jour avec succès, récupération des nouvelles données...");

      //  Récupérer l'équipement mis à jour avec l'image
      const response = await axios.get(`${DOMAIN_URL}/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(" Image mise à jour, URL récupérée :", response.data?.data?.image);
      return { id, updatedData: response.data.data };
    } catch (error) {
      console.error(" Erreur API (mise à jour de l'image) :", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour de l'image");
    }
  }
);

//  Action pour supprimer un équipement (DELETE)
export const deleteEquipement = createAsyncThunk(
  "equipements/deleteEquipement",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      await axios.delete(`${DOMAIN_URL}/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la suppression de l'équipement");
    }
  }
);

//  Création du Slice Redux
const equipementsSlice = createSlice({
  name: "equipements",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipements.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEquipements.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchEquipements.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createEquipement.fulfilled, (state, action) => { state.loading = false; state.list.push(action.payload); })

      .addCase(updateEquipement.fulfilled, (state, action) => {
        state.loading = false;
        console.log(" Données reçues après update :", action.payload);
        const { id, updatedData } = action.payload;
        const index = state.list.findIndex((equipement) => equipement.id === id);
        if (index !== -1) state.list[index] = { ...state.list[index], ...updatedData };
      })

      .addCase(updateEquipementImage.fulfilled, (state, action) => {
        state.loading = false;
        console.log(" Image mise à jour dans Redux :", action.payload);
        const { id, updatedData } = action.payload;
        const index = state.list.findIndex((equipement) => equipement.id === id);
        if (index !== -1) state.list[index].image = updatedData.image;
      })

      .addCase(deleteEquipement.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((equipement) => equipement.id !== action.payload);
      });
  },
});

// Exportation du reducer pour le store Redux
export default equipementsSlice.reducer;
