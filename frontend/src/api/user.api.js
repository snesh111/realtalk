import api from "./axiosInstance";

export const getUserProfileAPI = (username) => api.get(`/users/${username}`);
