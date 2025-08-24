import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import SkeletonCard from "./SkeletonCard";

const DonorListEditor = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("All");

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/donors");
      setDonors(res.data);
      setFilteredDonors(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch donors");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // Filter donors by year
  useEffect(() => {
    if (yearFilter === "All") {
      setFilteredDonors(donors);
    } else {
      setFilteredDonors(
        donors.filter(
          (donor) => donor.date && new Date(donor.date).getFullYear().toString() === yearFilter
        )
      );
    }
  }, [yearFilter, donors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      const donorData = { name, amount, purpose, date, notes };

      if (editId) {
        await axiosInstance.put(`/donors/${editId}`, donorData);
        toast.success("Donor updated successfully");
      } else {
        await axiosInstance.post("/donors", donorData);
        toast.success("Donor added successfully");
      }

      setName("");
      setAmount("");
      setPurpose("");
      setDate("");
      setNotes("");
      setEditId(null);
      fetchDonors();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const handleEdit = (donor) => {
    setName(donor.name);
    setAmount(donor.amount);
    setPurpose(donor.purpose);
    setDate(donor.date ? donor.date.split("T")[0] : "");
    setNotes(donor.notes || "");
    setEditId(donor._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donor?")) return;
    try {
      await axiosInstance.delete(`/donors/${id}`);
      toast.success("Donor deleted successfully");
      fetchDonors();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete donor");
    }
  };

  // Generate list of years from donors
  const years = Array.from(
    new Set(donors.map((donor) => donor.date && new Date(donor.date).getFullYear()))
  ).filter(Boolean)
   .sort((a, b) => b - a); // Descending order

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md md:max-w-3xl bg-white shadow-md rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Donor List Editor
        </h2>

        {/* Donor Form */}
        <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-1 gap-4">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Donor Name"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
          />
          <input
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
          />
          <input
            type="text"
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Purpose"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
          />
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
          />

          <button
            type="submit"
            className="bg-black text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-gray-900 w-full"
          >
            {editId ? "Update Donor" : "Add Donor"}
          </button>
        </form>

        {/* Year Filter */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">Filter by Year:</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
          >
            <option value="All">All</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Donor List */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Donor List</h3>

        {initialLoading ? (
          <SkeletonCard lines={5} />
        ) : filteredDonors.length === 0 ? (
          <p className="text-gray-500 text-center">No donors found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredDonors.map((donor) => (
              <li
                key={donor._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center border p-3 rounded-lg"
              >
                <div className="mb-2 md:mb-0">
                  <p className="font-semibold">{donor.name}</p>
                  <p className="text-sm text-gray-500">Amount: ₹{donor.amount}</p>
                  <p className="text-sm text-gray-500">Purpose: {donor.purpose}</p>
                  {donor.date && (
                    <p className="text-sm text-gray-500">
                      Date: {new Date(donor.date).toLocaleDateString()}
                    </p>
                  )}
                  {donor.notes && <p className="text-sm text-gray-500">Notes: {donor.notes}</p>}
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <button
                    onClick={() => handleEdit(donor)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(donor._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DonorListEditor;
