import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Button, Layout } from 'antd';
import {
  PictureOutlined,
  NotificationOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import './BackNav.css'; // We'll still use some custom CSS

const { Header } = Layout;

const BackNav = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const items = [
    {
      key: '/back/carousel',
      icon: <DashboardOutlined />,
      label: 'Carousel',
      onClick: () => navigate('/back/carousel')
    },
    {
      key: '/back/fotos',
      icon: <PictureOutlined />,
      label: 'Photos',
      onClick: () => navigate('/back/fotos')
    },
    {
      key: '/back/alert',
      icon: <NotificationOutlined />,
      label: 'Alerts',
      onClick: () => navigate('/back/alert')
    },
    {
      key: '/back/openingsuren',
      icon: <ClockCircleOutlined />,
      label: 'Hours',
      onClick: () => navigate('/back/openingsuren')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      style: { marginLeft: 'auto' }
    }
  ];

  return (
    <Header className="back-nav-header">
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        theme="dark"
        className="back-nav-menu"
      />
    </Header>
  );
};

export default BackNav;