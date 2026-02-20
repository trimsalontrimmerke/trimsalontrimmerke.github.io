import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Button, 
  Upload, 
  List, 
  Image, 
  Spin, 
  Typography, 
  message,
  Space,
  Divider
} from 'antd';
import { 
  UploadOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  deleteObject, 
  getDownloadURL,
  listAll
} from 'firebase/storage';
import BackNav from '../nav/BackNav';
import useAuth from '../../../hooks/useAuth';
import './BackCarousel.css';
import PageSEO from '../../PageSEO';

const { Title } = Typography;
const { Content } = Layout;

const BackCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { isLoggedIn, loading: authLoading } = useAuth();
  const storage = getStorage();

  useEffect(() => {
    if (isLoggedIn) {
      fetchImages();
    }
  }, [isLoggedIn]);

  const fetchImages = async () => {
    setLoading(true);
    const storageRef = ref(storage, 'carousel/');
    
    try {
      const imageRefs = await listAll(storageRef);
      const imageUrls = await Promise.all(
        imageRefs.items.map(async (imageRef) => {
          const url = await getDownloadURL(imageRef);
          return {
            name: imageRef.name,
            publicUrl: url,
          };
        })
      );
      setImages(imageUrls);
    } catch (error) {
      message.error('Error fetching images from Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    const storageRef = ref(storage, `carousel/${file.name}`);
    
    try {
      await uploadBytes(storageRef, file);
      message.success(`${file.name} uploaded successfully!`);
      fetchImages();
    } catch (error) {
      message.error(`Error uploading ${file.name}.`);
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const handleDelete = async (image) => {
    setLoading(true);
    const imageRef = ref(storage, `carousel/${image.name}`);
    
    try {
      await deleteObject(imageRef);
      message.success(`${image.name} deleted successfully!`);
      fetchImages();
    } catch (error) {
      message.error(`Error deleting ${image.name}.`);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: handleUpload,
    showUploadList: false,
    multiple: false,
    accept: 'image/*'
  };

  if (authLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <PageSEO page="backCarousel" />
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
         <PageSEO page="backCarousel" />
        <BackNav />
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Title level={4}>Please log in to manage carousel images</Title>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
       <PageSEO page="backCarousel" />
      <BackNav />
      <Content className="back-carousel-container">
        <Card
          title={
            <Title level={2} style={{ margin: 0 }}>
              Carousel Management
            </Title>
          }
          className="back-carousel-card"
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Upload {...uploadProps}>
              <Button 
                icon={<UploadOutlined />} 
                type="primary"
                loading={uploading}
                size="large"
              >
                Upload Image
              </Button>
            </Upload>

            <Divider />

            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
              dataSource={images}
              loading={loading}
              locale={{ emptyText: 'No carousel images uploaded yet' }}
              renderItem={(image) => (
                <List.Item>
                  <Card
                    hoverable
                    cover={
                      <Image
                        src={image.publicUrl}
                        alt={image.name}
                        preview={false}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    }
                    actions={[
                      <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(image)}
                        loading={loading}
                      >
                        Delete
                      </Button>
                    ]}
                  >
                   
                  </Card>
                </List.Item>
              )}
            />
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default BackCarousel;