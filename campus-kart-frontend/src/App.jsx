import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';

import Signup from './auth/Signup';
import Login from './auth/Login';
import ForgotPassword from './auth/ForgotPassword';
import ActivateAccount from './auth/ActivateAccount';
import UserLogin from './auth/UserLogin';
import UserSignup from './auth/UserSignup';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import TermsAndConditions from './pages/TermsAndConditions';
// import PrivacyPolicy from './pages/PrivacyPolicy';

import Dashboard from './users/dashboard/Dashboard';
import Accounts from './users/accounts/Accounts';
import Contacts from './users/contacts/Contacts';
import Integrations from './users/integrations/Integrations';
import Settings from './users/settings/Settings';
import Users from './users/settings/Users/Users';
import RolesAndPermissions from './users/settings/RolesAndPermissions/RolesAndPermissions';
import AccountInformation from './users/settings/AccountInformation/AccountInformation';
import AccountDataUpload from './users/settings/AccountDataUpload/AccountDataUpload';
import Help from './users/help/Help';

import StudentDashboard from "./students/Dashboard";
import Cart from "./students/Cart";
import Checkout from "./students/Checkout";
import Orders from "./students/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-account" element={<ActivateAccount />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/integrations"
          element={
            <ProtectedRoute>
              <Integrations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/roles"
          element={
            <ProtectedRoute>
              <RolesAndPermissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/account-information"
          element={
            <ProtectedRoute>
              <AccountInformation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/account-data-upload"
          element={
            <ProtectedRoute>
              <AccountDataUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
