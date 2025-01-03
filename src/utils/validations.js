


export const calculateDefectRate = (defectQuantity, inspectedQuantity) => {
    if (inspectedQuantity === 0) return 0;
    const rate = (defectQuantity / inspectedQuantity) * 100;
    return parseFloat(rate.toFixed(1)); // Ensures it returns a number with two decimal points
};

export const determineStatus = (defectQuantity, inspectedQuantity) => {
    const AQL = 1.5; // Default AQL standard
    // Special conditions for inspected quantities of 20 and 32
    if (
        (inspectedQuantity === 20 && defectQuantity >= 2) ||
        (inspectedQuantity === 32 && defectQuantity >= 2)
    ) {
        return "Fail";
    }

    // Calculate defect rate for other cases
    const defectRate = calculateDefectRate(defectQuantity, inspectedQuantity);
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
