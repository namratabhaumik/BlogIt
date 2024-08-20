import {
  Card,
  Col,
  Image,
  Row,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import bookmarkWhite from "../../assets/bookmark-white.png";
import bookmarkBlack from "../../assets/bookmark-black.png";
import { BookmarkContext } from "../../context/BookmarkContext";
import { Link, useNavigate } from "react-router-dom";

import "./BlogFeedItem.css";
import { LinkContainer } from "react-router-bootstrap";
import { getUserData } from "../../api/User";
import avatar from '../../img/profile_placeholder.png';

function BlogFeedItem({ post }) {
  const { bookmarkedPosts, handleBookmarkToggle } = useContext(BookmarkContext);
  const [bookmarked, setBookmarked] = useState(false);
  const [userPopupShow, setUserPopupShow] = useState(false);
  const [authorData, setAuthorData] = useState({});
  const handleUserNameOnMouseEnter = () => {
    setUserPopupShow(true);
  };
  const handleUserNameOnMouseLeave = () => {
    setUserPopupShow(false);
  };

  const normalizeId = (post) => post._id || post.blog_post_id;
  useEffect(() => {
    setBookmarked(
      bookmarkedPosts.some((item) => normalizeId(item) === normalizeId(post))
    );

    const getAuthorDataSuccess = (response) => {
      setAuthorData(response.data);
    }

    const getAuthorDataError = (error) => {
      console.error(error);
    }

    const getAuthorData = (id) => {
      getUserData(id, getAuthorDataSuccess, getAuthorDataError);
    }
    getAuthorData(post.author);
  }, [bookmarkedPosts, post]);

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
    handleBookmarkToggle(post);
  };

  const formatBlogTimestamp = (ts) => {
    // Create a Date object from the ISO 8601 string
    const d = new Date(ts);
    const now = new Date();
    
    // Get the month name and date
    console.log(d);
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

  return (
    <div className="blog-feed-item-container">
      <Card
        className="blog-feed-item"
        style={{ width: "40rem" }}
      >
        <LinkContainer to={"/blog/" + post._id}>
          <Card.Img
            variant="top"
            src={post.image_url}
            style={{ maxHeight: "260px", objectFit: "cover" }}
            className="img-fluid"
          />
        </LinkContainer>
        <Card.Body>
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
                  <div className="text-secondary d-flex">Posted on {formatBlogTimestamp(post.timestamp)}</div>
                </Col>
              </Row>
            </div>
          <LinkContainer to={"/blog/" + post._id}>
            <Card.Title>
              <b>{post.title}</b>
            </Card.Title>
          </LinkContainer>
          <LinkContainer to={"/blog/" + post._id}>
            <Card.Text className="blog-feed-item-tags">
              <i>{post.tags}</i>
            </Card.Text>
          </LinkContainer>
          <LinkContainer to={"/blog/" + post._id}>
            <Card.Text>{post.summary}</Card.Text>
          </LinkContainer>
          <div onClick={handleToggleBookmark} style={{ cursor: "pointer" }}>
            <img
              src={bookmarked ? bookmarkBlack : bookmarkWhite}
              alt="Bookmark"
              style={{ width: "24px", height: "24px" }}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BlogFeedItem;
