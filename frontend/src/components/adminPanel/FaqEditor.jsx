import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import SkeletonCard from "./SkeletonCard";

const FAQEditor = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [faqs, setFaqs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(false);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/getfaq");
      setFaqs(res.data);
    } catch {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/updatefaq/${editingId}`, formData);
        toast.success("FAQ updated");
        setEditingId(null);
      } else {
        await axiosInstance.post("/savefaq", formData);
        toast.success("FAQ added");
      }
      setFormData({ title: "", description: "" });
      fetchFAQs();
    } catch {
      toast.error("Error saving FAQ");
    }
  };

  const handleEdit = (faq) => {
    setFormData({ title: faq.title, description: faq.description });
    setEditingId(faq._id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deletefaq/${id}`);
      toast.success("FAQ deleted");
      fetchFAQs();
    } catch {
      toast.error("Error deleting FAQ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {editingId ? "Edit FAQ" : "Add New FAQ"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-10">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="FAQ Title"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="FAQ Description"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <div className="flex space-x-2">
            <button type="submit" className="px-6 py-2 bg-black text-white rounded">
              {editingId ? "Update FAQ" : "Add FAQ"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: "", description: "" });
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h3 className="text-xl font-semibold mb-4 text-center">FAQ List</h3>

        {loading ? (
          <SkeletonCard lines={4} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.slice(0, visibleCount).map((faq) => (
                <div key={faq._id} className="bg-gray-50 p-6 rounded-lg shadow relative">
                  <h3 className="font-bold text-lg mb-2">{faq.title}</h3>
                  <p className="text-gray-700">{faq.description}</p>
                  <div className="absolute top-4 right-4 flex space-x-3">
                    <button onClick={() => handleEdit(faq)} className="text-black ">
                      <FiEdit size={20} />
                    </button>
                    <button onClick={() => handleDelete(faq._id)} className="text-red-500">
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < faqs.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="px-6 py-2 bg-black text-white rounded"
                >
                  View More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FAQEditor;
