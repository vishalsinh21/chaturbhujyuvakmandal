import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";

const FooterEditor = () => {
  const [formData, setFormData] = useState({
    copyright: "",
    quickLinks: [],
    email: "",
    phone: ""
  });
  const [footers, setFooters] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [quickLink, setQuickLink] = useState({ title: "", link: "" });
  const [loading, setLoading] = useState(false);

  const fetchFooter = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/getfooter");
      setFooters(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch footers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleAddQuickLink = () => {
    if (quickLink.title && quickLink.link) {
      setFormData({
        ...formData,
        quickLinks: [...formData.quickLinks, quickLink]
      });
      setQuickLink({ title: "", link: "" });
    } else {
      toast.error("Both title and link are required");
    }
  };

  const handleRemoveQuickLink = (index) => {
    const updatedLinks = [...formData.quickLinks];
    updatedLinks.splice(index, 1);
    setFormData({ ...formData, quickLinks: updatedLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/updatefooter/${editingId}`, formData);
        toast.success("Footer updated");
      } else {
        await axiosInstance.post("/savefooter", formData);
        toast.success("Footer added");
      }
      setFormData({ copyright: "", quickLinks: [], email: "", phone: "" });
      setEditingId(null);
      fetchFooter();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save footer");
    }
  };

  const handleEdit = (footer) => {
    setFormData({
      copyright: footer.copyright,
      quickLinks: footer.quickLinks || [],
      email: footer.email || "",
      phone: footer.phone || ""
    });
    setEditingId(footer._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await axiosInstance.delete(`/deletefooter/${id}`);
      toast.success("Footer deleted");
      fetchFooter();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete footer");
    }
  };

  return (
    <div className="flex items-center bg-gray-100 justify-center px-4 min-h-screen">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 my-20">

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto"></div>

            <div className="space-y-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>

            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              {editingId ? "Edit Footer" : "Add Footer"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Copyright</label>
                <input
                  type="text"
                  value={formData.copyright}
                  onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder="Enter copyright text"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="p-4 bg-gray-50 border rounded-lg">
                <h3 className="font-semibold mb-3">Quick Links</h3>

                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={quickLink.title}
                    onChange={(e) => setQuickLink({ ...quickLink, title: e.target.value })}
                    placeholder="Link Title"
                    className="w-1/3 px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={quickLink.link}
                    onChange={(e) => setQuickLink({ ...quickLink, link: e.target.value })}
                    placeholder="Link URL"
                    className="w-1/2 px-3 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuickLink}
                    className="px-4 py-2 bg-black text-white rounded-lg"
                  >
                    <FiPlus />
                  </button>
                </div>

                {formData.quickLinks.length > 0 && (
                  <ul className="space-y-2">
                    {formData.quickLinks.map((ql, index) => (
                      <li key={index} className="flex justify-between bg-white p-2 rounded shadow">
                        <span>{ql.title} - {ql.link}</span>
                        <button onClick={() => handleRemoveQuickLink(index)} className="text-red-500">
                          <FiX />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-2 rounded-lg transition duration-300"
              >
                {editingId ? "Update Footer" : "Add Footer"}
              </button>
            </form>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Footer List</h3>
              {footers.length === 0 && (
                <p className="text-gray-500 text-center">No footers found.</p>
              )}
              <ul className="space-y-4">
                {footers.map((footer) => (
                  <li key={footer._id} className="flex justify-between items-center border p-4 rounded-lg">
                    <div>
                      <p className="font-semibold">{footer.copyright}</p>
                      <p className="text-sm text-gray-500">Email: {footer.email}</p>
                      <p className="text-sm text-gray-500">Phone: {footer.phone}</p>
                      {footer.quickLinks.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {footer.quickLinks.map((ql, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                              {ql.title} - {ql.link}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(footer)} className="text-blue-500 hover:text-blue-700">
                        <FiEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(footer._id)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FooterEditor;
