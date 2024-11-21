export const calculateDefectRate = (defectQuantity, inspectedQuantity) => {
    if (inspectedQuantity === 0) return 0;
    const rate = (defectQuantity / inspectedQuantity) * 100;
    return parseFloat(rate.toFixed(2)); // Ensures it returns a number with two decimal points
};

export const determineStatus = (defectRate) => {
    const AQL = 1.5; // Based on AQL standards, adjust if necessary
    return defectRate <= AQL ? "Pass" : "Fail";
};

// New validation function
export const validateDefectQuantity = (defectQuantity, inspectedQuantity) => {
    if (defectQuantity > inspectedQuantity) {
        throw new Error("Defect quantity cannot exceed inspected quantity.");
    }
    if (defectQuantity < 0) {
        throw new Error("Defect quantity cannot be negative.");
    }
    if (inspectedQuantity < 0) {
        throw new Error("Inspected quantity cannot be negative.");
    }
    return true;
};
