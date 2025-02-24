// UserView.jsx
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { EyeIcon } from "@heroicons/react/24/outline";
import { getFCAData, fetchPlants, fetchModules, getFailureReport } from "../services/api";
import FailureReport from "../components/FailureReport";
import LoadingOverlay from "../components/LoadingOverlay";

const UserView = () => {
  const [filters, setFilters] = useState({
    plant: "",
    module: "",
    shift: "",
    po: "",
    size: "",
    status: "",
    type: "",
    date: "",
    page: 1,
    limit: 10,
  });
  
  const [data, setData] = useState({ total: 0, data: [] });
  const [plants, setPlants] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [failureReport, setFailureReport] = useState({
    isOpen: false,
    data: null
  });

  // Fetch dropdown data
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const plantData = await fetchPlants();
        setPlants(plantData.map((item) => ({ 
          id: item.Production_Section, 
          label: item.Production_Section, 
          value: item.Production_Section 
        })));
      } catch (error) {
        toast.error("Error loading plants: " + error.message);
      }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    if (filters.plant) {
      const loadModules = async () => {
        try {
          const moduleData = await fetchModules(filters.plant);
          setModules(moduleData.map((item) => ({ 
            id: item.Sewing_work_center, 
            label: item.Sewing_work_center, 
            value: item.Sewing_work_center 
          })));
        } catch (error) {
          toast.error("Error loading modules: " + error.message);
        }
      };
      loadModules();
    }
  }, [filters.plant]);

  // Fetch FCA data
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getFCAData(filters);
      setData({
        total: result.total,
        data: result.data
      });
      
      if (!result.data.length) {
        toast.info("No records found.");
      }
    } catch (error) {
      toast.error("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? value : 1 // Reset page when other filters change
    }));
  };

  const handleViewReport = async (auditId) => {
    setIsGeneratingReport(true);
    try {
      const reportData = await getFailureReport(auditId);
      setFailureReport({
        isOpen: true,
        data: reportData
      });
    } catch (error) {
      toast.error("Error fetching failure report: " + error.message);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    return status.toLowerCase() === 'pass' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getTypeBadgeClass = (type) => {
    return type.toLowerCase() === 'inline'
      ? 'bg-[#8ecae6] text-[#023047] border-[#8ecae6]'  
      : 'bg-[#8d99ae] text-[#2b2d42] border-[#8d99ae]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-gray-800 text-center">
          View FCA Data
        </h1>

        {/* Filters Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700"></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Dropdown
              label="Plant"
              options={plants}
              value={filters.plant}
              onChange={(value) => handleFilterChange("plant", value)}
              className="bg-white"
            />
            <Dropdown
              label="Module"
              options={modules}
              value={filters.module}
              onChange={(value) => handleFilterChange("module", value)}
              className="bg-white"
            />
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search PO
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.po}
                onChange={(e) => handleFilterChange("po", e.target.value)}
                placeholder="Enter PO number"
              />
            </div>
            <Dropdown
              label="Type"
              options={[
                { id: "inline", label: "Inline", value: "inline" },
                { id: "endline", label: "Endline", value: "endline" },
              ]}
              value={filters.type}
              onChange={(value) => handleFilterChange("type", value)}
              className="bg-white"
            />
            <Dropdown
              label="Status"
              options={[
                { id: "pass", label: "Pass", value: "pass" },
                { id: "fail", label: "Fail", value: "fail" },
              ]}
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              className="bg-white"
            />
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : data.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Plant</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Module</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">PO</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Size</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Style</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Inspected</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Defect</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.data.map((record) => (
                      <tr key={record.Id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">{record.Id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.Plant}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.Module}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{record.PO}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.Size}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.Customer}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.Style}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(record.Type)}`}>
                            {record.Type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.InspectedQuantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.DefectQuantity}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(record.Status)}`}>
                            {record.Status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(record.SubmissionDate).toLocaleString()}
                        </td>
                        
<td className="px-4 py-3 text-sm">
 
    <button
      onClick={() => handleViewReport(record.Id)}
      className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 group"
      title="View Report"
    >
      <EyeIcon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
      <span className="sr-only">View Report</span>
    </button>
 
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Total Records: <span className="font-medium">{data.total}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    label="Previous"
                    onClick={() => handleFilterChange("page", filters.page - 1)}
                    disabled={filters.page === 1}
                    variant="secondary"
                    className="px-4 py-2 text-sm"
                  />
                  <span className="text-sm text-gray-700">
                    Page <span className="font-medium">{filters.page}</span> of{" "}
                    <span className="font-medium">{Math.ceil(data.total / filters.limit)}</span>
                  </span>
                  <Button
                    label="Next"
                    onClick={() => handleFilterChange("page", filters.page + 1)}
                    disabled={filters.page >= Math.ceil(data.total / filters.limit)}
                    variant="secondary"
                    className="px-4 py-2 text-sm"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">No data found.</div>
          )}
        </div>
      </div>

      {/* Failure Report Modal */}
      <FailureReport
        data={failureReport.data}
        isOpen={failureReport.isOpen}
        onClose={() => setFailureReport({ isOpen: false, data: null })}
      />
      {isGeneratingReport && <LoadingOverlay />}
    </motion.div>
  );
};

export default UserView;