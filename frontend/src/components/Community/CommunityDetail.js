// Author - Pratik Sakaria (B00954261)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap'; // Ensure Button is imported
import './CommunityDetail.css';
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";
import Header from "../Navbar/Navbar";
import BlogFeed from '../BlogFeed/BlogFeed';
import axios from 'axios';
import RightNavBar from '../VerticalNavBar/RightNavBar'; // Import the RightNavBar component
import { SERVER_HOST } from '../../api/Config';

const CommunityDetail = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunityDetails(communityId);
  }, [communityId]);

  const fetchCommunityDetails = async (id) => {
    try {
      const response = await axios.get(`${SERVER_HOST}/communities/${id}`);
      console.log('Community details response:', response);
      setCommunity(response.data.community);
    } catch (error) {
      console.error('Error fetching community details:', error);
    }
  };

  return (
    <div> 
      <Header />
      <VerticalNavBar />
      <RightNavBar community={community} navigate={navigate} />
      <Container className="community-detail-container">
        {community ? (
          <>
            <div className="mt-4">
              <h4>Posts in {community.community_name}</h4>
              <BlogFeed communityId={communityId} />
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </div>
  );
};

export default CommunityDetail;
