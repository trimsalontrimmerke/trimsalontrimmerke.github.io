import React, {useEffect} from 'react';
import './Regels.css'; // Import styles for the Regels component
import iconImage from './hondepootje icon.png'; // Import the icon image

function Regels() {
  useEffect(() => {
    // Update the page title dynamically
    document.title = "Regels"; // Set your desired title here
  }, []); 
  const backgroundImageUrl = `${process.env.PUBLIC_URL}/img/achtergrond3.jpg`;

  return (
    <div className="background-container" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      <div className="regels-container">
        <h1>Huisregels</h1>
        <ul className="lijst-regels">
          <li><p>Er wordt met een strak tijdsschema gewerkt. Breng daarom uw hond op tijd naar het salon.</p></li>
          <li><p>De honden zijn rustiger zonder het baasje in de buurt. Breng uw hond binnen op het afgesproken tijdstip. Op dat moment laat ik u weten wanneer u het dier terug kan ophalen.</p></li>
          <li><p>Laat uw hond zijn behoefte doen net voor u hem binnenbrengt. Zo gebeuren er geen ongelukjes in het trimsalon.</p></li>
          <li><p>Heeft uw hond medische problemen, allergieën, vlooien, epilepsie,... ? Laat het mij zeker op voorhand weten!</p></li>
          <li><p>Als u niet tevreden bent over de trimbeurt, laat u mij dit zo snel mogelijk weten. We bekijken dan samen hoe we voor een oplossing kunnen zorgen.</p></li>
          <li><p>Kan u niet aanwezig zijn op uw afspraak? Contacteer mij dan minstens 24 uur op voorhand. Zo kan ik misschien nog een ander baasje gelukkig maken.</p></li>
        </ul>
      </div>
    </div>
  );
}

export default Regels;
