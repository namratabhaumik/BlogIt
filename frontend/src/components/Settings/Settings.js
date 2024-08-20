import '../common.css';
import { Container, Tab, Row, Col, Nav } from 'react-bootstrap';
import AppNavbar from '../Navbar/Navbar';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';

function Settings() {
  return (
    <div className="App">
      <AppNavbar />
      <Container>
        <Tab.Container id="settings-tab-layout" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant='pills' className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Account</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={6}>
              <Tab.Content>
                <Tab.Pane eventKey="first"><ProfileSettings/></Tab.Pane>
                <Tab.Pane eventKey="second"><AccountSettings/></Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
}

export default Settings;