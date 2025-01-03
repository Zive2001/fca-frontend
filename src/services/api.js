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
    if (!response.data || response.data.length === 0) {
      console.warn(`No sizes found for PO ${po}`);
      return [];
    }
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

export const uploadDefectPhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/upload-defect-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Contains { photoUrl }
  } catch (error) {
    console.error('Error uploading defect photo:', error.response?.data || error.message);
    throw error;
  }
};

// Add these functions to your api.js file

// Photo-related API endpoints
export const addDefectPhoto = async (formData) => {
  try {
      const response = await axios.post(`${API_URL}/photos/add`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error uploading defect photo:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to upload photo');
  }
};

export const getDefectPhoto = async (photoId) => {
  try {
    const response = await axios.get(`${API_URL}/photos/${photoId}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Error fetching defect photo:', error);
    throw error;
  }
};

export const getDefectPhotos = async (defectId) => {
  try {
    const response = await axios.get(`${API_URL}/photos/defect/${defectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching defect photos:', error);
    return [];
  }
};

export const deleteDefectPhoto = async (photoId) => {
  try {
    const response = await axios.delete(`/api/fca/photos/${photoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting defect photo:', error);
    throw error;
  }
};

export const fetchLocationCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/location-categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching location categories:", error);
    return [];
  }
};

export const fetchDefectLocations = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/defect-locations/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching defect locations for category ${category}:`, error);
    return [];
  }
};