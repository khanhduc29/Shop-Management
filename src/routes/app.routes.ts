import AUTH_ROUTES from "../features/auth/routes/auth.routes";
import { HOME_ROUTES } from "../features/home/routes/home.routes";

export const ROOT_ROUTE = "/";
export const AUTH_ROUTE = "/sign-in";

export const HOME_LIST = [...HOME_ROUTES];
export const AUTH_LIST = [...AUTH_ROUTES];
