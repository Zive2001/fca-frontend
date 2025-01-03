import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ConfirmSubmissionDialog = ({ onConfirm, validateForm }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleOpenDialog = () => {
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      // Show all validation errors
      Object.values(formErrors).forEach((error) => {
        toast.error(error);
      });
      return;
    }
    
    setIsOpen(true);
  };

  return (
    <>
      {/* Submit Button */}
      <button
        onClick={handleOpenDialog}
        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Submit
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity" 
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="mt-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Submission
                </h3>
                <p className="mt-2 text-gray-600">
                  Are you sure you want to submit this FCA form? Please verify all the information before proceeding.
                </p>
              </div>

              {/* Actions */}
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
    </>
  );
};

export default ConfirmSubmissionDialog;