import React from 'react';
import './Fotohome.css';  // Import styles for the Alert component

function Fotohome() {
  return (
    <div class="top-picture">
    <img src={`${process.env.PUBLIC_URL}/img/foto rocky home.jpg`} alt="Top Picture"/>
</div>

  );
}

export default Fotohome;