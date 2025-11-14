import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Accepts either plain "admin" or email-style "admin@finddoc.com"
    const isEmail =
      (email === "admin@finddoc.com" || email === "admin" || email === "Admin");

    const isPassword = password === "finddoc123";

    if (isEmail && isPassword) {
      localStorage.setItem("isAdmin", "true");
      alert("✅ Welcome Admin!");
      navigate("/dashboard");
    } else {
      alert("❌ Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          🩺 Admin Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Admin Email or Username
            </label>
            <input
              type="text"
              placeholder="admin or admin@finddoc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-4">
          Default credentials: <br />
          <strong>admin / finddoc123</strong> or <strong>admin@finddoc.com / finddoc123</strong>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
