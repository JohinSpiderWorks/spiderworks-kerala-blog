// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { signIn, useSession } from "next-auth/react";
// import toast from "react-hot-toast";
// import { MailIcon, KeyIcon, Loader2 } from "lucide-react";
// import { BASE_URL } from "@/baseUrl/baseUrl";
// import Link from "next/link";

// const PublicLogin = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const otpInputRefs = useRef([]);
//   const [showOtpField, setShowOtpField] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (status === "authenticated") {
//       router.push("/blog");
//     }
//   }, [status, router]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${BASE_URL}/admin/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.err || "Login failed");
//         toast.error(data.err || "Login failed");
//         return;
//       }

//       setShowOtpField(true);
//       toast.success("OTP sent to your email!");
//     } catch (err) {
//       setError("Something went wrong.");
//       toast.error("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpVerification = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     const otpCode = otp.join("");

//     try {
//       const result = await signIn("credentials", {
//         email,
//         otp: otpCode,
//         redirect: false,
//       });

//       if (result?.error) {
//         setError(result.error);
//         toast.error(result.error || "OTP verification failed");
//         return;
//       }

//       toast.success("Logged in successfully!");
//       router.push("/blog");
//     } catch (err) {
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
//       <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Welcome Back
//         </h2>

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700 mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={showOtpField ? handleOtpVerification : handleLogin} className="space-y-4">
//           <div className="relative">
//             <MailIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {!showOtpField && (
//             <div className="relative">
//               <KeyIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           {showOtpField && (
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-600">Enter OTP</label>
//               <div className="flex gap-2">
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     type="text"
//                     maxLength="1"
//                     value={digit}
//                     ref={(el) => (otpInputRefs.current[index] = el)}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       const newOtp = [...otp];
                    
//                       if (value === "") {
//                         newOtp[index] = "";
//                         setOtp(newOtp);
//                         return;
//                       }
                    
//                       if (/^\d$/.test(value)) {
//                         newOtp[index] = value;
//                         setOtp(newOtp);
//                         if (index < 5) otpInputRefs.current[index + 1]?.focus();
//                       }
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Backspace" && !otp[index] && index > 0) {
//                         otpInputRefs.current[index - 1]?.focus();
//                       }
//                     }}
//                     className="w-10 h-10 text-center border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-amber-400 to-pink-500 text-white py-3 rounded-lg hover:from-pink-400 hover:to-amber-500 transition-all shadow-md"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 {showOtpField ? "Verifying..." : "Logging in..."}
//               </span>
//             ) : showOtpField ? (
//               "Verify OTP"
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <Link href="/register" className="text-blue-600 hover:underline">
//             Don't have an account? Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PublicLogin;

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('Login successful');
      router.push('/blog'); // or your user landing page
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-pink-500 text-white py-3 rounded-lg hover:from-pink-400 hover:to-amber-500 transition-all shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                Login
              </span>
            )}
          </button>
          <div className="text-center mt-4">
  <p className="text-sm text-gray-600">
    Don't have an account?{" "}
    <button
      type="button"
      onClick={() => router.push("/register")}
      className="text-blue-600 font-medium hover:underline"
    >
      Register
    </button>
  </p>
</div>
        </form>
      </div>
    </div>
  );
}
