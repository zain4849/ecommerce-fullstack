import api from "@/lib/api";
import User from "@/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ---------------- TYPES ---------------- */

interface AuthState {
  user: User | null;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: AuthState = {
  user: null,
};

/* ---------------- ASYNC THUNKS ---------------- */

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      return res.data;
    } catch (err: unknown) {
      const typedErr = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      return rejectWithValue(
        typedErr.response?.data?.error || typedErr.message || "Login failed",
      );
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      return res.data;
    } catch (err: unknown) {
      const typedErr = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      return rejectWithValue(
        typedErr.response?.data?.error ||
          typedErr.message ||
          "Could not load current user",
      );
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const loginResult = await dispatch(login({ email, password }));

      if (!login.fulfilled.match(loginResult)) {
        return rejectWithValue("Auto-login after registration failed");
      }

      return res.data;
    } catch (err: unknown) {
      const typedErr = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      return rejectWithValue(
        typedErr.response?.data?.error ||
          typedErr.message ||
          "Registration failed",
      );
    }
  },
);

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },

    loadFromStorage: (state) => {
      const user = localStorage.getItem("user");
      if (user) {
        state.user = JSON.parse(user);
      }
    },

    setCurrentUser: (state, action) => {
      state.user = action.payload.userData;
      localStorage.setItem("user", JSON.stringify(action.payload.userData));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.userData;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload.userData;
      localStorage.setItem("user", JSON.stringify(action.payload.userData));
    });
  },
});

/* ---------------- EXPORTS ---------------- */

export const { logout, loadFromStorage, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
