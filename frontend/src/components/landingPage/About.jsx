import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AboutMeSkeleton = () => (
  <section id="about" className="min-h-screen flex items-center justify-center bg-[#FDF6EC] px-4 py-10">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 animate-pulse">
      <div className="w-72 h-72 bg-gray-300 rounded-3xl shadow-lg border-4 border-gray-200"></div>
      <div className="flex-1 space-y-4">
        <div className="h-8 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-4 w-full bg-gray-300 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
      </div>
    </div>
  </section>
);

const AboutMeDisplay = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/getaboutme");
      if (res.data.length > 0) {
        setAbout(res.data[0]);
      } else {
        setAbout(null);
      }
    } catch (err) {
      console.error("Failed to fetch about me", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  if (loading || !about) {
    return <AboutMeSkeleton />;
  }

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center bg-[#FDF6EC] px-4 py-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 transition-all duration-700">
        {about.image && (
          <div className="relative w-full max-w-[350px] aspect-square rounded-3xl shadow-xl overflow-hidden group">
            <img
              src={about.image}
              alt={about.name}
              className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-110"
            />
          </div>
        )}
        <div className="flex-1 p-4 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#FF6F61] mb-4 border-b-2 border-[#FF6F61] pb-2">
            About us
          </h2>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-6">
            {about.name}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {about.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMeDisplay;