import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";

const FooterDisplay = () => {
  const [footer, setFooter] = useState(null);
  const [socialIcons, setSocialIcons] = useState([]);

  const fetchFooter = async () => {
    try {
      const [footerRes, socialRes] = await Promise.all([
        axiosInstance.get("/getfooter"),
        axiosInstance.get("/get-social-icons")
      ]);

      if (footerRes.data.length > 0) {
        setFooter(footerRes.data[0]);
      }
      setSocialIcons(socialRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  if (!footer) {
    return null;
  }

  const getIcon = (logo) => {
    switch (logo) {
      case "FaFacebook":
        return <FaFacebookF />;
      case "FaInstagram":
        return <FaInstagram />;
      case "FaTwitter":
        return <FaTwitter />;
      case "FaLinkedin":
        return <FaLinkedin />;
      case "FaYoutube":
        return <FaYoutube />;
      default:
        return null;
    }
  };

  return (
    <footer
      className="relative text-white py-12 bg-cover bg-center"
      style={{
        backgroundImage: `url("/ganesh.jpg")`, // 👈 replace with your Ganpati photo path
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & Brand */}
        <div>
          <h2 className="text-3xl font-bold mb-4">Chaturbhuj Yuvak Mandal</h2>
          <p className="text-gray-300">
            In the blessings of Bappa, we find strength, service, and togetherness.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3">
            {footer.quickLinks?.map((ql, index) => (
              <li key={index}>
                <a
                  href={ql.link}
                  className="text-gray-300 hover:text-white transition"
                >
                  {ql.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info with Social Icons */}
        <div className="flex flex-col justify-between">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
            <p className="text-gray-300">Email: {footer.email}</p>
            <p className="text-gray-300">Phone: {footer.phone}</p>

            <div className="mt-4">
              <p className="text-gray-300 font-medium mb-2">Follow us on:</p>
              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white text-xl transition"
                  >
                    {getIcon(social.logo)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm text-center md:text-right">
            © {new Date().getFullYear()} {footer.copyright}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterDisplay;
