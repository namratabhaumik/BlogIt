// Author -
// Modified by - Zeel Ravalani (B00917373)
import { useParams, Link } from 'react-router-dom';
import { Alert, Button, Card, CardBody, Container, Col, Image, Row, ListGroup, Spinner, Modal } from 'react-bootstrap';
import AppNavbar from '../Navbar/Navbar';
import BlogFeedItem from '../BlogFeed/BlogFeedItem';
import postLogo from '../../assets/post_icon.svg';
import commentLogo from '../../assets/comment_icon.svg';
import locationIcon from '../../assets/location_icon.svg';
import birthdayIcon from '../../assets/birthday_icon.svg';
import communityIcon from '../../assets/community_icon.svg';
import { useContext, useEffect, useState } from 'react';
import { getUserDataByUsername, addFollower, removeFollower, getUserFollowers, getUserFollowing } from '../../api/User';
import { getAllBlogsByUserId } from '../../api/Blog';
import { getAllVideosByUserId } from '../../api/Video';
import { CurrentUserDataContext } from '../../App';
import VideoFeedItem from '../VideoFeed/VideoFeedItem';
import avatar from '../../img/profile_placeholder.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserProfile.css';
import Footer from '../Footer/Footer';


function UserProfileDisplay({ userData }) {
  const { currentUserData, setCurrentUserData } = useContext(CurrentUserDataContext);
  const [userBlogItems, setUserBlogItems] = useState(null);
  const [userVideoItems, setUserVideoItems] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const formatTimestamp = (ts) => {
    const d = new Date(ts * 1000);
    const month = d.toLocaleString('default', { month: "long" });
    return month + " " + d.getDate() + ", " + d.getFullYear()
  }

  useEffect(() => {
    const handleGetBlogsSuccess = (response) => {
      if (response.data.blogs.length > 0)
        setUserBlogItems(response.data.blogs);
    }

    const handleGetBlogsError = (error) => {
      console.log(error);
    }

    getAllBlogsByUserId(userData.id, handleGetBlogsSuccess, handleGetBlogsError);
  }, [userData.id]);

  useEffect(() => {
    const handleGetVideosSuccess = (response) => {
      if (response.data.videos.length > 0)
        setUserVideoItems(response.data.videos);
    }

    const handleGetVideosError = (error) => {
      console.log(error);
    }

    getAllVideosByUserId(userData.id, handleGetVideosSuccess, handleGetVideosError);
  }, [userData.id]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const followersResponse = await getUserFollowers(userData.id);
        console.log("Followers Response:", JSON.stringify(followersResponse, null, 2));
        setFollowersCount(followersResponse.length);
        setFollowersList(followersResponse);

        const followingResponse = await getUserFollowing(userData.id);
        console.log("Following Response:", JSON.stringify(followingResponse, null, 2));
        setFollowingCount(followingResponse.length);
        setFollowingList(followingResponse);

        if (currentUserData) {
          // Check if the current user is following this user
          const isFollowing = followersResponse.some(follower => follower.id === currentUserData.id);
          setIsFollowing(isFollowing);
        }
      } catch (error) {
        console.error('Error fetching followers or following:', error);
      }
    };

    fetchUserDetails();
  }, [userData.id, currentUserData]);

  const handleFollowClick = async () => {
    if (currentUserData && userData) {
      try {
        await addFollower(userData.id, currentUserData.id);
        setIsFollowing(true); // Update state to reflect following status
        setFollowersCount(followersCount + 1); // Update followers count
        toast.success('Successfully followed the user!');
      } catch (error) {
        toast.error('Failed to follow the user.');
      }
    }
  };
  
  const handleUnfollowClick = async () => {
    if (currentUserData && userData) {
      try {
        await removeFollower(userData.id, currentUserData.id);
        setIsFollowing(false); // Update state to reflect unfollowing status
        setFollowersCount(followersCount - 1); // Update followers count
        toast.success('Successfully unfollowed the user!');
      } catch (error) {
        toast.error('Failed to unfollow the user.');
      }
    }
  };
  


  return (
    <div>
      <Card>
        <Image src={(userData && userData.profile_banner) ? userData.profile_banner : 'https://placehold.co/1200x400'} style={{ height: '200px', objectFit: 'cover' }} />
        <div style={{ height: '120px', textAlign: 'center', marginTop: '-100px', marginBottom: '1rem' }}>
          <Image className='border border-white' src={(userData && userData.profile_pic) ? userData.profile_pic : avatar} style={{ height: '128px', width: '128px', marginTop: '10px', objectFit: 'cover' }} alt="user_picture" roundedCircle />
        </div>
        <CardBody>
          <Card.Title style={{ textAlign: 'center' }}>
            {userData && userData.name}
          </Card.Title>
          <Card.Text style={{ textAlign: 'center' }}>
            {
              userData ? (
                <div className='text-secondary'>
                  {userData.bio}
                </div>
              ) : (
                <></>
              )
            }
          </Card.Text>
          <div className='d-flex justify-content-center mb-3 text-secondary'>
            {(userData && userData.location) ? (
              <div><img src={locationIcon} alt="Location Icon" /> {userData.location}</div>
            ) : (
              <></>
            )
            }
            <div className='ms-3'><img src={birthdayIcon} alt="Birthday Icon" /> Joined on {(userData && userData.join_date) ? formatTimestamp(userData.join_date) : "Jan 1, 1970"}</div>
          </div>
          {(userData && (userData.education || userData.work_status)) ? (
            <>
              <hr />
            </>
          ) : (
            <></>
          )}
          <div>
            <Row>
              {(userData && userData.education) ? (
                <Col>
                  <div className='d-flex justify-content-center'><h6>Education</h6></div>
                  <div className='d-flex justify-content-center'>{userData.education}</div>
                </Col>
              ) : (
                <></>
              )}
              {(userData && userData.work_status) ? (
                <Col>
                  <div className='d-flex justify-content-center'><h6>Work</h6></div>
                  <div className='d-flex justify-content-center'>{userData.work_status}</div>
                </Col>
              ) : (
                <></>
              )}
            </Row>
            {
              (userData && currentUserData && currentUserData.id === userData.id) ? (
                <>
                  <hr />
                </>
              ) : (currentUserData !== null) ? (
                <>
                  <hr />
                </>
              ) : (
                <></>
              )
            }
          </div>
          <div className="d-flex justify-content-center">
            {
              (userData && currentUserData && currentUserData.id === userData.id) ? (
                <Link to="/settings">
                  <Button>Edit Profile</Button>
                </Link>
              ) : (currentUserData !== null) ? (
                isFollowing ? (
                  <Button onClick={handleUnfollowClick}>Unfollow</Button>
                ) : (
                  <Button onClick={handleFollowClick}>Follow</Button>
                )
              ) : (
                <></>
              )
            }
          </div>
        </CardBody>
      </Card>
      <div style={{ marginTop: '4px' }}>
        <Row>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush" >
                <ListGroup.Item className="highlight-item">
                  <div className='d-flex justify-content-between align-items-center' style={{ cursor: 'pointer' }} onClick={() => setShowFollowersModal(true)}>
                    <span className="highlight-text">Followers: {followersCount}</span>
                    <span className="highlight-icon">👥</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="highlight-item">
                  <div className='d-flex justify-content-between align-items-center' style={{ cursor: 'pointer' }} onClick={() => setShowFollowingModal(true)}>
                    <span className="highlight-text">Following: {followingCount}</span>
                    <span className="highlight-icon">🔗</span>
                  </div>
                </ListGroup.Item>
                {
                  (userBlogItems || userVideoItems) ? (
                    <ListGroup.Item><img src={postLogo} alt="Post Logo" /> {((userBlogItems) ? userBlogItems.length : 0) + ((userVideoItems) ? userVideoItems.length : 0)} posts published</ListGroup.Item>
                  ) : (
                    <></>
                  )
                }
              </ListGroup>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardBody>
                <Card.Title>Blog Posts</Card.Title>
                {(userBlogItems) ? (
                  <ListGroup variant="flush" >
                    {userBlogItems.map((post) => (
                      <ListGroup.Item>
                        <BlogFeedItem
                          post={post}
                        />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div>
                    No posts.
                  </div>
                )}
              </CardBody>
              <CardBody>
                <Card.Title>Video Posts</Card.Title>
                <div className='video-feed-container'>
                  <div className="row">
                    {(userVideoItems) ? (
                      <>
                        {userVideoItems.map((video) => (
                          <VideoFeedItem
                            video={video}
                          />
                        ))}
                      </>
                    ) : (
                      <div>
                        No posts.
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Followers Modal */}
      <Modal show={showFollowersModal} onHide={() => setShowFollowersModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Followers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            followersList.length > 0 ? (
              <ListGroup>
                {
                  followersList.map((follower) => (
                    <ListGroup.Item key={follower.id}>
                      <Link to={`/user/${follower.username}`}>{follower.name}</Link>
                    </ListGroup.Item>
                  ))
                }
              </ListGroup>
            ) : (
              <p>No followers</p>
            )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFollowersModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Following Modal */}
      <Modal show={showFollowingModal} onHide={() => setShowFollowingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Following</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            followingList.length > 0 ? (
              <ListGroup>
                {
                  followingList.map((followedUser) => (
                    <ListGroup.Item key={followedUser.id}>
                      <Link to={`/user/${followedUser.username}`}>{followedUser.name}</Link>
                    </ListGroup.Item>
                  ))
                }
              </ListGroup>
            ) : (
              <p>Not following anyone</p>
            )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFollowingModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Spinner animation='border' role='status' variant='secondary'>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}

function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    const handleGetUserSuccess = (response) => {
      setUserData(response.data);
    }

    const handleGetUserError = (error) => {
      const response = error.response;

      console.log(error);

      if (response.status === 404) {
        setUserNotFound(true);
      }
    }

    getUserDataByUsername(username, handleGetUserSuccess, handleGetUserError)
  }, [username]);

  if (userNotFound) {
    return (
      <div>
        <AppNavbar />
        <Container>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Alert variant='danger'>
              <Alert.Heading>Oh no! This page does not exist!</Alert.Heading>
              <Link to="/">
                Return to home.
              </Link>
            </Alert>
          </div>
        </Container>
      </div>
    )
  }

  if (userData === null)
    return (
      <div>
        <AppNavbar />
        <Container>
          <LoadingSpinner />
        </Container>
      </div>
    );

  return (
    <div>
      <AppNavbar />
      <Container>
        <UserProfileDisplay userData={userData} />
      </Container>
      <Footer/>
    </div>
  );
}

export default UserProfile;