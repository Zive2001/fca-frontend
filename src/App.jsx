import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './contexts/AuthContext';
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

// Component imports
import ModernHeader from "./components/ModernHeader";

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: "your-client-id",
    authority: "https://login.microsoftonline.com/your-tenant-id",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

// Optional - Check for cached accounts
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <Router>
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
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
      </AuthProvider>
    </MsalProvider>
  );
};

export default App;