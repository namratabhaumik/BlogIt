// Author -
// Modified by - Zeel Ravalani (B00917373)
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./VerticalNavBar.css";
import "bootstrap/dist/css/bootstrap.min.css";

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
}

function VerticalNavBar() {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [showFloatingButton, setShowFloatingButton] = useState(window.innerWidth <= 768);
  const navRef = useRef(null);

  useOutsideClick(navRef, () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
      setShowFloatingButton(true);
    }
  });

  const toggleNavBar = () => {
    setIsOpen(!isOpen);
    setShowFloatingButton(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth > 768;
      setIsOpen(isLargeScreen);
      setShowFloatingButton(!isLargeScreen);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {showFloatingButton && (
        <button className="floating-button" onClick={toggleNavBar}>
          ☰
        </button>
      )}
      <div
        ref={navRef}
        className={`vertical-nav custom-bg ${isOpen ? "open" : ""}`}
      >
        <Link to="/videos" className="nav-link custom-text">
          Videos
        </Link>
        <Link to="/contact" className="nav-link custom-text">
          Contact Us
        </Link>
        <Link to="/faq" className="nav-link custom-text">
          FAQ
        </Link>
        <Link to="/bookmarks" className="nav-link custom-text">
          Bookmarks
        </Link>
        <Link to="/tags" className="nav-link custom-text">
          Tags
        </Link>
        <Link to="/community" className="nav-link custom-text">
          Community
        </Link>
      </div>
    </>
  );
}

export default VerticalNavBar;
