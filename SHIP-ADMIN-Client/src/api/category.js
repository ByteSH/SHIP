import axios from 'axios';

const API_BASE_URL = '/api/categories';

export const getToken = () => localStorage.getItem('ship_admin_token');

export const getHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch all categories
 */
export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/list`, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) throw error.response.data;
        throw error;
    }
};

/**
 * Add a new category using an image URL
 */
export const addCategoryWithUrl = async (categoryName, imageUrl) => {
    try {
        const params = new URLSearchParams();
        params.append('category', categoryName);
        params.append('imageUrl', imageUrl);

        const response = await axios.post(`${API_BASE_URL}/add-with-url?${params.toString()}`, null, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) throw error.response.data;
        throw error;
    }
};

/**
 * Add a new category with an uploaded file
 */
export const addCategory = async (categoryName, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('category', categoryName);
        formData.append('image', imageFile);

        const response = await axios.post(`${API_BASE_URL}/add`, formData, {
            headers: {
                ...getHeaders()
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) throw error.response.data;
        throw error;
    }
};

/**
 * Edit an existing category
 */
export const editCategory = async (oldName, newName, newImageUrl) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/edit/${encodeURIComponent(oldName)}?newCategoryName=${encodeURIComponent(newName)}&newImageUrl=${encodeURIComponent(newImageUrl)}`, null, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) throw error.response.data;
        throw error;
    }
};

/**
 * Delete a category by name
 */
export const deleteCategory = async (categoryName) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/delete/${encodeURIComponent(categoryName)}`, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) throw error.response.data;
        throw error;
    }
};
