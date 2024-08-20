import React from "react";
import { useState } from "react";
import "./ContactUs.css";
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";
import { Container, Form, Button, Image, InputGroup, Col, Alert } from "react-bootstrap";
import AppNavbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';
import brandLogo from '../../img/logo.png';
import Footer from "../Footer/Footer";

const ContactUs = () => {
  const { Formik } = formik;
  const [loginSuccessShow, loginSuccessSetShow] = useState(false);
  const [loginFailureShow, loginFailureSetShow] = useState(false);
  const [failureMessage, setFailureMessage] = useState("Sorry, we failed to send your message. Please try again.");

  const schema = yup.object().shape(
    {
      name: yup.string().required("Please enter your name"),
      email: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Please enter a valid email").required("Please enter your email"),
      message: yup.string().required("Please enter a message")
    }
  );

  return (
    <>
      <AppNavbar />
      <VerticalNavBar />
      <Container>
        <div class="row d-flex justify-content-center align-items-center h-20 pt-2">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style={{ borderRadius: 15 + 'px' }}>
              <div class="card-body p-5">
                <h2 class="card-title d-flex">Get in touch</h2>
                <p>
                  Please feel free to reach out to us through the following means!
                </p>
                <ul>
                  <li>Email: <a href="mailto:contact@blogit.com">contact@blogit.com</a></li>
                  <li>Phone: +1 (782) 882 890</li>
                  <li>Address: 123 South St, Halifax, NS, Canada</li>
                </ul>
                <Formik
                  validationSchema={schema}
                  onSubmit={
                    async values => {
                      loginSuccessSetShow(false);
                      await new Promise(resolve => setTimeout(resolve, 1200));
                      loginSuccessSetShow(true);
                    }
                  }
                  initialValues={{
                    name: '',
                    email: '',
                    message: '',
                  }}
                >
                  {({ values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset }) => (
                    <Form noValidate onSubmit={handleSubmit} class="d-flex">

                      <Form.Group className="mb-3" controlId="validationFormik04">
                        <Form.Label class="d-flex">Name</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.name && !errors.name}
                            isInvalid={!!errors.name}
                            placeholder="Enter your name"
                          />
                          <Form.Control.Feedback className="d-flex" type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="validationFormik03">
                        <Form.Label class="d-flex">Email address</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.email && !errors.email}
                            isInvalid={!!errors.email}
                            placeholder="Enter your email" />
                          <Form.Control.Feedback className="d-flex" type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="validationFormik03">
                        <Form.Label class="d-flex">Message</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            as="textarea"
                            name="message"
                            value={values.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!errors.message}
                            placeholder="Express your thoughts..." />
                          <Form.Control.Feedback className="d-flex" type="invalid">
                            {errors.bio}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button variant="primary" type='submit' size="lg">
                          Send us a message
                        </Button>
                      </div>
                    </Form>
                  )}

                </Formik>

                <div className="pt-2">
                  <Alert key="success" variant="success" show={loginSuccessShow}>
                    We have received your message! We will get back to you soon.
                  </Alert>
                  <Alert key="error" variant="danger" show={loginFailureShow}>
                    {failureMessage}
                  </Alert>
                </div>

              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer/>
    </>
  );
};

export default ContactUs;
