export const calculateDefectRate = (defectQuantity, inspectedQuantity) => {
    if (inspectedQuantity === 0) return 0;
    return (defectQuantity / inspectedQuantity) * 100;
};

export const determineStatus = (defectRate) => {
    const AQL = 1.5; // Based on AQL standards, adjust if necessary
    return defectRate <= AQL ? "Pass" : "Fail";
};
