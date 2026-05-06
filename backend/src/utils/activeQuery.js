export const activeQuery = (extra = {}) => ({
  isDeleted: false,
  ...extra,
});