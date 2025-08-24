import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SkeletonCard from "./SkeletonCard";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.put('/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success(res.data.message);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>

        {loading ? (
          <SkeletonCard lines={6} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block font-semibold mb-1">Current Password</label>
              <input
                type={showCurrent ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring focus:ring-gray-300"
              />
              <div className="absolute top-9 right-3 cursor-pointer text-gray-600" onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="relative">
              <label className="block font-semibold mb-1">New Password</label>
              <input
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring focus:ring-gray-300"
              />
              <div className="absolute top-9 right-3 cursor-pointer text-gray-600" onClick={() => setShowNew(!showNew)}>
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="relative">
              <label className="block font-semibold mb-1">Confirm New Password</label>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring focus:ring-gray-300"
              />
              <div className="absolute top-9 right-3 cursor-pointer text-gray-600" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <button type="submit" className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-black">
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;