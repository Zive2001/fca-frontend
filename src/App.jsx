import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FCAForm from "./pages/FCAForm";
import LandingPage from "./pages/LandingPage";
import FCAEndline from "./pages/Endline";
import Admin from "./pages/Admin";
import UserView from "./pages/userView";
import AdminLanding from "./pages/AdminLanding"; // Add this import
import ModernHeader from "./components/ModernHeader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import AddData from "./pages/AddData";
import Home from "./pages/Home";
import GetStartedGuide from "./pages/GetStartedGuide";

const App = () => {
  return (
    <Router>
      {/* ToastContainer for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* FloatingMenu Component */}
      <ModernHeader />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fca-inline" element={<FCAForm />} />
        <Route path="/fca-endline" element={<FCAEndline />} />
        <Route path="/admin" element={<AdminLanding />} /> 
        <Route path="/view-data" element={<UserView />} /> 
        <Route path="/view-audits" element={<Admin />} />
        <Route path="/add-Data" element={<AddData />} />
        <Route path="/home" element={<Home />} />
        <Route path="/get-started" element={<GetStartedGuide />} />
      </Routes>
    </Router>
  );
};

export default App;