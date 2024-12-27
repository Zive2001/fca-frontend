import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import InputField from "../components/InputField";
import UploadPhotos from "../components/UploadPhotos";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CurrDate from '../components/CurrDate';
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import Select from "react-select";

import {
  fetchPlants,
  fetchModules,
  fetchPOs,
  fetchSizes,
  fetchDefectCategories,
  fetchDefectCodes,
  fetchCustomers,
  fetchStyles,
  submitFCAData,
} from "../services/api";
import { calculateDefectRate, determineStatus } from "../utils/validations";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const FCAForm = () => {
  const [plants, setPlants] = useState([]);
  const [newDefect, setNewDefect] = useState([])
  const [modules, setModules] = useState([]);
  const [pos, setPos] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [defectCategories, setDefectCategories] = useState([]);
  const [defectCodes, setDefectCodes] = useState([]);
  const [formData, setFormData] = useState({
  plant: "",
  module: "",
  shift: "A",
  po: "",
  size: "",
  customer: "",
  style: "",
  inspectedQuantity: "",
  defectQuantity: "",
  defectCategory: "",
  defectCode: "",
  quantity: "",
  defectEntries: [], // To store defect category and code for each defect
  remarks: "",
  photos: [],
  status: "",
  defectRate: 0,
  type: "Inline",
});

  const [errors, setErrors] = useState({});


  

  // Fetching data for dropdowns
  useEffect(() => {
    const loadData = async () => {
      const plantData = await fetchPlants();
      setPlants(
        plantData.map((item) => ({
          id: item.id,
          label: item.Production_Section,
          value: item.id,
        }))
      );
    };
    loadData();
  }, []);

  useEffect(() => {
    if (formData.plant) {
      const loadModules = async () => {
        const poData = await fetchModules(formData.plant);
        setModules(
          poData.map((item) => ({
            id: item.id,
            label: item.Sewing_work_center,
            value: item.id,
          }))
        );
      };
      loadModules();
    }
  }, [formData.plant]);

  useEffect(() => {
    if (formData.module) {
      const loadPOs = async () => {
        const poData = await fetchPOs(formData.module);
        setPos(
          poData.map((item) => ({
            id: item.id,
            label: item.Sewing_Order,
            value: `${item.Plant}-${item.Module}-${item.Sewing_Order}`,
          }))
        );
      };
      loadPOs();
    }
  }, [formData.module]);

  useEffect(() => {
    if (formData.po) {
      const loadSizes = async () => {
        const poValue = formData.po.split("-")[2];
        const sizeData = await fetchSizes(poValue);
        setSizes(
          sizeData.map((item) => ({
            id: item.id,
            label: item.Size,
            value: item.id,
          }))
        );
      };
      loadSizes();
    }
  }, [formData.po]);

//loadcustomers and styles

  useEffect(() => {
    if (formData.po) {
      const loadStylesAndCustomers = async () => {
        const styleData = await fetchStyles(formData.po);
        const selectedStyle = styleData.length > 0 ? styleData[0].styles : "";
        setFormData((prevData) => ({
          ...prevData,
          style: selectedStyle,
        }));
  
        const customerData = await fetchCustomers(formData.po);
        const selectedCustomer = customerData.length > 0 ? customerData[0].customers : "";
        setFormData((prevData) => ({
          ...prevData,
          customer: selectedCustomer,
        }));
      };
  
      loadStylesAndCustomers();
    } else {
      setFormData((prevData) => ({
        ...prevData,
        customer: "",
        style: "",
      }));
    }
  }, [formData.po]);
  


 
    // Load defect categories
    useEffect(() => {
      const loadDefectCategories = async () => {
        try {
          const categoryData = await fetchDefectCategories();
          const formattedCategories = categoryData.map((item) => ({
            id: item.UnqId,
            label: item.Defect_Category,
            value: item.UnqId,
          }));
          setDefectCategories(formattedCategories);
        } catch (error) {
          console.error("Error fetching defect categories:", error);
        }
      };
      loadDefectCategories();
    }, []);
  
    // Load defect codes based on selected defect category
    useEffect(() => {
      if (newDefect.defectCategory) {
        const loadDefectCodes = async () => {
          try {
            const codeData = await fetchDefectCodes(newDefect.defectCategory);
            const formattedCodes = codeData.map((item) => ({
              id: item.UnqId,
              label: item.Defect_Code,
              value: item.Defect_Code,
            }));
            setDefectCodes(formattedCodes);
          } catch (error) {
            console.error("Error fetching defect codes:", error);
          }
        };
        loadDefectCodes();
      } else {
        setDefectCodes([]);
      }
    }, [newDefect.defectCategory]);
  
    // Add a new defect entry
    const addDefectEntry = () => {
      const { defectCategory, defectCode, quantity } = newDefect;
  
      if (!defectCategory || !defectCode || !quantity) {
        toast.error("All fields for defect entry are required.");
        return;
      }
  
      const totalQuantity = formData.defectEntries.reduce(
        (total, entry) => total + entry.quantity,
        0
      );
  
      if (totalQuantity + Number(quantity) > Number(formData.defectQuantity)) {
        toast.error("Total defect quantity cannot exceed the specified defect quantity.");
        return;
      }
  
      setFormData((prevData) => ({
        ...prevData,
        defectEntries: [
          ...prevData.defectEntries,
          { defectCategory, defectCode, quantity: Number(quantity) },
        ],
      }));
  
      setNewDefect({ defectCategory: "", defectCode: "", quantity: "" });
    };
  
    // Remove a defect entry
    const removeDefectEntry = (index) => {
      setFormData((prevData) => ({
        ...prevData,
        defectEntries: prevData.defectEntries.filter((_, i) => i !== index),
      }));
    };
  
    // Handle form field changes
    const handleChange = (field, value) => {
      setFormData((prevData) => {
        const updatedData = { ...prevData, [field]: value };
  
        if (field === "defectQuantity" || field === "inspectedQuantity") {
          const defectRate = calculateDefectRate(
            updatedData.defectQuantity,
            updatedData.inspectedQuantity
          );
          updatedData.defectRate = defectRate;
          updatedData.status = determineStatus(defectRate);
        }
  
        return updatedData;
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Form validation
      let formErrors = {};
      const inspectedQuantity = Number(formData.inspectedQuantity);
      const defectQuantity = Number(formData.defectQuantity);
    
      // Validate required fields
      if (!formData.plant) formErrors.plant = "Plant is required.";
      if (!formData.po) formErrors.po = "PO is required.";
      if (!formData.size) formErrors.size = "Size is required.";
      if (!formData.inspectedQuantity) formErrors.inspectedQuantity = "Inspected Quantity is required.";
      if (!formData.defectQuantity) formErrors.defectQuantity = "Defect Quantity is required.";
      if (defectQuantity > inspectedQuantity) formErrors.defectQuantity = "Defect quantity cannot exceed inspected quantity.";
      if (defectQuantity < 0) formErrors.defectQuantity = "Defect quantity cannot be negative.";
      if (inspectedQuantity < 0) formErrors.inspectedQuantity = "Inspected quantity cannot be negative.";
      if (formData.defectEntries.length === 0) formErrors.defectEntries = "At least one defect entry is required.";
    
      // Display errors if any
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        Object.values(formErrors).forEach((error) => toast.error(error));
        return;
      }
    
      // Prepare data for submission
      const defectDetails = formData.defectEntries.map((entry) => ({
        defectCategory: entry.defectCategory,
        defectCode: entry.defectCode,
        quantity: Number(entry.quantity),
      }));
    
      const submissionData = {
        plant: formData.plant,
        module: formData.module,
        shift: formData.shift,
        po: formData.po,
        size: formData.size,
        customer: formData.customer,
        style: formData.style,
        inspectedQuantity,
        defectQuantity,
        defectDetails,
        status: formData.status,
        defectRate: formData.defectRate,
       // photoLinks: formData.photos, // Ensure this is an array or serialized string
        remarks: formData.remarks,
        type: formData.type,
      };
    
      try {
        await submitFCAData(submissionData);
        toast.success("Form submitted successfully!");
    
        // Clear form data after successful submission
        setFormData({
          plant: "",
          module: "",
          shift: "A",
          po: "",
          size: "",
          customer: "",
          style: "",
          inspectedQuantity: "",
          defectQuantity: "",
          defectCategory: "",
          defectCode: "",
          defectEntries: [],
          remarks: "",
          photos: [],
          status: "",
          defectRate: 0,
          type: "Inline",
        });
    
        // Clear errors
        setErrors({});
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("There was an error submitting the form.");
      }
    };
    
    return (
      <motion.div
        className="container mx-auto p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-2xl font-semibold mb-6 flex items-center">
          <img src="/inlineicon2.svg" alt="Sewing Icon" className="w-6 h-6 mr-2" />
          FCA Inline Form
        </h1>
        <p className="text-sm text-gray-600 font-semibold mb-6 translate-x-8 -translate-y-5">
          <CurrDate />
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            
    
            <motion.div variants={itemVariants}>
              <Dropdown
                label="Select Plant"
                options={plants}
                value={formData.plant}
                onChange={(value) => handleChange("plant", value)}
                error={errors.plant}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Dropdown
                label="Select Module"
                options={modules}
                value={formData.module}
                onChange={(value) => handleChange("module", value)}
                error={errors.module}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Dropdown
                label="Select Shift"
                options={[
                  { id: "A", label: "A", value: "A" },
                  { id: "B", label: "B", value: "B" },
                ]}
                value={formData.shift}
                onChange={(value) => handleChange("shift", value)}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
            <label htmlFor="po-select" className="block text-sm font-medium text-gray-700 mb-1">
    Select PO
  </label>
            <Select
            
  options={pos}
  value={pos.find((po) => po.value === formData.po) || null}
  onChange={(selectedOption) =>
    handleChange("po", selectedOption?.value || "")
  }
 
  placeholder="Search PO"
  isSearchable
/>
  {errors.po && <span className="text-red-500">{errors.po}</span>}
</motion.div>


            <motion.div variants={itemVariants}>
              <Dropdown
                label="Select Size"
                options={sizes}
                value={formData.size}
                onChange={(value) => handleChange("size", value)}
                error={errors.size}
              />
            </motion.div>
            {formData.customer && (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <p className="mt-1 text-sm text-gray-800 bg-gray-100 rounded-md p-2">{formData.customer}</p>
              </motion.div>
            )}
            {formData.style && (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700">Style</label>
                <p className="mt-1 text-sm text-gray-800 bg-gray-100 rounded-md p-2">{formData.style}</p>
              </motion.div>
            )}
            <motion.div variants={itemVariants}>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Inspected Quantity
  </label>
  <div className="flex space-x-4">
    {[20, 32].map((quantity) => (
      <div key={quantity} className="flex items-center">
        <input
          id={`quantity-${quantity}`}
          type="radio"
          name="inspectedQuantity"
          value={quantity}
          checked={formData.inspectedQuantity === quantity}
          onChange={(e) =>
            handleChange("inspectedQuantity", Number(e.target.value))
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
        />
        <label
          htmlFor={`quantity-${quantity}`}
          className="ml-2 block text-sm font-medium text-gray-700"
        >
          {quantity}
        </label>
      </div>
    ))}
  </div>
  {errors.inspectedQuantity && (
    <p className="text-sm text-red-600 mt-1">{errors.inspectedQuantity}</p>
  )}
</motion.div>

            <motion.div variants={itemVariants}>
              <InputField
                label="Remarks"
                type="textarea"
                value={formData.remarks}
                onChange={(value) => handleChange("remarks", value)}
                error={errors.remarks}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InputField
                label="Defect Quantity"
                type="number"
                value={formData.defectQuantity}
                onChange={(value) => handleChange("defectQuantity", value)}
                error={errors.defectQuantity}
              />
            </motion.div>
            {/* <motion.div variants={itemVariants}>
              <UploadPhotos
                label="Upload Photos"
                photos={formData.photos}
                onChange={(photos) => handleChange("photos", photos)}
              />
            </motion.div> */}
            <div className="grid grid-cols-2 gap-4 mt-4">
  {/* Status */}
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1">Status</label>
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
        formData.defectRate <= 5 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {formData.defectRate <= 5 ? "Pass" : "Fail"}
    </div>
  </div>

  {/* Defect Rate */}
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1">Defect Rate</label>
    <div
      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
    >
      {formData.defectRate}%
    </div>
  </div>
</div>


            
            {/* <motion.div variants={itemVariants}>
              <InputField
                label="Remarks"
                type="textarea"
                value={formData.remarks}
                onChange={(value) => handleChange("remarks", value)}
                error={errors.remarks}
              />
            </motion.div> */}
          </div>
    
          {/* Right side fields */}
          <div className="flex flex-col justify-between">
            <motion.div variants={itemVariants} className="border p-4 rounded">
              <h2 className="text-lg font-semibold mb-4">Add Defects</h2>
              <div className="grid grid-cols-3 gap-4 items-end">
                <Dropdown
                  label="Defect Category"
                  options={defectCategories}
                  value={newDefect.defectCategory}
                  onChange={(value) =>
                    setNewDefect((prev) => ({ ...prev, defectCategory: value }))
                  }
                  error={errors.defectCategory}
                />
                <Dropdown
                  label="Defect Code"
                  options={defectCodes}
                  value={newDefect.defectCode}
                  onChange={(value) =>
                    setNewDefect((prev) => ({ ...prev, defectCode: value }))
                  }
                  error={errors.defectCode}
                />
                <InputField
                  label="Quantity"
                  type="number"
                  value={newDefect.quantity}
                  onChange={(value) =>
                    setNewDefect((prev) => ({ ...prev, quantity: value }))
                  }
                />
              </div>
              <button
      type="button"
      onClick={addDefectEntry}
      className="mt-4 flex items-center justify-center bg-gray-900 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded shadow"
    >
      <PlusCircleIcon className="h-5 w-5 mr-2" />
      Add Defect
    </button>
    <div className="mt-6">
      <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-100">
        Defect Entries
      </h3>
      <ul className="space-y-2">
        {formData.defectEntries.map((entry, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded shadow"
          >
            <span className="text-gray-700 dark:text-gray-200">
              {entry.defectCategory} - {entry.defectCode}: {entry.quantity}
            </span>
            <button
              className="text-red-500 hover:text-red-600"
              onClick={() => removeDefectEntry(index)}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
    
            {/* Submit */}
            <div className="mt-6 flex justify-end">
              <Button type="submit" variant="primary" label="Submit" />
            </div>
          </div>
        </form>
      </motion.div>
    );
    
    
};

export default FCAForm