import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  ClipboardDocumentCheckIcon,
  ChartPieIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ModernHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch user data
  useEffect(() => {
    fetch("/.auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setUserEmail(data[0].user_id);
        }
      })
      .catch(err => console.error("Failed to fetch user:", err));
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation items configuration
  const navItems = [
    {
      icon: HomeIcon,
      label: 'Home',
      description: 'Return to Main Page',
      path: '/'
    },
    {
      icon: ClipboardDocumentListIcon,
      label: 'Inline Audit',
      description: 'Perform inline audit',
      path: '/fca-inline'
    },
    {
      icon: ClipboardDocumentCheckIcon,
      label: 'Endline Audit',
      description: 'Perform endline audit',
      path: '/fca-endline'
    },
    {
      icon: ChartBarIcon,
      label: 'View Data',
      description: 'View added data',
      path: '/view-data'
    },
    {
      icon: ChartPieIcon,
      label: 'Dashboard',
      description: 'Analyze data',
      path: '/Analytics'
    }
  ];

  // Check if we're on landing or admin landing pages
  const hideOnPaths = ['/', '/admin', '/add-Data', '/view-audits', '/admin/email-management'];
  if (hideOnPaths.includes(location.pathname)) {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop and Tablet Header */}
      <AnimatePresence>
        {isVisible && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 right-4 z-50 hidden sm:block" // Hide on mobile, show on sm and up
          >
            <motion.nav 
              className="bg-white/80 backdrop-blur-md rounded-3xl shadow-md px-3 py-2 border border-blue-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-1">
                {/* User Initial Circle */}
                {userEmail && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group mr-1"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-semibold">
                        {userEmail.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Tooltip for full email */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-100">
                      <div className="text-sm font-medium text-gray-700">{userEmail}</div>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-gray-100 transform rotate-45" />
                    </div>
                  </motion.div>
                )}

                {/* Navigation Items */}
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    className="relative group"
                  >
                    <button
                      onClick={() => navigate(item.path)}
                      className={`relative p-2.5 rounded-xl transition-all duration-300
                        ${location.pathname === item.path 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      
                      {/* Active indicator line */}
                      {location.pathname === item.path && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-1 left-1/2 w-3 h-0.5 bg-blue-600 rounded-full"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                          style={{
                            transform: 'translateX(-50%)'
                          }}
                        />
                      )}
                    </button>

                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-100">
                      <div className="text-sm font-medium text-gray-700">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-gray-100 transform rotate-45" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 sm:hidden">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 ${
                location.pathname === item.path
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User info for mobile - small floating avatar in top-right */}
      {userEmail && isVisible && (
        <div className="fixed top-4 right-4 z-40 sm:hidden">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-semibold">
              {userEmail.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Add spacing at the bottom to prevent content from being hidden behind the mobile nav bar */}
      <div className="pb-16 sm:pb-0"></div>
    </>
  );
};

export default ModernHeader;