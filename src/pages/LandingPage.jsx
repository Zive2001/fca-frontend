import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [userEmail, setUserEmail] = useState(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="flex items-center justify-between px-8 py-4 bg-transparent bg-opacity-80">
        {userEmail && (
          <div className="flex items-center space-x-2 bg-transparent rounded-lg px-4 py-2">
            <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-white font-semibold">
                {userEmail.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-white">{userEmail}</span>
          </div>
        )}
        <div className="flex items-center space-x-8">
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
              <li><Link to="/view-data" className="hover:text-blue-500">View Data</Link></li>
              <li><Link to="/Analytics" className="hover:text-blue-500">Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-blue-500">Admin</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20">
        <motion.h1
          className="text-5xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-blue-500">FCA App</span>
        </motion.h1>
        <p className="text-lg text-gray-400 mb-10">
          Factory Certified Audits platform. Click on get started for the guide.
        </p>
        <Link
          to="/get-started"
          className="px-6 py-3 bg-blue-500 rounded-full font-semibold shadow-md hover:bg-blue-600 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* FCA Inline */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-300"
        >
          <Link to="/fca-inline" className="block">
            <div className="h-40 bg-gray-700 flex items-center justify-center">
              <img
                src="./chrts.svg" 
                alt="FCA Inline"
                className="h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                FCA Inline
              </h2>
              <p className="text-gray-400">Inline Audit Form</p>
            </div>
          </Link>
        </motion.div>

        {/* FCA Endline */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-300"
        >
          <Link to="/fca-endline" className="block">
            <div className="h-40 bg-gray-700 flex items-center justify-center">
              <img
                src="./pics.svg" 
                alt="FCA Endline"
                className="h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                FCA Endline
              </h2>
              <p className="text-gray-400">Endline Audit Form</p>
            </div>
          </Link>
        </motion.div>

        {/* Final Audit */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700/30 opacity-75"
        >
          <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
          <div className="block p-6">
            <div className="relative h-40 flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
              <img
                src="./mgr.svg"
                alt="Final Audit"
                className="h-32 relative grayscale opacity-50"
              />
              <div className="absolute top-2 right-2">
                <span className="px-3 py-1 text-xs font-medium text-blue-200/80 bg-blue-500/10 rounded-full border border-blue-200/10">
                  Coming Soon 🚀
                </span>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-400">
              Final Audit
            </h2>
            <p className="text-sm text-gray-500">
              Final Audit module is under development. Stay tuned! ✨
            </p>
          </div>
          <div className="absolute inset-0 pointer-events-none cursor-not-allowed" />
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-16 py-6 bg-gray-800 text-center">
        <p className="text-gray-400 text-sm font-semibold">
          © 2024 FCA App. Bodyline Digital Excellence.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;