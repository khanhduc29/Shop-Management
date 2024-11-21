export type InitialAuthState = {
  // accessToken: string | null;
  isAuthenticated: boolean;
  userInfo: User | null;
};

export type User = {
  _id: string;
  email: string;
  avatar: string;
  firstname: string;
  lastname: string;
  isBlocked: boolean;
  mobile: string;
};

export type UserList = {
  _id: string;
  email?: string;
  avatar?: string;
  mobile?: string;
  firstname: string;
  lastname: string;
  isBlocked?: boolean;
  role?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginDataDef = {
  email: string;
  password: string;
};

export type FromValue = {
  email: string;
  password: string;
};
