import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const UploadPhotos = ({ photos, onChange, onRemove }) => {
    const handleFileChange = (e) => {
        onChange([...photos, ...Array.from(e.target.files)]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        onChange([...photos, ...Array.from(e.dataTransfer.files)]);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                Upload Photos
            </label>
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:bg-gray-50 transition-all"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16l-4-4m0 0l4-4m-4 4h18M3 12h18m0 0l-4 4m4-4l-4-4"
                    />
                </svg>
                <p className="text-center text-sm">
                    Drag & drop files here, or{" "}
                    <label
                        htmlFor="file-input"
                        className="text-indigo-600 font-medium cursor-pointer"
                    >
                        browse
                    </label>
                </p>
                <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        className="relative w-full h-24 overflow-hidden rounded-lg shadow-md group"
                    >
                        <img
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index + 1}`}
                            className="object-cover w-full h-full"
                        />
                        <button
                            onClick={() => onRemove(index)}
                            className="absolute top-1 right-1 bg-gray-900 bg-opacity-75 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadPhotos;
