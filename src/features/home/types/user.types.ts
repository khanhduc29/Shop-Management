import { ProductCartType } from "./product.types";

export type UserListDef = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: string;
  roles: string;
  address: string;
  joinDate?: string;
  updatedDate?: string;
  isNew?: boolean;
};

export type CartType ={
  id: string;
  product: ProductCartType[];
  quantity: number;
  color: string;
}

export type WishlistType = {
  product: ProductCartType[];
}

export type UserCurrent = {
  _id?: string;
  email: string;
  mobile: string;
  firstname: string;
  lastname: string;
  isBlocked: boolean;
  avatar?: string;
  role: string;
  address: string;
  cart?: CartType[];
  wishlist?: WishlistType[];
  createdAt?: string;
  updatedAt?: string;
  password?: string;
};