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
        state.user = JSON.parse(user);
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
    { dispatch, rejectWithValue }
  ) => {
    try {
      console.log("Registering user:", { name, email });
      const res = await api.post("/auth/register", { name, email, password });
      console.log("Registration successful:", res.data);
      
      // reuse login logic to automatically log the user in after registration
      const loginResult = await dispatch(login({ email, password }));
      
      if (login.fulfilled.match(loginResult)) {
        console.log("Auto-login after registration successful");
      } else {
        console.error("Auto-login after registration failed");
      }
      
      // Return the registration response data
      return res.data;
    } catch (err: any) {
      console.error("Registration error:", err);
      // Return error message for the component to handle
      return rejectWithValue(err.response?.data?.error || err.message || "Registration failed");
    }
  }
);
/* ---------------- EXPORTS ---------------- */
// If logout in child component called by itself, return {type: 'auth/logout'} to reducer, thus should always be called via dispatch(logout())

export const { logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
