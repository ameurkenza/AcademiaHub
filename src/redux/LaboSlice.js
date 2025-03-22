// src/redux/laboSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const DOMAIN_URL = import.meta.env.VITE_API_URL;

// Action pour récupérer les laboratoires (GET)
export const fetchLabos = createAsyncThunk(
  "labos/fetchLabos",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Utilisateur non authentifié");

      const response = await axios.get(`${DOMAIN_URL}/laboratories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data?.data?.laboratories || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement des laboratoires");
    }
  }
);

// Action pour créer un laboratoire (POST)
export const createLabo = createAsyncThunk(
    "labos/createLabo",
    async (newLabo, { getState, rejectWithValue }) => {
      try {
        const token = getState().auth.token;
        if (!token) throw new Error("Utilisateur non authentifié !");
  
        console.log(" Envoi de la requête à l'API avec :", newLabo);
  
        const response = await axios.post(`${DOMAIN_URL}/laboratories`, newLabo, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        console.log(" Réponse reçue :", response.data);
        return response.data?.data || response.data;
      } catch (error) {
        console.error("Erreur API :", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || "Erreur de création du laboratoire");
      }
    }
  );

   // Action pour mettre à jour un laboratoire (PUT)
   export const updateLabo = createAsyncThunk(
    "labos/updateLabo",
    async ({ id, updatedData }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            if (!token) throw new Error("Utilisateur non authentifié !");

            console.log(`📤 Mise à jour du labo ${id} avec les données :`, updatedData);

            const response = await axios.put(
                `${DOMAIN_URL}/laboratories/${id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json", 
                    },
                }
            );

            console.log(" Réponse API :", response.data);

            return { id, updatedData: response.data.data };
        } catch (error) {
            console.error(" Erreur API :", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour");
        }
    }
);

//  Action pour supprimer un laboratoire
export const deleteLabo = createAsyncThunk(
    "labos/deleteLabo",
    async (id, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            if (!token) throw new Error("Utilisateur non authentifié !");

            console.log(` Suppression du labo ID ${id}...`);

            await axios.delete(`${DOMAIN_URL}/laboratories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(" Labo supprimé !");
            return id; // Retourne l'ID du labo supprimé
        } catch (error) {
            console.error("Erreur API lors de la suppression :", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Erreur lors de la suppression");
        }
    }
);



  
  
 
// Création du Slice Redux
const laboSlice = createSlice({
    name: "labos",
    initialState: { list: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        //  Gestion de la récupération des laboratoires
        .addCase(fetchLabos.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchLabos.fulfilled, (state, action) => {
          state.loading = false;
          console.log(" Liste des labos mise à jour :", action.payload);
          state.list = action.payload;
        })
        .addCase(fetchLabos.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        // Gestion de la création d'un laboratoire
        .addCase(createLabo.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createLabo.fulfilled, (state, action) => {
          state.loading = false;
          state.list.push(action.payload);
        })
        .addCase(createLabo.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        // Gestion de la mise à jour d'un laboratoire
        .addCase(updateLabo.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateLabo.fulfilled, (state, action) => {
            state.loading = false;
            console.log(" Données reçues par Redux après update :", action.payload);
        
            const { id, updatedData } = action.payload;
        
            // Nouveau log pour voir si updatedData contient bien les bonnes infos
            console.log(" Vérification : updatedData reçu dans Redux :", updatedData);
        
            const index = state.list.findIndex((labo) => labo.id === id);
            if (index !== -1) {
                state.list[index] = { ...state.list[index], ...updatedData }; 
            }
        
            console.log(" Labo mis à jour :", state.list);
        })
        .addCase(updateLabo.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // Gestion de la suppression d'un laboratoire
.addCase(deleteLabo.pending, (state) => {
    state.loading = true;
    state.error = null;
})
.addCase(deleteLabo.fulfilled, (state, action) => {
    state.loading = false;
    console.log(" Labo supprimé de Redux :", action.payload);
    state.list = state.list.filter((labo) => labo.id !== action.payload); 
})
.addCase(deleteLabo.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
});

    },
  });
  
  // Exportation du reducer pour le store Redux
  export default laboSlice.reducer;
  