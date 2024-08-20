import { Container } from "react-bootstrap";
import BlogFeed from "../BlogFeed/BlogFeed";
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";
import AppNavbar from "../Navbar/Navbar";

function Home() {
  return (
    <div className="App">
      <AppNavbar/>
      <VerticalNavBar />
      <Container>
        <BlogFeed />
      </Container>
      
    </div>
  );
}

export default Home;
