import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FaBars, FaTimes } from "react-icons/fa";

const HeaderSkeleton = () => (
  <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-full">
    <div className="w-full flex justify-between items-center py-4 px-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 bg-gray-300 rounded"></div>
        <div className="h-8 w-32 bg-gray-300 rounded"></div>
      </div>
      <nav className="hidden md:flex gap-10">
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
      </nav>
      <div className="md:hidden">
        <div className="h-7 w-7 bg-gray-300 rounded"></div>
      </div>
    </div>
  </header>
);

const HeaderDisplay = () => {
  const [data, setData] = useState({ logos: [], headers: [] });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get current path

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/get-header-logos");
      setData(res.data);
    } catch {
      console.error("Failed to fetch header data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname === "/review") {
      setActiveSection("/review");
      return; // don't apply scroll detection when on /review page
    }

    const handleScroll = () => {
      let found = false;
      for (let header of data.headers) {
        const sectionId = header.link.replace("#", "");
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(header.link);
            found = true;
            break;
          }
        }
      }
      if (!found) {
        setActiveSection("#home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data, location.pathname]);

  if (loading) {
    return <HeaderSkeleton />;
  }

  function getLinkForMobile(link) {
    if (link.startsWith("/")) {
      // example: "/about" => "#about"
      return "#" + link.slice(1);
    } else if (link.startsWith("#")) {
      // ensure absolute hash navigation to root
      return "/" + link;
    } else {
      // external link, leave untouched
      return link;
    }
  }

  const latestLogo = data.logos.length > 0 ? data.logos[0].imageUrl : null;

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-full">
      <div className="w-full flex justify-between items-center py-4 px-6">
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          {latestLogo && (
            <img src={latestLogo} alt="Logo" className="h-14 object-contain" />
          )}
          <span
            className="font-bold text-2xl text-gray-800 select-none"
            onCopy={(e) => e.preventDefault()}
          >
            Chaturbhuj Yuvak Mandal
          </span>
        </a>

        <nav className="hidden md:flex gap-10">
          {data.headers.map((header) => {
            const isActive =
              (!header.link.startsWith("#") &&
                location.pathname === header.link) ||
              (header.link.startsWith("#") && activeSection === header.link);

            return (
              <a
                key={header._id}
                href={header.link} // don't prepend '/'
                onClick={(e) => {
                  if (header.link.startsWith("#")) {
                    e.preventDefault();
                    const section = document.querySelector(header.link);
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                    setActiveSection(header.link);
                  }
                }}
                className={`relative text-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "text-black after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-black"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {header.title}
              </a>
            );
          })}
        </nav>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4">
          {data.headers.map((header) => {
            const hrefValue = getLinkForMobile(header.link);
            return (
              <a
                key={header._id}
                href={hrefValue}
                className={`block py-3 text-lg font-medium ${
                  activeSection === header.link
                    ? "text-black underline"
                    : "text-gray-700 hover:text-black"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {header.title}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default HeaderDisplay;
