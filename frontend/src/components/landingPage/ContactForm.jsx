import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        otp: otp,
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
    setSubmitting(true);
    try {
      await axiosInstance.post("/submit-contact", formData);
      toast.success("Message submitted successfully");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setOtp("");
      setIsOtpSent(false);
      setIsVerified(false);
    } catch {
      toast.error("Failed to submit message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="contact"
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-[#FEE2F8] via-[#E0F2FE] to-[#E0E7FF]"
    >
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-3xl p-8 border-2 border-indigo-100">
        <h2 className="text-4xl font-extrabold text-center text-black mb-8">
          Contact Us
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            value={formData.name}
            placeholder="Your Name"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 bg-white rounded-xl transition-all"
          />

          <div className="relative">
            <input
              type="email"
              value={formData.email}
              placeholder="Your Email"
              required
              disabled={isOtpSent || isVerified}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border-2 bg-white rounded-xl disabled:bg-gray-100"
            />
            {!isVerified && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={otpSending}
                className="absolute right-2 top-2 bg-black hover:bg-black text-white px-4 py-2 rounded-xl text-sm"
              >
                {otpSending
                  ? "Sending..."
                  : isOtpSent
                  ? "Resend OTP"
                  : "Send OTP"}
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
                className="flex-1 px-4 py-3 border-2  rounded-xl"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="bg-black hover:bg-black text-white px-4 py-3 rounded-xl"
                disabled={otpVerifying}
              >
                {otpVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          )}

          <input
            type="text"
            value={formData.phone}
            placeholder="Your Phone"
            required
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 border-2 rounded-xl"
          />

          <div>
            <textarea
              value={formData.message}
              placeholder="Your Message (max 100 characters)"
              required
              rows={4}
              maxLength={100}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 border-2  rounded-xl"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.message.length}/100
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-black text-white font-semibold py-3 rounded-xl transition-all ${
              submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-black"
            }`}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
