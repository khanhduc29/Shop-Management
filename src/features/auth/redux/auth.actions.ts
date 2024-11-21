import { createAsyncThunk } from "@reduxjs/toolkit";
import { FromValue } from "../types/auth.types";
import { authApi } from "../apis/auth.api";

export const postLogin = createAsyncThunk(
  "auth/postLogin",
  async (data: FromValue, { rejectWithValue }) => {
    try {
      const response = await authApi.signIn(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const postLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.logout();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
