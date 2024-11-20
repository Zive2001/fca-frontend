import React from "react";

const UploadPhotos = ({ photos, onChange }) => {
    const handleFileChange = (e) => {
        onChange([...photos, ...e.target.files]);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Upload Photos
            </label>
            <input
                type="file"
                multiple
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleFileChange}
            />
            <div className="flex flex-wrap mt-2 gap-2">
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        src={URL.createObjectURL(photo)}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-md shadow-md"
                    />
                ))}
            </div>
        </div>
    );
};

export default UploadPhotos;
