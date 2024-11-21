import { AxiosResponse } from "axios";
import { FromValue } from "../types/auth.types";
import { instance } from "../../../api/api";
import { AuthEndpointsEnum } from "../constants/auth.endpoints";

const signIn = (data: FromValue): Promise<AxiosResponse> => {
  return instance.post(AuthEndpointsEnum.LOGIN, data);
};

const logout = (): Promise<AxiosResponse> => {
  return instance.get(AuthEndpointsEnum.LOGOUT);
};

export const authApi = {
  signIn,
  logout,
};
