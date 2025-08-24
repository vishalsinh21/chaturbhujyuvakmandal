import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import SkeletonCard from "../adminPanel/SkeletonCard";
import Header from "../landingPage/Header";
import Footer from "../landingPage/Footer";

const DonorListDisplay = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await axiosInstance.get("/donors");
        setDonors(res.data);
      } catch (err) {
        console.error("Failed to fetch donors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const years = Array.from(
    new Set(donors.map(d => d.date ? new Date(d.date).getFullYear() : "Unknown"))
  ).sort((a, b) => b - a);

  const currentYear = new Date().getFullYear();

  const filteredDonors = selectedYear === "All"
    ? donors
    : donors.filter(d => d.date && new Date(d.date).getFullYear() === Number(selectedYear));

  return (
    <>
      <Header />
      <div className="bg-orange-50 min-h-screen p-4 pt-6 md:pt-12 mt-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          🙏 Our Beloved Donors
        </h1>
        <p className="text-center text-gray-600 mb-6">
          We are grateful to everyone who has contributed. Your support helps us grow and serve better!
        </p>

        {/* Year filter dropdown */}
        <div className="flex justify-center mb-6">
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
          >
            <option value="All">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year} {year === currentYear ? "(Current Year)" : ""}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <SkeletonCard lines={5} />
        ) : filteredDonors.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            {selectedYear === "All"
              ? "No donors found yet. Be the first to contribute!"
              : `No donors found for the year ${selectedYear}.`}
          </p>
        ) : (
          <>
            {/* Table for medium and larger screens */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow mb-6">
              <table className="min-w-full bg-white">
                <thead className="bg-orange-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Sr. No.</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Amount (₹)</th>
                    <th className="py-3 px-4 text-left">Purpose</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonors.map((donor, idx) => (
                    <tr
                      key={donor._id}
                      className={`border-b transition duration-200 hover:bg-gray-100 ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4">{donor.name}</td>
                      <td className="py-3 px-4 font-semibold text-green-700">{donor.amount}</td>
                      <td className="py-3 px-4">{donor.purpose}</td>
                      <td className="py-3 px-4">
                        {donor.date ? new Date(donor.date).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-3 px-4">{donor.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards for small screens */}
            <div className="md:hidden grid gap-4">
              {filteredDonors.map((donor, idx) => (
                <div
                  key={donor._id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <p className="font-semibold text-lg text-gray-800">#{idx + 1} {donor.name}</p>
                  <p className="text-sm text-gray-600">Amount: ₹{donor.amount}</p>
                  <p className="text-sm text-gray-600">Purpose: {donor.purpose}</p>
                  <p className="text-sm text-gray-500">
                    Date: {donor.date ? new Date(donor.date).toLocaleDateString() : "-"}
                  </p>
                  {donor.notes && <p className="text-sm text-gray-500 mt-1">Notes: {donor.notes}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DonorListDisplay;