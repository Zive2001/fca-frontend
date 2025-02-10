const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"style={{ borderColor: "#219ebc" }}></div>
        <p className="text-gray-700 text-lg font-medium">Generating Report...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we process your request</p>
      </div>
    </div>
  );
  
  export default LoadingOverlay;