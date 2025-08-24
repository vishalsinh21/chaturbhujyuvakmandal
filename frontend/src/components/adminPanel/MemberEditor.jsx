import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const MemberEditor = () => {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [memberType, setMemberType] = useState("Member"); // ✅ new
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/members");
      setMembers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle add/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("position", position);
      formData.append("memberType", memberType); // ✅ append memberType
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("bio", bio);
      if (image) formData.append("memberPhoto", image);

      if (editId) {
        await axiosInstance.put(`/updatemembers/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Member updated");
      } else {
        await axiosInstance.post("/savemembers", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Member added");
      }

      resetForm();
      fetchMembers();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  // Handle edit
  const handleEdit = (member) => {
    setName(member.name);
    setPosition(member.position);
    setMemberType(member.memberType || "Member"); // ✅ set memberType
    setPhone(member.phone);
    setEmail(member.email);
    setAddress(member.address);
    setBio(member.bio);
    setEditId(member._id); // ✅ use MongoDB _id
    setPreview(member.image || null);
    setImage(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axiosInstance.delete(`/deletemembers/${id}`);
      toast.success("Member deleted");
      fetchMembers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete member");
    }
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setPosition("");
    setMemberType("Member"); // ✅ reset memberType
    setPhone("");
    setEmail("");
    setAddress("");
    setBio("");
    setImage(null);
    setPreview(null);
    setEditId(null);
  };

  return (
    <div className="flex items-center bg-gray-100 justify-center px-4 min-h-screen">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-2xl p-8 my-20">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Member Editor
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Position"
                  className="w-full px-4 py-2 border rounded-lg"
                />

                {/* Member Type */}
                <select
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Member">Member</option>
                  <option value="Bal Yuvak Mandal">Bal Yuvak Mandal</option>
                </select>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bio"
                  className="w-full px-4 py-2 border rounded-lg h-24"
                ></textarea>

                {/* Image upload */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="mt-2 h-24 w-24 object-cover rounded-full border"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-black text-white font-semibold py-2 rounded-lg transition duration-300 cursor-pointer"
              >
                {editId ? "Update Member" : "Add Member"}
              </button>
            </form>

            {/* List */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Member List
              </h3>
              {members.length === 0 && (
                <p className="text-gray-500 text-center">No members found.</p>
              )}
              <ul className="space-y-4">
                {members.map((member) => (
                  <li
                    key={member._id}
                    className="flex justify-between items-center border p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-12 w-12 rounded-full object-cover border"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-gray-500">
                          {member.position} • {member.memberType} • {member.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberEditor;
