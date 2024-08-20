import { Alert, Button, Container, Form, InputGroup, Image } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import '../../App.css';
import '../common.css';
import brandLogo from '../../img/logo.png';
import { resetUserPassword } from '../../services/Authetication';

YupPassword(yup);

function ForgotPassword() {
  const { Formik } = formik;
  const [resetSuccessShow, resetSuccessSetShow] = useState(false);
  const schema = yup.object().shape(
    {
      email: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Please enter a valid email").required("Required"),
    }
  );

  const handleResetEmailSuccess = () => {
    resetSuccessSetShow(true);
  }

  const handleResetEmailError = (error) => {
    console.log(error.code);
    console.log(error.message);
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
                <h2 class="card-title d-flex mt-2">Reset password</h2>
                <Formik
                  validationSchema={schema}
                  onSubmit={
                    async values => {
                      resetUserPassword(values.email, handleResetEmailSuccess, handleResetEmailError);
                    }
                  }
                  initialValues={{
                    email: '',
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

                      <div className="d-grid gap-2">
                        <Button variant="primary" type='submit' size="lg">
                          Send Reset Password Email
                        </Button>
                      </div>
                    </Form>
                  )}

                </Formik>
                <div className="pt-2">
                  <Alert key="success" variant="success" show={resetSuccessShow}>
                    If you have an account with us, the reset password link has been sent to your email address. 
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

export default ForgotPassword;