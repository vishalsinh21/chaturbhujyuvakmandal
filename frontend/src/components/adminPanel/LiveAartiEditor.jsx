import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const LiveAartiEditor = () => {
  const [liveAartis, setLiveAartis] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [editId, setEditId] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch all Live Aarti links
  const fetchLiveAarti = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/liveaarti"); // fetches active one
      setLiveAartis(res.data ? [res.data] : []); // put in array for listing
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Live Aarti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAarti();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    try {
      if (editId) {
        await axiosInstance.put(`/liveaarti/${editId}`, { youtubeLink, isActive });
        toast.success("Live Aarti updated");
      } else {
        await axiosInstance.post("/liveaarti", { youtubeLink });
        toast.success("Live Aarti added");
      }
      setYoutubeLink("");
      setEditId(null);
      setIsActive(true);
      fetchLiveAarti();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const handleEdit = (live) => {
    setYoutubeLink(live.youtubeLink);
    setIsActive(live.isActive);
    setEditId(live._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Live Aarti?")) return;
    try {
      await axiosInstance.delete(`/liveaarti/${id}`);
      toast.success("Live Aarti deleted");
      fetchLiveAarti();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete Live Aarti");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 min-h-screen bg-gray-100">
      <div className="max-w-lg w-full bg-white shadow-md rounded-2xl p-8 my-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Live Aarti Editor
        </h2>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">YouTube Link</label>
            <input
              type="text"
              required
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="Enter YouTube live link"
            />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              id="isActive"
            />
            <label htmlFor="isActive" className="text-gray-700 font-semibold">
              Active
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 rounded-lg transition duration-300 cursor-pointer"
          >
            {editId ? "Update Live Aarti" : "Add Live Aarti"}
          </button>
        </form>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Aarti List</h3>
          {liveAartis.length === 0 && (
            <p className="text-gray-500 text-center">No Live Aarti found.</p>
          )}
          <ul className="space-y-4">
            {liveAartis.map((live) => (
              <li key={live._id} className="flex justify-between items-center border p-3 rounded-lg">
                <div>
                  <p className="font-semibold">{live.title}</p>
                  <p className="text-sm text-gray-500">{live.youtubeLink}</p>
                  <p className="text-sm text-gray-500">
                    Status: {live.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(live)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(live._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveAartiEditor;