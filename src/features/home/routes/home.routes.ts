import React from 'react';
import { RouteItemType } from '../../../types/routes.types';
import { HomePathsEnum } from '../constants/home.path';

const DashboardScreen = React.lazy(
  () => import('../screens/Dashboard/Dashboard')
);
const UserScreen = React.lazy(
  () => import('../screens/UserManagement/UserManagement')
);
const ProductScreen = React.lazy(
  () => import('../screens/ProductManagement/ProductManagement')
);

const BlogScreen = React.lazy(() => import('../screens/Blog/Blog'));

const OrderScreen = React.lazy(() => import('../screens/Order/Order'));

const OrderEditScreen = React.lazy(() => import('../screens/Order/EditOrder'));

const UserEditScreen = React.lazy(
  () => import('../screens/UserManagement/EditUser')
);

const ProductEditScreen = React.lazy(
  () => import('../screens/ProductManagement/DetailProduct')
);

const BrandScreen = React.lazy(
  () => import('../screens/BrandAndCategory/BrandAndCategory')
);

const CouponScreen = React.lazy(() => import('../screens/Coupon/Coupon'));

export const DASHBOARD_SCREEN: RouteItemType = {
  id: 'dashboard',
  path: HomePathsEnum.DASHBOARD,
  element: DashboardScreen,
  isAuthRoute: true,
  breadcrumbs: 'Home',
};

export const USER_SCREEN: RouteItemType = {
  id: 'user',
  path: HomePathsEnum.USER,
  element: UserScreen,
  isAuthRoute: true,
  breadcrumbs: 'User Management',
};

export const USER_EDIT_SCREEN: RouteItemType = {
  id: 'user_edit',
  path: HomePathsEnum.USER_EDIT,
  element: UserEditScreen,
  isAuthRoute: true,
  breadcrumbs: 'User Details',
};

export const PRODUCT_SCREEN: RouteItemType = {
  id: 'product',
  path: HomePathsEnum.PRODUCT,
  element: ProductScreen,
  isAuthRoute: true,
  breadcrumbs: 'Product Management',
};

export const PRODUCT_EDIT_SCREEN: RouteItemType = {
  id: 'product',
  path: HomePathsEnum.PRODUCT_EDIT,
  element: ProductEditScreen,
  isAuthRoute: true,
  breadcrumbs: 'Product Edit Management',
};

export const BLOG_SCREEN: RouteItemType = {
  id: 'blog',
  path: HomePathsEnum.BLOG,
  element: BlogScreen,
  isAuthRoute: true,
  breadcrumbs: 'Blog Management',
};

export const ORDER_SCREEN: RouteItemType = {
  id: 'order',
  path: HomePathsEnum.ORDER,
  element: OrderScreen,
  isAuthRoute: true,
  breadcrumbs: 'Order Management',
};

export const ORDER_EDIT_SCREEN: RouteItemType = {
  id: 'order_edit',
  path: HomePathsEnum.ORDER_EDIT,
  element: OrderEditScreen,
  isAuthRoute: true,
  breadcrumbs: 'Order Management',
};

export const BRAND_SCREEN: RouteItemType = {
  id: 'brand',
  path: HomePathsEnum.BRAND,
  element: BrandScreen,
  isAuthRoute: true,
  breadcrumbs: 'Brand Management',
};

export const COUPON_SCREEN: RouteItemType = {
  id: 'coupon',
  path: HomePathsEnum.COUPON,
  element: CouponScreen,
  isAuthRoute: true,
  breadcrumbs: 'Coupon Management',
};

export const HOME_ROUTES = [
  DASHBOARD_SCREEN,
  USER_SCREEN,
  PRODUCT_SCREEN,
  BLOG_SCREEN,
  ORDER_SCREEN,
  USER_EDIT_SCREEN,
  PRODUCT_EDIT_SCREEN,
  BRAND_SCREEN,
  COUPON_SCREEN,
  ORDER_EDIT_SCREEN,
];
