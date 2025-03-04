// Calculate defect rate
export const calculateDefectRate = (defectQuantity, inspectedQuantity) => {
    if (!inspectedQuantity) return 0;
    const rate = (defectQuantity / inspectedQuantity) * 100;
    return parseFloat(rate.toFixed(1));
};

// Determine status based on inspected quantity and defect quantity
export const determineStatus = (defectRate, inspectedQuantity) => {
    if (inspectedQuantity === 20) {
        // For 20-piece inspection, 0 defects is pass, 1 or more is fail
        return defectRate === 0 ? "Pass" : "Fail";
    } else if (inspectedQuantity === 32) {
        // For 32-piece inspection, 0-1 defects is pass, 2 or more is fail
        return defectRate < 2 ? "Pass" : "Fail";
    }
    return "Invalid Quantity"; // Optional fallback for unsupported quantities
};

// Validate defect quantity against inspected quantity
export const validateDefectQuantity = (defectQuantity, inspectedQuantity) => {
    // Basic validation
    if (defectQuantity > inspectedQuantity) {
        throw new Error("Defect quantity cannot exceed inspected quantity.");
    }
    if (defectQuantity < 0) {
        throw new Error("Defect quantity cannot be negative.");
    }
    
    // Validate inspected quantity is either 20 or 32
    if (inspectedQuantity !== 20 && inspectedQuantity !== 32) {
        throw new Error("Inspected quantity must be either 20 or 32 pieces.");
    }

    return true;
};

// Helper function to validate the entire form data
export const validateFormData = (formData) => {
    const errors = {};
    
    // Required field validation
    if (!formData.plant) errors.plant = "Plant is required.";
    if (!formData.po) errors.po = "PO is required.";
    if (!formData.size) errors.size = "Size is required.";
    if (!formData.inspectedQuantity) errors.inspectedQuantity = "Inspected Quantity is required.";
    if (formData.defectQuantity === "") errors.defectQuantity = "Defect Quantity is required.";

    // Quantity validation
    const inspectedQuantity = Number(formData.inspectedQuantity);
    const defectQuantity = Number(formData.defectQuantity);

    try {
        validateDefectQuantity(defectQuantity, inspectedQuantity);
    } catch (error) {
        errors.defectQuantity = error.message;
    }

    // Validate defect entries if defect quantity is greater than 0
    if (defectQuantity > 0 && (!formData.defectEntries || formData.defectEntries.length === 0)) {
        errors.defectEntries = "At least one defect entry is required when defect quantity is greater than 0.";
    }

    return errors;
};