  import { useState, useEffect } from "react";
  import axiosInstance from "../utils/axiosInstance";
  import toast from "react-hot-toast";

  // Skeleton component
  const Skeleton = ({ className }) => (
    <div className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl ${className}`} />
  );

  const UserPhotoUploader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }, []);

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        const maxSizeInMB = 1;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (selectedFile.size > maxSizeInBytes) {
          toast.error(`File size exceeds ${maxSizeInMB} MB limit`);
          setFile(null);
          setPreview(null);
          e.target.value = null;
          return;
        }
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setFile(null);
        setPreview(null);
      }
    };

    const sendOtp = async () => {
      if (!formData.email) {
        toast.error("Please enter email first");
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
        if (res.data.message === 'OTP verified successfully') {
          setIsVerified(true);
          toast.success("Email verified");
        }
      } catch (err) {
        toast.error("Invalid OTP", err);
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
      if (!file) {
        toast.error("Please select a photo");
        return;
      }

      setSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      data.append("CustomPhoto", file);

      try {
        await axiosInstance.post("/upload-user-photo", data);
        toast.success("Uploaded successfully");
        setFormData({ name: "", email: "", mobile: "" });
        setFile(null);
        setPreview(null);
        setOtp("");
        setIsVerified(false);
        setIsOtpSent(false);
      } catch {
        toast.error("Failed to upload");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div id="sketch" className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
        <div className="max-w-lg w-full bg-white bg-opacity-80 backdrop-blur-md shadow-2xl rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Submit Your Photo for Sketch
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-40 w-40 mx-auto" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <input
                type="text"
                value={formData.name}
                placeholder="Your Name"
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl"
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={formData.email}
                  placeholder="Your Email"
                  required
                  disabled={isOtpSent || isVerified}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 px-4 py-3 border rounded-xl disabled:bg-gray-100"
                />
                {!isVerified && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={otpSending}
                    className="bg-black text-white px-4 py-3 rounded-xl text-sm"
                  >
                    {otpSending ? "Sending..." : isOtpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                )}
              </div>

              {isOtpSent && !isVerified && (
                <div className="flex flex-col sm:flex-row gap-2">
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

              <input
                type="text"
                value={formData.mobile}
                placeholder="Your Mobile Number"
                required
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border rounded-xl cursor-pointer"
                disabled={!isVerified}
              />

              {preview && (
                <div className="flex justify-center mb-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-40 w-40 rounded-xl object-cover border shadow-md"
                  />
                </div>
              )}

              <button
                type="submit"
                className={`w-full bg-black text-white font-semibold py-3 rounded-xl transition-all ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"}`}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Photo"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  export default UserPhotoUploader;
