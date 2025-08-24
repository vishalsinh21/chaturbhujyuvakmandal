import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Star } from "lucide-react";

const ReviewDisplay = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get("/get-reviews");
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-[300px] bg-gradient-to-br from-orange-200 via-orange-200 to-orange-100 py-14 px-4">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 drop-shadow">
        Whispers from the Heart
      </h2>

      {loading ? (
        <div className="text-center text-gray-500 text-lg">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No reviews yet.</div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <Carousel
            showThumbs={false}
            showStatus={false}
            showArrows={false}
            showIndicators={false}
            infiniteLoop
            autoPlay
            interval={4500}
            dynamicHeight={false}
            swipeable
            emulateTouch
          >
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-6 bg-white rounded-3xl mx-4 select-none flex flex-col justify-between min-h-[260px]"
              >
                <div>
                  <div className="flex justify-center mb-6">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, index) => (
                        <Star
                          key={index}
                          className="w-6 h-6 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-center text-lg text-gray-700 italic relative px-2">
                    <span className="text-4xl text-gray-400 absolute -top-4 left-4">
                      “
                    </span>
                    {review.review}
                    <span className="text-4xl text-gray-400 absolute -bottom-4 right-4">
                      ”
                    </span>
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <p className="font-semibold text-gray-900 text-lg">
                    {review.name}
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;
