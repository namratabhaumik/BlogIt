// Author - Namrata Bhaumik (B00957053)
import React, { useContext } from "react";
import BlogFeedItem from "../BlogFeed/BlogFeedItem";
import "./BookmarksPage.css";
import { BookmarkContext } from "../../context/BookmarkContext";
import AppNavbar from "../Navbar/Navbar";
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";

function BookmarksPage() {
  const { bookmarkedPosts, handleBookmarkToggle } = useContext(BookmarkContext);

  const normalizeId = (post) => post._id || post.blog_post_id;

  return (
    <div>
      <AppNavbar />
      <VerticalNavBar />
      <div className="bookmarks-content">
        {bookmarkedPosts.length > 0 ? (
          bookmarkedPosts.map((post) => {
            return (
              <BlogFeedItem
                key={normalizeId(post)}
                post={post}
                handleBookmarkToggle={handleBookmarkToggle}
              />
            );
          })
        ) : (
          <p className="no-bookmarks">No bookmarks yet.</p>
        )}
      </div>
    </div>
  );
}

export default BookmarksPage;
