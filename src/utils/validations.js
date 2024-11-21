export const calculateDefectRate = (defectQuantity, inspectedQuantity) => {
    if (inspectedQuantity === 0) return 0;
    const rate = (defectQuantity / inspectedQuantity) * 100;
    return parseFloat(rate.toFixed(2)); // Ensures it returns a number with two decimal points
};

export const determineStatus = (defectRate) => {
    const AQL = 1.5; // Based on AQL standards, adjust if necessary
    return defectRate <= AQL ? "Pass" : "Fail";
};

