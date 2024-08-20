import { useState } from 'react';
import { Alert, Button, Container, Form, InputGroup, OverlayTrigger, Tooltip, Image } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import { useNavigate, Link } from "react-router-dom";
import infoLogo from '../../assets/info_icon.svg'
import '../../App.css';
import '../common.css';
import brandLogo from '../../img/logo.png';
import { signUpUser } from '../../services/Authetication';
import { checkUsernameExists, createUser } from '../../api/User';

YupPassword(yup);

function Signup() {
  const { Formik } = formik;
  const navigate = useNavigate();
  const [signupSuccessShow, signupSuccessSetShow] = useState(false);
  const [signupFailureShow, signupFailureSetShow] = useState(false);
  const [failureMessage, setFailureMessage] = useState("Sorry, we failed to created an account!");
  const renderTooltip = (props) => (
    <Tooltip id="info-logo-tooltip" {...props}>
      Password should contain at least 8 characters including 1 lower case character, 1 upper case character, 1 number and 1 special character.
    </Tooltip>
  );

  const schema = yup.object().shape(
    {
      name: yup.string().required("Required"),
      username: yup.string().matches(/^[a-zA-Z0-9_-]*$/i, "Special characters are not allowed").required("Required").min(6, "Username is too short - should be 6 characters minimum"),
      email: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Please enter a valid email").required("Required"),
      password: yup.string().required("Required").password()
        .min(8, "Password must contain at least 8 characters")
        .minLowercase(1, "Password must contain at least one lower case character")
        .minUppercase(1, "Password must contain at least one upper case character")
        .minNumbers(1, "Password must contain at least one number")
        .minSymbols(1, "Password must contain at least one special character"),
      passwordConfirmation: yup.string().required("Required")
        .oneOf([yup.ref('password')], 'Passwords must match')
    }
  );

  const handleSignUpError = (error) => {
    console.log(error.code);
    console.log(error.message);

    switch (error.code) {
      case 'auth/email-already-in-use':
        setFailureMessage("Email is already in use. Please use a different email.")
        break;
      default:
        break;
    }

    signupFailureSetShow(true);
  }

  const handleSignUpSuccess = (userCredentials, values) => {
    console.log(userCredentials);
    createUser(userCredentials.user.uid, values.name, values.username, values.email, handleApiSuccess, handleApiFailure);
  }

  const handleApiSuccess = async (response) => {
    console.log(response);
    signupSuccessSetShow(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate("/login");
  }

  const handleApiFailure = (error) => {
    console.log(error);
    signupFailureSetShow(true);
  }

  const handleCheckUsernameSuccess = (response, values) => {
    console.log(response);
    if (response.data && response.data.exists && response.data.exists === true) {
      setFailureMessage("Username is already taken! Please use another username.")
      signupFailureSetShow(true);
    } else {
      if (values) {
        // Sign up the user with Firebase Auth if the username does not exist
        signUpUser(values.email, values.password, values, handleSignUpSuccess, handleSignUpError);
      }
    }
  }

  const handleCheckUsernameError = (error) => {
    console.log(error);
    signupFailureSetShow(true);
  }

  return (
    <div className='App'>
      <Container>
        <div class="row d-flex justify-content-center align-items-center h-100 pt-5">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style={{ borderRadius: 15 + 'px' }}>
              <div class="card-body p-5">
              <Link to="/">
                  <div className='d-flex justify-content-center'>
                    <Image src={brandLogo} style={{ width: '30%' }} />
                  </div>
                </Link>
                <h2 class="card-title d-flex mt-2">Create your account</h2>
                <Formik
                  validationSchema={schema}
                  onSubmit={
                    async values => {
                      // Check if the username is already taken before signing up the user
                      checkUsernameExists(values.username, values, handleCheckUsernameSuccess, handleCheckUsernameError);
                    }
                  }
                  initialValues={{
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                    passwordConfirmation: ''
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
                      
                      <Form.Group className="mb-3" controlId="validationFormikName">
                        <Form.Label className="d-flex">Name</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!errors.name}
                            placeholder="Enter your name"
                          />
                          <Form.Control.Feedback type="invalid" className='d-flex'>
                            {errors.name}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="validationFormikUsername">
                        <Form.Label class="d-flex">Username</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="input"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.username && !errors.username}
                            isInvalid={!!errors.username}
                            placeholder="Enter a username" />
                          <Form.Control.Feedback className="d-flex" type="invalid">
                            {errors.username}
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
                            placeholder="Enter email" />
                          <Form.Control.Feedback className="d-flex" type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="validationFormik04">
                        <Form.Label class="d-flex">
                          Password
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                          >
                            <img src={infoLogo} alt="Info Logo" className="ms-1" />
                          </OverlayTrigger>
                        </Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.password && !errors.password}
                            isInvalid={!!errors.password}
                            placeholder="Enter password"
                          />
                          <Form.Control.Feedback className="d-flex" type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="validationFormik05">
                        <Form.Label className="d-flex">Password Confirmation</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="password"
                            name="passwordConfirmation"
                            value={values.passwordConfirmation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.passwordConfirmation && !errors.passwordConfirmation}
                            isInvalid={!!errors.passwordConfirmation}
                            placeholder="Enter password again"
                          />
                          <Form.Control.Feedback className="d-flex" type="invalid">
                            {errors.passwordConfirmation}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button variant="primary" type='submit' size='lg'>
                          Sign up
                        </Button>
                      </div>
                      <div className='mt-2'>
                        <p>Already have an account? Log in <Link to="/login">here</Link>.</p>
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="pt-2">
                  <Alert key="success" variant="success" show={signupSuccessShow}>
                    You have successfully created an account!
                  </Alert>
                  <Alert key="error" variant="danger" show={signupFailureShow}>
                    {failureMessage}
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Signup;