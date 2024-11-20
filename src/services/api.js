import axios from "axios";

const API_URL = "http://localhost:5000/api/fca";

export const fetchPlants = async () => {
    try {
        const response = await axios.get(`${API_URL}/plants`);
        return response.data;
    } catch (error) {
        console.error("Error fetching plants:", error);
        return [];
    }
};

export const fetchPOs = async (plant) => {
    try {
        const response = await axios.get(`${API_URL}/pos/${plant}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching PO for ${plant}:`, error);
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
