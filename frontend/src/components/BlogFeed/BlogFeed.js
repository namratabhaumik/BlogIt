// Author - 
// Modified by - Pratik Sakaria (B00954261)
import React, { useEffect, useState } from 'react';
import BlogFeedItem from "./BlogFeedItem";
import "./BlogFeed.css";
import axios from 'axios';
import { SERVER_HOST } from '../../api/Config';

function BlogFeed({ communityId, handleBookmarkToggle }) {
  const [blogItems, setBlogItems] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${SERVER_HOST}/blogs/get/all`, {
          params: { community_id: communityId }
        });
        setBlogItems(response.data.blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, [communityId]);

  return (
    <div className="blog-feed-container">
      {blogItems.map((post) => (
        <BlogFeedItem
          key={post._id}
          post={post}
          handleBookmarkToggle={handleBookmarkToggle}
        />
      ))}
    </div>
  );
}

export default BlogFeed;
