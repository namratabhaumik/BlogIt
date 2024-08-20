//Author - Zeel Ravalani (B00917373)
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDemographicInsights } from '../../api/CommunityAnalysis';

/**
 * Component to display demographic insights of a community, including location distribution by continent
 * and pronouns distribution. It also handles loading and error states.
 * 
 * @component
 * @param {Object} props - React component props
 * @param {string} props.communityId - ID of the community to fetch demographic data for
 * @author Zeel Ravalani
 */
const DemographicInsights = ({ communityId }) => {

  // State for storing demographic data
  const [data, setData] = useState({
    locationDistribution: [],
    pronounsDistribution: []
  });

   // State for loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    /**
     * Fetches demographic insights data for the community and updates the state with the response data.
     * 
     * @param {Function} successCallback - Callback function for successful response
     * @param {Function} errorCallback - Callback function for error response
     */
    getDemographicInsights(communityId, (response) => {
      const { data } = response;
      console.log("demographicsData:", data);
      
      setData({
        locationDistribution: data.locationDistribution || [],
        pronounsDistribution: data.pronounsDistribution || [],
      });
      setLoading(false);
    }, (error) => {
      console.error('Error fetching community posts sentiment:', error);
      setLoading(false);
    });
  }, [communityId]);// Re-run the effect when communityId changes

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  // Ensure data is not empty
  const hasLocationData = data.locationDistribution.length > 0;
  const hasPronounsData = data.pronounsDistribution.length > 0;

  return (
    <Container style={{ marginTop:'20px'}}>
      <h2>Demographic Insights</h2>
      <Grid container spacing={5}>
        {/* Location Distribution by Continent */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">Location Distribution by Continent</Typography>
              <ResponsiveContainer width="100%" height={400}>
                {hasLocationData ? (
                  <RadarChart cx="50%" cy="50%" outerRadius="90%" data={data.locationDistribution}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="location" />
                    <PolarRadiusAxis angle={25} domain={[0, 20]} />
                    <Radar name="Users" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                ) : (
                  <Typography>No location data available</Typography>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pronouns Distribution */}
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">Pronouns Distribution</Typography>
              <ResponsiveContainer width="100%" height={400}>
                {hasPronounsData ? (
                  <PieChart>
                    <Pie
                      data={data.pronounsDistribution}
                      dataKey="count"
                      nameKey="pronouns"
                      cx="50%"
                      cy="50%"
                      outerRadius={180}
                      fill="#82ca9d"
                      label
                    >
                      {data.pronounsDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <Typography>No pronouns data available</Typography>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DemographicInsights;
