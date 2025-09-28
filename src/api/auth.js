import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => api.post("/signup", data);

export const login = async (data) => {
  const res = await api.post("/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const forgotPassword = (data) => api.post("/forgot-password", data);

export const getProfile = () => api.get("/profile");
