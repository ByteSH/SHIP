import axios from 'axios';

const API_BASE_URL = '/api/auth';

export const requestOtp = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/request-otp`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data; // e.g. for custom error messages from backend
    }
    throw error;
  }
};

export const verifyLogin = async (username, password, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
      otp,
    });
    return response.data; // expecting { token: '...' }
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};
