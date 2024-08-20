import { useContext, useState } from 'react';
import { Alert, Button, Col, Container, Form, InputGroup, Image } from 'react-bootstrap';
import { Link } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import '../../App.css';
import '../common.css';
import brandLogo from '../../img/logo.png';
import { signInUser } from '../../services/Authetication';
import { CurrentUserContext } from '../../App';

function Login() {
  const { Formik } = formik;
  const navigate = useNavigate();
  const [loginSuccessShow, loginSuccessSetShow] = useState(false);
  const [loginFailureShow, loginFailureSetShow] = useState(false);
  const [failureMessage, setFailureMessage] = useState("Sorry, we failed to log you in!");
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const schema = yup.object().shape(
    {
      email: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Please enter a valid email").required("Required"),
      password: yup.string().required("Required")
    }
  );

  const handleLoginSuccess = async (userCredentials) => {
    console.log(userCredentials);
    setCurrentUser(userCredentials.user);

    // Store email in localStorage
    localStorage.setItem('userId', userCredentials.user.uid);

    // Log the stored email to the console
    const storedId = localStorage.getItem('userId');
    console.log('Stored Id:', storedId);

    loginSuccessSetShow(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate("/");
  }

  const handleLoginFailure = (error) => {
    console.log(error.code);
    console.log(error.message);
    switch (error.code) {
      case 'auth/invalid-credential':
        setFailureMessage("Invalid email and/or password.");
        break;
      default:
        break;
    }
    loginFailureSetShow(true);
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
                <h2 class="card-title d-flex">Log In</h2>
                <Formik
                  validationSchema={schema}
                  onSubmit={
                    async values => {
                      signInUser(values.email, values.password, values.rememberMe, handleLoginSuccess, handleLoginFailure);
                    }
                  }
                  initialValues={{
                    email: '',
                    password: '',
                    rememberMe: false,
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
                        <Form.Label class="d-flex">Password</Form.Label>
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

                      <div className="row">
                        <Col>
                          <Form.Group className="d-flex mb-3">
                            <Form.Check
                              name="rememberMe"
                              label="Remember Me"
                              onChange={handleChange}
                              id="validationFormik106"
                              checked={values.rememberMe}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="text-end">
                          <Link to="/forgot-password">Forgot password?</Link>
                        </Col>
                      </div>

                      <div className="d-grid gap-2">
                        <Button variant="primary" type='submit' size="lg">
                          Log in
                        </Button>
                        <div className='mt-2'>
                          <p>Do not have an account? Create an account <Link to="/signup">here</Link>.</p>
                        </div>
                      </div>
                    </Form>
                  )}

                </Formik>

                <div className="pt-2">
                  <Alert key="success" variant="success" show={loginSuccessShow}>
                    You have successfully logged in!
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
    </div>
  );
}

export default Login;
