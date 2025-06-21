import React from 'react';
import { Alert } from 'antd';
import './Mededeling.css';

function Mededeling() {
  return (
    <Alert
      className="modern-alert"
      message="Afspraken worden enkel gepland via een telefoontje!"
      type="info"
      showIcon
      banner
    />
  );
}

export default Mededeling;