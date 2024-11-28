import React, { useState } from "react";
import { motion } from "framer-motion";
import { HomeIcon, PlusIcon, EyeIcon, ViewGridIcon } from "@heroicons/react/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarVariants = {
    open: { width: "250px", transition: { duration: 0.5 } },
    closed: { width: "80px", transition: { duration: 0.5 } },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.div
        className="bg-gray-800 h-screen text-white shadow-lg"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4">
            <h1 className={`text-xl font-bold ${isOpen ? "block" : "hidden"} transition-all`}>
              My App
            </h1>
            <button
              className="text-white focus:outline-none"
              onClick={toggleSidebar}
            >
              <ViewGridIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-10 flex flex-col space-y-4">
            {[
              { name: "Home", icon: <HomeIcon className="h-6 w-6" />, path: "/home" },
              { name: "FCA-Inline", icon: <EyeIcon className="h-6 w-6" />, path: "/fca-inline" },
              { name: "FCA-Endline", icon: <EyeIcon className="h-6 w-6" />, path: "/fca-endline" },
              { name: "View Page", icon: <EyeIcon className="h-6 w-6" />, path: "/view" },
              { name: "Add Data Page", icon: <PlusIcon className="h-6 w-6" />, path: "/add-data" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded-md transition-all"
              >
                <span className="">{item.icon}</span>
                <span className={`text-sm ${isOpen ? "block" : "hidden"} transition-all`}>
                  {item.name}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <h2 className="text-2xl font-bold">Content Goes Here</h2>
      </div>
    </div>
  );
};

export default Sidebar;
