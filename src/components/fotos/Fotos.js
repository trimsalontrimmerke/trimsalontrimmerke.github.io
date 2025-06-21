// src/components/Fotos.js
import React, { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, storage } from '../../firebaseConfig';
import { 
  Pagination, 
  Row, 
  Col, 
  Empty, 
  Spin,
  Typography,
  Card,
  Image,
  notification
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import "./Fotos.css";

const { Title } = Typography;

function Fotos() {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photosPerPage, setPhotosPerPage] = useState(8);

  const calculatePhotosPerPage = () => {
    const width = window.innerWidth;
    if (width < 576) return 2;
    if (width < 768) return 4;
    if (width < 1200) return 6;
    return 8;
  };
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const firestoreCollection = collection(db, "images");
      const q = query(firestoreCollection, orderBy("uploadTime", "desc"));
      const querySnapshot = await getDocs(q);
  
      const photoData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          try {
            const url = await getDownloadURL(ref(storage, data.path));
            return { url, id: doc.id, ...data };
          } catch (err) {
            console.error(`Error loading image ${data.path}:`, err);
            return null;
          }
        })
      );
  
      setPhotos(photoData.filter(photo => photo !== null));
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Failed to load photos. Please try again later.");
      notification.error({
        message: 'Error Loading Photos',
        description: 'Could not load the photo gallery.',
      });
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchPhotos();
    setPhotosPerPage(calculatePhotosPerPage());

    const handleResize = () => {
      const newPhotosPerPage = calculatePhotosPerPage();
      if (newPhotosPerPage !== photosPerPage) {
        setPhotosPerPage(newPhotosPerPage);
        setCurrentPage(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

   return (
    <div className="fotos-container">
      <Title level={2} className="fotos-title">
        Foto's van onze blije klantjes
      </Title>

      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <>
          <Row gutter={[16, 16]} className="fotos-grid">
            {currentPhotos.map((photo) => (
              <Col 
                key={photo.id} 
                xs={24} 
                sm={12} 
                md={8} 
                lg={6} 
                xl={6}
              >
                <div className="photo-item">
                  <Image
                    src={photo.url}
                    alt={`Photo ${photo.id}`}
                    className="photo-img"
                    loading="lazy"
                    placeholder={
                      <div className="image-placeholder">
                        <Spin />
                      </div>
                    }
                    onError={() => {
                      notification.warning({
                        message: 'Image Load Error',
                        description: `Could not load image ${photo.id}`,
                      });
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>

          {photos.length > 0 && (
            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={photos.length}
                pageSize={photosPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
                itemRender={(current, type, originalElement) => {
                  if (type === 'prev') {
                    return (
                      <button className="ant-pagination-item-link">
                        <LeftOutlined /> Vorige
                      </button>
                    );
                  }
                  if (type === 'next') {
                    return (
                      <button className="ant-pagination-item-link">
                        Volgende <RightOutlined />
                      </button>
                    );
                  }
                  return originalElement;
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Fotos;