import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";
import { FaTrash, FaSyncAlt } from "react-icons/fa";
import SkeletonCard from "./SkeletonCard";

const ContactDisplay = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/get-contacts");
      setContacts(res.data);
    } catch {
      console.error("Failed to fetch contact data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await axiosInstance.delete(`/delete-contact/${id}`);
      fetchContacts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: "Phone",
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: "Message",
      selector: row => row.message,
      wrap: true,
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
      width: "80px",
    }
  ];

  const customStyles = {
    rows: { style: { minHeight: '50px', paddingTop: '4px', paddingBottom: '4px' }},
    headCells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: '14px', fontWeight: '600', backgroundColor: '#f4f4f4' }},
    cells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: '14px', wordBreak: 'break-word' }},
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Contact Form Submissions</h2>
          <button 
            onClick={fetchContacts} 
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
              data={contacts}
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

export default ContactDisplay;
