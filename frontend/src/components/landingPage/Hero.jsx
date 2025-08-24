import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Skeleton = () => (
  <div className="relative w-full h-screen animate-pulse bg-gray-300">
    <div className="absolute inset-0 flex flex-col justify-center items-center">
      <div className="h-10 w-3/4 bg-gray-400 rounded mb-4"></div>
      <div className="h-6 w-1/2 bg-gray-400 rounded"></div>
    </div>
  </div>
);

const HeroDisplay = () => {
  const [images, setImages] = useState([]);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axiosInstance.get("/gethero");
        const data = res.data;

        setImages(data.map(item => item.images[0]));
        setTexts(data.map(item => item.texts[0]));
      } catch (error) {
        console.error("Failed to fetch hero data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  if (loading) return <Skeleton />;

  if (images.length === 0)
    return <div className="text-center py-10 text-lg">No Hero Data Available</div>;

  const sliderSettings = {
    dots: true,
    infinite: images.length > 1,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: images.length > 1,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    swipe: true,
    touchMove: true,
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Slider {...sliderSettings}>
        {images.map((img, index) => (
          <div key={index} className="relative w-full h-screen">
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-6 drop-shadow-xl mt-50">
                {texts[index] || ""}
              </h1>
              {/* Optional CTA button */}
              {/* <button className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition">
                Join Us
              </button> */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroDisplay;
