import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FCAForm from "./pages/FCAForm";
import LandingPage from "./pages/LandingPage";
import FCAEndline from "./pages/Endline";
import Admin from "./pages/Admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"; // Global CSS

const App = () => {
  return (
    <Router>
   
        {/* ToastContainer for notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

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
        </Routes>
  
    </Router>
  );
};

export default App;
