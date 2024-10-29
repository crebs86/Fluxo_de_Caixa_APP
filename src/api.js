import axios from "axios";
import { useAuthStore } from "./store/useAuthStore";

const store = useAuthStore();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${store.user?.currentToken}`,
    Accept: "application/json",
  },
});

export default api;
