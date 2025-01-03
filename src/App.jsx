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
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      
        {/* ToastContainer for notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* FloatingMenu Component */}
        <FloatingMenu />

       
        <Routes>
          
          <Route path="/" element={<LandingPage />} />

         
          <Route path="/fca-inline" element={<FCAForm />} />

          <Route path="/fca-endline" element={<FCAEndline />} />

          
          <Route path="/view-audits" element={<Admin />} />

          <Route path="/add-Data" element={<AddData />} />

          <Route path="/home" element={<Home />} />

         
        </Routes>
      
    </Router>
  );
};

export default App;
