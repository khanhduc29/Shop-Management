import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Brand, Category } from '../types/home.types';
import { getBrand, getCategory } from './home.action';
import {
  InitialAuthState,
  Language,
  orderPage,
  productPage,
  userPage,
} from './initial.value';

const initialState: InitialAuthState = {
  brand: [],
  categories: [],
  productPage: {
    products: [],
    totalProducts: 0,
    page: 1,
    sort: [],
    title: '',
    'price[lt]': 30000000,
    'price[gte]': 0,
    color: [],
    category: '',
  },
  userPage: {
    users: [],
    totalUsers: 0,
    page: 1,
  },
  orderPage: {
    orders: [],
    totalOrders: 0,
    page: 1,
  },
  language: {
    code: 'vi',
    name: 'Tiếng Việt',
  },
};

const authSlice = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {
    getProductList: (state, action: PayloadAction<productPage>) => {
      state.productPage.products = action.payload.products;
      state.productPage.totalProducts = action.payload.totalProducts;
      state.productPage.page = action.payload.page;
    },
    removeFilter: (state, action: PayloadAction<{ filterType: string }>) => {
      const { filterType } = action.payload;
      switch (filterType) {
        case 'sort':
          state.productPage.sort = [];
          break;
        case 'category':
          state.productPage.category = '';
          break;
        case 'color':
          state.productPage.color = [];
          break;
        case 'price':
          state.productPage['price[lt]'] = 30000000;
          state.productPage['price[gte]'] = 0;
          break;
        default:
          break;
      }
    },
    getFilter: (state, action: PayloadAction<any>) => {
      state.productPage.sort = action.payload.sort;
      state.productPage.title = action.payload.title;
      state.productPage.page = action.payload.page;
      state.productPage['price[lt]'] = action.payload['price[lt]'];
      state.productPage['price[gte]'] = action.payload['price[gte]'];
      state.productPage.color = action.payload.color;
      state.productPage.category = action.payload.category;
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.productPage.products = state.productPage.products.filter(
        (product) => product._id !== action.payload
      );
    },
    getListUser: (state, action: PayloadAction<userPage>) => {
      state.userPage.users = action.payload.users;
      state.userPage.totalUsers = action.payload.totalUsers;
      state.userPage.page = action.payload.page;
    },
    updateUserInfo: (state, action: PayloadAction<any>) => {
      state.userPage.users = state.userPage.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    },
    getListOrder: (state, action: PayloadAction<orderPage>) => {
      state.orderPage.orders = action.payload.orders;
      state.orderPage.totalOrders = action.payload.totalOrders;
      state.orderPage.page = action.payload.page;
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orderPage.orders = state.orderPage.orders.filter(
        (order) => order._id !== action.payload
      );
    },
    addBrand: (state, action: PayloadAction<Brand>) => {
      state.brand.push(action.payload);
    },
    deleteBrand: (state, action: PayloadAction<string>) => {
      state.brand = state.brand.filter((brand) => brand._id !== action.payload);
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (category) => category._id !== action.payload
      );
    },
    changeLanguageApp: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategory.fulfilled, (state, action) => {
        state.categories = action.payload.prodCategories;
      })
      .addCase(getBrand.fulfilled, (state, action) => {
        state.brand = action.payload.prodBrands;
      });
  },
});

export const {
  addBrand,
  deleteBrand,
  addCategory,
  deleteCategory,
  getListUser,
  getProductList,
  getListOrder,
  deleteProduct,
  changeLanguageApp,
  updateUserInfo,
  removeFilter,
  getFilter,
} = authSlice.actions;

export const homeReducer = authSlice.reducer;
