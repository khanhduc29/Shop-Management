import { UserList } from '../../auth/types/auth.types';
import { Brand, Category } from '../types/home.types';
import { OrderType } from '../types/order.typs';
import { ProductType } from '../types/product.types';

export type productPage = {
  products: ProductType[];
  totalProducts: number;
  page: number;
  sort?: string[];
  title?: string;
  'price[lt]'?: number;
  'price[gte]'?: number;
  color?: string[];
  category?: string;
};

export type userPage = {
  users: UserList[];
  totalUsers: number;
  page: number;
};

export type orderPage = {
  orders: OrderType[];
  totalOrders: number;
  page: number;
};

export type Language = {
  code: string;
  name: string;
};

export type InitialAuthState = {
  brand: Brand[];
  categories: Category[];
  productPage: productPage;
  userPage: userPage;
  orderPage: orderPage;
  language: Language;
};
