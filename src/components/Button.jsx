import React from "react";

const Button = ({ label, type, onClick }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="px-6 py-2 bg-[#003049] to to-[#219ebc] text-white font-medium rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
        >
            {label}
        </button>
    );
};

export default Button;
