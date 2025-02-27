// UserView.jsx with updated table UI
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
import axios from "axios";
import { API_URL } from "../services/api";

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
    id: "",
    customer: "",
    isThirdParty: "",
    page: 1,
    limit: 10,
  });
  
  const [data, setData] = useState({ total: 0, data: [] });
  const [plants, setPlants] = useState([]);
  const [modules, setModules] = useState([]);
  const [customers, setCustomers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [failureReport, setFailureReport] = useState({
    isOpen: false,
    data: null
  });

  // Fetch dropdown data - separate from filter effects
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        // Load plants
        const plantData = await fetchPlants();
        setPlants(plantData.map((item) => ({ 
          id: item.Production_Section, 
          label: item.Production_Section, 
          value: item.Production_Section 
        })));

        // Load customers separately to avoid infinite loops with filter state
        try {
          const response = await axios.get(`${API_URL}/data`, {
            params: { limit: 1000 }
          });
          
          if (response.data && response.data.data) {
            const uniqueCustomers = [...new Set(
              response.data.data
                .map(item => item.Customer)
                .filter(customer => customer && customer.trim() !== '')
            )];
            
            // Sort customers alphabetically
            uniqueCustomers.sort();
            
            setCustomers([
              { id: "", label: "All Customers", value: "" },
              ...uniqueCustomers.map(customer => ({
                id: customer,
                label: customer,
                value: customer
              }))
            ]);
          }
        } catch (customerError) {
          console.error("Error loading customers:", customerError);
          toast.warning("Could not load customers list");
        }
      } catch (error) {
        toast.error("Error loading filter data: " + error.message);
      }
    };

    loadFilterData();
  }, []);

  // Load modules when plant changes
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
    } else {
      // Reset modules if plant is cleared
      setModules([]);
    }
  }, [filters.plant]);

  // Fetch FCA data based on filters
  const fetchData = async () => {
    setLoading(true);
    try {
      // Log the filters being sent for debugging
      console.log("Fetching data with filters:", filters);
      
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

  // Set up debounced fetching when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    console.log(`Filter changed: ${name} = ${value}`);
    
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
    return status?.toLowerCase() === 'pass' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getTypeBadgeClass = (type) => {
    return type?.toLowerCase() === 'inline'
      ? 'bg-[#8ecae6] text-[#023047] border-[#8ecae6]'  
      : 'bg-[#8d99ae] text-[#2b2d42] border-[#8d99ae]';
  };

  const getThirdPartyBadgeClass = (isThirdParty) => {
    return isThirdParty
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      plant: "",
      module: "",
      shift: "",
      po: "",
      size: "",
      status: "",
      type: "",
      date: "",
      id: "",
      customer: "",
      isThirdParty: "",
      page: 1,
      limit: 10,
    });
    toast.info("Filters have been reset");
  };

  // Format date to be more compact
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          View FCA Data
        </h1>

        {/* Filters Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Filters</h2>
            <Button
              label="Reset Filters"
              onClick={handleResetFilters}
              variant="secondary"
              className="px-4 py-2 text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* ID Search Filter */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by ID
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.id}
                onChange={(e) => handleFilterChange("id", e.target.value)}
                placeholder="Enter ID"
              />
            </div>

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

            {/* Customer Filter */}
            <Dropdown
              label="Customer"
              options={customers}
              value={filters.customer}
              onChange={(value) => handleFilterChange("customer", value)}
              className="bg-white"
            />

            <Dropdown
              label="Type"
              options={[
                { id: "", label: "All", value: "" },
                { id: "inline", label: "Inline", value: "inline" },
                { id: "endline", label: "Endline", value: "endline" },
              ]}
              value={filters.type}
              onChange={(value) => handleFilterChange("type", value)}
              className="bg-white"
            />

            {/* Third Party / Internal Filter */}
            <Dropdown
              label="Inspection Source"
              options={[
                { id: "", label: "All", value: "" },
                { id: "true", label: "Third Party", value: "true" },
                { id: "false", label: "Internal", value: "false" },
              ]}
              value={filters.isThirdParty}
              onChange={(value) => handleFilterChange("isThirdParty", value)}
              className="bg-white"
            />
            
            <Dropdown
              label="Status"
              options={[
                { id: "", label: "All", value: "" },
                { id: "pass", label: "Pass", value: "pass" },
                { id: "fail", label: "Fail", value: "fail" },
              ]}
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              className="bg-white"
            />
          </div>
        </div>

        {/* Data Table Card - Updated for more compact display */}
        <div className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : data.data.length > 0 ? (
            <>
              {/* Improved table with more compact design */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Plant / Module</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">PO / Style</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Customer / Size</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Source</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quality</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Created By</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.data.map((record) => (
                      <tr key={record.Id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{record.Id}</td>
                        
                        {/* Plant/Module combined column */}
                        <td className="px-3 py-2 text-sm text-gray-500">
                          <div className="font-medium text-gray-900">{record.Plant}</div>
                          <div className="text-xs text-gray-500">{record.Module}</div>
                        </td>
                        
                        {/* PO/Style combined column */}
                        <td className="px-3 py-2 text-sm text-gray-500">
                          <div className="font-medium text-gray-900">{record.PO}</div>
                          <div className="text-xs text-gray-500">{record.Style}</div>
                        </td>
                        
                        {/* Customer/Size combined column */}
                        <td className="px-3 py-2 text-sm text-gray-500">
                          <div className="font-medium text-gray-900">{record.Customer}</div>
                          <div className="text-xs text-gray-500">Size: {record.Size}</div>
                        </td>
                        
                        {/* Type with badge */}
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(record.Type)}`}>
                            {record.Type}
                          </span>
                        </td>
                        
                        {/* Source with badge */}
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThirdPartyBadgeClass(record.IsThirdParty)}`}>
                            {record.IsThirdParty ? 'Third Party' : 'Internal'}
                          </span>
                        </td>
                        
                        {/* Inspected/Defect combined column */}
                        <td className="px-3 py-2 text-sm text-gray-500">
                          <div className="font-medium">Inspected: {record.InspectedQuantity}</div>
                          <div className="text-xs text-gray-500">Defect: {record.DefectQuantity}</div>
                        </td>
                        
                        {/* Status with badge */}
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(record.Status)}`}>
                            {record.Status}
                          </span>
                        </td>
                        
                        {/* Date (formatted more compactly) */}
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.SubmissionDate)}
                        </td>
                        
                        {/* Created By column (Added as requested) */}
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {record.CreatedBy || "N/A"}
                        </td>
                        
                        {/* Action button */}
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => handleViewReport(record.Id)}
                            className="inline-flex items-center p-1.5 border border-blue-300 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                            title="View Report"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 flex justify-between items-center border-t border-gray-200 bg-gray-50 sm:px-6">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="font-medium mr-1">Total:</span> {data.total} records
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    label="Previous"
                    onClick={() => handleFilterChange("page", filters.page - 1)}
                    disabled={filters.page === 1}
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                  />
                  <span className="text-sm text-gray-700">
                    Page <span className="font-medium">{filters.page}</span> of{" "}
                    <span className="font-medium">{Math.max(1, Math.ceil(data.total / filters.limit))}</span>
                  </span>
                  <Button
                    label="Next"
                    onClick={() => handleFilterChange("page", filters.page + 1)}
                    disabled={filters.page >= Math.ceil(data.total / filters.limit)}
                    variant="secondary"
                    className="px-3 py-1 text-xs"
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