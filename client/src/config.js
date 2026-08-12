// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  return imagePath.startsWith("http") ? imagePath : `${API_BASE_URL}${imagePath}`;
};
