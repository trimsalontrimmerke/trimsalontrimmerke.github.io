import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Button, TimePicker, Switch, Typography, Spin, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import moment from 'moment';
import BackNav from '../nav/BackNav';
import useAuth from '../../../hooks/useAuth';
import './BackOpening.css';

const { Title } = Typography;
const { Content } = Layout;

const BackOpeningHours = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [switchStates, setSwitchStates] = useState({});
  const { isLoggedIn, loading: authLoading } = useAuth();
  const db = getFirestore();

  const daysOrder = [
    'maandag', 'dinsdag', 'woensdag', 'donderdag', 
    'vrijdag', 'zaterdag', 'zondag'
  ];

  useEffect(() => {
    if (isLoggedIn) {
      fetchOpeningHours();
    }
  }, [isLoggedIn]);

  const fetchOpeningHours = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'openingstijden', 'weeklyHours');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const formData = {};
        const initialSwitchStates = {};
        
        daysOrder.forEach(day => {
          formData[day] = {
            open: data[day]?.open ? moment(data[day].open, 'HH:mm') : null,
            close: data[day]?.close ? moment(data[day].close, 'HH:mm') : null,
            isClosed: data[day]?.isClosed || false
          };
          initialSwitchStates[day] = data[day]?.isClosed || false;
        });
        
        form.setFieldsValue(formData);
        setSwitchStates(initialSwitchStates);
      } else {
        message.warning('Opening hours data not found.');
      }
    } catch (error) {
      message.error('Error fetching opening hours data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = (day, checked) => {
    setSwitchStates(prev => ({
      ...prev,
      [day]: checked
    }));
    form.setFieldsValue({
      [day]: {
        ...form.getFieldValue([day]),
        isClosed: checked
      }
    });
  };

  const handleUpdateHours = async () => {
    setUpdating(true);
    try {
      const values = await form.validateFields();
      const formattedData = {};
      
      daysOrder.forEach(day => {
        formattedData[day] = {
          open: values[day]?.open ? values[day].open.format('HH:mm') : '',
          close: values[day]?.close ? values[day].close.format('HH:mm') : '',
          isClosed: values[day]?.isClosed || false
        };
      });

      const docRef = doc(db, 'openingstijden', 'weeklyHours');
      await setDoc(docRef, formattedData, { merge: true });
      message.success('Opening hours updated successfully!');
    } catch (error) {
      message.error('Error updating opening hours.');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <BackNav />
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!isLoggedIn) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <BackNav />
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Title level={4}>Please log in to update opening hours</Title>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <BackNav />
      <Content className="back-opening-container">
        <Card
          title={
            <span>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              Opening Hours Management
            </span>
          }
          loading={loading}
          className="back-opening-card"
        >
          <Form form={form} layout="vertical">
            {daysOrder.map(day => (
              <div key={day} className="back-opening-day-section">
                <Title level={4} className="back-opening-day-title">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Title>
                
                <Form.Item
                  name={[day, 'isClosed']}
                  
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Closed"
                    unCheckedChildren="Open"
                    checked={switchStates[day]}
                    onChange={(checked) => handleSwitchChange(day, checked)}
                    className={`back-opening-switch ${switchStates[day] ? 'switch-closed' : 'switch-open'}`}
                  />
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => 
                    prevValues[day]?.isClosed !== currentValues[day]?.isClosed
                  }
                >
                  {({ getFieldValue }) => (
                    !getFieldValue([day, 'isClosed']) && (
                      <>
                        <Form.Item
                          name={[day, 'open']}
                          label="Opening Time"
                          rules={[{ required: true, message: 'Please set opening time' }]}
                        >
                          <TimePicker 
                            format="HH:mm" 
                            minuteStep={5}
                            showNow={false}
                            style={{ width: '100%' }}
                            placeholder="Select opening time"
                          />
                        </Form.Item>
                        
                        <Form.Item
                          name={[day, 'close']}
                          label="Closing Time"
                          rules={[{ required: true, message: 'Please set closing time' }]}
                        >
                          <TimePicker 
                            format="HH:mm" 
                            minuteStep={5}  
                            showNow={false}
                            style={{ width: '100%' }}
                            placeholder="Select closing time"
                          />
                        </Form.Item>
                      </>
                    )
                  )}
                </Form.Item>
              </div>
            ))}

            <Form.Item>
              <Button 
                type="primary" 
                onClick={handleUpdateHours}
                loading={updating}
                block
                size="large"
              >
                Update Opening Hours
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default BackOpeningHours;