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
import Analytics from "./pages/Analytics";

// Component imports
import ModernHeader from "./components/ModernHeader";

const msalConfig = {
  auth: {
    clientId: "7569e108-ac80-4fde-b698-968962b13303",
    authority: "https://login.microsoftonline.com/519f28ec-a14a-45a5-8697-409b75aeadca",
    redirectUri: "https://sg-prod-bdyapp-fcafront.azurewebsites.net"
  },
  cache: {
    cacheLocation: "localStorage"
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

// Simple initialization
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <Router>
          <ToastContainer />
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
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MsalProvider>
  );
};

export default App;