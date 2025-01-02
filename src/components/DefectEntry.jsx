import React, { useState } from 'react';
import { TrashIcon, CameraIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { toast } from 'react-toastify';

const DefectEntry = ({ entry, index, onRemove, onPhotosChange }) => {
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      // Create preview URLs and store file objects
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      setPhotos(prev => [...prev, ...files]);
      
      // Notify parent component about photo changes
      onPhotosChange(index, files);
      
    } catch (error) {
      console.error('Error handling photo upload:', error);
      toast.error('Error handling photo upload');
    }
  };

  const removePhoto = (photoIndex) => {
    // Clean up preview URL
    URL.revokeObjectURL(previewUrls[photoIndex]);
    
    // Remove from state
    setPreviewUrls(prev => prev.filter((_, i) => i !== photoIndex));
    setPhotos(prev => prev.filter((_, i) => i !== photoIndex));
    
    // Notify parent component
    onPhotosChange(index, photos.filter((_, i) => i !== photoIndex));
  };

  return (
    <li className="flex flex-col bg-gray-50 dark:bg-gray-700 p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 dark:text-gray-200">
          {entry.defectCategory} - {entry.defectCode}: {entry.quantity}
        </span>
        <button
          className="text-red-500 hover:text-red-600"
          onClick={() => onRemove(index)}
          type="button"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mt-2">
        <div className="flex flex-wrap gap-2">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative">
              <img
                src={url}
                alt={`Preview ${idx + 1}`}
                className="h-20 w-20 object-cover rounded"
              />
              <button
                onClick={() => removePhoto(idx)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                type="button"
              >
                <XCircleIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
          <label className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <CameraIcon className="h-8 w-8 text-gray-400" />
          </label>
        </div>
      </div>
    </li>
  );
};

export default DefectEntry;