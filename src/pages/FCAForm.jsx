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
  const [modules, setModules] = useState([]);
  const [pos, setPos] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [styles, setStyles] = useState([]);
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
    remarks:"",
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
            value: item.id,
          }))
        );
      };
      loadPOs();
    }
  }, [formData.module]);

  useEffect(() => {
    if (formData.po) {
      const loadSizes = async () => {
        const sizeData = await fetchSizes(formData.po);
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

  useEffect(() => {
    if (formData.po) {
      const loadStyles = async () => {
        const sizeData = await fetchStyles(formData.po);
        setStyles(
          sizeData.map((item) => ({
            id: item.id,
            label: item.Style,
            value: item.id,
          }))
        );
      };
      loadStyles();
    }
  }, [formData.po]);


  useEffect(() => {
    if (formData.po) {
      const loadCustomers = async () => {
        const sizeData = await fetchCustomers(formData.po);
        setCustomers(
          sizeData.map((item) => ({
            id: item.id,
            label: item.Customers,
            value: item.id,
          }))
        );
      };
      loadCustomers();
    }
  }, [formData.po]);



  useEffect(() => {
    const loadDefectCategories = async () => {
      const categoryData = await fetchDefectCategories();
      const formattedCategories = categoryData.map((item) => ({
        id: item.UnqId,
        label: item.Defect_Category,
        value: item.UnqId,
      }));
      setDefectCategories(formattedCategories);
    };
    loadDefectCategories();
  }, []);

  useEffect(() => {
    if (formData.defectCategory) {
      const loadDefectCodes = async () => {
        const codeData = await fetchDefectCodes(formData.defectCategory);
        const formattedCodes = codeData.map((item) => ({
          id: item.UnqId,
          label: item.Defect_Code,
          value: item.Defect_Code,
        }));
        setDefectCodes(formattedCodes);
      };
      loadDefectCodes();
    }
  }, [formData.defectCategory]);

  const handleChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };

      if (field === "defectQuantity" || field === "inspectedQuantity") {
        const defectRate = calculateDefectRate(updatedData.defectQuantity, updatedData.inspectedQuantity);
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
    

    if (!formData.plant) formErrors.plant = "Plant is required.";
    if (!formData.po) formErrors.po = "PO is required.";
    if (!formData.size) formErrors.size = "Size is required.";
    if (!formData.inspectedQuantity) formErrors.inspectedQuantity = "Inspected Quantity is required.";
    if (!formData.defectQuantity) formErrors.defectQuantity = "Defect Quantity is required.";
    if (!formData.defectCategory) formErrors.defectCategory = "Defect Category is required.";
    if (!formData.defectCode) formErrors.defectCode = "Defect Code is required.";
    if (defectQuantity > inspectedQuantity) formErrors.defectQuantity = "Defect quantity cannot exceed inspected quantity.";
    if (defectQuantity < 0) formErrors.defectQuantity = "Defect quantity cannot be negative.";
    if (inspectedQuantity < 0) formErrors.inspectedQuantity = "Inspected quantity cannot be negative.";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);

      // Show toast notifications for each error
      Object.values(formErrors).forEach((error) => {
        toast.error(error);
      });

      return;
    }

    try {
      await submitFCAData(formData);
      toast.success("Form submitted successfully!");

      //Clear Data after submit
      setFormData({
        plant: "",
        module: "",
        shift: "A",
        po: "",
        size: "",
        customer:"",
        style:"",
        inspectedQuantity: "",
        defectQuantity: "",
        defectCategory: "",
        defectCode: "",
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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side fields */}
        <div className="flex flex-col gap-6">
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
            <Dropdown
              label="Select PO"
              options={pos}
              value={formData.po}
              onChange={(value) => handleChange("po", value)}
              error={errors.po}
            />
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
        </div>

        {/* Right side fields */}
        <div className="flex flex-col gap-6">
        
          <motion.div variants={itemVariants}>
            <InputField
              label="Inspected Quantity"
              type="number"
              value={formData.inspectedQuantity}
              onChange={(value) => handleChange("inspectedQuantity", value)}
              error={errors.inspectedQuantity}
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

          <motion.div variants={itemVariants}>
            <Dropdown
              label="Defect Category"
              options={defectCategories}
              value={formData.defectCategory}
              onChange={(value) => handleChange("defectCategory", value)}
              error={errors.defectCategory}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Dropdown
              label="Defect Code"
              options={defectCodes}
              value={formData.defectCode}
              onChange={(value) => handleChange("defectCode", value)}
              error={errors.defectCode}
            />
          </motion.div>

          <div className="col-span-full flex flex-col items-baseline gap-8">
          <StatusBadge 
            defectRate={formData.defectRate} 
            status={formData.status} 
          />
        </div>

          <motion.div variants={itemVariants}>
            <UploadPhotos
              label="Upload Photos"
              photos={formData.photos}
              onChange={(photos) => handleChange("photos", photos)}
            />
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
  
        </div>
        
 {/* Status Badge */}
 <div className="col-span-full flex flex-col items-baseline gap-8">
          <StatusBadge 
            defectRate={formData.defectRate} 
            status={formData.status} 
          />
        </div>
       
        {/* Submit Button */}
        <div className="col-span-full flex justify-end mt-4">
          <Button type="submit" variant="primary" label="Submit" />
        </div>
      </form>
    </motion.div>
    
  );
};

export default FCAForm