//Author - Zeel Ravalani (B00917373)
import React from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap"; // Reference: https://react-bootstrap.netlify.app/docs/components/accordion/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Reference: https://docs.fontawesome.com/v5/web/use-with/react/
import { faPen, faEdit, faComments, faCheckCircle, faUserPlus, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import './Faq.css'; 
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";
import Header from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

/**
 * Faq Component
 * 
 * This component renders the FAQ (Frequently Asked Questions) section of the application.
 * It includes a header, a vertical navigation bar, and a list of accordion items representing 
 * different frequently asked questions.
 * 
 * @component
 * @example
 * return (
 *   <Faq />
 * )
 * 
 * @see https://react-bootstrap.netlify.app/docs/components/accordion/
 * @see https://docs.fontawesome.com/v5/web/use-with/react/
 */
export default function Faq() {
  return (
    <div> 
      <Header />
      <VerticalNavBar />
      <Container className="faq-container">
        <Row>
          <Col xs={12} sm={12} md={{ span: 10, offset: 1 }} lg={{ span: 12, offset: 1 }} className="mb-4">
            <section className="faq-section">
              <h3 className="text-center mb-4 pb-2 faq-title">FAQ</h3>
              <p className="text-center mb-5 faq-subtitle">Find the answers for the most frequently asked questions below</p>
              <Accordion defaultActiveKey="0" alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faPen} className="faq-icon" />
                    How do I create a new post?
                  </Accordion.Header>
                  <Accordion.Body>
                    Click on the <strong>"Create Post"</strong> button on the top navigation bar. You'll be taken to a text editor where you can write and format your post. Once you're ready, hit "Publish" to make it live.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faEdit} className="faq-icon" />
                    Can I edit my post after publishing?
                  </Accordion.Header>
                  <Accordion.Body>
                    <strong><u>Yes, you can edit your post at any time.</u></strong> Go to your profile, click on the post you want to edit, and then click on the "Edit" button.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faComments} className="faq-icon" />
                    How can I manage comments on my posts?
                  </Accordion.Header>
                  <Accordion.Body>
                    You can manage comments by going to your post and viewing the comment section. From there, you can delete inappropriate comments or reply to engage with your readers.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faCheckCircle} className="faq-icon" />
                    What kind of content is allowed?
                  </Accordion.Header>
                  <Accordion.Body>
                    We encourage a wide range of content, including tutorials, opinion pieces, and news. However, all content must adhere to our community guidelines, which prohibit spam, harassment, and offensive material.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faUserPlus} className="faq-icon" />
                    How do I follow other users?
                  </Accordion.Header>
                  <Accordion.Body>
                    To follow another user, visit their profile and click on the <strong>"Follow"</strong> button. You’ll then see their posts in your feed.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faUserCircle} className="faq-icon" />
                    Can I customize my profile?
                  </Accordion.Header>
                  <Accordion.Body>
                    <strong><u>Yes, you can customize your profile</u></strong> by clicking on your avatar in the top right corner and selecting <strong>"Edit Profile."</strong> You can change your bio, profile picture, and social links.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </section>
          </Col>
        </Row>
      </Container>
      <Footer/>
    </div>
  );
}
