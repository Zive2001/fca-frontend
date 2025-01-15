import React from 'react';
import { XMarkIcon, DocumentDuplicateIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';

const FailureReport = ({ data, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = async () => {
    const element = document.getElementById('failure-report');
    try {
      const canvas = await html2canvas(element);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `FCA_Failure_Report_${data.po}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to download report');
    }
  };

  const handleCopy = () => {
    const content = document.getElementById('failure-report-content').innerText;
    navigator.clipboard.writeText(content)
      .then(() => toast.success('Report copied to clipboard'))
      .catch(() => toast.error('Failed to copy report'));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl mx-4 my-6 rounded-xl shadow-2xl">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 rounded-t-xl flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              Quality Control Report
            </h1>
            <p className="text-sm text-gray-500">Generated {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-3 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              Save
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4" id="failure-report">
          {/* Alert Banner */}
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-4 rounded">
            <div className="flex">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-red-600">
                  FCA {data.type} Inspection Failure
                </h2>
                <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <div className="text-red-600">
                    <span className="font-medium">Defect Rate:</span> {data.defectRate}%
                  </div>
                  <div className="text-red-600">
                    <span className="font-medium">Defect Qty:</span> {data.defectQuantity}
                  </div>
                  <div>
                    <span className="font-medium">Total Inspected:</span> {data.inspectedQuantity}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div id="failure-report-content" className="space-y-4">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <InfoGroup>
                <InfoItem label="PO Number" value={data.po} />
                <InfoItem label="Style" value={data.style} />
                <InfoItem label="Size" value={data.size} />
              </InfoGroup>
              <InfoGroup>
                <InfoItem label="Plant" value={data.plant} />
                <InfoItem label="Module" value={data.module} />
                <InfoItem label="Shift" value={data.shift} />
              </InfoGroup>
              <InfoGroup>
                <InfoItem label="Customer" value={data.customer} />
                <InfoItem label="Color" value={data.color} />
              </InfoGroup>
            </div>

            {/* Defects Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Detected Defects</h3>
              <div className="grid gap-3">
                {data.defectEntries.map((entry, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                      <InfoItem label="Category" value={entry.defectCategory} />
                      <InfoItem label="Code" value={entry.defectCode} />
                      <InfoItem label="Location" value={`${entry.locationCategory} - ${entry.defectLocation}`} />
                      <InfoItem label="Quantity" value={entry.quantity} />
                    </div>
                    {entry.photos && entry.photos.length > 0 && (
                      <div className="mt-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {entry.photos.map((photo, photoIndex) => (
                            <img
                              key={photoIndex}
                              src={URL.createObjectURL(photo)}
                              alt={`Defect ${index + 1} Photo ${photoIndex + 1}`}
                              className="w-full h-20 object-cover rounded border hover:border-red-500 cursor-pointer transition-colors"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoGroup = ({ children }) => (
  <div className="space-y-2">
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default FailureReport;