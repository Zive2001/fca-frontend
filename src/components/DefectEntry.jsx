import React, { useState } from 'react';
import { TrashIcon, CameraIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { addDefectPhoto, deleteDefectPhoto } from '../services/api'; // Add this import
import { toast } from 'react-toastify';

const DefectEntry = ({ entry, index, onRemove }) => {
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      // Create preview URLs for the uploaded files
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Upload each photo
      for (const file of files) {
        try {
          const response = await addDefectPhoto(entry.auditId, entry.defectId, file);
          setPhotos(prev => [...prev, response]); // Store the response from server
          toast.success(`Photo ${file.name} uploaded successfully`);
        } catch (error) {
          console.error('Error uploading photo:', error);
          toast.error(`Failed to upload photo ${file.name}`);
          
          // Remove the preview for failed upload
          const failedIndex = files.indexOf(file);
          URL.revokeObjectURL(newPreviewUrls[failedIndex]);
          setPreviewUrls(prev => prev.filter((_, i) => i !== failedIndex));
        }
      }
    } catch (error) {
      console.error('Error handling photo upload:', error);
      toast.error('Error handling photo upload');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async (index, photoId) => {
    try {
      if (photoId) {
        await deleteDefectPhoto(photoId);
        toast.success('Photo deleted successfully');
      }
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrls[index]);
      
      // Remove from state
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
      setPhotos(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
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
                onClick={() => removePhoto(idx, photos[idx]?.id)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                type="button"
                disabled={isUploading}
              >
                <XCircleIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
          <label className={`flex items-center justify-center h-20 w-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={isUploading}
            />
            <CameraIcon className="h-8 w-8 text-gray-400" />
          </label>
        </div>
      </div>
    </li>
  );
};

export default DefectEntry;