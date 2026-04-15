import axios from 'axios';

const API_BASE_URL = '/api/products';

export const getToken = () => localStorage.getItem('ship_admin_token');

export const getHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch products by category name
 */
export const getProductsByCategory = async (categoryName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/names/${encodeURIComponent(categoryName)}`, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) throw error.response.data;
        throw error;
    }
};

/**
 * Add a new product with URLs
 */
export const addProductWithUrls = async (productData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add-with-urls`, productData, {
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) throw error.response.data;
        throw error;
    }
};

/**
 * Add a new product with image files
 */
export const addProduct = async (productData, imageFiles) => {
    try {
        const formData = new FormData();
        const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
        formData.append('product', productBlob);

        Array.from(imageFiles).forEach(file => {
            formData.append('images', file);
        });

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
 * Edit an existing product
 */
export const editProduct = async (uniqueId, productData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/edit/${uniqueId}`, productData, {
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) throw error.response.data;
        throw error;
    }
};

/**
 * Delete a product by unique ID
 */
export const deleteProduct = async (uniqueId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/delete/${uniqueId}`, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) throw error.response.data;
        throw error;
    }
};
