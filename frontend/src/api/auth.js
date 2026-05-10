import api from "./axios";

// REGISTER
export const registerUser = async (userData) => {
  const response = await api.post("users/register/", userData);
  return response.data;
};

// LOGIN
export const loginUser = async (userData) => {
  const response = await api.post("users/login/", userData);
  return response.data;
};