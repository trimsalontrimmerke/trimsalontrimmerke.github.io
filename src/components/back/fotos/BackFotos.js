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
  getDownloadURL 
} from 'firebase/storage';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  serverTimestamp,  
  where, 
  deleteDoc, 
  doc
} from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import BackNav from '../nav/BackNav';
import useAuth from '../../../hooks/useAuth';
import './BackFotos.css';
import PageSEO from '../../PageSEO';

const { Title } = Typography;
const { Content } = Layout;

const BackFotos = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]); // selected files for upload
  const { isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      fetchImages();
    }
  }, [isLoggedIn]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const firestoreCollection = collection(db, "images");
      const q = query(firestoreCollection, orderBy("uploadTime", "desc"));
      const querySnapshot = await getDocs(q);

      const imageUrls = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const url = await getDownloadURL(ref(storage, data.path));
          return { 
            id: doc.id,
            name: data.name, 
            publicUrl: url, 
            uploadTime: data.uploadTime.toDate() 
          };
        })
      );

      setImages(imageUrls);
    } catch (error) {
      message.error("Error fetching images.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Upload a single file (returns promise)
  const uploadFile = async (file) => {
    const fileRef = ref(storage, `fotos/${file.name}`);
    try {
      // Upload to Storage
      await uploadBytes(fileRef, file);
      
      // Add to Firestore
      await addDoc(collection(db, "images"), {
        name: file.name,
        path: `fotos/${file.name}`,
        uploadTime: serverTimestamp()
      });
      
      return { success: true, fileName: file.name };
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false, fileName: file.name, error };
    }
  };

  // Handle multiple file uploads
  const handleUploadAll = async () => {
    if (fileList.length === 0) {
      message.warning("No files selected.");
      return;
    }

    setUploading(true);
    const results = [];

    for (const file of fileList) {
      const result = await uploadFile(file.originFileObj); // AntD wraps file in originFileObj
      results.push(result);
    }

    // Show summary
    const succeeded = results.filter(r => r.success).length;
    const failed = results.length - succeeded;
    if (succeeded > 0) {
      message.success(`${succeeded} file(s) uploaded successfully.`);
    }
    if (failed > 0) {
      message.error(`${failed} file(s) failed.`);
    }

    // Refresh list and clear selection
    await fetchImages();
    setFileList([]);
    setUploading(false);
  };

  const handleDelete = async (image) => {
    setLoading(true);
    try {
      // Delete from Storage
      await deleteObject(ref(storage, `fotos/${image.name}`));
      
      // Delete from Firestore
      await deleteDoc(doc(db, "images", image.id));
      
      message.success(`${image.name} deleted successfully!`);
      fetchImages();
    } catch (error) {
      message.error(`Error deleting ${image.name}.`);
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Upload props: allow multiple, controlled fileList
  const uploadProps = {
    multiple: true,
    fileList: fileList,
    beforeUpload: () => false, // prevent auto upload
    onChange: ({ fileList }) => setFileList(fileList),
    accept: 'image/*',
    showUploadList: true, // show list of selected files
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (authLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <PageSEO page="backFotos" />
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
        <PageSEO page="backFotos" />
        <BackNav />
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Title level={4}>Please log in to manage photos</Title>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <PageSEO page="backFotos" />
      <BackNav />
      <Content className="back-fotos-container">
        <Card
          title={
            <Title level={2} style={{ margin: 0 }}>
              Photo Management
            </Title>
          }
          className="back-fotos-card"
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space direction="horizontal" size="middle">
              <Upload {...uploadProps}>
                <Button 
                  icon={<UploadOutlined />} 
                  type="primary"
                  disabled={uploading}
                >
                  Select Images
                </Button>
              </Upload>
              {fileList.length > 0 && (
                <Button 
                  type="primary" 
                  onClick={handleUploadAll}
                  loading={uploading}
                  disabled={uploading}
                >
                  Upload {fileList.length} file(s)
                </Button>
              )}
            </Space>

            <Divider />

            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
              dataSource={images}
              loading={loading}
              locale={{ emptyText: 'No images uploaded yet' }}
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
                    <Card.Meta
                      title={image.name}
                      description={`Uploaded: ${formatDate(image.uploadTime)}`}
                    />
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

export default BackFotos;