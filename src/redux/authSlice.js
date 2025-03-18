import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const DOMAIN_URL = import.meta.env.VITE_API_URL; // ✅ Met à jour ici !


// 🎯 Action asynchrone pour la connexion
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, motDePasse }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${DOMAIN_URL}/login`, {
          email,
          mot_de_passe: motDePasse,
        });
  
        console.log("✅ Connexion réussie :", response.data); // Ajout du log ici ✅
  
        // Stocker le token dans localStorage
        localStorage.setItem('token', response.data.token);
  
        return response.data; // Retourne les données de l'utilisateur
      } catch (error) {
        console.error("❌ Erreur de connexion :", error);
        return rejectWithValue(error.response?.data?.message || "Erreur de connexion");
      }
    }
  );
  

// 🎯 Reducer pour gérer l'état d'authentification
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token'); // Supprimer le token
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
