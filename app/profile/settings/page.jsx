'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BASE_URL } from '@/baseUrl/baseUrl';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  ArrowLeft
} from 'lucide-react';

const InputField = React.memo(({ label, name, type = 'text', value, onChange, error, icon: Icon, placeholder, disabled = false, showPassword, togglePassword }) => (
  <div className="mb-6">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-amber-500" />
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword !== undefined ? (showPassword ? 'text' : 'password') : type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-4 bg-white/80 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-gray-200 hover:border-gray-300'
        } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
      />
      {togglePassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
    {error && (
      <p className="text-sm text-red-600 mt-2 flex items-center">
        <X className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
));

const TextAreaField = React.memo(({ label, name, value, onChange, error, icon: Icon, placeholder, rows = 4 }) => (
  <div className="mb-6">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-amber-500" />
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-4 bg-white/80 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 resize-y ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-gray-200 hover:border-gray-300'
      }`}
    />
    {error && (
      <p className="text-sm text-red-600 mt-2 flex items-center">
        <X className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
));

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!session?.accessToken) return;

      try {
        const res = await fetch(`${BASE_URL}/blogs/user/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.err || 'Failed to fetch user profile');

        setFormData((prev) => ({
          ...prev,
          username: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          bio: data.user.bio || '',
        }));
      } catch (error) {
        toast.error(error.message || 'Error fetching profile');
      }
    };

    fetchUserDetails();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Username is required';

    if (formData.phone && !/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Phone must be a 10-digit number';

    if (formData.newPassword && !formData.currentPassword)
      newErrors.currentPassword = 'Current password is required to change password';

    if (formData.newPassword && formData.newPassword.length < 6)
      newErrors.newPassword = 'Password must be at least 6 characters';

    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (!session?.accessToken) throw new Error('No valid session. Please login again.');

      const payload = {
        name: formData.username,
        bio: formData.bio,
        phone: formData.phone,
      };

      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const res = await fetch(`${BASE_URL}/blogs/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.type) {
          toast.error(data.err || 'Update failed');
          setErrors({ [data.type]: data.err });
        } else {
          toast.error(data.err || 'Update failed');
        }
        return;
      }

      toast.success(data?.msg || 'Profile updated successfully!');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Edit3 className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Edit Profile
              </h1>
              <p className="text-gray-600 text-lg">Update your personal information</p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-gray-50/80 backdrop-blur-lg rounded-3xl border border-gray-200/50 relative overflow-hidden">
          <div className="relative z-10 p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Profile Information Section */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      error={errors.username}
                      icon={User}
                      placeholder="Enter your username"
                    />

                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      icon={Mail}
                      placeholder="your@email.com"
                      disabled={true}
                    />

                    <InputField
                      label="Phone Number"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      icon={Phone}
                      placeholder="1234567890"
                    />

                    <div className="md:col-span-2">
                      <TextAreaField
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        error={errors.bio}
                        icon={Edit3}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>
                  </div>

                  <div className="space-y-6">
                    <InputField
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      error={errors.currentPassword}
                      icon={Lock}
                      placeholder="Enter current password"
                      showPassword={showCurrentPassword}
                      togglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                        icon={Lock}
                        placeholder="Enter new password"
                        showPassword={showNewPassword}
                        togglePassword={() => setShowNewPassword(!showNewPassword)}
                      />

                      <InputField
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        icon={Lock}
                        placeholder="Confirm new password"
                        showPassword={showConfirmPassword}
                        togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-8 py-4 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-amber-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center min-w-[160px] ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}