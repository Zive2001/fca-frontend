import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import { getFCAData, deleteFCAData, fetchPlants, fetchModules } from "../services/api";

const Admin = () => {
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
  const [deleteDialog, setDeleteDialog] = useState({ 
    isOpen: false, 
    recordId: null 
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

  const handleDelete = async () => {
    if (!deleteDialog.recordId) return;
    
    try {
      await deleteFCAData(deleteDialog.recordId);
      toast.success("Record deleted successfully.");
      setDeleteDialog({ isOpen: false, recordId: null });
      fetchData(); // Refresh data after deletion
    } catch (error) {
      toast.error("Error deleting record: " + error.message);
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteDialog({ isOpen: true, recordId: id });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">View FCA Data</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        <Dropdown
          label="Plant"
          options={plants}
          value={filters.plant}
          onChange={(value) => handleFilterChange("plant", value)}
        />
        <Dropdown
          label="Module"
          options={modules}
          value={filters.module}
          onChange={(value) => handleFilterChange("module", value)}
        />
        {/* PO Search input */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search PO
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
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
        />
        <Dropdown
          label="Status"
          options={[
            { id: "pass", label: "Pass", value: "pass" },
            { id: "fail", label: "Fail", value: "fail" },
          ]}
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
        />
        {/* <InputField
          label="Date"
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
        /> */}
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : data.data.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">ID</th>
                  <th className="p-2 border border-gray-300">Plant</th>
                  <th className="p-2 border border-gray-300">Module</th>
                  <th className="p-2 border border-gray-300">PO</th>
                  <th className="p-2 border border-gray-300">Size</th>
                  <th className="p-2 border border-gray-300">Customer</th>
                  <th className="p-2 border border-gray-300">Style</th>
                  <th className="p-2 border border-gray-300">Type</th>
                  <th className="p-2 border border-gray-300">Inspected Qty</th>
                  <th className="p-2 border border-gray-300">Defect Qty</th>
                  <th className="p-2 border border-gray-300">Status</th>
                  <th className="p-2 border border-gray-300">Submission Date</th>
                  <th className="p-2 border border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((record) => (
                  <tr key={record.Id}>
                    <td className="p-2 border border-gray-300">{record.Id}</td>
                    <td className="p-2 border border-gray-300">{record.Plant}</td>
                    <td className="p-2 border border-gray-300">{record.Module}</td>
                    <td className="p-2 border border-gray-300">{record.PO}</td>
                    <td className="p-2 border border-gray-300">{record.Size}</td>
                    <td className="p-2 border border-gray-300">{record.Customer}</td>
                    <td className="p-2 border border-gray-300">{record.Style}</td>
                    <td className="p-2 border border-gray-300">{record.Type}</td>
                    <td className="p-2 border border-gray-300">{record.InspectedQuantity}</td>
                    <td className="p-2 border border-gray-300">{record.DefectQuantity}</td>
                    <td className="p-2 border border-gray-300">{record.Status}</td>
                    <td className="p-2 border border-gray-300">
                      {new Date(record.SubmissionDate).toLocaleString()}
                    </td>
                    <td className="p-2 border border-gray-300">
                      <Button 
                        label="Delete" 
                        onClick={() => openDeleteDialog(record.Id)} 
                        variant="danger"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              Total Records: {data.total}
            </div>
            <div className="flex space-x-2">
              <Button
                label="Previous"
                onClick={() => handleFilterChange("page", filters.page - 1)}
                disabled={filters.page === 1}
                variant="secondary"
              />
              <span className="py-2 px-4">
                Page {filters.page} of {Math.ceil(data.total / filters.limit)}
              </span>
              <Button
                label="Next"
                onClick={() => handleFilterChange("page", filters.page + 1)}
                disabled={filters.page >= Math.ceil(data.total / filters.limit)}
                variant="secondary"
              />
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">No data found.</p>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, recordId: null })}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this record? This action cannot be undone."
      />
    </motion.div>
  );
};

export default Admin;