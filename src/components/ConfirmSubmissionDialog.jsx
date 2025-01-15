import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon } from "@heroicons/react/24/outline";
import FailureReport from './FailureReport';

const ConfirmSubmissionDialog = ({ onConfirm, validateForm, formData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFailureReport, setShowFailureReport] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleOpenDialog = () => {
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      Object.values(formErrors).forEach((error) => {
        toast.error(error);
      });
      return;
    }
    
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Submit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity" 
              onClick={() => setIsOpen(false)}
            />

            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <div className="mt-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Submission
                </h3>
                <p className="mt-2 text-gray-600">
                  Are you sure you want to submit this FCA form? Please verify all the information before proceeding.
                </p>
              </div>

              {formData?.defectRate > 5 && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-red-700 text-sm">
                    This inspection has failed. Would you like to generate a failure report?
                  </p>
                  <button
                    onClick={() => setShowFailureReport(true)}
                    className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Generate Failure Report
                  </button>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FailureReport
        data={formData}
        isOpen={showFailureReport}
        onClose={() => setShowFailureReport(false)}
      />
    </>
  );
};

export default ConfirmSubmissionDialog;