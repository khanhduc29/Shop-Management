import { FC, memo, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteItemType } from "../types/routes.types";
import DefaultLayout from "../layouts/DefaultLayout";
import { AUTH_LIST, AUTH_ROUTE, HOME_LIST } from "./app.routes";
import AuthLayout from "../layouts/AuthLayout";
import { RootState, useAppSelector } from "../store/store";

const RouteWrapper: FC<RouteItemType> = ({
  element: Component,
  isAuthRoute,
}) => {

  const { isAuthenticated } = useAppSelector((state: RootState) => state.authManagement);

  if (!isAuthenticated && isAuthRoute) {
    return <Navigate to={AUTH_ROUTE} replace />;
  }

  return (
    <Component />
  );
};

const AppRoutes: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          {HOME_LIST.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<RouteWrapper {...route} />}
            />
          ))}
        </Route>

        <Route path="" element={<AuthLayout />}>
          {AUTH_LIST.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<RouteWrapper {...route} />}
            />
          ))}
        </Route>

      </Routes>
    </Suspense>
  );
};

export default memo(AppRoutes);
