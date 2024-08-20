// Author - Pratik Sakaria (B00954261)
// Modified by - Zeel Ravalani (B00917373)
import React, { useState, useEffect, useRef } from "react";
import { Button } from 'react-bootstrap';
import "./RightNavBar.css";
import { CurrentUserDataContext } from '../../App';
import { useContext } from 'react';
import { checkUserAdminStatus } from '../../api/CommunityAnalysis'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RightNavBar({ community, navigate }) {
  const { currentUserData } = useContext(CurrentUserDataContext);
  const userId = currentUserData?.id;

  // State to manage if the overlay is open
  const [isOpen, setIsOpen] = useState(false);
  
  // Reference for the RightNavBar
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAnalysisClick = async () => {
    if (!userId) {
      toast.error("User is not authenticated.");
      return;
    }
    
    const onSuccess = (data) => {
      if (data.isAdmin) {
        navigate(`/community/${community._id}/analysis`);
      } else {
        toast.warn("This feature can only be accessed by community admin.");
      }
    };

    const onFailure = (error) => {
      console.error("Error checking admin status:", error);
      toast.error("An error occurred while checking admin status.");
    };

    checkUserAdminStatus(community._id, userId, onSuccess, onFailure);
  };

  // Function to toggle the overlay state
  const toggleOverlay = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar is always visible on larger screens */}
      <div className="right-nav">
        {community ? (
          <>
            <h4 className="right-nav-title">
              {community.community_name}
            </h4>
            <p className="right-nav-description">
              {community.community_desc}
            </p>

            <Button
              variant="primary"
              className="mt-3"
              onClick={() => navigate(`/create-blog-post?community_id=${community._id}`)}
            >
              Create Post
            </Button>

            <Button 
              onClick={handleAnalysisClick} 
              className="analysis-button"
            >
              Community Analysis
            </Button>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <ToastContainer className="custom-toast-container" />
      </div>

      {/* Overlay for small screens */}
      <div ref={navRef} className={`overlay ${isOpen ? "open" : ""}`}>
        {community ? (
          <>
            <h4 className="right-nav-title">
              {community.community_name}
            </h4>
            <p className="right-nav-description">
              {community.community_desc}
            </p>

            <Button
              variant="primary"
              className="mt-3"
              onClick={() => navigate(`/create-blog-post?community_id=${community._id}`)}
            >
              Create Post
            </Button>

            <Button 
              onClick={handleAnalysisClick} 
              className="analysis-button"
            >
              Community Analysis
            </Button>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <ToastContainer className="custom-toast-container" />
      </div>
      {!isOpen && (
        <button className="overlay-toggle-button" onClick={toggleOverlay}>
          ☰
        </button>
      )}
    </>
  );
}

export default RightNavBar;
