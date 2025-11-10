import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// helper to set auth header
API.setToken = (token) => {
  API.defaults.headers.common["Authorization"] = token
    ? `Bearer ${token}`
    : undefined;
};

export default API;
