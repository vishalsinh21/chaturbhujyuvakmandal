import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

// Skeleton component
const ReviewSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="max-w-lg w-full bg-white shadow-2xl rounded-3xl p-8 animate-pulse">
      <div className="h-8 bg-gray-300 rounded mb-6 w-2/3 mx-auto"></div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-300 rounded"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
        <div className="h-32 bg-gray-300 rounded"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    review: "",
    rating: 0
  });

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // 1.2 sec skeleton
    return () => clearTimeout(timer);
  }, []);

  const sendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }
    setOtpSending(true);
    try {
      await axiosInstance.post("/send-otp", { email: formData.email });
      toast.success("OTP sent to your email");
      setIsOtpSent(true);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setOtpVerifying(true);
    try {
      const res = await axiosInstance.post("/verify-otp", {
        email: formData.email,
        otp: otp
      });
      if (res.data.message === "OTP verified successfully") {
        setIsVerified(true);
        toast.success("Email verified");
      }
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error("Please verify your email first");
      return;
    }
    if (formData.rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      await axiosInstance.post("/submit-review", formData);
      toast.success("Review submitted successfully");
      setFormData({ name: "", email: "", review: "", rating: 0 });
      setOtp("");
      setIsOtpSent(false);
      setIsVerified(false);
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  if (loading) {
    return <ReviewSkeleton />;
  }

  return (
    <div id="review" className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Submit Your Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            value={formData.name}
            placeholder="Your Name"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <div className="relative">
            <input
              type="email"
              value={formData.email}
              placeholder="Your Email"
              required
              disabled={isOtpSent || isVerified}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl disabled:bg-gray-100"
            />
            {!isVerified && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={otpSending}
                className="absolute right-2 top-2 bg-black text-white px-4 py-2 rounded-xl text-sm"
              >
                {otpSending ? "Sending..." : isOtpSent ? "Resend OTP" : "Send OTP"}
              </button>
            )}
          </div>

          {isOtpSent && !isVerified && (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 px-4 py-3 border rounded-xl"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="bg-black text-white px-4 py-3 rounded-xl"
                disabled={otpVerifying}
              >
                {otpVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          )}

          <div className="flex justify-center items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <FaStar
                key={value}
                size={30}
                className={`cursor-pointer transition ${
                  value <= formData.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleRating(value)}
              />
            ))}
          </div>

          <div>
            <textarea
              value={formData.review}
              placeholder="Your Review (max 100 characters)"
              required
              rows={4}
              maxLength={100}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-xl"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.review.length}/100
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-black text-white font-semibold py-3 rounded-xl transition-all ${
              submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"
            }`}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
