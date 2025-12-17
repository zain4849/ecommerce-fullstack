import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
// import {configureStore} from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    // useSelector doesn't track reducers, it state shape:
    // {
    //   auth: {
    //     user: ...
    //   }
    // }
  },
});

// Below is how it was before using Redux Toolkit
// function authReducer(state = initialState, action) {
//   switch (action.type) {
//     case 'auth/setUser':
//       return setUser(state, action);
//     case 'auth/logout':
//       return logout(state, action);
//     default:
//       return state;
//   }
// }

// Types (important for TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
