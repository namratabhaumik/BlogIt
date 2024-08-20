// components/Faq/FaqForm.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './FaqForm.css';

export default function FaqForm() {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Question:', question);
    console.log('Email:', email);
    // Reset form fields
    setQuestion('');
    setEmail('');
  };

  return (
    <Container className="faq-form-container">
      <h4 className="faq-form-title">Submit a Question</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formQuestion">
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label className='faq-form-lable'>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="faq-form-button">
          Submit
        </Button>
      </Form>
    </Container>
  );
}