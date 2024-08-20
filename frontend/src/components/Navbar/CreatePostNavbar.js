import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../../img/logo.png';
import './Navbar.css';

function CreatePostNavbar({ communityId }) {
  const createPostLink = communityId ? `/create-blog-post?community_id=${communityId}` : '/create-blog-post';
  return (
    <Navbar expand="lg" className="bg-color-lavender" fixed="top">
      <Navbar.Brand href="/">
        <img alt="Brand Logo" src={logo} className="navbar-logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
      <Nav>
          <Nav.Link href={createPostLink} className="ms-auto" style={{color: "#383F51"}}>
              Create Post
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CreatePostNavbar;
