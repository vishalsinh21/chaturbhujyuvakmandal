import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQDisplay = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axiosInstance.get("/getfaq");
        setFaqs(response.data);
      } catch (err) {
        console.error("Failed to fetch FAQs", err);
      }
    };
    fetchFAQs();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faqs" className="min-h-[400px] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq._id} className="bg-white shadow-md rounded-xl">
            <button
              className="flex justify-between items-center w-full px-4 py-3 text-left font-semibold text-lg text-gray-800"
              onClick={() => toggleAccordion(index)}
            >
              {faq.title}
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 text-gray-700 border-t">
                {faq.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQDisplay;
