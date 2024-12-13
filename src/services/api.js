import axios from "axios";

// Base API URL
export const API_URL = "http://localhost:5001/api/fca";

// Plant and Module APIs
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
    console.error(`Error fetching modules for plant ${plant}:`, error);
    return [];
  }
};

export const fetchPOs = async (module) => {
  try {
    const response = await axios.get(`${API_URL}/pos/${module}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching POs for module ${module}:`, error);
    return [];
  }
};

export const fetchSizes = async (po) => {
  try {
    const response = await axios.get(`${API_URL}/sizes/${po}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sizes for PO ${po}:`, error);
    return [];
  }
};

export const fetchStyles = async (po) => {
  try {
    const response = await axios.get(`${API_URL}/styles/${po}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching styles for PO ${po}:`, error);
    return [];
  }
};

export const fetchCustomers = async (po) => {
  try {
    const response = await axios.get(`${API_URL}/customers/${po}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customers for PO ${po}:`, error);
    return [];
  }
};

// Defect APIs
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
    console.error(`Error fetching defect codes for category ${category}:`, error);
    return [];
  }
};

// FCA Data APIs
export const submitFCAData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/submit`, data);
    return response.data;
  } catch (error) {
    console.error("Error submitting FCA data:", error);
    throw error;
  }
};

export const getFCAData = async (filters) => {
  const { plant, module, shift, po, size, status, date, page, limit } = filters;
  try {
    const response = await axios.get(`${API_URL}/data`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching FCA data:", error);
    return [];
  }
};

export const updateFCAData = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/data/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating FCA data with ID ${id}:`, error);
    throw error;
  }
};

export const deleteFCAData = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/data/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting FCA data with ID ${id}:`, error);
    throw error;
  }
};

// Excel File Upload API
export const uploadExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    throw error;
  }
};
