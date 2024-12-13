import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../services/api";
import { FaUpload } from "react-icons/fa";
import { AiOutlineFileExcel } from "react-icons/ai";

const AddData = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(`${API_URL.replace("/fca", "/upload")}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-6">
      <div className="bg-gray-800 shadow-2xl rounded-xl p-8 w-full max-w-lg transform transition-all hover:scale-105 hover:shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Upload Excel File</h1>

        <div className="mb-6">
          <label
            htmlFor="fileInput"
            className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2"
          >
            <FaUpload className="text-teal-400" />
            <span>Select File</span>
          </label>
          <div className="relative group">
            <input
              id="fileInput"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="flex items-center justify-center w-full px-4 py-3 text-sm text-gray-300 bg-gray-900 border border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              <AiOutlineFileExcel className="mr-2 text-green-400" />
              {file ? file.name : "Choose an Excel file"}
            </label>
          </div>
        </div>

        <button
          onClick={handleUpload}
          className="w-full flex items-center justify-center bg-gradient-to-r from-teal-600 to-blue-700 text-white py-3 px-5 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transition"
        >
          <FaUpload className="mr-2" /> Upload File
        </button>

        {uploadStatus && (
          <p className={`mt-6 text-center text-sm font-medium ${uploadStatus.includes("Error") ? "text-red-400" : "text-teal-400"}`}>
            {uploadStatus}
          </p>
        )}

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Accepted formats: .xlsx, .xls</p>
        </div>
      </div>
    </div>
  );
};

export default AddData;
