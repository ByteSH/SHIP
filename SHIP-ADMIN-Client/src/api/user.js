import axios from 'axios';

const API_BASE_URL = '/api/admin/users';

export const createUser = async (userData) => {
  const token = localStorage.getItem('ship_admin_token');
  try {
    const response = await axios.post(API_BASE_URL, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getAllUsers = async () => {
  const token = localStorage.getItem('ship_admin_token');
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getUser = async (username) => {
  const token = localStorage.getItem('ship_admin_token');
  try {
    const response = await axios.get(`${API_BASE_URL}/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const updateUser = async (username, userData) => {
  const token = localStorage.getItem('ship_admin_token');
  try {
    const response = await axios.put(`${API_BASE_URL}/${username}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const deleteUser = async (username) => {
  const token = localStorage.getItem('ship_admin_token');
  try {
    const response = await axios.delete(`${API_BASE_URL}/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};
