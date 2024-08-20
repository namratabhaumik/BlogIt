//Author - Zeel Ravalani (B00917373)
import axios from "axios";
import { SERVER_HOST } from "./Config";

/**
 * Fetches user engagement metrics for a given community.
 *
 * @param {string} communityId - The ID of the community to fetch metrics for.
 * @param {Function} apiSuccessCb - Callback function to handle successful response.
 * @param {Function} apiFailureCb - Callback function to handle errors.
 * @author Zeel Ravalani
 */
export const getUserEngagementMetrics = async (communityId, apiSuccessCb, apiFailureCb) => {
    console.log(`Fetching user engagement metrics for communityId: ${communityId}`);
    
    try {
        const response = await axios.get(`${SERVER_HOST}/community_analysis/get_user_engagement_metrics/${communityId}`);
        console.log('User engagement metrics response:', response);
        apiSuccessCb(response);
    } catch (error) {
        console.error('Error fetching user engagement metrics:', error);
        apiFailureCb(error);
    }
}

/**
 * Fetches monthly blog and video posts data for a given community.
 *
 * @param {string} communityId - The ID of the community to fetch data for.
 * @param {Function} apiSuccessCb - Callback function to handle successful response.
 * @param {Function} apiFailureCb - Callback function to handle errors.
 * @author Zeel Ravalani
 */
export const getMonthlyBlogAndVideoPostsData = async (communityId, apiSuccessCb, apiFailureCb) => {
    console.log(`Fetching monthly blog and video posts data for communityId: ${communityId}`);
    
    try {
        const response = await axios.get(`${SERVER_HOST}/community_analysis/get_monthly_blog_and_video_posts_data/${communityId}`);
        console.log('Monthly blog and video posts data response:', response.data);
        apiSuccessCb(response.data);
    } catch (error) {
        console.error('Error fetching monthly blog and video posts data:', error);
        apiFailureCb(error);
    }
}

/**
 * Fetches monthly bookmarks data for a given community.
 *
 * @param {string} communityId - The ID of the community to fetch data for.
 * @param {Function} apiSuccessCb - Callback function to handle successful response.
 * @param {Function} apiFailureCb - Callback function to handle errors.
 * @author Zeel Ravalani
 */
export const getMonthlyBookmarksData = async (communityId, apiSuccessCb, apiFailureCb) => {
    console.log(`Fetching monthly bookmarks data for communityId: ${communityId}`);
    
    try {
        const response = await axios.get(`${SERVER_HOST}/community_analysis/get_monthly_bookmarks_data/${communityId}`);
        console.log('Monthly bookmarks data response:', response.data);
        apiSuccessCb(response.data);
    } catch (error) {
        console.error('Error fetching monthly bookmarks data:', error);
        apiFailureCb(error);
    }
}

/**
 * Fetches community posts sentiment for a given community.
 *
 * @param {string} communityId - The ID of the community to fetch sentiment for.
 * @param {Function} apiSuccessCb - Callback function to handle successful response.
 * @param {Function} apiFailureCb - Callback function to handle errors.
 * @author Zeel Ravalani
 */
export const getCommunityPostsSentiment = async (communityId, apiSuccessCb, apiFailureCb) => {
    console.log(`Fetching community posts sentiment for communityId: ${communityId}`);
    
    try {
        const response = await axios.get(`${SERVER_HOST}/community_analysis/get_community_posts_sentiment/${communityId}`);
        console.log('Community posts sentiment response:', response.data);
        apiSuccessCb(response.data);
    } catch (error) {
        console.error('Error fetching community posts sentiment:', error);
        apiFailureCb(error);
    }
}

/**
 * Fetches demographic insights for a given community.
 *
 * @param {string} communityId - The ID of the community to fetch demographic insights for.
 * @param {Function} apiSuccessCb - Callback function to handle successful response.
 * @param {Function} apiFailureCb - Callback function to handle errors.
 * @author Zeel Ravalani
 */
export const getDemographicInsights = async (communityId, apiSuccessCb, apiFailureCb) => {
    console.log(`Fetching demographic insights for communityId: ${communityId}`);
    
    try {
        const response = await axios.get(`${SERVER_HOST}/community_analysis/get_demographic_insights/${communityId}`);
        console.log('Demographic insights response:', response.data);
        apiSuccessCb(response.data);
    } catch (error) {
        console.error('Error fetching demographic insights:', error);
        apiFailureCb(error);
    }
}

/**
 * Checks if a user is an admin of a given community using the community details.
 *
 * @param {string} communityId - The ID of the community to check.
 * @param {string} userId - The ID of the user to check.
 * @param {Function} apiSuccessCb - Callback function to handle successful response.
 * @param {Function} apiFailureCb - Callback function to handle errors.
 * @author Zeel Ravalani
 */
export const checkUserAdminStatus = async (communityId, userId, apiSuccessCb, apiFailureCb) => {
    console.log(`Checking admin status for userId: ${userId} in communityId: ${communityId}`);
    
    try {
        // Fetch the community details
        const response = await axios.get(`${SERVER_HOST}/communities/${communityId}`);
        const community = response.data.community;
        
        // Check if the userId is in the admin list
        const isAdmin = community.admin.includes(userId);
        
        console.log('Admin status response:', { isAdmin });
        apiSuccessCb({ isAdmin });  // Pass the admin status to the success callback
    } catch (error) {
        console.error('Error checking admin status:', error);
        apiFailureCb(error);
    }
};

