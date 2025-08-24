import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const PrivacyPolicyDisplay = () => {
  const [policy, setPolicy] = useState("");

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axiosInstance.get("/getpolicy");
        if (res.data?.content) {
          // Convert newlines to <br> for display
          const formattedPolicy = res.data.content.replace(/\n/g, "<br/>");
          setPolicy(formattedPolicy);
        }
      } catch (err) {
        setPolicy("<p>Unable to load privacy policy at the moment.</p>",err);
      }
    };
    fetchPolicy();
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Privacy Policy</h1>
        <div className="prose prose-lg mx-auto text-justify" dangerouslySetInnerHTML={{ __html: policy }} />
      </div>
    </div>
  );
};

export default PrivacyPolicyDisplay;