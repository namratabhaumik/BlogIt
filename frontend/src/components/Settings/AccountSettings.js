import { useContext } from 'react';
import { Card, Form, InputGroup, Button, ListGroup, Modal, Alert } from "react-bootstrap";
import * as formik from 'formik';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import { useState } from "react";
import { deleteUserAccount, reauthenticateUser, updateUserPassword } from "../../services/Authetication";
import { useNavigate } from "react-router-dom";
import { CurrentUserDataContext } from '../../App';

YupPassword(yup);

function DeleteAccountModal(props) {
  const { Formik } = formik;
  const [deleteSuccessShow, deleteSuccessSetShow] = useState(false);
  const [deleteFailureShow, deleteFailureSetShow] = useState(false);
  const [failureMessage, setFailureMessage] = useState("Sorry, we failed to delete your account!");
  const schema = yup.object().shape(
    {
      email: yup.string().email().required("Required"),
      password: yup.string().required("Required")
    }
  );
  const navigate = useNavigate();

  const handleDeleteSuccess = async () => {
    deleteSuccessSetShow(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate("/");
  };

  const handleDeleteError = (error) => {
    console.log(error);
    deleteFailureSetShow(true);
  };

  const handleReauthSuccess = () => {
    deleteUserAccount(handleDeleteSuccess, handleDeleteError);
  };

  const handleReauthFailure = (error) => {
    console.log(error);
    setFailureMessage("Email and/or password is incorrect.")
    deleteFailureSetShow(true);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete you account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="danger" key="danger">
          Warning! You are deleting your account on BlogIt.
        </Alert>
        <div>
          <h4>Please enter your email and password to confirm deletion</h4>
          <hr />
        </div>
        <div>
          <Formik
            validationSchema={schema}
            onSubmit={
              async values => {
                reauthenticateUser(values.email, values.password, handleReauthSuccess, handleReauthFailure);
              }
            }
            initialValues={{
              email: '',
              password: '',
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

                <div className="d-grid gap-2">
                  <Button variant="primary" type='submit' size="lg">
                    Confirm
                  </Button>
                </div>
              </Form>
            )}

          </Formik>
          <div className='mt-2'>
            <Alert key="success" variant="success" show={deleteSuccessShow}>
              You have successfully created an account!
            </Alert>
            <Alert key="error" variant="danger" show={deleteFailureShow}>
              {failureMessage}
            </Alert>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function AccountSettings() {
  const { Formik } = formik;
  const schema = yup.object().shape(
    {
      email: yup.string().required("Please enter your email"),
      password: yup.string().required("Please enter your password"),
      newPassword: yup.string().password()
        .min(8, "Password must contain at least 8 characters")
        .minLowercase(1, "Password must contain at least one lower case character")
        .minUppercase(1, "Password must contain at least one upper case character")
        .minNumbers(1, "Password must contain at least one number")
        .minSymbols(1, "Password must contain at least one special character"),
      confirmNewPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
    }
  );
  const [deleteAccountModalShow, setDeleteAccountModalShow] = useState(false);
  const { currentUserData, setCurrentUserData } = useContext(CurrentUserDataContext);
  const [updatePasswdSuccessShow, updatePasswdSuccessSetShow] = useState(false);
  const [updatePasswdFailureShow, updatePasswdFailureSetShow] = useState(false);

  const handleUpdatePasswordSuccess = async () => {
    updatePasswdSuccessSetShow(true);
  }

  const handleUpdatePasswordFailure = (error) => {
    console.log(error);
    updatePasswdFailureSetShow(true);
  }

  return (
    <div className="App">
      <Card>
        <Card.Body>
          <Card.Title>Change password</Card.Title>
          <Formik
            validationSchema={schema}
            onSubmit={
              async values => {
                updatePasswdFailureSetShow(false);
                updatePasswdSuccessSetShow(false);
                updateUserPassword(
                  values.email,
                  values.password,
                  values.newPassword,
                  handleUpdatePasswordSuccess,
                  handleUpdatePasswordFailure
                );
              }
            }
            initialValues={{
              email: currentUserData.email,
              password: '',
              newPassword: '',
              confirmNewPassword: '',
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
                      placeholder="Enter email"
                      disabled={true}
                    />
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
                      isInvalid={!!errors.password}
                      placeholder="Enter password"
                    />
                    <Form.Control.Feedback className="d-flex" type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="validationFormik04">
                  <Form.Label class="d-flex">New password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={values.newPassword && !errors.newPassword}
                      isInvalid={!!errors.newPassword}
                      placeholder="Enter new password"
                    />
                    <Form.Control.Feedback className="d-flex" type="invalid">
                      {errors.newPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text>
                    Password should contain at least 8 characters including 1 lower case character, 1 upper case character, 1 number and 1 special character.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="validationFormik04">
                  <Form.Label class="d-flex">Confirm new password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="password"
                      name="confirmNewPassword"
                      value={values.confirmNewPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={values.confirmNewPassword && !errors.confirmNewPassword}
                      isInvalid={!!errors.confirmNewPassword}
                      placeholder="Confirm new password"
                    />
                    <Form.Control.Feedback className="d-flex" type="invalid">
                      {errors.confirmNewPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type='submit' size="lg">
                    Set new password
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <div className='mt-2'>
            <Alert key="success" variant="success" show={updatePasswdSuccessShow}>
              Your password has been updated!
            </Alert>
            <Alert key="error" variant="danger" show={updatePasswdFailureShow}>
              Failed to update your password.
            </Alert>
          </div>
        </Card.Body>
      </Card>
      <div className="mt-3">
        <Card bg="danger" text="white">
          <Card.Body>
            <Card.Title>
              Advanced (Danger Zone)
            </Card.Title>
            <Card.Text>
              <div>
                Deleting your account will:
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item variant="danger">Not delete your profile to maintain consistency on BlogIt.</ListGroup.Item>
                <ListGroup.Item variant="danger">Not delete all the content you have created, such as articles, comments, and other content, to preserve author attribution.</ListGroup.Item>
                <ListGroup.Item variant="danger">Remove your personalized access to BlogIt.</ListGroup.Item>
              </ListGroup>
            </Card.Text>
            <Button variant="warning" onClick={() => setDeleteAccountModalShow(true)}>Delete your account</Button>
          </Card.Body>
        </Card>
      </div>
      <DeleteAccountModal show={deleteAccountModalShow} onHide={() => setDeleteAccountModalShow(false)} />
    </div>
  );
}

export default AccountSettings;