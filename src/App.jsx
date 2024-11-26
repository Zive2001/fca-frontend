import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FCAForm from "./pages/FCAForm";
import LandingPage from "./pages/LandingPage";
import './index.css'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <div>
        {/* ToastContainer should be included once, outside Routes */}
        <ToastContainer />

        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Route for FCAForm */}
          <Route path="/fca-inline" element={<FCAForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
