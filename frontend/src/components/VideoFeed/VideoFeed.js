import VideoFeedItem from './VideoFeedItem';
import './VideoFeed.css';
import AppNavbar from '../Navbar/Navbar';
import { useEffect, useState } from 'react';
import { getAllVideos } from '../../api/Video';

function VideoFeed() {
  const [videoItems, setVideoItems] = useState([]);

  useEffect(() => {
    const handleSuccess = (response) => {
      console.log(response.data.videos);
      setVideoItems(response.data.videos);
    };

    const handleError = (error) => {
      console.error('Error fetching videos:', error);
    };

    getAllVideos(handleSuccess, handleError);
  }, []);

  return (
    <div>
      <AppNavbar />
      <div className="video-feed-container">
        <div className="row">
          {videoItems.map(item => (
            <VideoFeedItem key={item._id} video={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoFeed;
