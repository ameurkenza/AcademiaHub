import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; 

const DOMAIN_URL = import.meta.env.VITE_API_URL; 
//  Récupération de la liste des utilisateurs
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); 
      if (!token) throw new Error("Aucun token trouvé. Veuillez vous reconnecter.");

      console.log("🔍 URL utilisée :", `${DOMAIN_URL}/users`);

      const response = await axios.get(`${DOMAIN_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Utilisateurs récupérés :", response.data);
      return response.data.data.users;
    } catch (error) {
      console.error(" Erreur lors de la récupération des utilisateurs :", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors du chargement des utilisateurs");
    }
  }
);

//  Récupération des détails d'un utilisateur
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token trouvé. Veuillez vous reconnecter.");

      console.log(" URL utilisée :", `${DOMAIN_URL}/users/${id}`);

      const response = await axios.get(`${DOMAIN_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Réponse complète de fetchUserById :", response.data);

      if (!response.data || !response.data.data) {
        throw new Error("Données utilisateur invalides reçues.");
      }

      return response.data; 
    } catch (error) {
      console.error(" Erreur lors de la récupération des détails de l'utilisateur :", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors du chargement des détails de l'utilisateur");
    }
  }
);


//  Suppression d'un utilisateur
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token trouvé. Veuillez vous reconnecter.");

      console.log("🗑️ Suppression de l'utilisateur ID :", id);

      const response = await axios.delete(`${DOMAIN_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Utilisateur supprimé :", response.data);

      dispatch(fetchUsers()); 

      return id; // Retourne l'ID supprimé pour mise à jour du state
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la suppression");
    }
  }
);

//  Mise à jour des informations de l'utilisateur
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token trouvé. Veuillez vous reconnecter.");

      console.log(" Mise à jour de l'utilisateur ID :", id);

      const response = await axios.put(`${DOMAIN_URL}/users/${id}`, userData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(" Utilisateur mis à jour :", response.data);

      dispatch(fetchUsers()); 
      return response.data.data;
    } catch (error) {
      console.error(" Erreur lors de la mise à jour de l'utilisateur :", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la mise à jour");
    }
  }
);

// Mise à jour de la photo de l'utilisateur
export const updateUserPhoto = createAsyncThunk(
  "users/updateUserPhoto",
  async ({ id, photoFile }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token trouvé. Veuillez vous reconnecter.");

      const formData = new FormData();
      formData.append("photo", photoFile);

      console.log("📸 Mise à jour de la photo de l'utilisateur ID :", id);

      const response = await axios.put(`${DOMAIN_URL}/users/${id}/photo`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(" Photo mise à jour :", response.data);

      dispatch(fetchUsers()); 
      return response.data.data;
    } catch (error) {
      console.error(" Erreur lors de la mise à jour de la photo :", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la mise à jour de la photo");
    }
  }
);


export const addUserRole = createAsyncThunk(
  "users/addUserRole",
  async ({ id, roleIds }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token trouvé. Veuillez vous reconnecter.");

      console.log(" Ajout des rôles", roleIds, "à l'utilisateur :", id);

      const response = await axios.post(
        `${DOMAIN_URL}/users/${id}/roles`,
        { ids: roleIds }, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      console.log("Rôles ajoutés avec succès :", response.data);

      dispatch(fetchUserById(id)); 
      return response.data;
    } catch (error) {
      console.error(" Erreur lors de l'ajout des rôles :", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de l'ajout des rôles");
    }
  }
);



export const addUserSubject = createAsyncThunk(
  "users/addUserSubject",
  async ({ id, subjectIds }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token trouvé. Veuillez vous reconnecter.");

      console.log("Ajout des matières", subjectIds, "à l'utilisateur :", id);

      const response = await axios.post(
        `${DOMAIN_URL}/users/${id}/subjects`,
        { ids: subjectIds }, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      console.log(" Matières ajoutées avec succès :", response.data);

      dispatch(fetchUserById(id)); // Rafraîchir les détails de l'utilisateur
      return response.data;
    } catch (error) {
      console.error(" Erreur lors de l'ajout des matières :", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de l'ajout des matières");
    }
  }
);

//  Création d'un utilisateur
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Données envoyées à l'API :", userData);

      const response = await axios.post(`${DOMAIN_URL}/users`, userData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });

      return response.data;
    } catch (error) {
      console.error(" Erreur lors de la création de l'utilisateur :", error);
      console.log("Réponse de l'API :", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la création de l'utilisateur");
    }
  }
);





// Création du slice
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => { state.loading = true; })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => { state.loading = true; })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => { state.loading = true; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.users = state.users.map(user => user.id === action.payload.id ? action.payload : user);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserPhoto.pending, (state) => { state.loading = true; })
      .addCase(updateUserPhoto.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedUser && state.selectedUser.data) {
          state.selectedUser.data.photo = action.payload.photo;
        }
        state.users = state.users.map(user => 
          user.id === action.payload.id ? { ...user, photo: action.payload.photo } : user
        );
      })
      .addCase(updateUserPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUserRole.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedUser && state.selectedUser.data) {
          state.selectedUser.data.Roles = action.payload.data.Roles; 
        }
      })
      .addCase(addUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      .addCase(addUserSubject.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUserSubject.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedUser && state.selectedUser.data) {
          state.selectedUser.data.Subjects = action.payload.data.Subjects; 
        }
      })
      .addCase(addUserSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); 
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      

  },
});

export default userSlice.reducer;
