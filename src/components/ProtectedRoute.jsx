import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkAdminStatus } from '../services/api'; // Add this import

const ProtectedRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const isDevelopment = process.env.NODE_ENV === 'development';

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const response = await fetch('/.auth/me');
                const authData = await response.json();
                
                if (authData.length > 0) {
                    const userEmail = authData[0].user_id;
                    console.log('Checking admin status for:', userEmail);
                    
                    // Now using the imported checkAdminStatus function
                    const adminCheck = await checkAdminStatus(userEmail);
                    console.log('Admin check response:', adminCheck);
                    
                    setIsAdmin(adminCheck.isAdmin);
                    
                    if (!adminCheck.isAdmin) {
                        toast.error("You don't have permission to access this page");
                    }
                } else {
                    setIsAdmin(false);
                    toast.error("Please log in to access this page");
                }
            } catch (error) {
                console.error('Error in admin check:', error);
                setIsAdmin(false);
                toast.error("Error checking permissions");
            } finally {
                setLoading(false);
            }
        };

        checkAdminAccess();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return isAdmin ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;