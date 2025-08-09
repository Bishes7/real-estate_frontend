import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../slices/apiSlice";
import authSlicerReducer from "../slices/authSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlicerReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
