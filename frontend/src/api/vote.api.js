import api from "./axiosInstance";

export const castVoteAPI = (data) => api.post("/votes", data);
