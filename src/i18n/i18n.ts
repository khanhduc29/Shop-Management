import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import USER_EN from '../locales/en/user.json';
import SIDEBAR_EN from '../locales/en/sidebar.json';
import DASHBOARD_EN from '../locales/en/dashboard.json';
import USER_VI from '../locales/vi/user.json';
import SIDEBAR_VI from '../locales/vi/sidebar.json';
import DASHBOARD_VI from '../locales/vi/dashboard.json';
import PRODUCT_EN from '../locales/en/product.json';
import PRODUCT_VI from '../locales/vi/product.json';
import ORDER_EN from '../locales/en/order.json';
import ORDER_VI from '../locales/vi/order.json';
import BRAND_CATEGORY_EN from '../locales/en/brand_category.json';
import BRAND_CATEGORY_VI from '../locales/vi/brand_category.json';

export const locales = {
  en: 'English',
  vi: 'Việt Nam',
};

const resources = {
  en: {
    user: USER_EN,
    sidebar: SIDEBAR_EN,
    dashboard: DASHBOARD_EN,
    product: PRODUCT_EN,
    order: ORDER_EN,
    brandCategory: BRAND_CATEGORY_EN,
  },
  vi: {
    user: USER_VI,
    sidebar: SIDEBAR_VI,
    dashboard: DASHBOARD_VI,
    product: PRODUCT_VI,
    order: ORDER_VI,
    brandCategory: BRAND_CATEGORY_VI,
  },
};

const defaultNS = 'user';

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: ['user', 'sidebar', 'dashboard', 'product', 'order', 'brandCategory'],
  fallbackLng: 'vi',
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
