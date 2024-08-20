import { Link, useParams } from "react-router-dom";
import {
  Card,
  Col,
  Image,
  Row,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import AppNavbar from "../Navbar/Navbar";

import "./BlogPost.css";
import "./BlogFeed.css";
import data from "./data.json";
import Comments from "../Comments/Comments";
import { useState, useEffect } from "react";
import { getBlogById } from "../../api/Blog";
import { getUserData } from "../../api/User";
import avatar from '../../img/profile_placeholder.png';

function BlogPost() {
  const { id } = useParams();
  const currentUser = data.currentUser;
  const [userPopupShow, setUserPopupShow] = useState(false);
  const [authorData, setAuthorData] = useState({});

  const handleUserNameOnMouseEnter = () => {
    setUserPopupShow(true);
  };
  const handleUserNameOnMouseLeave = () => {
    setUserPopupShow(false);
  };

  const [blogContent, setBlogContent] = useState({});

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

    const handleSuccess = (response) => {
      setBlogContent(response.data);
      getAuthorData(response.data.author);
    };

    const handleError = (error) => {
      console.error('Error fetching blogs:', error);
    };

    getBlogById(id, handleSuccess, handleError);
  }, []);

  const formatBlogTimestamp = (ts) => {
    // Create a Date object from the ISO 8601 string
    const d = new Date(ts);
    const now = new Date();
    
    // Get the month name and date
    const month = d.toLocaleString('default', { month: 'long' });
    const date = d.getDate();
    
    // Determine if the year should be included
    const year = now.getFullYear() === d.getFullYear() ? '' : `, ${d.getFullYear()}`;
    
    // Return the formatted string
    return `${month} ${date}${year}`;
  };

  if (!blogContent) {
    return <div>Blog post not found</div>;
  }

  return (
    <div>
      <AppNavbar />
      <div className="center-card">
        <Card className="my-4 card">
          <Card.Img variant="top" src={blogContent.image_url} className="card-img-top" />
          <div style={{ marginTop: "20px" }}>
              <Row>
                <Col md={1}>
                  <Image
                    className="border border-white d-flex"
                    src={ (authorData.profile_pic) ? authorData.profile_pic : avatar}
                    style={{ height: "40px", width: "40px", marginLeft: "20px", objectFit: "cover" }}
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
                          <div>{authorData.join_date}</div>
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
                  <div className="text-secondary d-flex">Posted on {formatBlogTimestamp(blogContent.timestamp)}</div>
                </Col>
              </Row>
            </div>
          <Card.Body>
            <Card.Title>
              <h1>
                <strong>{blogContent.title}</strong>
              </h1>
            </Card.Title>
            <Card.Text className="blog-post-tags">
              <i>{blogContent.tags}</i>
            </Card.Text>
            <Card.Text dangerouslySetInnerHTML={{ __html: blogContent.content }} />
          </Card.Body>
          <Comments currentUser={currentUser} />
        </Card>
      </div>
    </div>
  );
}

export default BlogPost;
