import axios, { InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../auth/tokenStorage";

const api = axios.create({
  baseURL: "" 
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken(); // ваш метод

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
