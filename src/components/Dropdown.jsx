import React from "react";

const Dropdown = ({ label, options, value, onChange, error, disabled }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        className={`block w-full px-4 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring focus:border-[#023047] ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Select...</option>
        {options.map((option, index) => (
          <option key={option.id || index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default Dropdown;