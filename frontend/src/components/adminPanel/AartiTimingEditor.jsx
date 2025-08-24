import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit } from "react-icons/fi";
import SkeletonCard from "./SkeletonCard";

const AartiTimingEditor = () => {
  const [timings, setTimings] = useState([]);
  const [formData, setFormData] = useState({ name: "", time: "", day: "", notes: "" });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTimings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/aarti-timings");
      setTimings(res.data);
    } catch {
      toast.error("Failed to fetch aarti timings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/aarti-timings/${editingId}`, formData);
        toast.success("Updated successfully");
      } else {
        await axiosInstance.post("/aarti-timings", formData);
        toast.success("Added successfully");
      }
      resetForm();
      fetchTimings();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({ name: item.name, time: item.time, day: item.day || "", notes: item.notes || "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/aarti-timings/${id}`);
      toast.success("Deleted successfully");
      fetchTimings();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", time: "", day: "", notes: "" });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🕉️ Aarti Timing Editor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            value={formData.name}
            placeholder="Aarti Name"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300"
          />
          <input
            type="text"
            value={formData.time}
            placeholder="Time (e.g., 06:00 AM)"
            required
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300"
          />
          <input
            type="text"
            value={formData.day}
            placeholder="Day (e.g., Everyday, Monday)"
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300"
          />
          <textarea
            value={formData.notes}
            placeholder="Notes (optional)"
            rows="3"
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300"
          />

          <button
            type="submit"
            className={`w-full bg-black text-white font-semibold py-2 rounded-lg ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={submitting}
          >
            {submitting ? "Saving..." : editingId ? "Update" : "Add"} Timing
          </button>
        </form>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Records</h3>

        {loading ? (
          <SkeletonCard lines={4} />
        ) : timings.length === 0 ? (
          <p className="text-center text-gray-500">No aarti timings found.</p>
        ) : (
          <div className="space-y-4">
            {timings.map((item, idx) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-bold">{idx + 1}. {item.name}</p>
                  <p className="text-sm">Time: {item.time}</p>
                  <p className="text-sm">Day: {item.day || "Everyday"}</p>
                  {item.notes && <p className="text-sm text-gray-500">Notes: {item.notes}</p>}
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

export default AartiTimingEditor;
