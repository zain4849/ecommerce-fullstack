import api from "@/lib/api";
import User from "@/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ---------------- TYPES ---------------- */

interface AuthState {
  user: User | null;
  token: string | null;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: AuthState = {
  user: null,
  token: null,
};

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      (state.user = null),
        (state.token = null),
        localStorage.removeItem("user");
      localStorage.removeItem("token");

      delete api.defaults.headers.common["Authorization"];
    },

    loadFromStorage: (state) => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (user && token) {
        state.token = token;
        state.token = JSON.parse(user);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.userData;
      state.token = action.payload.token;
    });
  },
});


/* ---------------- ASYNC THUNKS ---------------- */
/* THESE REPLACE your Context login/register */

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // side effects (same as your context)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.userData));
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      return res.data; // action.payload === res.data
    } catch (err) {
      return rejectWithValue("Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { dispatch }
  ) => {
    await api.post("/auth/register", { name, email, password });

    // reuse login logic
    await dispatch(login({ email, password }));
  }
);
/* ---------------- EXPORTS ---------------- */
// If logout in child component called by itself, return {type: 'auth/logout'} to reducer, thus should always be called via dispatch(logout())

export const { logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
