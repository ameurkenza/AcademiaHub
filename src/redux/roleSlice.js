import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const DOMAIN_URL = import.meta.env.VITE_API_URL;
const ROLE_URL = `${DOMAIN_URL}/roles`;

// ✅ Récupérer le token depuis Redux
const getToken = (getState) => getState().auth.token;

// ✅ Récupérer tous les rôles (GET)
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      if (!token) throw new Error("Utilisateur non authentifié");

      const response = await axios.get(ROLE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement des rôles");
    }
  }
);

// ✅ Supprimer un rôle (DELETE)
export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      if (!token) throw new Error("Utilisateur non authentifié");

      await axios.delete(`${ROLE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la suppression du rôle");
    }
  }
);

// 🎯 **Création du Slice**
const roleSlice = createSlice({
  name: "roles",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.list = state.list.filter((role) => role.id !== action.payload);
      });
  },
});

// ✅ Export du reducer
export default roleSlice.reducer;
