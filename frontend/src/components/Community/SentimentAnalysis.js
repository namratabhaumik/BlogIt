//Author - Zeel Ravalani (B00917373)
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCommunityPostsSentiment } from '../../api/CommunityAnalysis'; 

/**
 * Component to display sentiment analysis of community posts including an overall sentiment score
 * and a trend chart showing sentiment over time.
 * 
 * @component
 * @param {Object} props - React component props
 * @param {string} props.communityId - ID of the community to fetch sentiment data for
 * @author Zeel Ravalani
 */
const SentimentAnalysis = ({ communityId }) => {

  // State for storing sentiment analysis data
  const [data, setData] = useState({
    overallScore: 0,
    trendData: [],
  });

  useEffect(() => {

    /**
     * Fetches sentiment analysis data for the community and updates the state with the response data.
     * 
     * @param {Function} successCallback - Callback function for successful response
     * @param {Function} errorCallback - Callback function for error response
     */
    getCommunityPostsSentiment(communityId, (response) => {
      const sentimentData = response.data;
      setData({
        overallScore: sentimentData.overallScore || 0,
        trendData: sentimentData.trendData || [],
      });
    }, (error) => {
      console.error('Error fetching community posts sentiment:', error);
    });
  }, [communityId]);  // Re-run the effect when communityId changes

  return (
    <div style={{ marginTop:'20px'}}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                Overall Sentiment Score
              </Typography>
              <Typography variant="h2" component="div" color="primary">
                {data.overallScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.overallScore >= 8 && <SentimentVerySatisfiedIcon fontSize="large" />}
                {data.overallScore >= 6 && data.overallScore < 8 && <SentimentSatisfiedIcon fontSize="large" />}
                {data.overallScore >= 4 && data.overallScore < 6 && <SentimentNeutralIcon fontSize="large" />}
                {data.overallScore >= 2 && data.overallScore < 4 && <SentimentDissatisfiedIcon fontSize="large" />}
                {data.overallScore < 2 && <SentimentVeryDissatisfiedIcon fontSize="large" />}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <div style={{ padding: 20, width: '100%', overflowX: 'auto' }}>
        <h2>Sentiment Trend Analysis</h2>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data.trendData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="positive" stroke="#00C49F" name="Positive" />
            <Line type="monotone" dataKey="negative" stroke="#FF0000" name="Negative" />
            <Line type="monotone" dataKey="neutral" stroke="#FFC658" name="Neutral" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
