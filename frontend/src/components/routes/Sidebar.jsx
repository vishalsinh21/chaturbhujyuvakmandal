import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaFileAlt,
  FaHome,
  FaList,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaCog,
  FaImage,
  FaPhotoVideo,
  FaQuestionCircle,
  FaEnvelope,
  FaStar,
  FaLock,
  FaMoneyBill,
  FaUser,
  FaTachometerAlt,
  FaVideoSlash,
  FaViadeo,
  FaUsers,
  FaPray,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      to: "/admin/dashboard",
    },
    {
      title: "General Settings",
      icon: <FaCog />,
      dropdownName: "general",
      links: [
        {
          to: "/admin/header-editor",
          label: "Header Editor",
          icon: <FaHome />,
        },
        {
          to: "/admin/footer-editor",
          label: "Footer Editor",
          icon: <FaList />,
        },
        { to: "/admin/logo-editor", label: "Logo Editor", icon: <FaFileAlt /> },
        { to: "/admin/social-editor", label: "Social Editor", icon: <FaCog /> },
      ],
    },
    {
      title: "Content Editors",
      icon: <FaImage />,
      dropdownName: "content",
      links: [
        {
          to: "/admin/about-editor",
          label: "About Editor",
          icon: <FaFileAlt />,
        },
        { to: "/admin/hero-editor", label: "Hero Editor", icon: <FaHome /> },
        {
          to: "/admin/gallery-editor",
          label: "Gallery Editor",
          icon: <FaPhotoVideo />,
        },
        {
          to: "/admin/faq-editor",
          label: "FAQ Editor",
          icon: <FaQuestionCircle />,
        },
        {
          to: "/admin/contact-list",
          label: "Contact List",
          icon: <FaEnvelope />,
        },
        { to: "/admin/review-display", label: "Reviews", icon: <FaStar /> },
      ],
    },
    {
      title: "Members",
      icon: <FaLock />,
      to: "/admin/member-editor",
    },

    {
      title: "Payments",
      icon: <FaMoneyBill />,
      to: "/admin/paymentqr-editor",
    },
    {
      title: "Donor List",
      icon: <FaUsers />, // Group/Users icon fits donors
      to: "/admin/donor-list-editor",
    },
    {
      title: "Live Aarti",
      icon: <FaPray />, // Prayer icon fits live aarti
      to: "/admin/live-aarti-editor",
    },
     {
      title: "Aarti Timings",
      icon: <FaClock />, // Prayer icon fits live aarti
      to: "/admin/aarti-timing-editor",
    },
    {
      title: "Change Password",
      icon: <FaLock />,
      to: "/admin/change-password",
    },
    // {
    //   title: "Account Settings",
    //   icon: <FaUser />,
    //   dropdownName: "account",
    //   links: [
    //     { to: "/admin/change-password", label: "Change Password", icon: <FaLock /> }
    //   ]
    // }
  ];

  const getInitialOpenDropdown = () => {
    for (let item of menu) {
      if (
        item.links &&
        item.links.some((link) => link.to === location.pathname)
      ) {
        return item.dropdownName;
      }
    }
    return "";
  };

  const [openDropdown, setOpenDropdown] = useState(getInitialOpenDropdown);

  useEffect(() => {
    setOpenDropdown(getInitialOpenDropdown());
  }, [location]);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? "" : dropdownName);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/admin");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded transition duration-200 
     ${
       isActive
         ? "bg-gray-700 font-semibold text-white"
         : "hover:bg-gray-700 text-gray-300"
     }`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white flex items-center justify-between p-2 z-50 shadow-md">
        <button onClick={toggleSidebar} className="text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 sm:hidden z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 max-h-full w-64 bg-gray-900 text-white p-5 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0 sm:relative sm:block overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button className="sm:hidden text-2xl" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {menu.map(({ title, icon, to, dropdownName, links }) => (
            <div key={dropdownName || to}>
              {to ? (
                // Direct link (no dropdown)
                <NavLink to={to} className={navLinkClass}>
                  {icon} {title}
                </NavLink>
              ) : (
                // Dropdown section
                <>
                  <button
                    onClick={() => toggleDropdown(dropdownName)}
                    className="flex justify-between items-center w-full px-4 py-2 rounded hover:bg-gray-700 transition"
                  >
                    <span className="flex items-center gap-2">
                      {icon} {title}
                    </span>
                    {openDropdown === dropdownName ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>

                  {openDropdown === dropdownName && (
                    <div className="ml-6 flex flex-col gap-1 mt-1">
                      {links.map(({ to, label, icon }) => (
                        <NavLink key={to} to={to} className={navLinkClass}>
                          {icon} {label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
