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
    clientId: "7569e108-ac80-4fde-b698-968962b13303",
    authority: "https://login.microsoftonline.com/519f28ec-a14a-45a5-8697-409b75aeadca",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
    secureCookies: false // Set to true only in production
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: "Info"
    }
  }
};

const msalInstance = new PublicClientApplication(msalConfig);
window.msalInstance = msalInstance;

// Optional - Check for cached accounts
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}
// Add this right after creating msalInstance
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
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