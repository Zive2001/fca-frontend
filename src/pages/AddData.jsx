import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../services/api";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { AiOutlineFileExcel } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { Link } from 'react-router-dom';

const AddData = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [guideExpanded, setGuideExpanded] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      setGuideExpanded(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      toast.info("Uploading...");
      const response = await axios.post(`${API_URL.replace("/fca", "/upload")}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navbar - Exactly matching AdminEmailManagement */}
      <header className="flex items-center justify-between px-8 py-4 bg-gray-800 bg-opacity-80">
        <img src="/fcalogo.svg" alt="FCA App Logo" className="h-full max-h-12" />
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/admin" className="hover:text-blue-500">
                Back to Admin Dashboard
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-500">
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6 mt-24">
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
          disabled={isUploading}
          className={`w-full flex items-center justify-center py-3 px-5 rounded-lg font-semibold transition ${
            isUploading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-600 to-blue-700 text-white hover:from-blue-700 hover:to-teal-600"
          }`}
        >
          {isUploading ? (
            <>
              <FaSpinner className="mr-2 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <FaUpload className="mr-2" /> Upload File
            </>
          )}
        </button>

        {file && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg text-gray-300 flex items-center space-x-4">
            <AiOutlineFileExcel className="text-green-400 text-2xl" />
            <span className="text-sm font-medium truncate">{file.name}</span>
          </div>
        )}

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Accepted formats: .xlsx, .xls</p>
        </div>
      </div>

      <div
        className={`fixed top-1/2 right-6 transform -translate-y-1/2 bg-gray-700 rounded-lg shadow-lg p-4 w-80 transition-transform ${
          guideExpanded ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold flex items-center space-x-2">
            <BsInfoCircle className="text-teal-400" />
            <span>Guide</span>
          </h2>
          <button
            onClick={() => setGuideExpanded(!guideExpanded)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {guideExpanded ? "Close" : "Open"}
          </button>
        </div>
        <p className="text-gray-300 text-sm">
          Ensure your Excel file has the following columns:
        </p>
        <ul className="text-gray-300 text-sm list-disc list-inside mt-2">
          <li>Size Coloumn should be a merge of "Cup" and "Size" coulmns</li>
          <li>"Sales_Order" and "Sewing_Order" Columns should not include numbers</li>
          <li>If any error occured please drop a message at <a href="mailto:supunse@masholdings.com" className="text-blue-600 hover:text-blue-800 underline">supunse@masholdings.com</a> 🫤</li>
          <li>Upload the newest line plan duplicate data will be replaced</li>
        </ul>
      </div>

      <button
        onClick={() => setGuideExpanded(!guideExpanded)}
        className="fixed top-1/2 right-8 transform -translate-y-1/2 text-teal-400 hover:text-white focus:outline-none"
      >
        <BsInfoCircle size={32} />
      </button>
    </div>
    </div>
  );
};

export default AddData;