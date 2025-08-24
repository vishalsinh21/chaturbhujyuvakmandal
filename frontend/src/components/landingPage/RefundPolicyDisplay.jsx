import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const RefundPolicyDisplay = () => {
  const [policy, setPolicy] = useState("");

  useEffect(() => {
    const fetchPolicy = async () => {
  try {
    const res = await axiosInstance.get("/get-refund-policy");
    if (res.data?.content) {
      const htmlContent = res.data.content.replace(/\n/g, "<br />");
      setPolicy(htmlContent);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setPolicy("Unable to load refund policy at the moment.");
  }
};
    fetchPolicy();
  }, []);

  return (
    <div className="p-8 mt-30 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Refund Policy</h1>
      <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: policy }} />
    </div>
  );
};

export default RefundPolicyDisplay;
