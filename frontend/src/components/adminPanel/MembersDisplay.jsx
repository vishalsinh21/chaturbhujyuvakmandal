import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Header from "../landingPage/Header";
import Footer from "../landingPage/Footer";

const MemberSkeleton = () => (
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white shadow-lg p-4 rounded-lg animate-pulse flex flex-col items-center"
      >
        <div className="w-40 h-40 bg-gray-300 rounded-full mb-4"></div>
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4 mx-auto"></div>
        <div className="h-5 bg-gray-300 rounded mb-4 w-1/2 mx-auto"></div>
      </div>
    ))}
  </div>
);

const MembersDisplay = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [memberTypeFilter, setMemberTypeFilter] = useState("All");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get("/members");
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch members", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Filter members by memberType
  const filteredMembers = members.filter(
    (m) => memberTypeFilter === "All" || m.memberType === memberTypeFilter
  );

  const displayedMembers = showAll
    ? filteredMembers
    : filteredMembers.slice(0, 6);

  return (
    <>
      <Header />

      <section className="pt-28 pb-16 px-4 bg-gradient-to-tr from-orange-200 via-orange-100 to-orange-100 min-h-[70vh]">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Our Members</h2>
          <p className="text-gray-600 mt-2">
            Meet the people behind our mission
          </p>
        </div>

        {/* Member Type Filter */}
        <div className="max-w-6xl mx-auto mb-6 flex justify-center gap-4">
          {["All", "Member", "Bal Yuvak Mandal"].map((type) => (
            <button
              key={type}
              onClick={() => setMemberTypeFilter(type)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                memberTypeFilter === type
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <MemberSkeleton />
        ) : filteredMembers.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-lg text-gray-500 font-medium">
              No members found for "{memberTypeFilter}".
            </p>
          </div>
        ) : (
          <>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedMembers.map((member) => (
                <div
                  key={member._id}
                  className="bg-white shadow-lg p-6 flex flex-col items-center rounded-lg transition-transform hover:scale-105 duration-300"
                >
                  <img
                    src={member.image || "/default-avatar.png"}
                    alt={member.name}
                    className="w-40 h-40 object-cover rounded-full mb-4"
                    loading="lazy"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500 italic mb-2">
                    {member.position}
                  </p>

                  {/* Member Type Badge */}
                  {member.memberType && (
                    <span
                      className={`text-xs font-medium px-2 py-1 mb-2 rounded-full ${
                        member.memberType === "Bal Yuvak Mandal"
                          ? "bg-orange-200 text-orange-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {member.memberType}
                    </span>
                  )}
                  {member.phone && (
                    <p className="text-sm text-gray-600 mb-1">
                      📞 {member.phone}
                    </p>
                  )}
                  {member.email && (
                    <p className="text-sm text-gray-600 mb-1">
                      ✉️ {member.email}
                    </p>
                  )}
                  {member.address && (
                    <p className="text-sm text-gray-600 text-center">
                      🏠 {member.address}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!showAll && filteredMembers.length > 6 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-lg rounded-lg shadow-md hover:scale-105 transition"
                >
                  View More
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </>
  );
};

export default MembersDisplay;
