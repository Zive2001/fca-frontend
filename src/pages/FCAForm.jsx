import React, { useState, useEffect } from "react";
import { color, motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import InputField from "../components/InputField";
import ConfirmSubmissionDialog from "../components/ConfirmSubmissionDialog";
import SubmissionSuccessDialog from "../components/SubmissionSuccessDialog";
import Button from "../components/Button";
import EmailNotificationHandler from '../components/EmailNotificationHandler';
import { sendEmailNotification } from '../utils/emailNotificationUtil';
// import { useMsal } from "@azure/msal-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CurrDate from '../components/CurrDate';
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import Select from "react-select";
import DefectEntry from '../components/DefectEntry';
import { Switch } from "@headlessui/react";

import {
  fetchPlants,
  fetchModules,
  fetchPOs,
  fetchSizes,
  fetchDefectCategories,
  fetchDefectCodes,
  fetchCustomers,
  fetchStyles,
  fetchCustomerColor,
  fetchCustomerColorDesc,
  fetchCPONumber,
  fetchEmailRecipients,
  sendFailureNotification,
  submitFCAData,
  fetchDefectLocations,
  fetchLocationCategories,
  addDefectPhoto
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
 
  const [userEmail, setUserEmail] = useState("");  // This will get the logged-in user's email // This will get the logged-in user's email
  const [plants, setPlants] = useState([]);
  const [newDefect, setNewDefect] = useState({
    defectCategory: "",
    defectCode: "",
    quantity: "",
    defectLocation: ""
    
});
  const [modules, setModules] = useState([]);
  const [pos, setPos] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [defectCategories, setDefectCategories] = useState([]);
  const [defectCodes, setDefectCodes] = useState([]);
  const [defectPhotos, setDefectPhotos] = useState({});
  const [locationCategories, setLocationCategories] = useState([]);
  const [defectLocations, setDefectLocations] = useState([]);
  const [isLocationCategoryLocked, setIsLocationCategoryLocked] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
const [submittedAuditId, setSubmittedAuditId] = useState(null);

useEffect(() => {
  fetch("/.auth/me")
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        setUserEmail(data[0].user_id);
      }
    })
    .catch(err => console.error("Failed to fetch user:", err));
}, []);

 
  const [formData, setFormData] = useState({
  plant: "",
  module: "",
  shift: "A",
  po: "",
  size: "",
  customer: "",
  style: "",
  color: "",
  colorDesc: "",
  cpoNumber: "",
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
  locationCategory: "",
  type: "Inline",
  createdBy: "",
  isThirdParty: false
});

  const [errors, setErrors] = useState({});

  const handleThirdPartyToggle = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isThirdParty: checked
    }));
  };

  useEffect(() => {
    if (userEmail) {
      setFormData(prev => ({
        ...prev,
        createdBy: userEmail
      }));
    }
  }, [userEmail]);
  // Modified useEffect for plant data
  useEffect(() => {
    const loadData = async () => {
      const plantData = await fetchPlants();
      
      // Custom sorting function
      const sortPlants = (plants) => {
        // Define the desired order
        const order = [
          'BPL1-VS1',
          'BPL1-VS2',
          'BPL1-VS4',
          'BPL2-VS1',
          'BPL2-VS2',
          'others'
        ];

        // Create a map for ordering
        const orderMap = new Map(order.map((item, index) => [item, index]));

        // Sort the plants based on the defined order
        return plants.sort((a, b) => {
          const aOrder = orderMap.has(a.Production_Section) ? 
            orderMap.get(a.Production_Section) : 
            order.length; // Put unknown items at the end
          const bOrder = orderMap.has(b.Production_Section) ? 
            orderMap.get(b.Production_Section) : 
            order.length; // Put unknown items at the end
          
          return aOrder - bOrder;
        });
      };

      // Sort the plant data
      const sortedPlantData = sortPlants(plantData);

      // Transform the sorted data into the required format
      setPlants(
        sortedPlantData.map((item) => ({
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
    const loadPOs = async () => {
      const poData = await fetchPOs();
      setPos(
        poData.map((item) => ({
          id: item.id,
          label: item.Sewing_Order,
          value: item.Sewing_Order
        }))
      );
    };
    loadPOs();
  }, []); // Empty dependency array since we want to load all POs once

  useEffect(() => {
  if (formData.po) {
    const loadSizes = async () => {
      try {
        // Just pass the PO number
        const sizeData = await fetchSizes(formData.po);
        setSizes(
          sizeData.map((item) => ({
            id: item.Size, // Use Size as id
            label: item.Size, // Display Size as label
            value: item.Size  // Use Size as value
          }))
        );
      } catch (error) {
        console.error("Error loading sizes:", error);
        toast.error("Error loading size information");
        setSizes([]);
      }
    };

    loadSizes();
  } else {
    setSizes([]);
  }
}, [formData.po]);


//loadcustomers and styles

useEffect(() => {
  if (formData.po) {
    const loadStylesAndCustomers = async () => {
      try {
        // Now passing just the PO number
        const styleData = await fetchStyles(formData.po);
        const selectedStyle = styleData.length > 0 ? styleData[0].Customer_Style : "";
        setFormData((prevData) => ({
          ...prevData,
          style: selectedStyle,
        }));

        const customerData = await fetchCustomers(formData.po);
        const selectedCustomer = customerData.length > 0 ? customerData[0].BPL_Customer_Code : "";
        setFormData((prevData) => ({
          ...prevData,
          customer: selectedCustomer,
        }));
      } catch (error) {
        console.error("Error loading styles and customers:", error);
        // Handle error appropriately
        toast.error("Error loading style and customer information");
      }
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


useEffect(() => {
  if (formData.po) {
    const loadColorAndDesc = async () => {
      try {
        // Now passing just the PO number
        const colorData = await fetchCustomerColor(formData.po);
        const selectedColor = colorData.length > 0 ? colorData[0].Customer_Color : "";
        setFormData((prevData) => ({
          ...prevData,
          color: selectedColor,
        }));

        const colorDescData = await fetchCustomerColorDesc(formData.po);
        const selectedDesc = colorDescData.length > 0 ? colorDescData[0].Customer_Color_Descr : "";
        setFormData((prevData) => ({
          ...prevData,
          colorDesc: selectedDesc,
        }));
      } catch (error) {
        console.error("Error loading color and description:", error);
        // Handle error appropriately
        toast.error("Error loading color and description");
      }
    };

    loadColorAndDesc();
  } else {
    setFormData((prevData) => ({
      ...prevData,
      color: "",
      colorDesc: "",
    }));
  }
}, [formData.po]);


useEffect(() => {
  if (formData.po) {
    const loadCPONumber = async () => {
      try {
        const cpoData = await fetchCPONumber(formData.po);
        const selectedCPO = cpoData.length > 0 ? cpoData[0].CPO_Number : "";
        setFormData((prevData) => ({
          ...prevData,
          cpoNumber: selectedCPO,
        }));
      } catch (error) {
        console.error("Error loading CPO number:", error);
        toast.error("Error loading CPO number");
      }
    };

    loadCPONumber();
  } else {
    setFormData((prevData) => ({
      ...prevData,
      cpoNumber: "",
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
              label: item.Combined_Defect,
              value: item.Combined_Defect,
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
  
  // Add new useEffect for loading location categories
useEffect(() => {
  const loadLocationCategories = async () => {
      const categories = await fetchLocationCategories();
      setLocationCategories(
          categories.map(item => ({
              id: item.Category,
              label: item.Category,
              value: item.Category
          }))
      );
  };
  loadLocationCategories();
}, []);

// Add useEffect for loading defect locations based on selected category
useEffect(() => {
  if (formData.locationCategory) {
    const loadDefectLocations = async () => {
      try {
        const locations = await fetchDefectLocations(formData.locationCategory);
        setDefectLocations(
          locations.map(item => ({
            id: item.Defect_Location,
            label: item.Defect_Location,
            value: item.Defect_Location
          }))
        );
      } catch (error) {
        console.error("Error loading defect locations:", error);
        toast.error("Error loading defect locations");
      }
    };
    loadDefectLocations();
  } else {
    setDefectLocations([]);
  }
}, [formData.locationCategory]);
    // Add a new defect entry
   // Add a new defect entry with updated validation
   const handleDefectPhotos = (defectIndex, photos) => {
    setDefectPhotos(prev => ({
      ...prev,
      [defectIndex]: photos
    }));
  };

  const addDefectEntry = () => {
    const { defectCategory, defectCode, quantity, defectLocation } = newDefect;
    const enteredQuantity = Number(quantity);
    const maxDefectQuantity = Number(formData.defectQuantity);
  
    // Basic validation
    if (!defectCategory || !defectCode || !quantity || !defectLocation) {
      toast.error("All fields for defect entry are required.");
      return;
    }
  
    if (!formData.locationCategory) {
      toast.error("Please select a location category first.");
      return;
    }
  
    // Validate that individual quantity doesn't exceed max defect quantity
    if (enteredQuantity > maxDefectQuantity) {
      toast.error(`Individual defect quantity cannot exceed the total defect quantity (${maxDefectQuantity}).`);
      return;
    }
  
    // Validate that quantity is a positive number
    if (enteredQuantity <= 0) {
      toast.error("Defect quantity must be greater than 0.");
      return;
    }
  
    // Lock the location category after first entry
    setIsLocationCategoryLocked(true);
  
    setFormData((prevData) => ({
      ...prevData,
      defectEntries: [
        ...prevData.defectEntries,
        { 
          id: Date.now(),
          defectCategory, 
          defectCode, 
          quantity: enteredQuantity,
          locationCategory: prevData.locationCategory,
          defectLocation
        },
      ],
    }));
  
    setNewDefect({ defectCategory: "", defectCode: "", quantity: "", defectLocation: "" });
  };
  

    // Remove a defect entry
    const removeDefectEntry = (index) => {
      const entry = formData.defectEntries[index];
      if (entry.photos) {
        entry.photos.forEach(photo => URL.revokeObjectURL(photo.preview));
      }
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
  updatedData.status = determineStatus(
    Number(updatedData.defectQuantity), 
    updatedData.inspectedQuantity
  );
}
        return updatedData;
      });
    };


    

    const validateForm = () => {
      let formErrors = {};
      const inspectedQuantity = Number(formData.inspectedQuantity);
      const defectQuantity = Number(formData.defectQuantity);
    
      // Validate required fields
      if (!formData.plant) formErrors.plant = "Plant is required.";
      if (!formData.po) formErrors.po = "PO is required.";
      if (!formData.size) formErrors.size = "Size is required.";
      if (!formData.inspectedQuantity) formErrors.inspectedQuantity = "Inspected Quantity is required.";
      if (formData.defectQuantity === "") formErrors.defectQuantity = "Defect Quantity is required.";
      if (defectQuantity > inspectedQuantity) formErrors.defectQuantity = "Defect quantity cannot exceed inspected quantity.";
      if (defectQuantity < 0) formErrors.defectQuantity = "Defect quantity cannot be negative.";
      if (inspectedQuantity < 0) formErrors.inspectedQuantity = "Inspected quantity cannot be negative.";
      
      // Only validate defect entries if defect quantity is greater than 0
      if (defectQuantity > 0 && formData.defectEntries.length === 0) {
        formErrors.defectEntries = "At least one defect entry is required when defect quantity is greater than 0.";
      }
    
      return formErrors;
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        // Object.values(formErrors).forEach((error) => toast.error(error));
        return;
      }
    };
    
    // In FCAForm.jsx

    const handleConfirmedSubmit = async () => {
      try {
        // Prepare data for submission
        const submissionData = {
          plant: formData.plant,
          module: formData.module,
          shift: formData.shift,
          po: formData.po,
          size: formData.size,
          customer: formData.customer,
          style: formData.style,
          color: formData.color,
          colorDesc: formData.colorDesc,
          cpoNumber: formData.cpoNumber,
          inspectedQuantity: Number(formData.inspectedQuantity),
          defectQuantity: Number(formData.defectQuantity),
          defectDetails: formData.defectEntries.map(entry => ({
            defectCategory: entry.defectCategory,
            defectCode: entry.defectCode,
            quantity: Number(entry.quantity),
            locationCategory: formData.locationCategory,
            defectLocation: entry.defectLocation
          })),
          status: formData.status,
          defectRate: formData.defectRate,
          remarks: formData.remarks,
          type: formData.type,
          createdBy: userEmail,
          isThirdParty: formData.isThirdParty
        };
    
        // Submit main form data
        const response = await submitFCAData(submissionData);
        
        if (!response || !response.auditId) {
          throw new Error('Server response missing audit ID');
        }
    
        const auditId = response.auditId;
        
        // Upload photos for each defect if they exist
        if (Object.keys(defectPhotos).length > 0) {
          const photoUploadPromises = [];
    
          for (const [defectIndex, photos] of Object.entries(defectPhotos)) {
            const defectId = response.defects[defectIndex]?.Id;
            if (!defectId) continue;
    
            for (const photo of photos) {
              const formData = new FormData();
              formData.append('photo', photo.file);
              formData.append('auditId', auditId.toString());
              formData.append('defectId', defectId.toString());
    
              photoUploadPromises.push(addDefectPhoto(formData));
            }
          }
    
          await Promise.all(photoUploadPromises);
        }
    
        // Set the submitted audit ID for the success dialog
        setSubmittedAuditId(auditId);
        setShowSuccessDialog(true);
    
        // Clear form data
        setFormData({
          plant: "",
          module: "",
          shift: "A",
          po: "",
          size: "",
          customer: "",
          style: "",
          color: "",
          colorDesc: "",
          cpoNumber: "",
          inspectedQuantity: "",
          defectQuantity: "",
          defectCategory: "",
          defectCode: "",
          quantity: "",
          defectEntries: [],
          locationCategory: "",
          remarks: "",
          photos: [],
          status: "",
          defectRate: 0,
          type: "Inline",
        });
    
        // Clear defect photos
        setDefectPhotos({});
        setIsLocationCategoryLocked(false);
        
        // Clear errors
        setErrors({});
    
        // Return the response for ConfirmSubmissionDialog
        return { auditId, status: 'success' };
    
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.message || "There was an error submitting the form.");
        throw error;
      }
    };
    
    return (
      <motion.div
        className="container mx-auto p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-2xl font-semibold mb-4 flex items-center">
    <img src="/inlineicon2.svg" alt="Sewing Icon" className="w-6 h-6 mr-2" />
    FCA Inline Form
  </h1>
  <p className="text-sm text-gray-600 font-semibold mb-3 translate-x-8 -translate-y-5">
          <CurrDate />
        </p>
        <div className="flex items-center mb-6 translate-x-8 -translate-y-5">
          <span className="text-sm text-gray-700 font-medium mr-3">
            {formData.isThirdParty ? "Third Party Audit" : "Internal Audit"}
          </span>
          <Switch
            checked={formData.isThirdParty}
            onChange={handleThirdPartyToggle}
            className={`${
              formData.isThirdParty ? "bg-gray-900" : "bg-gray-300"
            } relative inline-flex h-6 w-11 items-center rounded-full  transition-colors focus:outline-none  focus:ring-slate-800  focus:ring-offset-0`}
          >
            <span className="sr-only">Enable third party audit</span>
            <span
              className={`${
                formData.isThirdParty ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side fields - Reorganized */}
          <div className="space-y-6">
            {/* Main Input Section */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Dropdown
                  label="1. Select Plant"
                  options={plants}
                  value={formData.plant}
                  onChange={(value) => handleChange("plant", value)}
                  error={errors.plant}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Dropdown
                  label="2. Select Module"
                  options={modules}
                  value={formData.module}
                  onChange={(value) => handleChange("module", value)}
                  error={errors.module}
                />
              </motion.div>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Dropdown
                  label="3. Select Shift"
                  options={[
                    { id: "A", label: "A", value: "A" },
                    { id: "B", label: "B", value: "B" },
                  ]}
                  value={formData.shift}
                  onChange={(value) => handleChange("shift", value)}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  4. Select PO
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
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Dropdown
                  label="5. Select Size"
                  options={sizes}
                  value={formData.size}
                  onChange={(value) => handleChange("size", value)}
                  error={errors.size}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Dropdown
                  label="6. Category"
                  options={locationCategories}
                  value={formData.locationCategory}
                  onChange={(value) => handleChange("locationCategory", value)}
                  error={errors.locationCategory}
                  disabled={isLocationCategoryLocked}
                />
              </motion.div>
            </div>
  
            {/* PO Details Card - Compact View */}
            {(formData.cpoNumber || formData.customer || formData.style || formData.color || formData.colorDesc) && (
              <motion.div variants={itemVariants} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-2">PO Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {formData.cpoNumber && (
                    <div>
                      <span className="text-gray-500 font-semibold">VPO:</span>
                      <span className="ml-2 text-gray-900">{formData.cpoNumber}</span>
                    </div>
                  )}
                  {formData.customer && (
                    <div>
                      <span className="text-gray-500 font-semibold">Customer:</span>
                      <span className="ml-2 text-gray-900">{formData.customer}</span>
                    </div>
                  )}
                  {formData.style && (
                    <div>
                      <span className="text-gray-500 font-semibold">Style:</span>
                      <span className="ml-2 text-gray-900">{formData.style}</span>
                    </div>
                  )}
                  {formData.color && (
                    <div>
                      <span className="text-gray-500 font-semibold">Color:</span>
                      <span className="ml-2 text-gray-900">{formData.color}</span>
                    </div>
                  )}
                  {formData.colorDesc && (
                    <div className="col-span-2">
                      <span className="text-gray-500 font-semibold">Color Description:</span>
                      <span className="ml-2 text-gray-900">{formData.colorDesc}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
  
{/* Inspection Details Section */}
<motion.div variants={itemVariants} className="bg-white rounded-lg border p-4">
            <h3 className="text-md font-semibold mb-4">Inspection Details</h3>
            <div className="space-y-4">
              {/* First Row: Quantities */}
              <div className="grid grid-cols-2 gap-6">
                {/* Inspected Quantity */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    7. Inspected Quantity
                  </label>
                  <div className="flex space-x-6 bg-gray-50 rounded-md p-2">
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
                          {quantity} pcs
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.inspectedQuantity && (
                    <p className="text-sm text-red-600 mt-1">{errors.inspectedQuantity}</p>
                  )}
                </div>

                {/* Defect Quantity */}
                <div className="relative">
                  <div className="w-36">
                    <InputField
                      label="8. Defect Quantity"
                      type="number"
                      value={formData.defectQuantity}
                      onChange={(value) => handleChange("defectQuantity", value)}
                      error={errors.defectQuantity}
                    />
                  </div>
                </div>
              </div>

              {/* Second Row: Status and Rate */}
              <div className="pt-2">
  <div className="flex items-center space-x-6">
    {/* Status */}
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">Status:</label>
      <div
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium w-20 justify-normal ${
          formData.status === "Pass"
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}
      >
        {formData.status || "Pending"}
      </div>
    </div>

                  {/* Defect Rate */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Defect Rate:</label>
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium w-20 justify-normal bg-gray-100 text-gray-800 border border-gray-200">
                      {formData.defectRate}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

  
            {/* Remarks */}
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
          {/* Right side fields */}
          <div className="flex flex-col justify-between">
            <motion.div variants={itemVariants} className="border p-4 rounded">
              <h2 className="text-lg font-semibold mb-4">Add Defects</h2>
              <div className="grid grid-cols-4 gap-4 items-end">
        <Dropdown
          label="Defect Category"
          options={defectCategories}
          value={newDefect.defectCategory}
          onChange={(value) =>
            setNewDefect((prev) => ({ ...prev, defectCategory: value }))
          }
          error={errors.defectCategory}
        />
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Defect Code
        </label>
        <Select
          options={defectCodes}
          value={defectCodes.find(code => code.value === newDefect.defectCode) || null}
          onChange={(selectedOption) =>
            setNewDefect((prev) => ({
              ...prev,
              defectCode: selectedOption?.value || ""
            }))
          }
          placeholder="Search Code  "
          isSearchable
          className="basic-single"
          classNamePrefix="select"
          isDisabled={!newDefect.defectCategory}
        />
        {errors.defectCode && (
          <span className="text-red-500 text-sm">{errors.defectCode}</span>
        )}
      </div>
        <Dropdown
          label="Defect Location"
          options={defectLocations}
          value={newDefect.defectLocation}
          onChange={(value) =>
            setNewDefect((prev) => ({ ...prev, defectLocation: value }))
          }
          disabled={!formData.locationCategory}
          error={errors.defectLocation}
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
  <DefectEntry
    key={index}
    entry={entry}
    index={index}
    onRemove={removeDefectEntry}
    onPhotosChange={handleDefectPhotos}
  />
))}
  </ul>
</div>
            </motion.div>
    
            {/* Submit */}
            <div className="mt-6 flex justify-end">
            <ConfirmSubmissionDialog 
  onConfirm={handleConfirmedSubmit} 
  validateForm={validateForm}
  formData={formData}
/>
</div>
          </div>
        </form>

        <SubmissionSuccessDialog
      isOpen={showSuccessDialog}
      onClose={() => setShowSuccessDialog(false)}
      auditId={submittedAuditId}
      isFailureStatus={formData.defectRate > 5}
    />
      </motion.div>
    );
    
    
};


export default FCAForm