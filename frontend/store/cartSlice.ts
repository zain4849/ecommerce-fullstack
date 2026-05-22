import api from "@/lib/api";
import { CartItem } from "@/types/cart";
import { Product, getProductId } from "@/types/product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ---------------- TYPES ---------------- */

interface CartState {
  items: CartItem[];
  loading: boolean;
}

const getErrorMessage = (err: unknown, fallback: string) => {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object" &&
    (err as { response?: { data?: unknown } }).response?.data &&
    typeof (err as { response?: { data?: { error?: unknown } } }).response?.data?.error === "string"
  ) {
    return (err as { response: { data: { error: string } } }).response.data.error;
  }
  return fallback;
};

/* ---------------- INITIAL STATE ---------------- */

const initialState: CartState = {
  items: [],
  loading: false,
};

/* ---------------- ASYNC THUNKS ---------------- */

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await api.get("/cart");

  return res.data.items.map(
    (item: { product: Product; quantity: number }) => ({
      product: item.product,
      quantity: item.quantity,
    }),
  ) as CartItem[];
});

export const addItem = createAsyncThunk(
  "cart/addItem",
  async (product: Product, { rejectWithValue }) => {
    try {
      await api.post("/cart", { productId: getProductId(product), quantity: 1 });
      return product;
    } catch (err: unknown) {
      return rejectWithValue({
        product,
        error: getErrorMessage(err, "Failed to add item"),
      });
    }
  },
);

export const updateQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (
    { productId, delta }: { productId: string; delta: number },
    { rejectWithValue },
  ) => {
    try {
      await api.patch(`/cart/${productId}`, { delta });
      return { productId, delta };
    } catch (err: unknown) {
      return rejectWithValue({
        productId,
        delta,
        error: getErrorMessage(err, "Failed to update"),
      });
    }
  },
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/${productId}`);
      return productId;
    } catch (err: unknown) {
      return rejectWithValue({
        productId,
        error: getErrorMessage(err, "Failed to remove"),
      });
    }
  },
);

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  await api.delete(`/cart`);
});

/* ---------------- SLICE ---------------- */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });

    // Optimistic: update UI immediately on pending
    builder.addCase(addItem.pending, (state, action) => {
      const product = action.meta.arg;
      const pid = getProductId(product);
      const existing = state.items.find((i) => getProductId(i.product) === pid);
      if (existing) existing.quantity++;
      else state.items.push({ product, quantity: 1 });
    });
    builder.addCase(addItem.rejected, (state, action) => {
      // Rollback: undo the optimistic add
      const { product } = action.payload as { product: Product; error: string };
      const pid = getProductId(product);
      const existing = state.items.find((i) => getProductId(i.product) === pid);
      if (existing) {
        existing.quantity--;
        if (existing.quantity <= 0) {
          state.items = state.items.filter((i) => getProductId(i.product) !== pid);
        }
      }
    });

    // Optimistic: remove immediately on pending
    builder.addCase(removeItem.pending, (state, action) => {
      const productId = action.meta.arg;
      // Save removed item for potential rollback (stored in meta)
      state.items = state.items.filter((i) => getProductId(i.product) !== productId);
    });

    // Optimistic: update quantity immediately on pending
    builder.addCase(updateQuantity.pending, (state, action) => {
      const { productId, delta } = action.meta.arg;
      const item = state.items.find((i) => getProductId(i.product) === productId);
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => getProductId(i.product) !== productId);
      }
    });
    builder.addCase(updateQuantity.rejected, (state, action) => {
      // Rollback: reverse the delta
      const { productId, delta } = action.payload as {
        productId: string;
        delta: number;
        error: string;
      };
      const item = state.items.find((i) => getProductId(i.product) === productId);
      if (item) {
        item.quantity -= delta;
      }
    });

    builder.addCase(clearCart.fulfilled, (state) => {
      state.items = [];
    });
  },
});

/* ---------------- EXPORTS ---------------- */

export default cartSlice.reducer;
