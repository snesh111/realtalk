import api from "./axiosInstance";

export const registerAPI = (data) => api.post("/auth/register", data);
export const loginAPI = (data) => api.post("/auth/login", data);
export const logoutAPI = () => api.post("/auth/logout");
