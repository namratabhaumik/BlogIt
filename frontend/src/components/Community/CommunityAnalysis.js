//Author - Zeel Ravalani (B00917373)
import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";
import Header from "../Navbar/Navbar";
import UserEngagementMetrics from './UserEngagementMetrics'; // Ensure the path is correct
import SentimentAnalysis from './SentimentAnalysis'; // Ensure the path is correct
import DemographicInsights from './DemographicInsights'; // Ensure the path is correct
import './CommunityAnalysis.css';

/**
 * CommunityAnalysis Component
 *
 * This component renders the analysis sections for the community,
 * including user engagement metrics, sentiment analysis, and demographic insights.
 * It uses tabs to switch between different analysis sections and
 * passes the communityId from the URL to child components.
 *
 * @component
 * @returns {JSX.Element} The rendered CommunityAnalysis component
 * @author Zeel Ravalani
 */
const CommunityAnalysis = () => {

  // Extract communityId from the URL parameters
  const { communityId } = useParams(); // Extract communityId from URL
  console.log("CommunityAnalysis useParams communityId: " + communityId)

  return (
    <div>
      <Header />
      <VerticalNavBar />
      <Container className="community-analysis-container">
        <h2>Community Analysis</h2>
        <Tabs
          defaultActiveKey="user-engagement"
          id="justify-tab-example"
          className="mb-6 custom-tabs"
          justify
        >
          <Tab eventKey="user-engagement" title="User Engagement Metrics">
            <UserEngagementMetrics communityId={communityId} /> {/* Pass communityId as a prop */}
          </Tab>
          <Tab eventKey="sentiment-analysis" title="Sentiment Analysis">
            <SentimentAnalysis communityId={communityId} />
          </Tab>
          <Tab eventKey="demographic-insights" title="Demographic Insights">
            <DemographicInsights communityId={communityId} />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default CommunityAnalysis;
