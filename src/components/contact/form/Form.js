import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card, Divider, Row, Col } from "antd";
import { MailOutlined, UserOutlined, PhoneOutlined} from '@ant-design/icons';
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import './Form.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ContactForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    emailjs.send(
      "service_xzv51jn",
      "template_bxml3jz",
      values,
      "eLTU-oozx3Gy3kjkz"
    )
    .then(() => {
      message.success('Bericht succesvol verzonden!');
      form.resetFields();
      navigate('/success');
    })
    .catch(() => {
      message.error('Er is een fout opgetreden. Probeer later opnieuw.');
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="modern-form-container">
      <Card className="form-card" bordered={false}>
       
        <Title level={3} className="form-title">Vragen?</Title>
        <Text className="form-subtitle">Stel ze hier!</Text>
     
        <Divider />
        <Text type="secondary" className="form-note">Afspraken worden enkel gepland via een telefoontje!</Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="contact-form"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="naam"
                label="Uw naam"
                rules={[{ required: true, message: 'Naam is verplicht' }]}
              >
                <Input 
                  placeholder="Vul uw naam in" 
                  prefix={<UserOutlined />}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="E-mailadres"
                rules={[
                  { required: true, message: 'E-mail is verplicht' },
                  { type: 'email', message: 'Ongeldig e-mailadres' }
                ]}
              >
                <Input 
                  placeholder="Vul uw e-mailadres in" 
                  prefix={<MailOutlined />}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="onderwerp"
            label="Onderwerp"
            rules={[{ required: true, message: 'Onderwerp is verplicht' }]}
          >
            <Input 
              placeholder="Wat is uw vraag over?" 
              size="large"
            />
          </Form.Item>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="hondnaam"
                label="Naam van de hond"
                rules={[{ required: true, message: 'Naam hond is verplicht' }]}
              >
                <Input 
                  placeholder="Naam van uw hond" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="ras"
                label="Ras van de hond"
                rules={[{ required: true, message: 'Ras is verplicht' }]}
              >
                <Input 
                  placeholder="Ras van uw hond" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="leeftijd"
                label="Leeftijd van de hond"
                rules={[{ required: true, message: 'Leeftijd is verplicht' }]}
              >
                <Input 
                  placeholder="Leeftijd in jaren"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="message"
            label="Uw vraag"
            rules={[{ required: true, message: 'Vraag is verplicht' }]}
          >
            <TextArea 
              rows={5} 
              placeholder="Stel uw vraag hier..." 
              size="large"
              style={{ resize: 'none' }}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="submit-btn"
              size="large"
              block
            >
              Verzenden
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ContactForm;