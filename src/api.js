import axios from "axios";
import { useAuthStore } from "./store/useAuthStore";

const auth = useAuthStore();

const url =
  import.meta.env.VITE_ENV === "dev"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL_PROD;

const token =
  auth.user?.currentToken ??
  JSON.parse(localStorage.getItem("user") ?? '{"currentToken": "undefinied!"}')
    ?.currentToken;

const api = axios.create({
  baseURL: url,
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
});

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;

export default api;
