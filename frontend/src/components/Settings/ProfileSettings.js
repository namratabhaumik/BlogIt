import { useContext, useEffect, useState } from 'react';
import { Card, Form, InputGroup, Button, Alert, Modal } from "react-bootstrap";
import * as formik from 'formik';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import { CurrentUserContext, CurrentUserDataContext, updateCurrentUserData } from '../../App';
import { updateUserEmail } from '../../services/Authetication';
import { checkUsernameExists, updateUserData } from '../../api/User';

function FetchPasswordModal(props) {
  const { Formik } = formik;
  const schema = yup.object().shape(
    {
      email: yup.string().email().required("Required"),
      password: yup.string().required("Required")
    }
  );
  const { currentUserData, setCurrentUserData } = useContext(CurrentUserDataContext);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Email update requires password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h4>Please enter your password to update your email address</h4>
          <hr />
        </div>
        <div>
          <Formik
            validationSchema={schema}
            onSubmit={
              async values => {
                props.userPasswordCb(values.password)
              }
            }
            initialValues={{
              email: currentUserData.email,
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
                      isInvalid={!!errors.email}
                      disabled={true}
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
                    Continue
                  </Button>
                </div>
              </Form>
            )}

          </Formik>
          <div className='mt-2'>

          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ProfileSettings() {
  const { Formik } = formik;
  const { currentUserData, setCurrentUserData } = useContext(CurrentUserDataContext);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const schema = yup.object().shape(
    {
      name: yup.string(),
      username: yup.string().min(6, "Username is too short - should be 6 characters minimum").required("Please enter username"),
      email: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Please enter a valid email").required("Please enter email"),
      website: yup.string(),
      location: yup.string(),
      bio: yup.string()
    }
  );
  const [updateSuccessShow, updateSuccessSetShow] = useState(false);
  const [updateFailureShow, updateFailureSetShow] = useState(false);
  const [updateFailureMessage, setUpdateFailureMessage] = useState("Sorry, we failed to update your profile!");
  const [fetchPasswordModalShow, setFetchPasswordModalShow] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const onUserPassword = (password) => {
    setFetchPasswordModalShow(false);
    // Update the email address after we get the password from the user
    updateUserEmail(currentUserData.email, password, formValues.email, handleUpdateEmailSuccess, handleUpdateEmailError);
  }

  useEffect(() => {
    updateCurrentUserData(currentUser, setCurrentUserData);
  }, [currentUser, setCurrentUserData]);

  const handleUpdateUserDataSuccess = (response) => {
    console.log(response);
    updateSuccessSetShow(true);
    updateCurrentUserData(currentUser, setCurrentUserData);
  }

  const handleUpdateUserDataError = (error) => {
    console.log(error);
    updateFailureSetShow(false);
  }

  /**
   * Update the user details after the form is submitted
   * @param {*} values 
   */
  const handleFormSubmit = (values) => {
    console.log(values);
    setFormValues(values);
    if (values.email !== currentUserData.email) {
      // We need a password to update the email address
      setFetchPasswordModalShow(true);
    } else {
      if (values.username !== currentUserData.username) {
        checkUsernameExists(values.username, values, handleCheckUsernameSuccess, handleCheckUsernameError);
      } else {
        updateUserData(currentUserData.id, values, handleUpdateUserDataSuccess, handleUpdateUserDataError);
      }
    }
  }

  const handleUpdateEmailSuccess = () => {
    if (formValues.username !== currentUserData.username) {
      checkUsernameExists(formValues.username, formValues, handleCheckUsernameSuccess, handleCheckUsernameError);
    } else {
      updateUserData(currentUserData.id, formValues, handleUpdateUserDataSuccess, handleUpdateUserDataError);
    }
  }

  const handleUpdateEmailError = (error) => {
    console.log(error);
    updateFailureSetShow(true);
  }


  const handleCheckUsernameSuccess = (response, values) => {
    console.log(response);
    if (response.data && response.data.exists && response.data.exists === true) {
      setUpdateFailureMessage("Username is already taken! Please use another username.");
      updateFailureSetShow(true);
    } else {
      updateUserData(currentUserData.id, formValues, handleUpdateUserDataSuccess, handleUpdateUserDataError);
    }
  }

  const handleCheckUsernameError = (error) => {
    console.log(error);
    updateFailureSetShow(true);
  }

  return (
    <div className="App">
      <div style={{ marginBottom: '1rem' }}>
        <h2><Link to={'/user/' + currentUserData.username}>@{currentUserData.username}</Link></h2>
      </div>
      <Card>
        <Card.Body>
          <Formik
            validationSchema={schema}
            onSubmit={
              async values => {
                updateFailureSetShow(false);
                updateSuccessSetShow(false);
                handleFormSubmit(values);
              }
            }
            initialValues={{
              name: currentUserData.name,
              username: currentUserData.username,
              email: currentUserData.email,
              profilePicture: '',
              profileBanner: '',
              website: currentUserData.web_url,
              location: currentUserData.location,
              bio: currentUserData.bio,
              pronouns: currentUserData.pronouns,
              work: currentUserData.work_status
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
              handleReset,
              setFieldValue }) => (
              <Form noValidate onSubmit={handleSubmit} class="d-flex">

                <Form.Group className="mb-3" controlId="validationFormikName">
                  <Card.Title>
                    User
                  </Card.Title>
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

                <Form.Group controlId="profilePictureFile" className="mb-3">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    name="profilePicture"
                    onChange={(event) => {
                      console.log(event.currentTarget.files[0]);
                      setFieldValue("profilePicture", event.currentTarget.files[0]);
                    }}
                    onBlur={handleBlur}
                  />
                </Form.Group>

                <Form.Group controlId="profileBannerFile" className="mb-3">
                  <Form.Label>Profile Banner</Form.Label>
                  <Form.Control
                    type="file"
                    name="profileBanner"
                    onChange={(event) => {
                      console.log(event.currentTarget.files[0]);
                      setFieldValue("profileBanner", event.currentTarget.files[0]);
                    }}
                    onBlur={handleBlur}
                  />
                </Form.Group>

                <Card.Title>
                  Basic
                </Card.Title>

                <Form.Group className="mb-3" controlId="validationFormik03">
                  <Form.Label class="d-flex">Website URL</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="website"
                      value={values.website}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="https://example.com" />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="validationFormik03">
                  <Form.Label class="d-flex">Location</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="location"
                      value={values.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.location}
                      placeholder="For example, Knowhere" />
                    <Form.Control.Feedback className="d-flex" type="invalid">
                      {errors.location}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="validationFormik03">
                  <Form.Label class="d-flex">Bio</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      as="textarea"
                      name="bio"
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.bio}
                      placeholder="A short bio..." />
                    <Form.Control.Feedback className="d-flex" type="invalid">
                      {errors.bio}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text muted>
                    Tell everyone about yourself
                  </Form.Text>
                </Form.Group>

                <Card.Title>
                  Personal
                </Card.Title>

                <Form.Group className="mb-3" controlId="validationFormik03">
                  <Form.Label class="d-flex">Pronouns</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="pronouns"
                      value={values.pronouns}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.pronouns} />
                    <Form.Control.Feedback className="d-flex" type="invalid">
                      {errors.pronouns}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Card.Title>
                  Work
                </Card.Title>

                <Form.Group className="mb-3" controlId="validationFormik03">
                  <Form.Label class="d-flex">What do you do?</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="work"
                      value={values.work}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.work}
                      placeholder="For example, CEO at Wayne Enterprises" />
                    <Form.Control.Feedback className="d-flex" type="invalid">
                      {errors.work}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="validationFormik03">
                  <Form.Label class="d-flex">Education</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="education"
                      value={values.education}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.education}
                      placeholder="Where did you go to school?" />
                    <Form.Control.Feedback className="d-flex" type="invalid">
                      {errors.education}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type='submit' className='btn-pri-bg-color'>
                    Save Profile Information
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <div className='mt-2'>
            <Alert key="success" variant="success" show={updateSuccessShow}>
              You have successfully updated your profile!
            </Alert>
            <Alert key="error" variant="danger" show={updateFailureShow}>
              {updateFailureMessage}
            </Alert>
          </div>
        </Card.Body>
      </Card>
      <FetchPasswordModal show={fetchPasswordModalShow} onHide={() => { setFetchPasswordModalShow(false) }} userPasswordCb={onUserPassword} />
    </div>
  );
}

export default ProfileSettings;