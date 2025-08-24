import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router";
import { FiEye } from "react-icons/fi";
import toast from "react-hot-toast";

const LoginPage = () => {
  // Load rememberMe and identifier from localStorage if available
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });
  const [identifier, setIdentifier] = useState(() => {
    return localStorage.getItem("rememberMe") === "true"
      ? localStorage.getItem("identifier") || ""
      : "";
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Save rememberMe flag whenever it changes
  useEffect(() => {
    localStorage.setItem("rememberMe", rememberMe);
    if (!rememberMe) {
      // Remove identifier if not remembering
      localStorage.removeItem("identifier");
    }
  }, [rememberMe]);

  // Save identifier when it changes, but only if rememberMe is true
  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("identifier", identifier);
    }
  }, [identifier, rememberMe]);

  const handleLogin = async (e) => {
    toast.dismiss();
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/login", {
        identifier,
        password,
      });

      const { token } = response.data;

      if (token) {
        if (rememberMe) {
          localStorage.setItem("token", token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", token);
          localStorage.removeItem("token");
        }
        toast.success("Welcome Admin!");
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back :)
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email or Username
            </label>
            <input
              autoFocus="true"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-305"
              placeholder="your@domain.com or username"
              title="Email or Username"
              autoComplete="username"
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-305 pr-10 "
              placeholder="Enter your password" 
              title="Password"
              autoComplete="current-password"
            />
            <div
              className="absolute top-11 right-3 cursor-pointer text-gray-500 select-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FiEye />
            </div>
          </div>

          <div className="mb-6 flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 cursor-pointer accent-black"
            />
            <label htmlFor="rememberMe" className="text-gray-700 text-sm hover:cursor-pointer select-none">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 rounded-lg transition duration-300 cursor-pointer"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;