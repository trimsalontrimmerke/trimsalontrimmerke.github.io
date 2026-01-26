import React from 'react';
import './Over.css';  // Import styles for the Alert component

function Over() {
  return (
   

<div class="content-container">
    <div class="section left-section">
        <h2>Over mij</h2>
        <p class="pOver">Hallo, ik ben Marie Stragier,</p>
        <p class="pOver">Sinds kinds af ben ik gepassioneerd door dieren. Ik ben opgegroeid met honden, konijnen en cavia’s en in 2018 ben ik gestart met paardrijden.</p>
        <p class="pOver">Na vier jaar middelbaar heb ik gekozen voor de richting dierenzorg in VABI te Roeselare. Na een opleiding van twee jaar, volgde ik nog een zevende jaar met als specialisatie hondentrimmen.</p>
        <p class="pOver">Een paar maanden geleden kreeg ik het voorstel om mijn stageplaats te huren, de klanten over te nemen en op zelfstandige basis te beginnen. Dit was voor mij een droom die werkelijkheid werd en heb deze kans met beide handen aangenomen.</p>
        <p class="pOver">Op 1 januari 2025 start ik dus als zelfstandig trimster in ’t Trimmerke in Beselare. Ik hoop vele hondjes (en hun baasjes) terug te zien die ik tijdens mijn stage al mocht verzorgen.</p>
        <p class="pOver">Tot binnenkort!<br/>Marie</p>
    </div>
    <div class="section right-section">
        <img src={`${process.env.PUBLIC_URL}/img/FotoMarie.jpg`}  alt="Marie En Rocky"/>
    </div>
</div>


  );
}

export default Over;