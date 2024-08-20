//Author - Zeel Ravalani (B00917373)
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import { LineChart, AreaChart, XAxis, YAxis, Tooltip, Legend, Line, Area, ResponsiveContainer } from 'recharts';
import { FaBookmark, FaFileVideo } from 'react-icons/fa';
import { getUserEngagementMetrics, getMonthlyBlogAndVideoPostsData, getMonthlyBookmarksData } from '../../api/CommunityAnalysis'; 

/**
 * Component to display user engagement metrics including blog posts, video posts, and bookmarks.
 * It also shows trends in engagement over time with charts.
 * 
 * @component
 * @param {Object} props - React component props
 * @param {string} props.communityId - ID of the community to fetch metrics for
 * @author Zeel Ravalani
 */
const UserEngagementMetrics = ({ communityId }) => {

  // Custom labels for different analytics metrics
  const customLabels = {
    blog_posts_count: 'Total Blog Posts',
    video_posts_count: 'Total Video Posts',
    total_bookmarks_count: 'Total Bookmarks',
  };

  // State for storing analytics data
  const [analytics, setAnalytics] = useState({
    blog_posts_count: 0,
    video_posts_count: 0,
    total_bookmarks_count: 0,
  });

  // State for storing chart data
  const [charts, setCharts] = useState({
    blogAndVideoPostsData: [],
    bookmarksData: [],
  });

  useEffect(() => {
    
    /**
     * Fetches user engagement metrics and updates the state with the response data.
     * 
     * @param {Function} successCallback - Callback function for successful response
     * @param {Function} errorCallback - Callback function for error response
     */
    getUserEngagementMetrics(communityId, (response) => {
      const data = response.data;
      setAnalytics({
        blog_posts_count: data.blog_posts_count || 0,
        video_posts_count: data.video_posts_count || 0,
        total_bookmarks_count: data.total_bookmarks_count || 0,
      });
    }, (error) => {
      console.error('Error fetching user engagement metrics:', error);
    });

    /**
     * Fetches monthly blog and video posts data and updates the state with the response data.
     * 
     * @param {Function} successCallback - Callback function for successful response
     * @param {Function} errorCallback - Callback function for error response
     */
    getMonthlyBlogAndVideoPostsData(communityId, (response) => {
      const data = response.data;
      setCharts(prevCharts => ({
        ...prevCharts,
        blogAndVideoPostsData: data || [],
      }));
    }, (error) => {
      console.error('Error fetching monthly blog and video posts data:', error);
    });

    /**
     * Fetches monthly bookmarks data and updates the state with the response data.
     * 
     * @param {Function} successCallback - Callback function for successful response
     * @param {Function} errorCallback - Callback function for error response
     */
    getMonthlyBookmarksData(communityId, (response) => {
      const data = response.data;
      setCharts(prevCharts => ({
        ...prevCharts,
        bookmarksData: data || [],
      }));
    }, (error) => {
      console.error('Error fetching monthly bookmarks data:', error);
    });
  }, [communityId]); // Re-run the effect when communityId changes

  return (
    <div style={{ marginTop:'20px'}}>
      <Grid container spacing={2}>
        {Object.entries(analytics).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={key}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {key === 'blog_posts_count' && <EmailIcon sx={{ marginRight: '0.5rem' }} />}
                  {key === 'video_posts_count' && <FaFileVideo sx={{ marginRight: '0.5rem' }} />}
                  {key === 'total_bookmarks_count' && <FaBookmark sx={{ marginRight: '0.5rem' }} />}
                  {value}
                </Typography>
                <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                {customLabels[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div style={{ padding: 20, width: '100%', overflowX: 'auto' }}>
      <h2>Engagement Trends: Blog Posts vs. Video Posts</h2>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={charts.blogAndVideoPostsData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="blog_posts_count" stroke="#00ad1c" name="Blog Posts" />
            <Line type="monotone" dataKey="video_posts_count" stroke="#ff0000" name="Video Posts" />
          </LineChart>
        </ResponsiveContainer>

        <h2>Content Amplification: Bookmarks Count Analysis</h2>
        <ResponsiveContainer width="100%" height={500}>
          <AreaChart data={charts.bookmarksData}>
            <XAxis dataKey="month"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="bookmarks" stroke="#8e5402" fill="#FF9800" name="Bookmarks" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserEngagementMetrics;
