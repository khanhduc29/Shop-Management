import { UserList } from "../../auth/types/auth.types";

export type ProductOrderTypeProduct = {
  _id: string;
  title: string;
  thumb: string;
  price: number;
}

export type ProductOrderType = {
  count: number;
  color: string;
  _id?: string;
  product: ProductOrderTypeProduct;
}

export type OrderType = {
  _id: string;
  status: string;
  products?: ProductOrderType[];
  total: number;
  orderBy: UserList;
  createdAt?: string;
  updatedAt?: string;
}