import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FCAForm from "./pages/FCAForm";
import './index.css'; // Assuming Tailwind CSS is already included here

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FCAForm />} />
      </Routes>
    </Router>
  );
};

export default App;
