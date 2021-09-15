import axios, { AxiosRequestConfig } from "axios";

export const authAxios = axios.create({
  baseURL: process.env.PUBLIC_URL,
  // headers: {
  //     Authorization:
  // }
});

authAxios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers.Authorization = `${localStorage.getItem("currentUserToken")}`;
  return config;
});
