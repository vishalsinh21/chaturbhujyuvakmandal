import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit } from "react-icons/fi";
import SkeletonCard from "./SkeletonCard";

const AboutMeEditor = () => {
  const [aboutMeList, setAboutMeList] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true); // new state for skeleton

  const fetchAboutMe = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/getaboutme");
      setAboutMeList(res.data);
    } catch {
      toast.error("Failed to fetch About Me data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    if (file) data.append("aboutImage", file);

    try {
      if (editingId) {
        await axiosInstance.put(`/updateaboutme/${editingId}`, data);
        toast.success("Updated successfully");
      } else {
        await axiosInstance.post("/saveaboutme", data);
        toast.success("Added successfully");
      }
      resetForm();
      fetchAboutMe();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({ name: item.name, description: item.description });
    setFile(null);
    setPreview(item.image);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/deleteaboutme/${id}`);
      toast.success("Deleted successfully");
      fetchAboutMe();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setFile(null);
    setPreview(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          About Me Editor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            value={formData.name}
            placeholder="Name"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300"
          />
          <textarea
            value={formData.description}
            placeholder="Description"
            required
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300"
          />
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
                className="h-32 w-32 rounded-full object-cover border"
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
            {submitting ? "Saving..." : editingId ? "Update" : "Add"} About Me
          </button>
        </form>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Records</h3>

        {loading ? (
          <SkeletonCard lines={4} />
        ) : aboutMeList.length === 0 ? (
          <p className="text-center text-gray-500">No records found.</p>
        ) : (
          <div className="space-y-4">
            {aboutMeList.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt="About"
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-sm">{item.description}</p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutMeEditor;