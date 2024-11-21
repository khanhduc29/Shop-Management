import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { store } from '../store/store';
import { postLogout } from '../features/auth/redux/auth.actions';

const authInterceptor = (
  request: AxiosRequestConfig
): InternalAxiosRequestConfig => {
  return request as InternalAxiosRequestConfig;
};

const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

const errorInterceptor = (axiosError: any) => {
  // Nếu có lỗi và có response, xử lý lỗi và chuyển đổi response
  if (axiosError && axiosError.response) {
    if (axiosError?.response?.data) {
      const { data } = axiosError.response;
      if (data?.mes == 'jwt must be provided' || data?.mes == 'Cannot read properties of null (reading \'_id\')') {
        store.dispatch(postLogout());
      }
    }
  }
  return Promise.reject(axiosError);
};


export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

instance.interceptors.request.use(authInterceptor);
instance.interceptors.response.use(responseInterceptor, errorInterceptor);