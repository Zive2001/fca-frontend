import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import InputField from "../components/InputField";
import UploadPhotos from "../components/UploadPhotos";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CurrDate from "../components/CurrDate";

import {
  fetchPlants,
  fetchModules,
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

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [modules, setModules] = useState([]);
  const [pos, setPos] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [defectCategories, setDefectCategories] = useState([]);
  const [formData, setFormData] = useState({
    plant: "",
    module: "",
    shift: "A",
    po: "",
    size: "",
    inspectedQuantity: "",
    defectQuantity: "",
    defects: [],
    remarks: "",
    photos: [],
    status: "",
    defectRate: 0,
    type: "Endline",
  });
  const [errors, setErrors] = useState({});

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
    const loadDefectCategories = async () => {
      const categoryData = await fetchDefectCategories();
      setDefectCategories(
        categoryData.map((item) => ({
          id: item.UnqId,
          label: item.Defect_Category,
          value: item.UnqId,
        }))
      );
    };
    loadDefectCategories();
  }, []);

  useEffect(() => {
    // Adjust defect entries dynamically based on defect quantity
    const defectQuantity = parseInt(formData.defectQuantity || 0, 10);
    const currentDefects = formData.defects;
    const updatedDefects = currentDefects.slice(0, defectQuantity);

    while (updatedDefects.length < defectQuantity) {
      updatedDefects.push({ defectCategory: "", defectCode: "" });
    }

    setFormData((prevData) => ({ ...prevData, defects: updatedDefects }));
  }, [formData.defectQuantity]);

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

  const updateDefect = (index, field, value) => {
    const updatedDefects = formData.defects.map((defect, i) =>
      i === index ? { ...defect, [field]: value } : defect
    );
    setFormData((prevData) => ({ ...prevData, defects: updatedDefects }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    const inspectedQuantity = Number(formData.inspectedQuantity);
    const defectQuantity = Number(formData.defectQuantity);

    if (!formData.plant) formErrors.plant = "Plant is required.";
    if (!formData.po) formErrors.po = "PO is required.";
    if (!formData.size) formErrors.size = "Size is required.";
    if (!formData.inspectedQuantity)
      formErrors.inspectedQuantity = "Inspected Quantity is required.";
    if (!formData.defectQuantity)
      formErrors.defectQuantity = "Defect Quantity is required.";
    if (defectQuantity > inspectedQuantity)
      formErrors.defectQuantity =
        "Defect quantity cannot exceed inspected quantity.";

    formData.defects.forEach((defect, index) => {
      if (!defect.defectCategory) {
        formErrors[`defectCategory_${index}`] = `Defect category is required for defect ${
          index + 1
        }.`;
      }
      if (!defect.defectCode) {
        formErrors[`defectCode_${index}`] = `Defect code is required for defect ${
          index + 1
        }.`;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Object.values(formErrors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    try {
      await submitFCAData(formData);
      toast.success("Form submitted successfully!");
      setFormData({
        plant: "",
        module: "",
        shift: "A",
        po: "",
        size: "",
        inspectedQuantity: "",
        defectQuantity: "",
        defects: [],
        remarks: "",
        photos: [],
        status: "",
        defectRate: 0,
        type: "Endline",
      });
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Dropdown
          label="Plant"
          options={plants}
          value={formData.plant}
          onChange={(value) => handleChange("plant", value)}
          error={errors.plant}
        />
        <Dropdown
          label="Module"
          options={modules}
          value={formData.module}
          onChange={(value) => handleChange("module", value)}
          error={errors.module}
        />
        <Dropdown
          label="PO"
          options={pos}
          value={formData.po}
          onChange={(value) => handleChange("po", value)}
          error={errors.po}
        />
        <Dropdown
          label="Size"
          options={sizes}
          value={formData.size}
          onChange={(value) => handleChange("size", value)}
          error={errors.size}
        />
        <InputField
          label="Inspected Quantity"
          type="number"
          value={formData.inspectedQuantity}
          onChange={(value) => handleChange("inspectedQuantity", value)}
          error={errors.inspectedQuantity}
        />
        <InputField
          label="Defect Quantity"
          type="number"
          value={formData.defectQuantity}
          onChange={(value) => handleChange("defectQuantity", value)}
          error={errors.defectQuantity}
        />
        <div className="space-y-2">
          {formData.defects.map((defect, index) => (
            <div key={index} className="flex space-x-4">
              <Dropdown
                label={`Defect Category ${index + 1}`}
                options={defectCategories}
                value={defect.defectCategory}
                onChange={(value) => updateDefect(index, "defectCategory", value)}
                error={errors[`defectCategory_${index}`]}
              />
              <Dropdown
                label={`Defect Code ${index + 1}`}
                options={defectCategories}
                value={defect.defectCode}
                onChange={(value) => updateDefect(index, "defectCode", value)}
                error={errors[`defectCode_${index}`]}
              />
            </div>
          ))}
        </div>
        <InputField
          label="Remarks"
          type="text"
          value={formData.remarks}
          onChange={(value) => handleChange("remarks", value)}
        />
        <UploadPhotos
          photos={formData.photos}
          onChange={(photos) => handleChange("photos", photos)}
        />
        <StatusBadge status={formData.status} />
        <Button type="submit">Submit</Button>
      </form>
    </motion.div>
  );
};

export default Home;
