import React from "react";
import { RouteItemType } from "../../../types/routes.types";
import { AuthPathsEnum } from "../constants/auth.path";

const SIGN_IN_SCREEN: RouteItemType = {
  id: "auth_login",
  path: AuthPathsEnum.SIGN_IN,
  element: React.lazy(() => import("../screen/LoginScreen/LoginScreen")),
  isAuthRoute: false,
};

const AUTH_ROUTES = [SIGN_IN_SCREEN];

export default AUTH_ROUTES;
