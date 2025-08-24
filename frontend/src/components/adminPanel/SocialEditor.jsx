import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import * as Icons from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const availableIcons = [
  "FaInstagram", "FaLinkedin", "FaGithub", "FaFacebook", "FaTwitter",
  "FaYoutube", "FaTiktok", "FaTelegram", "FaWhatsapp"
];

const SocialIconEditor = () => {
  const [formData, setFormData] = useState({ url: "", logo: "" });
  const [socialIcons, setSocialIcons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchIcons = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/get-social-icons");
      setSocialIcons(res.data);
    } catch {
      toast.error("Failed to fetch icons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIcons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/update-social-icon/${editingId}`, formData);
        toast.success("Updated successfully");
        setEditingId(null);
      } else {
        await axiosInstance.post("/save-social-icon", formData);
        toast.success("Added successfully");
      }
      setFormData({ url: "", logo: "" });
      fetchIcons();
    } catch {
      toast.error("Error saving");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await axiosInstance.delete(`/delete-social-icon/${id}`);
      toast.success("Deleted");
      fetchIcons();
    } catch {
      toast.error("Error deleting");
    }
  };

  const handleEdit = (icon) => {
    setFormData({ url: icon.url, logo: icon.logo });
    setEditingId(icon._id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto"></div>

            <div className="space-y-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
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
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              {editingId ? "Edit Social Icon" : "Add Social Icon"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Social URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="Enter social URL"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Icon</label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <select
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg mb-2 sm:mb-0"
                  >
                    <option value="">Select Icon</option>
                    {availableIcons.map((iconName) => {
                      const label = iconName.replace("Fa", "");
                      return (
                        <option key={iconName} value={iconName}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  {formData.logo && Icons[formData.logo] && (
                    <div className="p-2 border rounded-lg bg-gray-50 self-center">
                      {Icons[formData.logo]({ size: 28 })}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-3 rounded-lg transition duration-300"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </form>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center sm:text-left">Social Icons List</h3>
              {socialIcons.length === 0 ? (
                <p className="text-gray-500 text-center">No icons found.</p>
              ) : (
                <ul className="space-y-4">
                  {socialIcons.map((icon) => {
                    const IconComponent = Icons[icon.logo];
                    return (
                      <li key={icon._id} className="flex flex-col sm:flex-row sm:justify-between items-center border border-gray-200 p-3 rounded-lg">
                        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                          {IconComponent ? <IconComponent size={24} /> : <span>No Icon</span>}
                          <a href={icon.url} target="_blank" rel="noreferrer" className="text-blue-600 break-all">{icon.url}</a>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => handleEdit(icon)} className="text-blue-500 hover:text-blue-700">
                            <FiEdit size={18} />
                          </button>
                          <button onClick={() => handleDelete(icon._id)} className="text-red-500 hover:text-red-700">
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialIconEditor;
