
import { Link, useParams } from "react-router-dom";
import {
  Card,
  Col,
  Image,
  Row,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { getVideoById } from "../../api/Video";

import AppNavbar from "../Navbar/Navbar";

import "./VideoPost.css";
import "./VideoFeed.css";
import { getUserData } from "../../api/User";
import avatar from '../../img/profile_placeholder.png';

function VideoPost() {
  const { id } = useParams();

  const [videoUrl, setVideoUrl] = useState("");
  const [videoContent, setVideoContent] = useState({});
  const [userPopupShow, setUserPopupShow] = useState(false);
  const [authorData, setAuthorData] = useState({});

  const handleUserNameOnMouseEnter = () => {
    setUserPopupShow(true);
  };
  const handleUserNameOnMouseLeave = () => {
    setUserPopupShow(false);
  };

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

    const fetchVideoUrl = async (videoPath) => {
      try {
        const url = await getDownloadURL(ref(storage, videoPath));
        console.log(url);
        setVideoUrl(url);
      } catch (error) {
        console.error("Error fetching video URL: ", error);
      }
    };

    const handleSuccess = (response) => {
      console.log(response.data);
      setVideoContent(response.data);

      if (response.data && response.data.video_url) {
        getAuthorData(response.data.author);
        fetchVideoUrl(response.data.video_url);
      }
    };

    const handleError = (error) => {
      console.error('Error fetching video:', error);
    };

    getVideoById(id, handleSuccess, handleError);
  }, [id]);

  const formatBlogTimestamp = (ts) => {
    // Create a Date object from the ISO 8601 string
    const d = new Date(ts * 1000);
    const now = new Date();
    
    // Get the month name and date
    const month = d.toLocaleString('default', { month: 'long' });
    const date = d.getDate();
    
    // Determine if the year should be included
    const year = now.getFullYear() === d.getFullYear() ? '' : `, ${d.getFullYear()}`;
    
    // Return the formatted string
    return `${month} ${date}${year}`;
  };

  const formatUserJoinTimestamp = (ts) => {
    const d = new Date(ts * 1000);
    const month = d.toLocaleString('default', { month: "long" });
    return month + " " + d.getDate() + ", " + d.getFullYear()
  }

  if (!videoContent) {
    return <div>Video post not found</div>;
  }

  console.log(videoContent)

  return (
    <div>
      <AppNavbar />
      <div className="center-card">
        <Card className="my-4 card">
          <Card.Body>
            <Card.Title><h1><strong>{videoContent.title}</strong></h1></Card.Title>
            <Card.Text className="video-post-tags"><i>{videoContent.tags}</i></Card.Text>
            {videoUrl ? (
              <video width="100%" height="auto" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div>Loading video...</div>
            )}
            <div>
              <Row>
                <Col md={1}>
                  <Image
                    className="border border-white d-flex"
                    src={ (authorData.profile_pic) ? authorData.profile_pic : avatar}
                    style={{ height: "40px", width: "40px", objectFit: "cover" }}
                    alt="user_picture"
                    roundedCircle
                  />
                </Col>
                <Col>
                  <OverlayTrigger
                    show={userPopupShow}
                    placement="auto-start"
                    key="bottom"
                    overlay={
                      <Popover
                        id="user-popover-bottom"
                        onMouseEnter={handleUserNameOnMouseEnter}
                        onMouseLeave={handleUserNameOnMouseLeave}
                      >
                        <Popover.Body>
                          <Row xs="auto">
                            <Col>
                              <Image
                                className="border border-white d-flex"
                                src={ (authorData.profile_pic) ? authorData.profile_pic : avatar}
                                style={{
                                  height: "40px",
                                  width: "40px",
                                  objectFit: "cover",
                                }}
                                alt="user_picture"
                                roundedCircle
                              />
                            </Col>
                            <Col>
                              <Link to={"/user/" + authorData.username}>
                                <div
                                  className="d-flex"
                                  style={{
                                    marginLeft: "-10px",
                                    marginTop: "6px",
                                  }}
                                >
                                  <strong>{authorData.name}</strong>
                                </div>
                              </Link>
                            </Col>
                          </Row>
                          <div className="mt-2">
                            {authorData.bio}
                          </div>
                          { (authorData && authorData.location) ? (
                            <>
                              <div className="mt-2">
                            <strong>Location</strong>
                          </div>
                          <div>{authorData.location}</div>
                            </>
                          ) : (
                            <></>
                          ) }
                          
                          <div>
                            <strong>Joined</strong>
                          </div>
                          <div>{formatUserJoinTimestamp(authorData.join_date)}</div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <div
                      className="d-flex"
                      onMouseEnter={handleUserNameOnMouseEnter}
                      onMouseLeave={handleUserNameOnMouseLeave}
                    >
                      <Link to={"/user/" + authorData.username}>{authorData.name}</Link>
                    </div>
                  </OverlayTrigger>
                  <div className="text-secondary d-flex">Posted on {formatBlogTimestamp(videoContent.timestamp)}</div>
                </Col>
              </Row>
            </div>
            <Card.Text dangerouslySetInnerHTML={{ __html: videoContent.content }} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default VideoPost;
