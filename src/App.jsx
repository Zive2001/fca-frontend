import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FCAForm from "./pages/FCAForm";
import LandingPage from "./pages/LandingPage";
import './index.css'; // Assuming Tailwind CSS is already included here

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing page route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Route for FCAForm */}
        <Route path="/fca-inline" element={<FCAForm />} />
      </Routes>
    </Router>
  );
};

export default App;
