import React, { useState } from "react";
import { motion } from "framer-motion";
import { HomeIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    open: { width: "auto", opacity: 1, transition: { duration: 0.5 } },
    closed: { width: "50px", opacity: 1, transition: { duration: 0.5 } },
  };

  const navItemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.5 } },
  };

  const navItems = [
    { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/" },
    { name: "FCA-Inline", icon: <EyeIcon className="h-5 w-5" />, path: "/fca-inline" },
    { name: "FCA-Endline", icon: <EyeIcon className="h-5 w-5" />, path: "/fca-endline" },
    { name: "View Page", icon: <EyeIcon className="h-5 w-5" />, path: "/view" },
    { name: "Add Data Page", icon: <PlusIcon className="h-5 w-5" />, path: "/add-data" },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Menu Container */}
      <motion.div
        className="flex items-center space-x-2 p-2 rounded-full shadow-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background
          backdropFilter: "blur(10px)", // Modern frosted-glass effect
        }}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        {/* Toggle Button */}
        <motion.button
          onClick={toggleMenu}
          className="bg-transparent p-2 rounded-full hover:bg-white/20 focus:outline-none"
        >
          {isOpen ? (
            <ChevronLeftIcon className="h-5 w-5 text-gray-300" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-300" />
          )}
        </motion.button>

        {/* Navigation Items */}
        {navItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.path}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white rounded-full transition-all"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)", // Subtle background for items
            }}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={navItemVariants}
          >
            <span>{item.icon}</span>
            {isOpen && <span className="font-medium">{item.name}</span>}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};

export default FloatingMenu;
