import React from "react";

const Button = ({ label, type, onClick }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="px-6 py-2 bg-red-800 to to-blue-400 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            {label}
        </button>
    );
};

export default Button;
