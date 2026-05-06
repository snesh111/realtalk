import api from "./axiosInstance";

export const getCommentsAPI = (postId) => api.get(`/posts/${postId}/comments`);
export const createCommentAPI = (postId, data) =>
  api.post(`/posts/${postId}/comments`, data);
export const updateCommentAPI = (commentId, data) =>
  api.patch(`/comments/${commentId}`, data);
export const deleteCommentAPI = (commentId) =>
  api.delete(`/comments/${commentId}`);
