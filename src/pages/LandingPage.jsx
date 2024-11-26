import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-gray-800 bg-opacity-80">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-blue-500">FCA</span> App
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-500">
                Add Data
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-500">
                View Audits
              </Link>
            </li>
          </ul>
        </nav>
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
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-300"
        >
          <Link to="/final-audit" className="block">
            <div className="h-40 bg-gray-700 flex items-center justify-center">
              <img
                src="./mgr.svg" 
                alt="Final Audit"
                className="h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                Final Audit
              </h2>
              <p className="text-gray-400">Manage final audits efficiently.</p>
            </div>
          </Link>
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
