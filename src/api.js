import axios from "axios";
import { useAuthStore } from "./store/useAuthStore";

const store = useAuthStore();

const url =
  import.meta.env.VITE_ENV === "dev"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL_PROD;

const api = axios.create({
  baseURL: url,
  headers: {
    Authorization: `Bearer ${store.user?.currentToken}`,
    Accept: "application/json",
  },
});

export default api;
