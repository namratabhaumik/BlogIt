// Author - Pratik Sakaria (B00954261)
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import './CommunityPage.css';
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";
import Header from "../Navbar/Navbar";
import CreateCommunityForm from './CreateCommunityForm';
import BlogFeed from '../BlogFeed/BlogFeed'; // Import BlogFeed component
import axios from 'axios';
import { SERVER_HOST } from '../../api/Config';

const CommunityPage = () => {
  const { communityId } = useParams(); // Use params to get the communityId
  const [communities, setCommunities] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assume the user ID is stored in localStorage
      const response = await axios.get(`${SERVER_HOST}/communities/user/${userId}`);
      setCommunities(response.data.communities);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  return (
    <div> 
      <Header />
      <VerticalNavBar />
      <Container className="community-page-container">
        <h3 className="text-center mb-4 community-title">Communities</h3>
        <Row>
          {communities.map((community) => (
            <Col key={community._id} sm={12} md={6} lg={4} className="mb-4">
              <Card onClick={() => navigate(`/community/${community._id}`)} className="community-card">
                <Card.Body>
                  <Card.Title>{community.community_name}</Card.Title>
                  <Card.Text>{community.community_desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center">
          <Button onClick={() => setShowCreateForm(true)} className="create-community-button">
            <FontAwesomeIcon icon={faPlusCircle} /> Create Community
          </Button>
        </div>
        <Modal show={showCreateForm} onHide={() => setShowCreateForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Community</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateCommunityForm 
              onClose={() => {
                setShowCreateForm(false);
                fetchCommunities(); // Refresh the community list
              }} 
            />
          </Modal.Body>
        </Modal>
        
        {communityId && (
          <div className="mt-4">
            <h4>Posts in {communities.find(c => c._id === communityId)?.community_name}</h4>
            <BlogFeed communityId={communityId} />
          </div>
        )}
      </Container>
    </div>
  );
};

export default CommunityPage;
