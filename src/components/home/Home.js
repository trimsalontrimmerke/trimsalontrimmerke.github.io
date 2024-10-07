import React, {useEffect} from 'react';
import './Home.css';  // Import styles for the Home component
import Alert from './alert/Alert';       // Import Alert component
import Fotohome from './fotohome/Fotohome'; // Import Fotohome component
import Over from './over/Over';           // Import Over component
import Carousel from '../carousel/Carousel'; // Import Carousel component
function Home() {
  useEffect(() => {
    // Update the page title dynamically
    document.title = "Home"; // Set your desired title here
  }, []); // Empty array ensures this runs only once when the component mounts
  return (
    <div className="home">
      <Alert />
      <Fotohome />
      <Over />
    <Carousel />
    </div>
  );
}

export default Home;