// First, update the handleChange function to include email notification
const handleChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };
  
      if (field === "defectQuantity" || field === "inspectedQuantity") {
        const defectRate = calculateDefectRate(
          updatedData.defectQuantity,
          updatedData.inspectedQuantity
        );
        updatedData.defectRate = defectRate;
        const newStatus = determineStatus(defectRate);
        
        // Check if status is changing to "Fail"
        if (newStatus === "Fail" && updatedData.status !== "Fail") {
          // Send email notification
          const emailData = {
            subject: `FCA Alert: Failed Inspection for PO ${updatedData.po}`,
            body: generateEmailBody(updatedData),
            attachments: Object.values(defectPhotos).flat(),
            recipients: ['quality.manager@example.com', 'production.supervisor@example.com']
          };
  
          EmailNotificationHandler.sendNotification(emailData)
            .then(() => {
              toast.success('Quality alert notification sent successfully');
            })
            .catch((error) => {
              console.error('Failed to send email notification:', error);
              toast.error('Failed to send quality alert notification');
            });
        }
        
        updatedData.status = newStatus;
      }
  
      return updatedData;
    });
  };
  
  // Update handleConfirmedSubmit to include email notification
  const handleConfirmedSubmit = async () => {
    try {
      // ... existing submission code ...
  
      // After successful submission, check if status is "Fail"
      if (formData.status === "Fail") {
        const emailData = {
          subject: `FCA Submission Alert: Failed Inspection for PO ${formData.po}`,
          body: generateEmailBody({
            ...formData,
            auditId: response.auditId // Include the audit ID in the email
          }),
          attachments: Object.values(defectPhotos).flat(),
          recipients: ['quality.manager@example.com', 'production.supervisor@example.com']
        };
  
        await EmailNotificationHandler.sendNotification(emailData);
        toast.success('Quality alert notification sent successfully');
      }
  
      // ... rest of the existing submission code ...
  
    } catch (error) {
      console.error("Error in form submission or notification:", error);
      toast.error(error.message || "There was an error processing your submission.");
    }
  };
  
  // Helper function to generate formatted email body
  const generateEmailBody = (data) => {
    const defectEntries = data.defectEntries.map((entry, index) => `
      Defect ${index + 1}:
      - Category: ${entry.defectCategory}
      - Code: ${entry.defectCode}
      - Location: ${entry.defectLocation}
      - Quantity: ${entry.quantity}
    `).join('\n');
  
    return `
  FCA Inspection Alert - Failed Status
  
  PO Details:
  -----------
  Plant: ${data.plant}
  Module: ${data.module}
  PO Number: ${data.po}
  Style: ${data.style}
  Customer: ${data.customer}
  Size: ${data.size}
  
  Inspection Results:
  ------------------
  Inspected Quantity: ${data.inspectedQuantity}
  Defect Quantity: ${data.defectQuantity}
  Defect Rate: ${data.defectRate}%
  Status: FAIL
  
  Defect Details:
  --------------
  ${defectEntries}
  
  Additional Information:
  ---------------------
  Remarks: ${data.remarks || 'None'}
  ${data.auditId ? `Audit ID: ${data.auditId}` : ''}
  Date: ${new Date().toLocaleString()}
  
  This is an automated notification. Please take necessary action.
  `;
  };