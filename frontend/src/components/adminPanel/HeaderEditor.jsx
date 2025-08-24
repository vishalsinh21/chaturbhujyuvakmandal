import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const HeaderEditor = () => {
  const [headers, setHeaders] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHeaders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/getheader");
      setHeaders(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch headers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeaders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    try {
      if (editId) {
        await axiosInstance.put(`/updateheader/${editId}`, { title, link });
        toast.success("Header updated");
      } else {
        await axiosInstance.post("/saveheader", { title, link });
        toast.success("Header added");
      }
      setTitle("");
      setLink("");
      setEditId(null);
      fetchHeaders();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const handleEdit = (header) => {
    setTitle(header.title);
    setLink(header.link);
    setEditId(header._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await axiosInstance.delete(`/deleteheader/${id}`);
      toast.success("Header deleted");
      fetchHeaders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete header");
    }
  };

  return (
    <div className="flex items-center bg-gray-100 justify-center px-4 min-h-screen">
      <div className="max-w-lg w-full bg-white shadow-md rounded-2xl p-8 my-20">

        {loading ? (
          // Full card skeleton
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
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Header Editor
            </h2>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder="Enter title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Link
                </label>
                <input
                  type="text"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder="Enter link"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-2 rounded-lg transition duration-300 cursor-pointer"
              >
                {editId ? "Update Header" : "Add Header"}
              </button>
            </form>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Header List
              </h3>
              {headers.length === 0 && (
                <p className="text-gray-500 text-center">No headers found.</p>
              )}
              <ul className="space-y-4">
                {headers.map((header) => (
                  <li
                    key={header._id}
                    className="flex justify-between items-center border p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{header.title}</p>
                      <p className="text-sm text-gray-500">{header.link}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(header)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(header._id)}
                        className="text-red-500 hover:text-red-700"
                      >
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

export default HeaderEditor;
