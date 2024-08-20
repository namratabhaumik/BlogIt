import React, { useEffect, useRef, useContext, useState } from 'react';
import { Nav, Navbar, NavDropdown, Form, InputGroup, FormControl, Button, Image, Modal, Placeholder } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../img/logo.png';
import './Navbar.css'; // Ensure your CSS files are correctly imported
import '../common.css';
import { useNavigate } from 'react-router-dom';
import notification from './Notification.json';
import { LinkContainer } from 'react-router-bootstrap';
import { CurrentUserContext, CurrentUserDataContext } from '../../App';
import { signOutUser } from '../../services/Authetication';
import avatar from '../../img/profile_placeholder.png';
import axios from 'axios';
import { SERVER_HOST } from '../../api/Config';

function AppNavbar() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { currentUserData, setCurrentUserData } = useContext(CurrentUserDataContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const displayCreatePostBox = () => {
    handleShow();
  }

  const handleNavigate = (e) => {
    if (e.target.name === "blog") {
      handleClose();
      navigate("/create-blog-post");
    } else {
      handleClose();
      navigate("/create-video-post");
    }
  }

 const handleSearch = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.get(`${SERVER_HOST}/search`, { params: { q: query } });
    navigate('/search-results', { state: { results: response.data } });
  } catch (error) {
    console.error('Search error:', error);
  }
};

  // Dropdown Notification
  const [open, setOpen] = useState(false);
  const [notificationSeen, setNotificationSeen] = useState(false);
  const dropDownRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setOpen(false)
      }
    };
    // setNotificationSeen(true);
    document.addEventListener('mousedown', close);
    return () => {
      document.removeEventListener('mousedown', close)
    }
  }, []);

  const handleSignOut = () => {
    signOutUser();
    navigate("/");
  }

  return (
    <Navbar expand="lg" className="bg-color-lavender" fixed="top" sticky="top">
      <Navbar.Brand href="#home">
        <Link to="/">
          <img alt="Brand Logo" src={logo} className="navbar-logo" />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
        <Form inline onSubmit={handleSearch}>
          <InputGroup>
            <FormControl
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-secondary" id="basic-addon2" type="submit">
              <FaSearch />
            </Button>
          </InputGroup>
        </Form>
        <Nav className='justify-content-end'>
          {
            currentUser ?
              (
                <>
                  {/* notification dropdown */}
          <div ref={dropDownRef} className="relative mx-auto  text-black ">
            
            <button onClick={() => setOpen((prev) => !prev, setNotificationSeen(true))} className='btn btn-ghost text-4xl'>
              <span className="relative inline-block text-4xl">
                {
                  notificationSeen ? 
                  <img src="/notification.png" alt="notification icon" title="notification icon" width="30" height="30" class="max-w-full rounded-full" />
                  : <img src="/red notification.png" alt="notification icon" title="notification icon" width="30" height="30" class="max-w-full rounded-full" />
                }
                <span className="h-[6px] w-[6px] bg-green-500 absolute rounded-full -top-0 -right-0 "></span>
              </span>            
            </button>


            <ul className={`dropdown-menu ${open ? 'show' : ''} mt-2 divide-y divide-slate-100`} >
              {notification?.notificationData?.map((item, idx) => (
                  <li key={idx} className={`rounded-sm px-6 py-2 ${open ? 'opacity-100 duration-300' : 'opacity-0'}  ${item === 'Log Out' ? 'text-red-500 hover:bg-red-600 hover:text-white' : 'hover:bg-slate-300'} flex items-start gap-4 px-4 py-3`}>
                    <div class="shrink-0">
                        <div class="relative flex items-center justify-center w-10 h-10 text-white rounded-full">
                            <img src={item.photo} alt="user name" title="user name" width="40" height="40" class="max-w-full rounded-full" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-0 min-h-[2rem] items-start justify-center w-full min-w-0">
                        <p class="w-full">@{item.username} {item.title}</p>
                        <p class="w-full">{item.time}</p>
                    </div>
                </li>
                ))}
            </ul>
          </div>
                  <Nav.Link>
                    <Button
                      variant="outline-primary"
                      className="rounded-pill"
                      onClick={displayCreatePostBox}
                    >
                      Create Post
                    </Button>
                  </Nav.Link>
                  <NavDropdown title={
                    <Image className='border border-white' src={(currentUserData && currentUserData.profile_pic) ? currentUserData.profile_pic : avatar} style={{ height: '40px', width: '40px', objectFit: 'cover' }} alt="user_picture" roundedCircle />
                  } id="nav-profile-dropdown">
                    <NavDropdown.Item>
                        <div>
                          {(currentUserData !== null) ? 
                            (
                              <>
                              <Link to={"/user/" + currentUserData.username}>
                                {currentUserData.name}
                                <div class='text-secondary'>
                                  @{currentUserData.username}
                                </div>
                              </Link>
                              </>
                            ) :
                            (
                              <>
                              <div>
                                <Placeholder as='div' animation='glow'>
                                  <Placeholder xs={10}/>
                                </Placeholder>
                                </div>
                                <div>
                                  <Placeholder as='div' animation='glow'>
                                    <Placeholder xs={10}/>
                                  </Placeholder>
                                </div>
                              </>
                            )
                          }
                          </div>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <Link to="/settings">
                        Settings
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleSignOut}>
                      Sign out
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) :
              (
                <>
                  <Nav.Link>
                    <LinkContainer to="/login">
                      <Button
                        variant="outline-primary"
                        className="rounded-pill"
                        onClick={displayCreatePostBox}
                      >
                        Login
                      </Button>
                    </LinkContainer>
                  </Nav.Link>
                  <Nav.Link>
                    <LinkContainer to="/signup">
                      <Button
                        variant="primary"
                        className="rounded-pill"
                        onClick={displayCreatePostBox}
                        >
                        Create Account
                      </Button>
                    </LinkContainer>
                  </Nav.Link>
                </>
              )
          }

        </Nav>
      </Navbar.Collapse>

      <Modal show={show} onHide={handleClose} animation={false} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Choose Post Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around">
            <Button variant="primary" name="blog" className="App-Button" onClick={handleNavigate}>Create Blog Post</Button>
            <Button variant="success" name="video" className="App-Button" onClick={handleNavigate}>Create Video Post</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="Modal-Button" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar >
  );
}

export default AppNavbar;
