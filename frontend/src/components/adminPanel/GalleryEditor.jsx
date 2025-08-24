import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit } from "react-icons/fi";
import SkeletonCard from "./SkeletonCard";

const GalleryEditor = () => {
  const [gallery, setGallery] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [formData, setFormData] = useState({
    imageTitle: "",
    imageType: "",
    year: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const years = Array.from({ length: 14 }, (_, i) => 2017 + i); // 2017-2030
  const imageTypes = ["Group Photo", "Ganesh Photo", "Event Photo", "Other"];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/getgallery");
      setGallery(res.data);
    } catch {
      toast.error("Failed to fetch gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append("imageTitle", formData.imageTitle);
    data.append("imageType", formData.imageType);
    data.append("year", formData.year);
    if (file) data.append("gallery", file);

    try {
      if (editingId) {
        await axiosInstance.put(`/updategallery/${editingId}`, data);
        toast.success("Updated successfully");
      } else {
        await axiosInstance.post("/savegallery", data);
        toast.success("Added successfully");
      }
      resetForm();
      fetchGallery();
      setVisibleCount(3);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      imageTitle: item.imageTitle,
      imageType: item.imageType,
      year: item.year,
    });
    setFile(null);
    setPreview(item.image);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/deletegallery/${id}`);
      toast.success("Deleted successfully");
      fetchGallery();
      setVisibleCount(3);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({ imageTitle: "", imageType: "", year: "" });
    setFile(null);
    setPreview(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 mt-5 mb-5">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Gallery Editor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            value={formData.imageTitle}
            placeholder="Image Title"
            required
            onChange={(e) =>
              setFormData({ ...formData, imageTitle: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300"
          />

          {/* Image Type Dropdown */}
          <select
            value={formData.imageType}
            required
            onChange={(e) =>
              setFormData({ ...formData, imageType: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300"
          >
            <option value="">Select Image Type</option>
            {imageTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={formData.year}
            required
            onChange={(e) =>
              setFormData({ ...formData, year: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {preview && (
            <div className="flex justify-center mb-2">
              <img
                src={preview}
                alt="Preview"
                className="h-40 w-40 rounded object-cover border"
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-black text-white font-semibold py-2 rounded-lg ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={submitting}
          >
            {submitting ? "Saving..." : editingId ? "Update" : "Add"} Gallery Item
          </button>
        </form>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Gallery Records
        </h3>

        {loading ? (
          <SkeletonCard lines={3} />
        ) : gallery.length === 0 ? (
          <p className="text-center text-gray-500">No records found.</p>
        ) : (
          <div className="space-y-4">
            {gallery.slice(0, visibleCount).map((item) => (
              <div key={item._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt="Gallery"
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{item.imageTitle}</h4>
                    <p className="text-sm text-gray-500">Type: {item.imageType}</p>
                    <p className="text-sm">Year: {item.year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-500">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-500">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}

            {visibleCount < gallery.length && (
              <div className="flex justify-center">
                <button
                  onClick={() => setVisibleCount(visibleCount + 3)}
                  className="bg-black text-white py-2 px-4 rounded-lg"
                >
                  View More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryEditor;
