import React, { useState } from "react";
import { motion } from "framer-motion";
import { HomeIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    open: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    closed: { x: 20, opacity: 0, transition: { duration: 0.5 } },
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
      {/* Toggle Button */}
      <motion.button
        onClick={toggleMenu}
        className="bg-transparent border border-gray-500 p-2 rounded-full shadow-md focus:outline-none hover:border-white"
      >
        {isOpen ? (
          <ChevronRightIcon className="h-5 w-5 text-gray-300" />
        ) : (
          <ChevronLeftIcon className="h-5 w-5 text-gray-300" />
        )}
      </motion.button>

      {/* Menu */}
      <motion.div
        className={`flex flex-col items-end mt-4 space-y-2`}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        {navItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.path}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-300 hover:text-white rounded-full transition-all"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background
              backdropFilter: "blur(5px)", // Modern frosted-glass effect
            }}
          >
            <span>{item.icon}</span>
            <motion.span
              className={`font-medium ${isOpen ? "block" : "hidden"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {item.name}
            </motion.span>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};

export default FloatingMenu;
