import api from "./axiosInstance";

export const getPostsAPI = (params) => api.get("/posts", { params });
export const getPostAPI = (postId) => api.get(`/posts/${postId}`);
export const createPostAPI = (data) => api.post("/posts", data);
export const updatePostAPI = (postId, data) => api.patch(`/posts/${postId}`, data);
export const deletePostAPI = (postId) => api.delete(`/posts/${postId}`);
export const markSolutionAPI = (postId, commentId) =>
  api.patch(`/posts/${postId}/solution`, { commentId });
export const getCategoryCountsAPI = () => api.get("/posts/category-counts");
