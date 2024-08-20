import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";
import AppNavbar from "../Navbar/Navbar";
import { getAllTagsWithCounts } from "../../api/Tag";
import "./Tags.css";

function Tags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getAllTagsWithCounts(
      (data) => {
        setTags(data);
      },
      (error) => {
        console.error("Error fetching tags:", error);
      }
    );
  }, []);

  return (
    <div>
      <AppNavbar />
      <VerticalNavBar />
      <Container className="tags-page-container">
        <h2 className="tags-heading text-center mt-4 mb-3">Tags</h2>
        <Row className="g-4">
          {tags.map((item, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3}>
              <Card className="custom-tag-card">
                <Card.Body className="custom-card-body">
                  <span className="custom-tag-text">{item.tag}</span>
                  <span className="custom-tag-count">
                    {item.count} {item.count === 1 ? "post" : "posts"}
                  </span>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Tags;
