import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FiYoutube } from "react-icons/fi";
import HeaderDisplay from "../landingPage/Header";
import FooterDisplay from "../landingPage/Footer";

const LiveAartiDisplay = () => {
  const [liveAarti, setLiveAarti] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveAarti = async () => {
      try {
        const res = await axiosInstance.get("/liveaarti");
        setLiveAarti(res.data);
      } catch (error) {
        console.error("Failed to fetch Live Aarti", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveAarti();
  }, []);

  if (loading) {
    return (
      <>
        <HeaderDisplay />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-xl animate-pulse">Loading Live Aarti...</p>
        </div>
        <FooterDisplay />
      </>
    );
  }

  if (!liveAarti || !liveAarti.youtubeLink) {
    return (
      <>
        <HeaderDisplay />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-xl">No Live Aarti available right now.</p>
        </div>
        <FooterDisplay />
      </>
    );
  }

  // Extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYoutubeId(liveAarti.youtubeLink);

  return (
    <>
      <HeaderDisplay />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-orange-50 p-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-orange-700 mt-20">
          🙏 Live Aarti
        </h1>

        {videoId ? (
          <div className="w-full max-w-4xl aspect-video mb-6 shadow-lg rounded-xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Live Aarti"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-gray-500 text-lg mb-6">Invalid YouTube link</p>
        )}

        <a
          href={liveAarti.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition duration-300"
        >
          <FiYoutube size={24} />
          Watch on YouTube
        </a>
      </div>
      <FooterDisplay />
    </>
  );
};

export default LiveAartiDisplay;
