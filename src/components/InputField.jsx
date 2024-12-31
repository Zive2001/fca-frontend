import React from "react";

const InputField = ({ label, type, value, onChange, error }) => {
    // Ensure value is always a defined string
    const controlledValue = value === null || value === undefined ? '' : value;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {type === "textarea" ? (
                <textarea
                    className="block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-700 sm:text-sm"
                    value={controlledValue}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    type={type}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-700 sm:text-sm"
                    value={controlledValue}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default InputField;  