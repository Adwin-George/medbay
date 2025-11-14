import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Doctors from "./pages/Doctors.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import "./index.css";
import { DataProvider } from "./context/DataContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DataProvider>
      <BrowserRouter>
        <Routes>

          {/* 🏠 Home Page (Now MedBay brand in App.jsx) */}
          <Route path="/" element={<App />} />

          {/* 👨‍⚕️ All Doctors Page */}
          <Route path="/doctors" element={<Doctors />} />

          {/* 🔍 Single Doctor Profile */}
          <Route path="/doctor/:id" element={<DoctorProfile />} />

          {/* 🔐 Admin Login */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* 📊 Admin Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ❌ 404 Page */}
          <Route
            path="*"
            element={
              <div className="flex flex-col justify-center items-center min-h-screen text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                  404 - Page Not Found
                </h1>
                <p className="text-gray-600 mb-4">
                  Oops! The page you're looking for doesn't exist.
                </p>
                <a
                  href="/"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Go Home
                </a>
              </div>
            }
          />

        </Routes>
      </BrowserRouter>
    </DataProvider>
  </React.StrictMode>
);
