import React, { useEffect } from 'react';
import './Regels.css';
import { List, Card, Typography } from 'antd';

const { Title, Text } = Typography;

function Regels() {
  useEffect(() => {
    document.title = "Huisregels - Trimsalon";
  }, []);

  const backgroundImageUrl = `${process.env.PUBLIC_URL}/img/achtergrond3.jpg`;

  const rules = [
    "Er wordt met een strak tijdsschema gewerkt. Breng daarom uw hond op tijd naar het salon.",
    "De honden zijn rustiger zonder het baasje in de buurt. Breng uw hond binnen op het afgesproken tijdstip. Op dat moment laat ik u weten wanneer u het dier terug kan ophalen.",
    "Laat uw hond zijn behoefte doen net voor u hem binnenbrengt. Zo gebeuren er geen ongelukjes in het trimsalon.",
    "Heeft uw hond medische problemen, allergieën, vlooien, epilepsie,... ? Laat het mij zeker op voorhand weten!",
    "Als u niet tevreden bent over de trimbeurt, laat u mij dit zo snel mogelijk weten. We bekijken dan samen hoe we voor een oplossing kunnen zorgen.",
    "Kan u niet aanwezig zijn op uw afspraak? Contacteer mij dan minstens 24 uur op voorhand. Zo kan ik misschien nog een ander baasje gelukkig maken.",
    "Wanneer u niet komt opdagen op een gemaakte afspraak, ontvangt u bij de eerste keer een waarschuwing. Bij een volgende keer zal 50% van de kosten van de gemiste behandeling bij de volgende afspraak in rekening worden gebracht.",
    "Bij het maken van een afspraak gaat u akkoord met bovenstaande regels."
  ];

  return (
    <div 
      className="background-container"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <Card className="rules-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>Huisregels</Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>Onze afspraken voor een prettige ervaring</Text>
        </div>

        <List
          className="rules-list"
          itemLayout="horizontal"
          dataSource={rules}
          renderItem={(item) => (
            <List.Item>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div className="paw-icon" />
                <Text style={{ fontSize: '16px' }}>{item}</Text>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default Regels;