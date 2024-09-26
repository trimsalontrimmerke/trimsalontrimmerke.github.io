import React from 'react';
import './Home.css';  // Import styles for the Home component
import Alert from './alert/Alert';       // Import Alert component
import Fotohome from './fotohome/Fotohome'; // Import Fotohome component
import Over from './over/Over';           // Import Over component


function Home() {
  return (
    <div className="home">
      <Alert />
      <Fotohome />
      <Over />
  
    </div>
  );
}

export default Home;