import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FCAForm from "./pages/FCAForm";
import LandingPage from "./pages/LandingPage";
import FCAEndline from "./pages/Endline";
import Admin from "./pages/Admin";
import FloatingMenu from "./components/FloatingMenu"; // Import FloatingMenu
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"; // Global CSS
import AddData from "./pages/AddData";

const App = () => {
  return (
    <Router>
      
        {/* ToastContainer for notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* FloatingMenu Component */}
        <FloatingMenu />

        {/* Application Routes */}
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />

          {/* Inline FCA Form */}
          <Route path="/fca-inline" element={<FCAForm />} />

          {/* Endline FCA Form */}
          <Route path="/fca-endline" element={<FCAEndline />} />

          {/* Admin Panel for viewing and managing audits */}
          <Route path="/view-audits" element={<Admin />} />

          <Route path="/add-Data" element={<AddData />} />

          {/* Additional routes can be added here */}
        </Routes>
      
    </Router>
  );
};

export default App;
