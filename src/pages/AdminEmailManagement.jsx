import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// Define API endpoint
const API_URL = 'https://sg-prod-bdyapp-fcatest.azurewebsites.net/api/fca';

// Create an axios instance with Azure authentication interceptor
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

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

const AdminEmailManagement = () => {
  const [adminEmails, setAdminEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch the current user's email
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/.auth/me');
        const authData = await response.json();
        
        if (authData.length > 0) {
          const userEmail = authData[0].user_id;
          setCurrentUserEmail(userEmail);
          console.log("Current user email:", userEmail);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError('Failed to authenticate user');
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch admin users with proper authentication
  const loadAdminUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/users');
      console.log("Admin users response:", response.data);
      setAdminEmails(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin users:', err);
      
      if (process.env.NODE_ENV === 'development') {
        // Use mock data in development mode only
        const mockAdminEmails = [
          { 
            Email: "admin@masholdings.com", 
            CreatedBy: "System", 
            CreatedAt: new Date().toISOString(),
            IsActive: true 
          },
          { 
            Email: "supunse@masholdings.com", 
            CreatedBy: "System", 
            CreatedAt: new Date().toISOString(),
            IsActive: true 
          }
        ];
        
        setAdminEmails(mockAdminEmails);
        setError('Failed to load admin users from server - using demo data');
      } else {
        setError('Failed to load admin users. Please try again later.');
      }
      setLoading(false);
    }
  };

  // Initial load of admin users
  useEffect(() => {
    loadAdminUsers();
  }, []);

  // Handle form submission to add a new admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Email validation
    if (!newEmail) {
      setError('Email is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate domain
    if (!newEmail.endsWith('@masholdings.com')) {
      setError('Only @masholdings.com email addresses are allowed');
      return;
    }

    // Check if email already exists
    const emailExists = adminEmails.some(admin => 
      admin.Email.toLowerCase() === newEmail.toLowerCase() && admin.IsActive
    );
    
    if (emailExists) {
      setError('This email is already an admin');
      return;
    }

    try {
      setLoading(true);
      // Add the new admin user with proper authentication
      const response = await axiosInstance.post('/admin/add', {
        email: newEmail,
        createdBy: currentUserEmail || 'current user'
      });
      
      console.log("Admin added response:", response.data);
      setSuccess('Admin user added successfully');
      setNewEmail('');
      
      // Refresh the admin users list
      await loadAdminUsers();
    } catch (err) {
      console.error('Error adding admin user:', err);
      setError('Failed to add admin user to database');
      setLoading(false);
    }
  };

  // Handle removing an admin
  const handleRemoveAdmin = async (email) => {
    if (window.confirm(`Are you sure you want to remove ${email} as an admin?`)) {
      try {
        setLoading(true);
        // Remove admin user with proper authentication
        const response = await axiosInstance.delete(`/admin/remove/${encodeURIComponent(email)}`);
        console.log("Admin removed response:", response.data);
        setSuccess(`${email} has been removed from admins`);
        
        // Refresh the admin users list
        await loadAdminUsers();
      } catch (err) {
        console.error('Error removing admin user:', err);
        setError('Failed to remove admin user from database');
        setLoading(false);
        
        // For UI responsiveness, update locally if the server request fails
        const updatedAdmins = adminEmails.map(admin => 
          admin.Email === email ? { ...admin, IsActive: false } : admin
        );
        setAdminEmails(updatedAdmins);
      }
    }
  };

  // Check if an admin is system-created (cannot be removed)
  const isSystemCreated = (admin) => {
    return admin.CreatedBy === 'System' || admin.CreatedBy === 'system';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-gray-800 bg-opacity-80">
        <img src="/fcalogo.svg" alt="FCA App Logo" className="h-full max-h-12" />
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/admin" className="hover:text-blue-500">
                Back to Admin Dashboard
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-500">
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Admin Email Management
        </motion.h1>

        {/* Add Email Form */}
        <motion.div
          className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Add New Admin Email</h2>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email Address
              </label>
              <div className="flex">
                <input
                  type="email"
                  id="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@masholdings.com"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-md disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Add Admin'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Only emails with @masholdings.com domain are allowed
              </p>
            </div>
          </form>
        </motion.div>

        {/* Admin List */}
        <motion.div
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Current Admin Users</h2>
            <button
              onClick={loadAdminUsers}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : adminEmails.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No admin users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-700 bg-opacity-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adminEmails
                    .filter(admin => admin.IsActive) // Only show active admins in the main list
                    .map((admin, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700 bg-opacity-30'}>
                      <td className="px-4 py-3 whitespace-nowrap">{admin.Email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{admin.CreatedBy}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(admin.CreatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {admin.IsActive ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {admin.IsActive && 
                         admin.Email !== currentUserEmail && 
                         !isSystemCreated(admin) && (
                          <button
                            onClick={() => handleRemoveAdmin(admin.Email)}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                            disabled={loading}
                          >
                            Remove
                          </button>
                        )}
                        {admin.IsActive && 
                         admin.Email !== currentUserEmail && 
                         isSystemCreated(admin) && (
                          <span className="text-gray-500 text-xs italic">
                            System Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Recently Deactivated Admins Section */}
          {adminEmails.some(admin => !admin.IsActive) && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">Recently Deactivated Admins</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-700 bg-opacity-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Deactivated By
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Deactivated At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminEmails
                      .filter(admin => !admin.IsActive)
                      .map((admin, index) => (
                      <tr key={index} className="bg-gray-700 bg-opacity-20">
                        <td className="px-4 py-3 whitespace-nowrap text-gray-400">{admin.Email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-400">{currentUserEmail || "Current User"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-400">
                          {new Date().toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminEmailManagement;