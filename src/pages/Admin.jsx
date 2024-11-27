import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getFCAData,
  updateFCAData,
  deleteFCAData,
  fetchPlants,
  fetchModules,
} from "../services/api";

const Admin = () => {
  const [filters, setFilters] = useState({
    type: "",
    date: "",
    plant: "",
    module: "",
    status: "",
    page: 1,
    limit: 10,
  });
  const [data, setData] = useState([]);
  const [plants, setPlants] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  // Fetch filter dropdown data
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const plantData = await fetchPlants();
        setPlants(
          plantData.map((item) => ({
            id: item.id,
            label: item.Production_Section,
            value: item.id,
          }))
        );
      } catch (error) {
        toast.error("Error loading plants.");
      }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    if (filters.plant) {
      const loadModules = async () => {
        try {
          const moduleData = await fetchModules(filters.plant);
          setModules(
            moduleData.map((item) => ({
              id: item.id,
              label: item.Sewing_work_center,
              value: item.id,
            }))
          );
        } catch (error) {
          toast.error("Error loading modules.");
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
      setData(result.records || []);
      if (result.records?.length === 0) {
        toast.info("No records found.");
      }
    } catch (error) {
      toast.error("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Update a record
  const handleUpdate = async (id, updatedData) => {
    try {
      await updateFCAData(id, updatedData);
      toast.success("Record updated successfully.");
      fetchData();
      setEditRecord(null);
    } catch (error) {
      toast.error("Error updating record.");
    }
  };

  // Delete a record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteFCAData(id);
        toast.success("Record deleted successfully.");
        fetchData();
      } catch (error) {
        toast.error("Error deleting record.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
        <InputField
          label="Date"
          type="date"
          name="date"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
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
        <InputField
          label="Type"
          name="type"
          value={filters.type}
          placeholder="Enter type"
          onChange={(e) => handleFilterChange("type", e.target.value)}
        />
      </div>

      {/* Data Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : data.length > 0 ? (
        <div className="overflow-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border border-gray-300">Plant</th>
                <th className="p-2 border border-gray-300">Module</th>
                <th className="p-2 border border-gray-300">Status</th>
                <th className="p-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record) => (
                <tr key={record.id}>
                  <td className="p-2 border border-gray-300">{record.plant}</td>
                  <td className="p-2 border border-gray-300">{record.module}</td>
                  <td className="p-2 border border-gray-300">{record.status}</td>
                  <td className="p-2 border border-gray-300 flex space-x-2">
                    <Button
                      label="Edit"
                      onClick={() => setEditRecord(record)}
                      variant="secondary"
                    />
                    <Button
                      label="Delete"
                      onClick={() => handleDelete(record.id)}
                      variant="danger"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No data found.</p>
      )}
    </motion.div>
  );
};

export default Admin;
