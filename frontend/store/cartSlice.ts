import ProductCard from "@/components/layout/product/ProductCard";
import api from "@/lib/api";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ---------------- TYPES ---------------- */

interface CartState {
  items: CartItem[];
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: CartState = {
  items: [],
};

/* ---------------- ASYNC THUNKS ---------------- */
/* THESE REPLACE your Context login/register */

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await api.get("/cart");

  return res.data.items.map((item: any) => ({
    product: {
      _id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      stock: item.productId.stock,
      images: item.productId.images,
    },
    quantity: item.quantity,
  })) as CartItem[]; // this is what action returns
});

export const addItem = createAsyncThunk(
  "cart/addItem",
  async (product: Product) => {
    await api.post("/cart", { productId: product._id, quantity: 1 }); // backend handles if new product or not
    return product;
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async ({ productId, delta }: { productId: string; delta: number }) => {
    await api.patch(`/cart/${productId}`, { delta });
    return { productId, delta };
  }
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (productId: string) => {
    await api.delete(`/cart/${productId}`);
    return productId;
  }
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

    builder.addCase(addItem.fulfilled, (state, action) => {
      const existing = state.items.find(
        (i) => i.product._id === action.payload._id
      );

      if (existing) existing.quantity++;
      else state.items.push({ product: action.payload, quantity: 1 });
    });

    builder.addCase(removeItem.fulfilled, (state, action) => {
      state.items = state.items.filter((i) => i.product._id !== action.payload);
    });

    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      const item = state.items.find(
        (i) => i.product._id === action.payload.productId
      );

      if (!item) return;

      item.quantity += action.payload.delta;

      if (item.quantity <= 0) {
        state.items.filter((i) => {
          i.product._id !== action.payload.productId;
        });
      }

      builder.addCase(clearCart.fulfilled, (state, action) => {
        state.items = []; // always an empty array
      });
    });
  },
});

/* ---------------- EXPORTS ---------------- */
// If logout in child component called by itself, return {type: 'auth/logout'} to reducer, thus should always be called via dispatch(logout())

// export const { logout, loadFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
