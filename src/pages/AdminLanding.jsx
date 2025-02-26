import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AdminLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-gray-800 bg-opacity-80">
        <img 
          src="/fcalogo.svg" 
          alt="FCA App Logo" 
          className="h-full max-h-12" 
        />
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-500">
                Back to Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Admin Options Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <motion.h1
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Data Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              to="/add-Data"
              className="block text-center"
            >
              <div className="bg-[#0096c7] rounded-lg p-4 mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Add Data</h2>
              <p className="text-gray-400">Add Weekly Line Plan</p>
            </Link>
          </motion.div>

          {/* View Audits Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/view-audits"
              className="block text-center"
            >
              <div className="bg-[#ee9b00] rounded-lg p-4 mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">View Audits</h2>
              <p className="text-gray-400">Manage and view existing audit data</p>
            </Link>
          </motion.div>

          {/* Add Emails Button - Now Active */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to="/admin/email-management"
              className="block text-center"
            >
              <div className="bg-[#005f73] rounded-lg p-4 mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Manage Admins</h2>
              <p className="text-gray-400">Add or remove admin users</p>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AdminLanding;