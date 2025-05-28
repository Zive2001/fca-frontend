import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Page imports
import FCAForm from "./pages/FCAForm";
import LandingPage from "./pages/LandingPage";
import FCAEndline from "./pages/Endline";
import Admin from "./pages/Admin";
import UserView from "./pages/userView";
import AdminLanding from "./pages/AdminLanding";
import AddData from "./pages/AddData";
import Home from "./pages/Home";
import GetStartedGuide from "./pages/GetStartedGuide";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminEmailManagement from "./pages/AdminEmailManagement";

// Component imports
import ModernHeader from "./components/ModernHeader";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <ModernHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fca-inline" element={<FCAForm />} />
        <Route path="/fca-endline" element={<FCAEndline />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLanding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/email-management" 
          element={
            <ProtectedRoute>
              <AdminEmailManagement />
           </ProtectedRoute>
          } 
        />
        <Route path="/view-data" element={<UserView />} />
        <Route 
          path="/view-audits" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-master-data" 
          element={
            <ProtectedRoute>
              <AddData />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-other-data" 
          element={
            <ProtectedRoute>
              {/* TODO: Create AddOtherData component */}
              <div className="min-h-screen bg-gray-900 text-white p-8">
                <h1 className="text-3xl font-bold">Add Other Data</h1>
                <p className="mt-4">This page is under construction.</p>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route path="/home" element={<Home />} />
        <Route path="/get-started" element={<GetStartedGuide />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
};

export default App;