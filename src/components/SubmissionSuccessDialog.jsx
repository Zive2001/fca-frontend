import React, { useState } from 'react';
import { CheckCircleIcon, XMarkIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-toastify';
import { getFailureReport } from '../services/api';
import FailureReport from './FailureReport';

const SubmissionSuccessDialog = ({ isOpen, onClose, auditId, isFailureStatus }) => {
  const [showFailureReport, setShowFailureReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!auditId) {
      toast.error('Missing audit ID. Cannot generate report.');
      return;
    }

    setIsGenerating(true);
    try {
      const data = await getFailureReport(auditId);
      setReportData(data);
      setShowFailureReport(true);
    } catch (error) {
      console.error('Error generating failure report:', error);
      toast.error('Failed to generate failure report');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/25 backdrop-blur-sm">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-md rounded-xl p-6 shadow-2xl">
            <div className="absolute right-4 top-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>

              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Submission Successful
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Your FCA form has been processed successfully.
                {auditId && (
                  <span className="block mt-1 text-xs text-gray-500">
                    Audit ID: {auditId}
                  </span>
                )}
              </p>

              {isFailureStatus && auditId && (
                <div className="mt-6 w-full">
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <DocumentTextIcon className="w-4 h-4 mr-2" />
                        Generate Failure Report
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="mt-6 w-full">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default SubmissionSuccessDialog;