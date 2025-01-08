import React, { useState, useEffect } from "react";
import { color, motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import InputField from "../components/InputField";
import ConfirmSubmissionDialog from "../components/ConfirmSubmissionDialog";
import Button from "../components/Button";
import EmailNotificationHandler from '../components/EmailNotificationHandler';
import { sendEmailNotification } from '../utils/emailNotificationUtil';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CurrDate from '../components/CurrDate';
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import Select from "react-select";
import DefectEntry from '../components/DefectEntry';

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
});

  const [errors, setErrors] = useState({});


  

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
    if (formData.module) {
      const loadPOs = async () => {
        const poData = await fetchPOs(formData.module);
        setPos(
          poData.map((item) => ({
            id: item.id,
            label: item.Sewing_Order,
            // Store the raw PO number as value
            value: item.Sewing_Order
          }))
        );
      };
      loadPOs();
    }
  }, [formData.module]);

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
          updatedData.status = determineStatus(defectRate);
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
    
    const handleConfirmedSubmit = async () => {
      try {
        // Prepare data for submission
        const defectDetails = formData.defectEntries.map((entry) => ({
          defectCategory: entry.defectCategory,
          defectCode: entry.defectCode,
          quantity: Number(entry.quantity),
          locationCategory: formData.locationCategory,
          defectLocation: entry.defectLocation,
          photos: entry.photos || []
        }));
    
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
          inspectedQuantity: Number(formData.inspectedQuantity),
          defectQuantity: Number(formData.defectQuantity),
          defectDetails,
          status: formData.status,
          defectRate: formData.defectRate,
          remarks: formData.remarks,
          type: formData.type,
        };
    
        // Submit main form data
        const response = await submitFCAData(submissionData);
        
        if (!response || !response.auditId) {
          throw new Error('Server response missing audit ID');
        }
    
        const auditId = response.auditId;
        const defectIds = response.defects || [];
    
        // Upload photos for each defect if they exist
        if (Object.keys(defectPhotos).length > 0) {
          const photoUploadPromises = Object.entries(defectPhotos).map(async ([defectIndex, photos]) => {
            const defectId = defectIds[defectIndex]?.Id;
            if (!defectId) {
              console.warn(`No defect ID found for index ${defectIndex}`);
              return;
            }
    
            return Promise.all(
              photos.map(async (photo) => {
                try {
                  const formData = new FormData();
                  formData.append('photo', photo);
                  formData.append('auditId', auditId.toString());
                  formData.append('defectId', defectId.toString());
                  
                  return await addDefectPhoto(formData);
                } catch (photoError) {
                  console.error('Error uploading photo:', photoError);
                  toast.error(`Failed to upload photo: ${photo.name}`);
                  return null;
                }
              })
            );
          });
    
          await Promise.all(photoUploadPromises);
        }
    
        // Send email notification if status is "Fail"
        if (formData.status === "Fail" && response.auditId) {
          try {
            await sendFailureNotification({
              plant: formData.plant,
              formData: formData,
              defectPhotos: defectPhotos,
              auditId: response.auditId,
              defectEntries: formData.defectEntries
            });
          } catch (emailError) {
            console.error("Error sending email notification:", emailError);
            toast.warning("Form submitted successfully, but there was an error sending the email notification.");
          }
        }
    
        toast.success("Form submitted successfully!");
        
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
          inspectedQuantity: "",
          defectQuantity: "",
          defectCategory: "",
          defectCode: "",
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
    
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.message || "There was an error submitting the form.");
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
            <label htmlFor="po-select" className="block text-sm font-medium text-gray-700 mb-1">
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
    label="6.Category"
    options={locationCategories}
    value={formData.locationCategory}
    onChange={(value) => handleChange("locationCategory", value)}
    error={errors.locationCategory}
    disabled={isLocationCategoryLocked}
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
            {formData.color && (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <p className="mt-1 text-sm text-gray-800 bg-gray-100 rounded-md p-2">{formData.color}</p>
              </motion.div>
            )}
            {formData.colorDesc && (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700">Color Description</label>
                <p className="mt-1 text-sm text-gray-800 bg-gray-100 rounded-md p-2">{formData.colorDesc}</p>
              </motion.div>
            )}
            <motion.div variants={itemVariants}>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    7. Inspected Quantity
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
                label="8. Defect Quantity"
                type="number"
                value={formData.defectQuantity}
                onChange={(value) => handleChange("defectQuantity", value)}
                error={errors.defectQuantity}
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
/>
</div>
          </div>
        </form>
      </motion.div>
    );
    
    
};

export default FCAForm