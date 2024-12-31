// Create a new component DefectPhotoUpload.jsx
import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const DefectPhotoUpload = ({ onPhotoUpload, currentPhoto }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('http://localhost:5001/api/fca/upload-defect-photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onPhotoUpload(data.photoUrl);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="defect-photo-upload"
      />
      <label
        htmlFor="defect-photo-upload"
        className="flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-50"
      >
        <Camera className="w-5 h-5 mr-2" />
        {uploading ? 'Uploading...' : 'Add Photo'}
      </label>
      {currentPhoto && (
        <img
          src={currentPhoto}
          alt="Defect"
          className="w-10 h-10 object-cover rounded-md"
        />
      )}
    </div>
  );
};

export default DefectPhotoUpload;