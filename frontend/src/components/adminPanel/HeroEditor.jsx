import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus, FiEdit3 } from "react-icons/fi";
import SkeletonCard from "./SkeletonCard";

const HeroEditor = () => {
  const [heroes, setHeroes] = useState([]);
  const [texts, setTexts] = useState([""]);
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true); // <-- Skeleton loading state

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/gethero");
      setHeroes(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch hero data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setFiles(filesArray);
    setPreviewImages(filesArray.map((file) => URL.createObjectURL(file)));
  };

  const handleAddTextField = () => {
    setTexts([...texts, ""]);
  };

  const handleTextChange = (index, value) => {
    const updatedTexts = [...texts];
    updatedTexts[index] = value;
    setTexts(updatedTexts);
  };

  const resetForm = () => {
    setTexts([""]);
    setFiles([]);
    setPreviewImages([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (texts.some((t) => t.trim() === "")) {
      return toast.error("Please fill all text fields.");
    }

    const formData = new FormData();
    formData.append("texts", JSON.stringify(texts));
    files.forEach((file) => {
      formData.append("images", file);
    });

    setUploading(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/updatehero/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Hero updated successfully");
      } else {
        await axiosInstance.post("/savehero", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Hero saved successfully");
      }
      fetchHeroes();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Hero?")) return;
    try {
      await axiosInstance.delete(`/deletehero/${id}`);
      toast.success("Hero deleted successfully");
      fetchHeroes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete hero");
    }
  };

  const handleEdit = (hero) => {
    setTexts(hero.texts);
    setFiles([]);
    setPreviewImages(hero.images);
    setEditingId(hero._id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-2xl p-8 mt-20 mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Hero Editor
        </h2>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Hero Texts
            </label>
            {texts.map((text, index) => (
              <input
                key={index}
                type="text"
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder={`Text ${index + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={handleAddTextField}
              className="flex items-center gap-2 mt-2 text-blue-600 hover:underline"
            >
              <FiPlus /> Add Text Field
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Hero Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {previewImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-lg border"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full bg-black text-white font-semibold py-2 rounded-lg transition duration-300 cursor-pointer ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading
              ? editingId
                ? "Updating..."
                : "Saving..."
              : editingId
              ? "Update Hero"
              : "Save Hero"}
          </button>
        </form>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Existing Heroes
          </h3>

          {loading ? (
            <SkeletonCard lines={3} />
          ) : heroes.length === 0 ? (
            <p className="text-gray-500 text-center">No hero entries yet.</p>
          ) : (
            <div className="space-y-6">
              {heroes.map((hero) => (
                <div key={hero._id} className="border border-gray-300 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg">Hero ID: {hero._id}</h4>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(hero)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(hero._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="font-medium text-gray-700">Texts:</p>
                    <ul className="list-disc pl-5 text-gray-600">
                      {hero.texts.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {hero.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Hero"
                        className="h-24 w-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;