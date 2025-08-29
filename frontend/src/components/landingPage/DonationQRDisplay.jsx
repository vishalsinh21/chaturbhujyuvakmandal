import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Header from "../landingPage/Header";
import Footer from "../landingPage/Footer";
import { FaWhatsapp } from "react-icons/fa";

const QRSkeleton = () => (
  <div className="flex justify-center items-center h-60">
    <div className="w-48 h-48 bg-gray-300 rounded-lg animate-pulse"></div>
  </div>
);

const DonationQRDisplay = () => {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const res = await axiosInstance.get("/paymentQR");
        setQrs(res.data);
      } catch (err) {
        console.error("Failed to fetch QR codes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQRCodes();
  }, []);

  const shareOnWhatsApp = async (qr) => {
    try {
      // Try Web Share API (mobile)
      const response = await fetch(qr.image);
      const blob = await response.blob();
      const file = new File([blob], "DonationQR.png", { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: `Donate via this QR code: ${qr.bankName || "Bank QR"}`
        });
      } else {
        // fallback: open WhatsApp web with QR image link
        const message = `Donate via this QR code: ${qr.bankName || "Bank QR"}\nScan the QR to support!\n${qr.image}`;
        const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to share directly. Please download the QR and share manually.");
    }
  };

  return (
    <>
      <Header />

      <section className="pt-28 pb-16 px-4 bg-orange-50 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center lg:items-center gap-12">

          {/* Left side: Text */}
          <div className="lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Donate via QR</h2>
            <p className="text-gray-600 text-lg">
              Support our cause by scanning any QR code below
            </p>
          </div>

          {/* Right side: QR Card */}
          <div className="lg:w-1/2 flex justify-center items-center">
            {loading ? (
              <QRSkeleton />
            ) : qrs.length === 0 ? (
              <p className="text-gray-500 font-medium text-center">No QR codes available at the moment.</p>
            ) : (
              <div className="bg-white shadow-lg p-6 flex flex-col items-center rounded-lg">
                <img
                  src={qrs[0].image}
                  alt="Donation QR"
                  className="w-48 h-48 object-cover rounded mb-4 border border-gray-200"
                  loading="lazy"
                />
                <p className="text-sm text-gray-600 mb-3">{qrs[0].bankName || "QR Code"}</p>

                <div className="flex gap-3">
                  {/* Share button (mobile + fallback) */}
                  <button
                    onClick={() => shareOnWhatsApp(qrs[0])}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition"
                  >
                    <FaWhatsapp /> Share on WhatsApp
                  </button>

                  {/* Download button (desktop) */}
                  <a
                    href={qrs[0].image}
                    download={`QR-${qrs[0].bankName || "Donation"}`}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition text-center"
                  >
                    Download QR
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default DonationQRDisplay;
