import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../../api/api';

export const getCategory = createAsyncThunk(
  'home/category',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get('productcategory');
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getBrand = createAsyncThunk(
  'home/brand',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get('brand');
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

