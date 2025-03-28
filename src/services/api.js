  import axios from "axios";

  // Base API URL

  export const API_URL = "https://sg-prod-bdyapp-fcatest.azurewebsites.net/api/fca";
  //export const API_URL = "http://localhost:8080/api/fca";
  // Create axios instance with default config
  const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
  });
  export const getFailureReport = async (auditId) => {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            const response = await axiosInstance.get(
                `/reports/failure-report/${auditId}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.data) {
                throw new Error('No data received from server');
            }

            // Process the photos if they exist
            if (response.data.defectEntries) {
                response.data.defectEntries = response.data.defectEntries.map(entry => ({
                    ...entry,
                    photos: (entry.photos || []).map(photo => ({
                        ...photo,
                        dataUrl: photo.dataUrl || null,
                        previewUrl: photo.dataUrl
                    }))
                }));
            }

            return response.data;

        } catch (error) {
            retryCount++;
            console.error(`Attempt ${retryCount} failed:`, error.message);

            if (error.response) {
                // Server responded with an error
                const errorMessage = error.response.data?.error || error.message;
                if (error.response.status === 404) {
                    throw new Error(`Report not found: ${errorMessage}`);
                }
                if (retryCount === maxRetries) {
                    throw new Error(`Failed to fetch report: ${errorMessage}`);
                }
            } else if (error.request) {
                // Request made but no response
                if (retryCount === maxRetries) {
                    throw new Error('Unable to reach the server. Please try again later.');
                }
            } else {
                throw error;
            }

            // Wait before retrying
            if (retryCount < maxRetries) {
                await new Promise(resolve => 
                    setTimeout(resolve, Math.pow(2, retryCount) * 1000)
                );
            }
        }
    }
    
    throw new Error('Failed to fetch report after multiple attempts');
  };


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

  export const fetchPOs = async () => {
    try {
      const response = await axios.get(`${API_URL}/pos`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching POs:`, error);
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

  export const fetchCustomerColor = async (po) => {
    try {
      const response = await axios.get(`${API_URL}/color/${po}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer color for PO ${po}:`, error);
      return [];
    }
  };

  export const fetchCustomerColorDesc = async (po) => {
    try {
      const response = await axios.get(`${API_URL}/colordesc/${po}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching color description for PO ${po}:`, error);
      return [];
    }
  };
  export const fetchCPONumber = async (po) => {
    try {
      const response = await axios.get(`${API_URL}/cpo/${po}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching CPO number for PO ${po}:`, error);
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

  // Updated getFCAData function with debugging
export const getFCAData = async (filters) => {
  const { 
    plant, 
    module, 
    shift, 
    po, 
    cpoNumber,
    size, 
    status, 
    style, 
    type, 
    date, 
    page, 
    limit,
    id,           // New filter parameter
    customer,     // New filter parameter
    isThirdParty  // New filter parameter
  } = filters;
  
  try {
    // Format date to YYYY-MM-DD if it exists
    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : null;
    
    // Create an object with all non-empty parameters
    const queryParamsObj = {
      ...(plant && { plant }),
      ...(module && { module }),
      ...(shift && { shift }),
      ...(po && { po }),
      ...(cpoNumber && { cpoNumber }),
      ...(size && { size }),
      ...(status && { status }),
      ...(style && { style }),
      ...(type && { type }),
      ...(formattedDate && { date: formattedDate }),
      ...(id && { id }),                       // Add ID filter parameter if exists
      ...(customer && { customer }),           // Add customer filter parameter if exists
      page: page || 1,
      limit: limit || 10
    };
    
    // Handle isThirdParty specially since it can be boolean or string
    if (isThirdParty !== undefined && isThirdParty !== "") {
      queryParamsObj.isThirdParty = isThirdParty;
    }

    // For debugging - log the actual parameters being sent
    console.log("Query parameters being sent to server:", queryParamsObj);
    
    const queryParams = new URLSearchParams(queryParamsObj);
    
    const response = await axios.get(`${API_URL}/data?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching FCA data:", error);
    throw error;
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
        const response = await axiosInstance.post('/photos/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading defect photo:', error);
        throw error;
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

  // Update these functions in your api.js file
  export const fetchEmailRecipients = async (plantId) => {
    try {
      const response = await axios.get(`${API_URL}/email/recipients/${plantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching email recipients:', error);
      throw error; // Throw the actual error for better debugging
    }
  };

  export const sendFailureNotification = async (data) => {
    try {
      const formData = new FormData();
      formData.append('emailData', JSON.stringify({
        plant: data.plant,
        formData: data.formData,
        auditId: data.auditId,
        defectEntries: data.defectEntries
      }));

      // Update the URL to match your server routes
      const response = await axios.post(`${API_URL}/email/send-notification`, formData);
      return response.data;
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  };

  // Dashboard Analytics API Functions

 // Dashboard Analytics API Functions - Updated with date range parameters

export const fetchDashboardAnalytics = async (startDate, endDate, plant) => {
  try {
    const params = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
      plant: plant || 'all'
    });
    
    // Updated endpoint to match server.js route
    const response = await axios.get(`${API_URL}/analytics/dashboard?${params}`);
    
    if (!response.data) {
      throw new Error('No data received from the server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch dashboard data');
  }
};

export const fetchModuleAnalytics = async (startDate, endDate, plant) => {
  try {
    const params = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
      plant: plant || 'all'
    });
    // Updated endpoint to match server.js route
    const response = await axios.get(`${API_URL}/analytics/module-analysis?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching module analytics:', error);
    throw new Error('Failed to fetch module performance data');
  }
};

export const fetchCustomerAnalytics = async (startDate, endDate, plant) => {
  try {
    const params = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
      plant: plant || 'all'
    });
    // Updated endpoint to match server.js route
    const response = await axios.get(`${API_URL}/analytics/customer-analysis?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    throw new Error('Failed to fetch customer performance data');
  }
};

export const fetchDefectLocationAnalytics = async (startDate, endDate, plant) => {
  try {
    const params = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
      plant: plant || 'all'
    });
    // Updated endpoint to match server.js route
    const response = await axios.get(`${API_URL}/analytics/defect-location-analysis?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching defect location analytics:', error);
    throw new Error('Failed to fetch defect location data');
  }
};

// New endpoint for defect code analysis
export const fetchDefectCodeAnalytics = async (startDate, endDate, plant) => {
  try {
    const params = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
      plant: plant || 'all'
    });
    // New endpoint for defect code analysis
    const response = await axios.get(`${API_URL}/analytics/defect-code-analysis?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching defect code analytics:', error);
    throw new Error('Failed to fetch defect code data');
  }
};
//admin user apis


// Add an interceptor to handle Azure AD tokens
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const response = await fetch('/.auth/me');
    const authData = await response.json();
    if (authData.length > 0) {
      config.headers['X-MS-CLIENT-PRINCIPAL-NAME'] = authData[0].user_id;
    }
  } catch (error) {
    console.error('Error fetching auth data:', error);
  }
  return config;
});

// Check if user is an admin
export const checkAdminStatus = async (email) => {
  try {
    const response = await axiosInstance.get(`/admin/check/${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    if (error.response) {
      console.error('Server responded with:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return { 
      isAdmin: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

// Add a new admin user
export const addAdminUser = async (email, createdBy) => {
  try {
    const response = await axiosInstance.post(`/admin/add`, {
      email,
      createdBy
    });
    return response.data;
  } catch (error) {
    console.error('Error adding admin user:', error);
    throw error;
  }
};

// Get all admin users
export const getAdminUsers = async () => {
  try {
    const response = await axiosInstance.get(`/admin/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error; // Throw error to handle it in the component
  }
};

// Remove an admin user
export const removeAdminUser = async (email) => {
  try {
    const response = await axiosInstance.delete(`/admin/remove/${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error('Error removing admin user:', error);
    throw error;
  }
};

// Debug authentication
export const debugAuth = async () => {
  try {
    const response = await axiosInstance.get(`/admin/auth-debug`);
    return response.data;
  } catch (error) {
    console.error('Error in auth debug:', error);
    return {
      error: error.message,
      authenticated: false
    };
  }
};