import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Header from "../landingPage/Header";
import Footer from "../landingPage/Footer";

const GallerySkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white shadow-lg p-4 rounded-lg animate-pulse"
        >
          <div className="w-full h-64 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4 mx-auto"></div>
          <div className="h-5 bg-gray-300 rounded mb-4 w-1/2 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

const GalleryDisplay = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axiosInstance.get("/getgallery");
        setGallery(res.data);
      } catch (err) {
        console.error("Failed to fetch gallery", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredGallery = gallery.filter(
    (item) => !selectedYear || item.year === Number(selectedYear)
  );

  const displayedItems = showAll
    ? filteredGallery
    : filteredGallery.slice(0, 3);

  return (
    <>
      {/* ✅ Header */}
      <Header />

      {/* ✅ Gallery Section */}
      <section
        id="gallery"
        className="pt-28 pb-16 px-4 bg-gradient-to-tr from-orange-200 via-orange-100 to-orange-100 min-h-[70vh]"
      >
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Our Gallery</h2>
          <p className="text-gray-600 mt-2">Moments we cherish together</p>
        </div>

        {/* Year Filter */}
        <div className="max-w-6xl mx-auto flex justify-center mb-8">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm"
          >
            {Array.from(
              { length: new Date().getFullYear() - 2017 + 1 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <GallerySkeleton />
        ) : filteredGallery.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-lg text-gray-500 font-medium">
              No records found for {selectedYear}.
            </p>
          </div>
        ) : (
          <>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-lg p-4 flex flex-col items-center rounded-lg transition-transform hover:scale-105 duration-300"
                >
                  <img
                    src={item.image}
                    alt="Gallery"
                    loading="lazy"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <p className="text-sm italic text-gray-500 mb-2">
                    {item.imageType}
                  </p>
                  <p className="text-sm text-gray-600">Year: {item.year}</p>
                </div>
              ))}
            </div>

            {!showAll && filteredGallery.length > 3 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-lg rounded-lg shadow-md hover:scale-105 transition"
                >
                  View More
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ✅ Footer */}
      <Footer />
    </>
  );
};

export default GalleryDisplay;
