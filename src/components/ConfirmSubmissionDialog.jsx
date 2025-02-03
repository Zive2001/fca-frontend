import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon } from "@heroicons/react/24/outline";
import FailureReport from './FailureReport';
import { getFailureReport } from '../services/api';

const ConfirmSubmissionDialog = ({ onConfirm, validateForm, formData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFailureReport, setShowFailureReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDialog = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      Object.values(formErrors).forEach((error) => toast.error(error));
      return;
    }
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      const response = await onConfirm();
      setIsOpen(false);

      // Check if it's a failure case (defect rate > 5%) and we have an auditId
      if (formData.defectRate > 5 && response?.auditId) {
        try {
          const failureReportData = await getFailureReport(response.auditId);
          setReportData(failureReportData);
          setShowFailureReport(true);
        } catch (reportError) {
          console.error('Error generating failure report:', reportError);
          toast.error('Failed to generate failure report');
        }
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity" 
              onClick={handleClose}
            />

            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
              <div className="mt-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Submission
                </h3>
                <p className="mt-2 text-gray-600">
                  Are you sure you want to submit this FCA form? Please verify all the information before proceeding.
                </p>
                {formData.defectRate > 5 && (
                  <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="text-sm">
                      This submission has been marked as a failure.
                      A failure report will be generated automatically.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportData && (
        <FailureReport
          data={reportData}
          isOpen={showFailureReport}
          onClose={() => setShowFailureReport(false)}
        />
      )}
    </>
  );
};

export default ConfirmSubmissionDialog;