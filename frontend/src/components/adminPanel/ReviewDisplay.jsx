import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";
import { FaTrash, FaSyncAlt, FaStar } from "react-icons/fa";
import SkeletonCard from "./SkeletonCard";

const ReviewDisplay = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/get-reviews");
      setReviews(res.data);
    } catch {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axiosInstance.delete(`/delete-review/${id}`);
      fetchReviews();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Review",
      selector: row => row.review,
      sortable: false,
      wrap: true,
    },
    {
      name: "Rating",
      cell: row => (
        <div className="flex gap-1">
          {[...Array(row.rating)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400" />
          ))}
        </div>
      ),
      width: "120px",
    },
    {
      name: "Action",
      cell: row => (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-red-600 hover:text-red-800 text-lg cursor-pointer"
          title="Delete"
        >
          <FaTrash />
        </button>
      ),
      width: "100px",
    }
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '60px',
        paddingTop: '4px',
        paddingBottom: '4px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: '#f4f4f4',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '14px',
        wordBreak: 'break-word',
      },
    },
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Submitted Reviews
          </h2>
          <button
            onClick={fetchReviews}
            className={`text-xl cursor-pointer text-black transition ${loading ? "animate-spin" : ""}`}
            title="Refresh"
          >
            <FaSyncAlt />
          </button>
        </div>

        {loading ? (
          <SkeletonCard lines={8} />
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={reviews}
              pagination
              highlightOnHover
              responsive
              persistTableHead
              customStyles={customStyles}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDisplay;
