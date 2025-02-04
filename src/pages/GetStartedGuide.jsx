import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Guide content remains the same
const guideContent = {
  user: {
    title: "User Guide",
    steps: [
      {
        title: "Welcome to FCA App",
        description: "Select relevant form based on your requirement ",
        image: "/welcome_slide.svg",
      },
      {
        title: "Step 1: Fill main form data",
        description: "Click on the inline form button to navigate here. Defect quantity > 2 will trigger the failure status.",
        image: "/form_data.svg",
      },
      {
        title: "Step 2: Find Po Details",
        description: "Check whether the added details are valid for the selected PO before continuing.",
        image: "/3.svg",
      },
      {
        title: "Step 3: Add Defect Entries",
        description: "Remember to add at least one defect entry when defect quantity is greater than 0. And quantity should not exceed the defect quantity added firsthand.",
        image: "/4.svg",
      },
      {
        title: "Step 4: Add Defect Entries Contd.",
        description: "Once a defect entry is added, you cannot change the main form data",
        image: "/5.svg",
      },
      {
        title: "Step 5: Report Generation",
        description: "Generate a report based on the data entered. The report will be available for download in view page as well.",
        image: "/6.svg",
      },
      {
        title: "Step 6: View Data",
        description: "Your added data will be available for viewing in the view page. You can also download the report from here.",
        image: "/7.svg",
      },
    ]
  },
  admin: {
    title: "Admin Guide",
    steps: [
      {
        title: "Welcome to FCA App ",
        description: "This guide will help you understand the administrative features and responsibilities.",
        image: "/api/placeholder/1200/800",
      },
      {
        title: "Step 1: Admin Dashboard Overview",
        description: "The admin dashboard provides system-wide analytics, user management tools, and configuration settings. Monitor key metrics and manage system health.",
        image: "/api/placeholder/1200/800",
      },
      {
        title: "Step 2: Add Po Master Data",
        description: "Access the User Management panel to create, edit, or deactivate user accounts. You can also manage roles and permissions for different user groups.",
        image: "/api/placeholder/1200/800",
      },
      {
        title: "Step 3: Manage Added Data",
        description: "Configure system-wide settings, integrate third-party services, and manage API keys through the Configuration panel.",
        image: "/api/placeholder/1200/800",
      },
      {
        title: "Step 4: Manage Emails",
        description: "Generate detailed reports on system usage, user activity, and performance metrics. Export data in various formats for further analysis.",
        image: "/api/placeholder/1200/800",
      }
    ]
  }
};

const Guide = ({ role }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const content = guideContent[role];
  const steps = content.steps;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg h-full">
      <div className="p-4 md:p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 w-6 rounded-full cursor-pointer ${
                  index === currentStep ? 'bg-blue-900' : 'bg-gray-200'
                }`}
                whileHover={{ scale: 1.1 }}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h2>
            
            {/* Medium-sized image container */}
            <div className="relative w-full aspect-[8/5] bg-gray-100 rounded-lg overflow-hidden">
              <motion.img
                src={steps[currentStep].image}
                alt={`Step ${currentStep + 1}`}
                className="w-full h-full object-contain"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                loading="eager"
                decoding="sync"
              />
              
              {/* Image zoom on hover */}
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 transition-all duration-300 cursor-zoom-in"
                whileHover={{ scale: 1.02 }}
              />
            </div>

            <p className="text-gray-600 text-base mt-4">
              {steps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm ${
              currentStep === 0
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </button>

          <button 
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
              currentStep === steps.length - 1
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const GetStartedGuides = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started Guides</h1>
        <p className="text-gray-600">Choose the guide that matches your role to get started</p>
      </div>

      {/* Guides Container - Now stacked vertically */}
      <div className="space-y-8">
        {/* User Guide */}
        <div className="mb-8">
          <Guide role="user" />
        </div>

        {/* Admin Guide */}
        <div>
          <Guide role="admin" />
        </div>
      </div>
    </div>
  );
};

export default GetStartedGuides;