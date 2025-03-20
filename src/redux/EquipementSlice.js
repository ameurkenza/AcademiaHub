import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const DOMAIN_URL = import.meta.env.VITE_API_URL;

// 1️⃣ Action pour récupérer les équipements (GET)
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

// 2️⃣ Action pour créer un équipement (POST)
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

// 3️⃣ Action pour mettre à jour un équipement (PUT)
export const updateEquipement = createAsyncThunk(
  "equipements/updateEquipement",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié !");

      console.log(`🔄 Mise à jour de l'équipement ${id} avec les données :`, updatedData);

      // Vérifier si une nouvelle image a été ajoutée
      const hasNewImage = updatedData.image && updatedData.image instanceof File;
      let body = updatedData;
      let headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Par défaut en JSON
      };

      if (hasNewImage) {
        body = new FormData();
        for (const key in updatedData) {
          if (updatedData[key] !== null && updatedData[key] !== undefined) {
            body.append(key, updatedData[key]);
          }
        }
        headers["Content-Type"] = "multipart/form-data"; // Passer en FormData si une image est incluse
      }

      // 🔹 Étape 1 : Mettre à jour l'équipement
      await axios.put(`${DOMAIN_URL}/equipment/${id}`, body, { headers });

      // 🔹 Étape 2 : Récupérer l'équipement mis à jour
      const response = await axios.get(`${DOMAIN_URL}/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Équipement mis à jour (GET) :", response.data.data);
      return { id, updatedData: response.data.data };
    } catch (error) {
      console.error("❌ Erreur API :", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour de l'équipement");
    }
  }
);

// 4️⃣ Action pour supprimer un équipement (DELETE)
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

// 5️⃣ Création du Slice Redux
const equipementsSlice = createSlice({
  name: "equipements",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Gestion du chargement des équipements
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

      // ✅ Gestion de la création d'un équipement
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

      // ✅ Gestion de la mise à jour d'un équipement
      .addCase(updateEquipement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEquipement.fulfilled, (state, action) => {
        state.loading = false;
        console.log("✅ Données reçues par Redux après update :", action.payload);

        const { id, updatedData } = action.payload;
        console.log("🔍 Vérification : updatedData reçu dans Redux :", updatedData);

        const index = state.list.findIndex((equipement) => equipement.id === id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...updatedData };
        }

        console.log("🎯 Équipement mis à jour dans Redux :", state.list);
      })
      .addCase(updateEquipement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Gestion de la suppression d'un équipement
      .addCase(deleteEquipement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEquipement.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((equipement) => equipement.id !== action.payload);
      })
      .addCase(deleteEquipement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Exportation du reducer pour le store Redux
export default equipementsSlice.reducer;
