import React from "react";

const Dropdown = ({ label, options, value, onChange, error }) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="" disabled>
                    Select {label}
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Dropdown;
