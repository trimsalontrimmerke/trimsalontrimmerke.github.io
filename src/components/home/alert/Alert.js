import React, { useState, useEffect } from 'react';
import './Alert.css';
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { CloseOutlined } from '@ant-design/icons'; 

function Alert() {
  const [alertMessage, setAlertMessage] = useState('');
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const medelingRef = doc(db, 'medeling', 'current');
        const docSnap = await getDoc(medelingRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAlertMessage(data.text);
          setShow(data.show);
        }
      } catch (error) {
        console.error('Error fetching alert:', error);
      }
    };

    fetchAlertData();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!show || !isVisible) return null;

  return (
    <div className="alert-box">
      {alertMessage}
      <button className="alert-close" onClick={handleClose}>
        <CloseOutlined />
      </button>
    </div>
  );
}

export default Alert;