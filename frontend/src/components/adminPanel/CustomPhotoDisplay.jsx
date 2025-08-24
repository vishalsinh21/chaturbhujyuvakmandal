import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";
import { saveAs } from "file-saver";
import { FaTrash, FaSyncAlt } from "react-icons/fa";
import SkeletonCard from "./SkeletonCard";  // <-- import Skeleton

const UserPhotoDisplay = () => {
  const [userPhotos, setUserPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserPhotos = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/get-user-photos");
      setUserPhotos(res.data);
    } catch {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPhotos();
  }, []);

  const handleDownload = async (url, name) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, `${name}.jpg`);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await axiosInstance.delete(`/delete-user-photo/${id}`);
      fetchUserPhotos();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const columns = [
    {
      name: "Photo",
      selector: row => (
        <div className="flex justify-center">
          <img
            src={row.photo}
            alt={row.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
          />
        </div>
      ),
      sortable: false,
      width: "110px",
    },
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
      grow: 1,
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
      wrap: true,
      grow: 2,
    },
    {
      name: "Phone",
      selector: row => row.mobile,
      sortable: true,
      wrap: true,
      grow: 2,
    },
    {
      name: "Action",
      cell: row => (
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
          <button
            onClick={() => handleDownload(row.photo, row.name)}
            className="bg-black text-white px-4 py-1 rounded text-sm hover:bg-gray-800 transition"
          >
            Download
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:text-red-800 text-lg cursor-pointer"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
      width: "200px",
    }
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '60px',
        paddingTop: '8px',
        paddingBottom: '8px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '12px',
        paddingRight: '12px',
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: '#f9fafb',
      },
    },
    cells: {
      style: {
        paddingLeft: '12px',
        paddingRight: '12px',
        fontSize: '14px',
        wordBreak: 'break-word',
      },
    },
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 p-4 ">
      <div className="w-full max-w-5xl bg-white shadow rounded-lg p-4 sm:p-6 mt-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Submitted User Photos
          </h2>
          <button 
            onClick={fetchUserPhotos} 
            className={`text-2xl cursor-pointer text-black hover:text-black transition ${loading ? "animate-spin" : ""}`}
            title="Refresh"
          >
            <FaSyncAlt />
          </button>
        </div>

        {loading ? (
          <SkeletonCard lines={4} />
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={userPhotos}
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

export default UserPhotoDisplay;