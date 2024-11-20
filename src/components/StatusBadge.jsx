import React from "react";

const StatusBadge = ({ status, defectRate }) => {
    const statusColors = status === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

    return (
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusColors}`}>
            {status}: {defectRate}%
        </div>
    );
};

export default StatusBadge;
