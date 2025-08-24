import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

const LogoEditor = () => {
  const [logos, setLogos] = useState([]);
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLogos = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/getlogo");
      setLogos(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch logos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewURL(URL.createObjectURL(selectedFile));
    } else {
      setPreviewURL(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a logo image");

    const formData = new FormData();
    formData.append("logo", file);

    setUploading(true);
    try {
      await axiosInstance.post("/savelogo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Logo uploaded successfully");
      setFile(null);
      setPreviewURL(null);
      fetchLogos();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this logo?")) return;

    try {
      await axiosInstance.delete(`/deletelogo/${id}`);
      toast.success("Logo deleted successfully");
      fetchLogos();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete logo");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full bg-white shadow-md rounded-2xl p-8">

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto"></div>

            <div className="space-y-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>

            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Logo Editor</h2>

            <form onSubmit={handleUpload} className="mb-6">
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>

              {previewURL && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={previewURL}
                    alt="Preview"
                    className="h-32 object-contain rounded shadow"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className={`w-full bg-black text-white font-semibold py-2 rounded-lg transition duration-300 cursor-pointer ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? "Uploading..." : "Upload Logo"}
              </button>
            </form>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Logos</h3>
              {logos.length === 0 ? (
                <p className="text-gray-500 text-center">No logos uploaded yet.</p>
              ) : (
                <ul className="space-y-4">
                  {logos.map((logo) => (
                    <li
                      key={logo._id}
                      className="flex justify-between items-center border border-gray-200 p-3 rounded-lg"
                    >
                      <img
                        src={logo.imageUrl}
                        alt="Logo"
                        className="h-10 w-10 object-contain rounded"
                      />
                      <button
                        onClick={() => handleDelete(logo._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoEditor;
