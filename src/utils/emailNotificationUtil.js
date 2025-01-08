// emailNotificationUtil.js
import { toast } from 'react-toastify';
import { fetchEmailRecipients } from '../services/api';

export const sendEmailNotification = async ({ 
    plant, 
    formData,
    defectPhotos,
    auditId,
    defectEntries
}) => {
    const formatEmailBody = () => {
        const defectEntriesText = defectEntries.map((entry, index) => `
            Defect ${index + 1}:
            - Category: ${entry.defectCategory}
            - Code: ${entry.defectCode}
            - Location Category: ${entry.locationCategory}
            - Defect Location: ${entry.defectLocation}
            - Quantity: ${entry.quantity}
        `).join('\n');

        return `
            Quality Alert - Failed FCA Inspection

            Audit ID: ${auditId}
            Plant: ${formData.plant}
            Module: ${formData.module}
            PO: ${formData.po}
            Size: ${formData.size}
            Style: ${formData.style}
            Color: ${formData.color}
            Color Description: ${formData.colorDesc}
            
            Inspection Details:
            - Inspected Quantity: ${formData.inspectedQuantity}
            - Defect Quantity: ${formData.defectQuantity}
            - Status: FAIL
            - Defect Rate: ${formData.defectRate}%

            Defect Details:
            ${defectEntriesText}
        `;
    };

    try {
        // Fetch recipients first
        const recipients = await fetchEmailRecipients(plant);
        if (recipients.length === 0) {
            toast.warning('No email recipients found for this plant');
            return;
        }

        const formDataToSend = new FormData();
        
        // Add photos with proper naming
        Object.entries(defectPhotos).forEach(([defectIndex, photos]) => {
            photos.forEach((photo, photoIndex) => {
                formDataToSend.append('photos', photo, 
                    `defect_${defectIndex}_photo_${photoIndex}.jpg`);
            });
        });

        // Add email data
        const emailData = {
            toList: recipients.map(r => r.EmailAddress),
            subject: `Quality Alert - Failed FCA Inspection - PO: ${formData.po}`,
            body: formatEmailBody(),
            auditId: auditId
        };

        formDataToSend.append('emailData', JSON.stringify(emailData));

        const response = await fetch('/api/email/send-notification', {
            method: 'POST',
            body: formDataToSend
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to send email: ${errorData}`);
        }

        const result = await response.json();
        toast.success('Quality alert email sent successfully');
        return result;
    } catch (error) {
        console.error('Error sending email notification:', error);
        toast.error('Failed to send quality alert email');
        throw error;
    }
};