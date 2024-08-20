// Author - Pratik Sakaria (B00954261)
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SearchResults.css';
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";
import Header from "../Navbar/Navbar";

const SearchResults = () => {
  const location = useLocation();
  const { results } = location.state || { results: null };

  if (!results) {
    return <div><h1>No results found</h1></div>;
  }
 
  return (
    <div> 
      <Header />
      <VerticalNavBar />
      <div className="search-results-container">
        <h1>Search Results</h1>
        {results.blog_posts.length > 0 && (
          <div className="results-section">
            <h2>Blog Posts</h2>
            {results.blog_posts.map(post => (
              <div key={post.blog_post_id} className="result-item">
                <h3>{post.title}</h3>
                <p className="post-content-preview">{post.content.slice(0, 150)}...</p>
                <Link to={`/blog/${post.blog_post_id}`} className="read-more-link">Read more</Link>
              </div>
            ))}
          </div>
        )}
        {results.communities.length > 0 && (
          <div className="results-section">
            <h2>Communities</h2>
            {results.communities.map(community => (
              <div key={community._id} className="result-item">
                <h3>{community.community_name}</h3>
                <p className="community-desc">{community.community_desc}</p>
                <Link to={`/community/${community._id}`} className="view-community-link">View Community</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
