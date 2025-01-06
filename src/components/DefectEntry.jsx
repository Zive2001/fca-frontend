import React, { useState } from 'react';
import { TrashIcon, CameraIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { toast } from 'react-toastify';

const DefectEntry = ({ entry, index, onRemove, onPhotosChange }) => {
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      // Validate file sizes and types
      const validFiles = files.filter(file => {
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        const isValidType = file.type.startsWith('image/');
        if (!isValidSize) toast.error(`File ${file.name} is too large. Max size is 5MB`);
        if (!isValidType) toast.error(`File ${file.name} is not an image`);
        return isValidSize && isValidType;
      });

      // Create preview URLs for valid files
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      setPhotos(prev => [...prev, ...validFiles]);
      
      // Notify parent component of the change
      onPhotosChange(index, validFiles);
    } catch (error) {
      console.error('Error handling photo upload:', error);
      toast.error('Error handling photo upload');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (photoIndex) => {
    // Clean up the preview URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[photoIndex]);
    
    // Update state
    setPreviewUrls(prev => prev.filter((_, i) => i !== photoIndex));
    setPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== photoIndex);
      onPhotosChange(index, newPhotos); // Notify parent of removal
      return newPhotos;
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-3 border border-gray-100">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-500 truncate">
              {entry.defectCategory}
            </span>
            <span className="px-2 py-0.5 bg-gray-800/10 text-gray-800 rounded-full text-sm">
              {entry.defectCode}
            </span>
            <span className="px-2 py-0.5 bg-green-500/10 text-gray-800 rounded-full text-sm">
              Qty: {entry.quantity}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="px-2 py-0.5 bg-red-100/80 rounded">
              Location: {entry.locationCategory} - {entry.defectLocation}
            </span>
          </div>
        </div>

        <button
          onClick={() => onRemove(index)}
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          type="button"
          disabled={isUploading}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap gap-2">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={url}
                alt={`Preview ${idx + 1}`}
                className="h-16 w-16 object-cover rounded-md border border-gray-200"
              />
              <button
                onClick={() => removePhoto(idx)}
                className="absolute -top-1 -right-1 p-0.5 bg-gray-800/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
                disabled={isUploading}
              >
                <XCircleIcon className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          ))}
          
          <label className={`flex items-center justify-center h-16 w-16 border border-dashed 
            border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={isUploading}
            />
            <CameraIcon className={`w-5 h-5 ${isUploading ? 'text-gray-300' : 'text-gray-400'}`} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default DefectEntry;