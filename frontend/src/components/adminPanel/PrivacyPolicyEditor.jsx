import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import SkeletonCard from "./SkeletonCard";

const PrivacyPolicyEditor = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axiosInstance.get("/getpolicy");
        if (res.data?.content) {
          setContent(res.data.content);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch privacy policy.");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/savepolicy", { content, updatedBy: "Admin" });
      toast.success("Privacy Policy updated successfully!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save privacy policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Privacy Policy Editor</h2>

        {initialLoading ? (
          <SkeletonCard lines={8} />
        ) : (
          <>
            <textarea
              className="w-full h-96 border rounded-lg p-4 focus:ring-1 focus:ring-gray-300 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your privacy policy here..."
            ></textarea>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-8 py-2 rounded-lg text-white font-semibold transition 
                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-black"}`}
              >
                {loading ? "Saving..." : "Save Policy"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyEditor;
