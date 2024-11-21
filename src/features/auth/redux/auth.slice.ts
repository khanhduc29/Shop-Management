import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { InitialAuthState } from "../types/auth.types";
import { postLogin, postLogout } from "./auth.actions";

const initialState: InitialAuthState = {
  isAuthenticated: false,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postLogin.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.success;
        state.userInfo = action.payload.userData;
      })
      .addCase(postLogout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.userInfo = null;
      });
  },
});

const authConfig = {
  key: "auth",
  storage,
  whitelist: ["isAuthenticated", "userInfo"],
};

export const authReducer = persistReducer(authConfig, authSlice.reducer);
