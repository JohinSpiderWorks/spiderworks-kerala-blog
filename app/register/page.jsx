'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  User, Mail, Lock, Phone, FileText, UserPlus, Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import { BASE_URL } from "@/baseUrl/baseUrl";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
    phone: "",
    bio: "",
    general: ""
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ email: "", password: "", phone: "", bio: "", general: "" });

    const { name, email, password, phone, bio } = formData;

    // Basic frontend validation
    if (email.length < 12) {
      setError((prev) => ({ ...prev, email: "* Email must be at least 12 characters" }));
      setLoading(false);
      return;
    }

    if (password.length < 6 || password.length > 20) {
      setError((prev) => ({ ...prev, password: "* Password must be 6–20 characters" }));
      setLoading(false);
      return;
    }

    if (bio.length > 70) {
      setError((prev) => ({ ...prev, bio: "* Bio must be under 70 characters" }));
      setLoading(false);
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (phone && !phonePattern.test(phone)) {
      setError((prev) => ({ ...prev, phone: "* Enter a valid 10-digit phone number" }));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/blogs/register`, {
        ...formData,
        role: "user", // Force role as user
      });

      toast.success("Registration successful!");
      router.push("/login");
    } catch (err) {
      if (err.response?.data?.err) {
        const type = err.response.data.type || "general";
        setError((prev) => ({ ...prev, [type]: err.response.data.err }));
        toast.error(err.response.data.err);
      } else {
        setError((prev) => ({ ...prev, general: "Registration failed. Try again." }));
        toast.error("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

        {error.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700 mb-4">
            {error.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleInputChange}
            />
            {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleInputChange}
            />
            {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              id="phone"
              placeholder="Phone (Optional)"
              pattern="[0-9]{10}"
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {error.phone && <p className="text-red-500 text-xs mt-1">{error.phone}</p>}
          </div>

          {/* Bio */}
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              id="bio"
              placeholder="Short Bio (Optional)"
              maxLength={70}
              rows={3}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              value={formData.bio}
              onChange={handleInputChange}
            />
            {error.bio && <p className="text-red-500 text-xs mt-1">{error.bio}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-pink-500 text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Register
              </>
            )}
          </button>

          <div className="text-center mt-4">
  <p className="text-sm text-gray-600">
    Don&apos;t have an account?{" "}
    <button
      type="button"
      onClick={() => router.push("/login")}
      className="text-blue-600 font-medium hover:underline"
    >
     Login
    </button>
  </p>
</div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;