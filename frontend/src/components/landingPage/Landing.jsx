import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import HeaderDisplay from './Header';
import HeroDisplay from './Hero';
import About from './About';
import ReviewDisplay from './Reviews';

import LogoEditor from '../adminPanel/LogoEditor';
import FAQDisplay from './FAQ';
import ContactForm from './ContactForm';
import FooterDisplay from './Footer';
import AartiTimingsDisplay from "../landingPage/AartiTimingsDisplay";




const Landing = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div>
      <HeaderDisplay />
      <HeroDisplay />
      <About />
      <AartiTimingsDisplay />
      <ReviewDisplay />
      <FAQDisplay />
      <ContactForm />
      <FooterDisplay />

      {showTopBtn && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-purple-500 text-white p-3 rounded-full shadow-lg transition hover:bg-purple-700 z-50"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Landing;