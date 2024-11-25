import React from "react";

const InputField = ({ label, type, value, onChange, error }) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-700 sm:text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default InputField;
