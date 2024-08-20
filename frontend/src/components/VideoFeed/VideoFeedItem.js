import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import './VideoFeedItem.css';
import { useEffect, useState } from 'react';
import { getUserData } from '../../api/User';

function VideoFeedItem({ video }) {
  const navigate = useNavigate();
  const [authorData, setAuthorData] = useState({});

  useEffect(() => {
    const getAuthorDataSuccess = (response) => {
      setAuthorData(response.data);
    }

    const getAuthorDataError = (error) => {
      console.error(error);
    }

    const getAuthorData = (id) => {
      getUserData(id, getAuthorDataSuccess, getAuthorDataError);
    }

    getAuthorData(video.author)
  }, []);

  const handleItemClick = () => {
    const url = `/videos/${video._id}`;
    navigate(url);
  };

  return (
    <div className="col-md-4 mb-4">
      <Card className="video-feed-item" onClick={handleItemClick}>
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={video.thumbnail_url}
            className="img-fluid"
          />
          <div className="video-time">{video.time}</div>
        </div>
        <Card.Body>
          <Card.Title><b>{video.title}</b></Card.Title>
          <Card.Text className="video-author-name">
            {authorData.name}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default VideoFeedItem;