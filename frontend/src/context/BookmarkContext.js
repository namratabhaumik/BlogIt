// Author - Namrata Bhaumik (B00957053)
import React, { createContext, useState, useContext, useEffect } from "react";
import { addBookmark, removeBookmark, getUserBookmarks } from "../api/Bookmark";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../App";

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const normalizeId = (item) => item._id || item.blog_post_id;

  useEffect(() => {
    if (currentUser) {
      // Fetch bookmarks when user logs in
      getUserBookmarks(
        currentUser.uid,
        (response) => {
          setBookmarkedPosts(response.data.bookmarks);
        },
        (error) => {
          console.error("Error fetching bookmarks:", error);
        }
      );
    } else {
      // Clear bookmarks when user logs out
      setBookmarkedPosts([]);
    }
  }, [currentUser]);

  const handleBookmarkToggle = async (post) => {
    if (!currentUser) {
      console.log("No user logged in, redirecting to login...");
      navigate("/login");
      return;
    }

    const userId = currentUser.uid;
    const isBookmarked = bookmarkedPosts.some((item) => {
      return normalizeId(item) === normalizeId(post);
    });

    const action = isBookmarked ? removeBookmark : addBookmark;

    await action(
      userId,
      normalizeId(post),
      () => {
        if (isBookmarked) {
          setBookmarkedPosts(
            bookmarkedPosts.filter(
              (item) => normalizeId(item) !== normalizeId(post)
            )
          );
        } else {
          setBookmarkedPosts([...bookmarkedPosts, post]);
        }
      },
      (error) => {
        console.error("Error toggling bookmark:", error);
      }
    );
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkedPosts, handleBookmarkToggle }}>
      {children}
    </BookmarkContext.Provider>
  );
};
