import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import InputField from "../components/InputField";
import UploadPhotos from "../components/UploadPhotos";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import {
  fetchPlants,
  fetchPOs,
  fetchSizes,
  fetchDefectCategories,
  fetchDefectCodes,
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
  const [pos, setPos] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [defectCategories, setDefectCategories] = useState([]);
  const [defectCodes, setDefectCodes] = useState([]);
  const [formData, setFormData] = useState({
    plant: "",
    shift: "A",
    po: "",
    size: "",
    inspectedQuantity: "",
    defectQuantity: "",
    defectCategory: "",
    defectCode: "",
    photos: [],
    status: "",
    defectRate: 0,
  });
  const [errors, setErrors] = useState({});

  // Fetching data for dropdowns
  useEffect(() => {
    const loadData = async () => {
      const plantData = await fetchPlants();
      setPlants(
        plantData.map((item) => ({
          id: item.id, // Use the unique 'id' column for mapping
          label: item.Sewing_work_center, // Replace 'name' with the plant name column
          value: item.id,
        }))
      );
    };
    loadData();
  }, []);

  useEffect(() => {
    if (formData.plant) {
      const loadPOs = async () => {
        const poData = await fetchPOs(formData.plant);
        setPos(
          poData.map((item) => ({
            id: item.id, // Use the 'id' from the PO data
            label: item.Sales_order, // Replace with the appropriate PO label column
            value: item.id,
          }))
        );
      };
      loadPOs();
    }
  }, [formData.plant]);

  useEffect(() => {
    if (formData.po) {
      const loadSizes = async () => {
        const sizeData = await fetchSizes(formData.po);
        setSizes(
          sizeData.map((item) => ({
            id: item.id, // Use the 'id' from the size data
            label: item.Size, // Replace with the appropriate size label column
            value: item.id,
          }))
        );
      };
      loadSizes();
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
          label: item.Defect_code,
          value: item.Defect_code,
        }));
        setDefectCodes(formattedCodes);
      };
      loadDefectCodes();
    }
  }, [formData.defectCategory]);

  const handleChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };

      // Calculate defect rate and status based on the updated data
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
    if (!formData.plant) formErrors.plant = "Plant is required";
    if (!formData.po) formErrors.po = "PO is required";
    if (!formData.size) formErrors.size = "Size is required";
    if (!formData.inspectedQuantity) formErrors.inspectedQuantity = "Inspected Quantity is required";
    if (!formData.defectQuantity) formErrors.defectQuantity = "Defect Quantity is required";
    if (!formData.defectCategory) formErrors.defectCategory = "Defect Category is required";
    if (!formData.defectCode) formErrors.defectCode = "Defect Code is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await submitFCAData(formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }
  };

  return (
    <motion.div
      className="container mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-2xl font-semibold mb-6">FCA Inline Form</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <motion.div className="col-span-1 md:col-span-2" variants={itemVariants}>
          <StatusBadge status={formData.status} defectRate={formData.defectRate} />
        </motion.div>

        <motion.div className="col-span-1 md:col-span-2" variants={itemVariants}>
          <UploadPhotos
            photos={formData.photos}
            onUpload={(photos) => handleChange("photos", photos)}
          />
        </motion.div>

        <motion.div className="col-span-1 md:col-span-2 flex justify-end" variants={itemVariants}>
          <Button type="submit" label="Submit" />
        </motion.div>
      </form>
    </motion.div>
  );
};

export default FCAForm;
