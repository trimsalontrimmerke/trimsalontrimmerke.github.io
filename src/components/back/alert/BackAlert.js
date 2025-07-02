import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  message, 
  Spin,
  Typography,
  Layout
} from 'antd';
import { 
  NotificationOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import BackNav from '../nav/BackNav';
import useAuth from '../../../hooks/useAuth';
import './BackAlert.css'; // We'll update this too

const { Title } = Typography;
const { Content } = Layout;

const BackAlert = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      fetchAlertData();
    }
  }, [isLoggedIn]);

  const fetchAlertData = async () => {
    setLoading(true);
    try {
      const medelingRef = doc(db, 'medeling', 'current');
      const docSnap = await getDoc(medelingRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        form.setFieldsValue({
          text: data.text,
          show: data.show
        });
      } else {
        message.warning('No alert data found in Firestore.');
      }
    } catch (error) {
      message.error('Error fetching alert data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAlert = async (values) => {
    setUpdating(true);
    try {
      const medelingRef = doc(db, 'medeling', 'current');
      await updateDoc(medelingRef, {
        text: values.text,
        show: values.show
      });
      message.success('Alert updated successfully!');
    } catch (error) {
      message.error('Error updating alert.');
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
          <Title level={4}>Please log in to update the alert</Title>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <BackNav />
      <Content className="back-alert-container">
        <Card 
          title={
            <span>
              <NotificationOutlined style={{ marginRight: 8 }} />
              Alert Management
            </span>
          }
          className="back-alert-card"
          loading={loading}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateAlert}
          >
            <Form.Item
              name="text"
              label="Alert Message"
              rules={[{ required: true, message: 'Please input the alert message!' }]}
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Enter your alert message..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="show"
              label="Display Alert"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={updating}
                block
                size="large"
              >
                Update Alert
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default BackAlert;