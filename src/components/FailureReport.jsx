import React, { useRef } from 'react';
import { XMarkIcon, ClipboardIcon, ArrowDownTrayIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';

const FailureReport = ({ data, isOpen, onClose }) => {
  const reportContentRef = useRef(null);
  const containerRef = useRef(null);

  if (!isOpen || !data) return null;

  const captureReport = async () => {
    if (!reportContentRef.current) return null;
    
    try {
      // Save current scroll position and styles
      const scrollPosition = [window.pageXOffset, window.pageYOffset];
      const originalStyles = {
        overflow: document.body.style.overflow,
        height: reportContentRef.current.style.height,
        maxHeight: reportContentRef.current.style.maxHeight,
        overflow: reportContentRef.current.style.overflow,
        overflowY: reportContentRef.current.style.overflowY,
        position: reportContentRef.current.style.position
      };

      // Modify styles for full capture
      document.body.style.overflow = 'hidden';
      reportContentRef.current.style.height = 'auto';
      reportContentRef.current.style.maxHeight = 'none';
      reportContentRef.current.style.overflow = 'visible';
      reportContentRef.current.style.overflowY = 'visible';
      reportContentRef.current.style.position = 'relative';

      // Wait for all images
      const images = reportContentRef.current.getElementsByTagName('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // Calculate full dimensions
      const contentWidth = reportContentRef.current.scrollWidth;
      const contentHeight = reportContentRef.current.scrollHeight;

      // Create canvas with full dimensions
      const canvas = await html2canvas(reportContentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: contentWidth,
        height: contentHeight,
        windowWidth: contentWidth,
        windowHeight: contentHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        allowTaint: true,
        onclone: function(clonedDoc) {
          const clonedElement = clonedDoc.getElementById(reportContentRef.current.id);
          if (clonedElement) {
            clonedElement.style.height = 'auto';
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.transform = 'none';
            clonedElement.style.position = 'relative';
          }
        }
      });

      // Restore original styles and scroll position
      Object.entries(originalStyles).forEach(([key, value]) => {
        if (key === 'overflow') {
          document.body.style[key] = value;
        } else {
          reportContentRef.current.style[key] = value;
        }
      });
      window.scrollTo(...scrollPosition);

      return canvas;
    } catch (error) {
      console.error('Error capturing report:', error);
      toast.error('Failed to capture report');
      return null;
    }
  };

  const handleDownload = async () => {
    toast.info('Generating image...');
    const canvas = await captureReport();
    if (!canvas) return;

    try {
      const link = document.createElement('a');
      link.download = `failure-report-${data.Id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const handleCopy = async () => {
    toast.info('Copying to clipboard...');
    const canvas = await captureReport();
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        toast.success('Report copied to clipboard');
      });
    } catch (error) {
      console.error('Error copying report:', error);
      toast.error('Failed to copy report');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm" ref={containerRef}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-gray-50 w-full max-w-4xl rounded-xl shadow-2xl">
          <div ref={reportContentRef} id="report-content" className="bg-white rounded-xl">
            <div className="p-8">
              {/* Alert Banner */}
              <div className="bg-red-50 rounded-xl shadow-sm mb-8">
                <div className="p-6 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-red-700">
                          FCA {data.Type} Quality Control Failure
                        </h2>
                        <div className="mt-2 flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center text-red-700">
                            <span className="font-medium">Defect Rate:</span>
                            <span className="ml-2 font-bold">{data.DefectRate}%</span>
                          </div>
                          <div className="flex items-center text-red-700">
                            <span className="font-medium">Failed Items:</span>
                            <span className="ml-2 font-bold">{data.DefectQuantity}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="font-medium">Total Inspected:</span>
                            <span className="ml-2 font-bold">{data.InspectedQuantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-700">
                          Audit #{data.Id}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Info Cards Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Audit Details</h4>
                  <dl className="grid grid-cols-2 gap-y-3">
                    <dt className="text-sm text-gray-600">Plant</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{data.Plant}</dd>
                    <dt className="text-sm text-gray-600">Module</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{data.Module}</dd>
                    <dt className="text-sm text-gray-600">PO</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{data.PO}</dd>
                    <dt className="text-sm text-gray-600">VPO</dt>
                    <dd className="text-sm font-medium text-red-900 text-right">{data.CPO_Number}</dd>
                    <dt className="text-sm text-gray-600">Size</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{data.Size}</dd>
                    <dt className="text-sm text-gray-600">Style</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{data.Style}</dd>
                    <dt className="text-sm text-gray-600">Color</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{data.Customer_Color}</dd>
                    
                  </dl>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Inspection Summary</h4>
                  <dl className="grid grid-cols-2 gap-y-3">
                    <dt className="text-sm text-gray-600">Date</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{data.FormattedSubmissionDate}</dd>
                    <dt className="text-sm text-gray-600">Defect Rate</dt>
                    <dd className="text-sm font-medium text-red-600 text-right">{data.DefectRate}%</dd>
                    <dt className="text-sm text-gray-600">Inspected</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{data.InspectedQuantity} pcs</dd>
                    <dt className="text-sm text-gray-600">Defects</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{data.DefectQuantity} pcs</dd>
                  </dl>
                </div>
              </div>

              {/* Defect Details */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Defect Details</h4>
                <div className="space-y-4">
                  {data.defectEntries.map((entry, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 transition-all hover:shadow-md">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900">
                            {entry.defectCategory} - {entry.defectCode}
                          </h5>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              Location: {entry.locationCategory} - {entry.defectLocation}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {entry.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {entry.photos && entry.photos.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mt-4">
                          {entry.photos.map((photo, photoIndex) => (
                            <div key={photoIndex} className="relative group">
                              <img
                                src={photo.dataUrl}
                                alt={`Defect ${index + 1} Photo ${photoIndex + 1}`}
                                className="h-24 w-full object-cover rounded-lg border-2 border-transparent 
                                         group-hover:border-red-400 transition-all duration-200"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          
       {/* Footer */}
       <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-xl border-t border-gray-100">
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 
                       bg-white rounded-lg border border-gray-200 hover:bg-gray-50 
                       shadow-sm transition-all duration-200"
            >
              <ClipboardIcon className="h-5 w-5 mr-2" />
              Copy as Image
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-red-600 rounded-lg hover:bg-red-700 shadow-sm 
                       transition-all duration-200"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download as PNG
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 text-sm font-medium 
                       text-gray-700 bg-white rounded-lg border border-gray-200 
                       hover:bg-gray-50 shadow-sm transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailureReport;