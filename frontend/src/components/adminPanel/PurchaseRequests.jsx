import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import DataTable from "react-data-table-component";
import { FaSyncAlt, FaCheckCircle, FaTimesCircle, FaEdit, FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import SkeletonCard from "./SkeletonCard";

const PurchaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [trackingPartner, setTrackingPartner] = useState("");
  const [awb, setAwb] = useState("");
  const [viewMore, setViewMore] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/get-purchase-requests");
      setRequests(res.data);
    } catch {
      console.error("Failed to fetch purchase requests");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.post(`/approve-purchase/${id}`);
      fetchRequests();
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    try {
      await axiosInstance.post(`/reject-purchase/${id}`);
      fetchRequests();
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const handleOrderStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.post(`/update-order-status/${id}`, { orderStatus: newStatus });
      fetchRequests();
      toast.success("Order status updated successfully");
    } catch (err) {
      console.error("Failed to update order status", err);
      toast.error("Failed to update order status");
    }
  };

  const openTrackingModal = (row) => {
    setSelectedRequest(row);
    setTrackingPartner(row.trackingPartner || "");
    setAwb(row.awb || "");
    setShowModal(true);
  };

  const handleSaveTracking = async () => {
    if (!trackingPartner || !awb) {
      toast.error("Please enter both Tracking Partner and AWB.");
      return;
    }
    try {
      await axiosInstance.post(`/update-tracking/${selectedRequest._id}`, { trackingPartner, awb });
      setShowModal(false);
      fetchRequests();
      toast.success("Tracking details updated and email sent to buyer.");
    } catch (err) {
      console.error("Failed to update tracking details", err);
    }
  };

  const openViewMore = (row) => {
    setSelectedRequest(row);
    setViewMore(true);
  };

  const columns = [
    { name: "Name", selector: row => row.buyerName, sortable: true },
    { name: "Phone", selector: row => row.phoneNumber, sortable: true },
    { name: "Price (₹)", selector: row => row.price, sortable: true },
    {
      name: "Order Status",
      selector: row => row.orderStatus || "Processing",
      cell: row => (
        <select className="border rounded px-2 py-1 text-sm"
          value={row.orderStatus}
          onChange={(e) => handleOrderStatusChange(row._id, e.target.value)}>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      )
    },
    {
      name: "Status",
      selector: row => row.status || "Pending",
      cell: row => (
        <span className={`font-semibold ${
          row.status === "Approved" ? "text-green-600" :
          row.status === "Rejected" ? "text-red-600" :
          "text-yellow-600"
        }`}>
          {row.status || "Pending"}
        </span>
      ),
    },
    {
      name: "More",
      cell: row => (
        <button onClick={() => openViewMore(row)} className="text-blue-600 hover:text-blue-800" title="View More">
          <FaEye size={20} />
        </button>
      )
    },
    {
      name: "Action",
      cell: row => (
        <div className="flex gap-2">
          {row.status !== "Approved" ? (
            <>
              <button onClick={() => handleApprove(row._id)} className="text-green-600 hover:text-green-800" title="Approve">
                <FaCheckCircle size={20} />
              </button>
              <button onClick={() => handleReject(row._id)} className="text-red-600 hover:text-red-800" title="Reject">
                <FaTimesCircle size={20} />
              </button>
            </>
          ) : (
            <button onClick={() => openTrackingModal(row)} className="text-blue-600 hover:text-blue-800" title="Edit Tracking Details">
              <FaEdit size={20} />
            </button>
          )}
        </div>
      ),
    }
  ];

  const customStyles = {
    rows: { style: { minHeight: '50px', paddingTop: '4px', paddingBottom: '4px' }},
    headCells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: '14px', fontWeight: '600', backgroundColor: '#f4f4f4' }},
    cells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: '14px', wordBreak: 'break-word' }},
  };

  return (
    <div className="flex min-h-screen justify-center p-2 bg-gray-100">
      <div className="w-full max-w-6xl bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Purchase Requests</h2>
          <button onClick={fetchRequests} className={`text-xl cursor-pointer text-black hover:text-black transition ${loading ? "animate-spin" : ""}`} title="Refresh">
            <FaSyncAlt />
          </button>
        </div>

        {initialLoading ? (
          <SkeletonCard lines={4} />
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={requests}
              pagination
              highlightOnHover
              responsive
              persistTableHead
              customStyles={customStyles}
            />
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md border-2">
            <h3 className="text-lg font-semibold mb-4">Update Tracking Details</h3>
            <div className="mb-4">
              <label className="block font-medium mb-1">Tracking Partner</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={trackingPartner} onChange={(e) => setTrackingPartner(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">AWB Number</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={awb} onChange={(e) => setAwb(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleSaveTracking} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* View More Modal */}
      {viewMore && selectedRequest && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg border-2">
            <h3 className="text-lg font-semibold mb-4">Purchase Details</h3>
            <p><strong>Buyer Name:</strong> {selectedRequest.buyerName}</p>
            <p><strong>Email:</strong> {selectedRequest.email}</p>
            <p><strong>Phone:</strong> {selectedRequest.phoneNumber}</p>
            <p><strong>Art Title:</strong> {selectedRequest.imageTitle}</p>
            <p><strong>Price:</strong> ₹{selectedRequest.price}</p>
            <p><strong>Transaction Date:</strong> {selectedRequest.transactionDate?.split("T")[0]}</p>
            <p><strong>Address:</strong> {selectedRequest.address} - {selectedRequest.pincode}</p>
            <p><strong>UPI:</strong> {selectedRequest.upiId}</p>
            <p><strong>Payment Screenshot:</strong> 
              <a href={selectedRequest.paymentScreenshot} target="_blank" rel="noreferrer" className="text-blue-600 underline ml-2">View</a>
            </p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setViewMore(false)} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequests;