import { useState, useEffect } from "react"; 
import axiosInstance from "../utils/axiosInstance";
import SkeletonCard from "../adminPanel/SkeletonCard";

const AartiTimingsDisplay = () => {
  const [aartiTimings, setAartiTimings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimings = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/aarti-timings");
        // Filter only Morning and Evening timings
        const filtered = res.data.filter(timing => 
          timing.name.toLowerCase() === "morning" || timing.name.toLowerCase() === "evening"
        );
        setAartiTimings(filtered);
      } catch (error) {
        console.error("Failed to fetch Aarti Timings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimings();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <h2 className="text-3xl font-bold text-orange-700 text-center mb-6">
        🕉️ Aarti Timings
      </h2>

      {loading ? (
        <SkeletonCard lines={2} />
      ) : aartiTimings.length === 0 ? (
        <p className="text-center text-gray-500">No aarti timings available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aartiTimings.map((timing, idx) => (
            <div
              key={timing._id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <p className="font-bold text-lg text-gray-800 mb-2">{timing.name}</p>
              <p className="text-gray-600 mb-1">Time: {timing.time}</p>
              <p className="text-gray-600 mb-1">Day: {timing.day || "Everyday"}</p>
              {timing.notes && (
                <p className="text-gray-500 text-sm mt-1">Notes: {timing.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AartiTimingsDisplay;