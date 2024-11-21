import { FC, ReactNode } from "react";

export type RouteItemType = {
  /**
   * Unique id for the path
   * The id should be the same for paths that are showing the same component
   */
  id: string;
  /**
   * The URL path for when
   * the component should be rendered
   */
  path: string;
  /**
   * Screen (or component) to show
   * when navigating to the menu item
   */
  element: FC;
  /** Layout used for this route */
  layout?: FC;
  /** Determine authenticated route */
  isPrivateRoute?: boolean;
  /**
   * Determine authentication route.
   * Ex: Login, Register, Forgot password...
   * This route can not be access after logging in
   */
  isAuthRoute?: boolean;
  /** Navigation title of menu item for navbar or sidebar */
  navigationTitle?: string;
  /** Page title of the screen to be shown on the header */
  pageTitle?: string;
  /** Icon of menu item for sidebar using https://material.io/resources/icons
   * We are only allowed to use Material UI SVG icons
   */
  icon?: ReactNode;
  /** Sub menu items (max level 1) */
  subMenuItems?: RouteItemType[];
  breadcrumbs?: string;
};

export type RouterLocation = {
  hash?: string;
  key?: string;
  pathname: string;
  search: string;
};
