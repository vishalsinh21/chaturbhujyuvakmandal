import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import SkeletonCard from "./SkeletonCard";

const PaymentQREditor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [qrs, setQrs] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchQR = async () => {
    try {
      const res = await axiosInstance.get("/paymentQR");
      setQrs(res.data);
    } catch (err) {
      toast.error("Error fetching QR",err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchQR();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("paymentQR", selectedFile);
    setUploading(true);
    try {
      await axiosInstance.post("/paymentQR", formData);
      toast.success("QR Uploaded");
      setSelectedFile(null);
      fetchQR();
    } catch (err) {
      toast.error("Error uploading QR",err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/paymentQR/${id}`);
      toast.success("QR Deleted");
      fetchQR();
    } catch (err) {
      toast.error("Error deleting QR",err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment QR Editor</h1>

        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="w-full sm:w-auto"
          />
          <button 
            type="submit" 
            disabled={uploading}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-black"}`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {initialLoading ? (
          <SkeletonCard lines={3} />
        ) : qrs.length === 0 ? (
          <p className="text-center text-gray-500">No QR uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {qrs.map((qr) => (
              <div key={qr._id} className="relative border rounded-lg overflow-hidden shadow">
                <img src={qr.image} alt="QR Code" className="w-full h-auto" />
                <button
                  onClick={() => handleDelete(qr._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow hover:bg-red-600 transition"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentQREditor;
