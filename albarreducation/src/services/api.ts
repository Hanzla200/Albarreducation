import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (
    typeof window !== "undefined" &&
    !(config as typeof config & { skipAuth?: boolean }).skipAuth
  ) {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${jwt}`;
    }
  }
  return config;
});

export default api;
