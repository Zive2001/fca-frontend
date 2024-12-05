import axios from "axios";

const API_URL = "http://localhost:5001/api/fca";

export const fetchPlants = async () => {
    try {
        const response = await axios.get(`${API_URL}/plants`);
        return response.data;
    } catch (error) {
        console.error("Error fetching plants:", error);
        return [];
    }
};

export const fetchModules = async (plant) => {
    try {
        const response = await axios.get(`${API_URL}/modules/${plant}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching PO for ${plant}:`, error);
        return [];
    }
};

export const fetchPOs = async (module) => {
    try {
        const response = await axios.get(`${API_URL}/pos/${module}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching PO for ${module}:`, error);
        return [];
    }
};

export const fetchSizes = async (po) => {
    try {
        const response = await axios.get(`${API_URL}/sizes/${po}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching sizes for ${po}:`, error);
        return [];
    }
};

export const fetchStyles = async (po) => {
    try {
        const response = await axios.get(`${API_URL}/styles/${po}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching sizes for ${po}:`, error);
        return [];
    }
};

export const fetchCustomers = async (po) => {
    try {
        const response = await axios.get(`${API_URL}/customers/${po}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching sizes for ${po}:`, error);
        return [];
    }
};


export const fetchDefectCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/defect-categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching defect categories:", error);
        return [];
    }
};

export const fetchDefectCodes = async (category) => {
    try {
        const response = await axios.get(`${API_URL}/defect-codes/${category}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching defect codes for ${category}:`, error);
        return [];
    }
};

export const submitFCAData = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/submit`, data);
        return response.data;
    } catch (error) {
        console.error("Error submitting FCA data:", error);
        throw error;
    }
};

// Fetch data with filters
export const getFCAData = async (filters) => {
    const { plant, module, shift, po, size, status, date, page, limit } = filters;
    const params = {
        plant,
        module,
        shift,
        po,
        size,
        status,
        date,
        page,
        limit,
    };
    const response = await axios.get(`${API_URL}/data`, { params });
    return response.data;
};

// Update FCA data
export const updateFCAData = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}/data/${id}`, updatedData);
    return response.data;
};

// Delete FCA data
export const deleteFCAData = async (id) => {
    const response = await axios.delete(`${API_URL}/data/${id}`);
    return response.data;
};
