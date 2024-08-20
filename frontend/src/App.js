import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import ContactUs from "./components/ContactUs/ContactUs";
import VideoFeed from "./components/VideoFeed/VideoFeed";
import ComposeBlog from "./components/ComposeBlog/ComposeBlogPost";
import Home from "./components/Home/Home";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import UserProfile from "./components/UserProfile/UserProfile";
import Settings from "./components/Settings/Settings";
import BookmarksPage from "./components/BookmarksPage/BookmarksPage";
import BlogPost from "./components/BlogFeed/BlogPost";
import Faq from "./components/Faq/Faq";
import ForgotPassword from "./components/Login/ForgotPassword";
import Tags from "./components/Tags/Tags";
import VideoPost from "./components/VideoFeed/VideoPost";
import ComposeVideo from "./components/ComposeVideo/ComposeVideoPost";
import CommunityPage from "./components/Community/CommunityPage";
import CommunityDetail from "./components/Community/CommunityDetail";
import CommunityAnalysis from "./components/Community/CommunityAnalysis";
import { createContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import AccountAction from "./components/Auth/AccountAction";
import { getUserData } from "./api/User";
import { BookmarkProvider } from "./context/BookmarkContext";
import SearchResults from "./components/Navbar/SearchResults";

export const CurrentUserContext = createContext(null);
export const CurrentUserDataContext = createContext(null);

export function updateCurrentUserData(currentUser, setCurrentUserData) {
  const getUserSuccess = (response) => {
    console.log(response);
    setCurrentUserData(response.data);
    localStorage.setItem("logged_in_user_data", JSON.stringify(response.data));
  };

  const getUserError = (error) => {
    console.log(error);
  };

  if (currentUser !== null) {
    getUserData(currentUser.uid, getUserSuccess, getUserError);
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem('logged_in_user') !== null
  );
  const [currentUserData, setCurrentUserData] = useState(
    () => localStorage.getItem('logged_in_user_data') !== null
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User still logged in");
        console.log(user);
        setCurrentUser(user);
        updateCurrentUserData(user, setCurrentUserData);
        localStorage.setItem("logged_in_user", JSON.stringify(user));
      } else {
        setCurrentUser(null);
        setCurrentUserData(null);
        localStorage.setItem("logged_in_user", null);
        localStorage.setItem("logged_in_user_data", null);
      }
    });
  }, []);

  useEffect(() => {
    updateCurrentUserData(currentUser, setCurrentUserData);
  }, [currentUser]);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      <CurrentUserDataContext.Provider
        value={{
          currentUserData,
          setCurrentUserData,
        }}
      >
        <BrowserRouter>
          <BookmarkProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/signup" element={<Signup />} />
              {/* User profiles can be accessed from /:username. Similar to dev.to */}
              <Route path="/user/:username" element={<UserProfile />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/videos" element={<VideoFeed />} />
              <Route path="/videos/:id" element={<VideoPost />} />
              <Route path="/create-blog-post" element={<ComposeBlog />} />
              <Route path="/create-video-post" element={<ComposeVideo />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route
                path="/contact"
                element={
                  currentUserData === null ? (
                    <Navigate to="/login" />
                  ) : (
                    <ContactUs />
                  )
                }
              />
              <Route
                path="/settings"
                element={
                  currentUserData === null ? (
                    <Navigate to="/login" />
                  ) : (
                    <Settings />
                  )
                }
              />
              <Route
                path="/bookmarks"
                element={
                  currentUserData === null ? (
                    <Navigate to="/login" />
                  ) : (
                    <BookmarksPage />
                  )
                }
              />
              <Route path="/faq" element={<Faq />} />
              <Route
                path="/tags"
                element={
                  currentUserData === null ? <Navigate to="/login" /> : <Tags />
                }
              />
              <Route path="/auth/action" element={<AccountAction />} />
              {/* Community-related routes */}
              <Route
                path="/community"
                element={
                  currentUserData === null ? <Navigate to="/login" /> : <CommunityPage />
                }
              />
              {/* <Route path="/community" element={<CommunityPage />} /> */}
              <Route path="/community/:communityId" element={<CommunityDetail />} />
              <Route path="/community/:communityId/analysis" element={<CommunityAnalysis />} />
            </Routes>
          </BookmarkProvider>
        </BrowserRouter>
      </CurrentUserDataContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
