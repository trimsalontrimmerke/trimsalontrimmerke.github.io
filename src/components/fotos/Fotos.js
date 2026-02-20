// src/components/Fotos.js
import React, { useState, useEffect, useRef } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, storage } from '../../firebaseConfig';
import { 
  Pagination, 
  Empty, 
  Spin,
  Typography,
  Image,
  notification
} from 'antd';
import { LeftOutlined, RightOutlined, EyeOutlined } from '@ant-design/icons';
import { useInView } from 'react-intersection-observer';
import "./Fotos.css";
import PageSEO from '../PageSEO.js';

const { Title } = Typography;

// Skeleton loader component
const SkeletonItem = () => (
  <div className="fotos-grid-item skeleton">
    <div className="image-wrapper skeleton-pulse"></div>
  </div>
);

// Intersection observer wrapper for fade-in
const FadeInSection = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return (
    <div ref={ref} className={`fade-section ${inView ? 'visible' : ''}`}>
      {children}
    </div>
  );
};

function Fotos() {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photosPerPage, setPhotosPerPage] = useState(8);
  const photosPerPageRef = useRef(photosPerPage);

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

    // Set initial photosPerPage
    const initial = calculatePhotosPerPage();
    setPhotosPerPage(initial);
    photosPerPageRef.current = initial;

    const handleResize = () => {
      const newPhotosPerPage = calculatePhotosPerPage();
      if (newPhotosPerPage !== photosPerPageRef.current) {
        setPhotosPerPage(newPhotosPerPage);
        photosPerPageRef.current = newPhotosPerPage;
        setCurrentPage(1); // Reset to first page when layout changes
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array – works because we use ref

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Removed scroll-to-top
  };

  // Show skeleton grid while loading
  if (loading) {
    return (
      <div className="fotos-container">
        <PageSEO page="fotos" />
        <Title level={2} className="fotos-title">
          Foto's van onze blije klantjes
        </Title>
        <div className="fotos-grid">
          {Array.from({ length: photosPerPage }).map((_, i) => (
            <SkeletonItem key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fotos-container">
        <PageSEO page="fotos" />
        <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  return (
    <div className="fotos-container">
      <PageSEO page="fotos" />
      <Title level={2} className="fotos-title">
        Foto's van onze blije klantjes
      </Title>

      <div className="fotos-grid">
        {currentPhotos.map((photo) => (
          <FadeInSection key={photo.id}>
            <div className="fotos-grid-item">
              <div className="image-wrapper">
                <Image
                  src={photo.url}
                  alt="Hond bij trimsalon 't Trimmerke"
                  className="gallery-image"
                  loading="lazy"
                  preview={{
                    mask: (
                      <div className="image-mask">
                        <EyeOutlined /> Bekijken
                      </div>
                    ),
                  }}
                  placeholder={
                    <div className="image-placeholder">
                      <Spin />
                    </div>
                  }
                  onError={() => {
                    notification.warning({
                      message: 'Image Load Error',
                      description: `Could not load image`,
                    });
                  }}
                />
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>

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
                  <button className="custom-pagination-prev">
                    <LeftOutlined /> Vorige
                  </button>
                );
              }
              if (type === 'next') {
                return (
                  <button className="custom-pagination-next">
                    Volgende <RightOutlined />
                  </button>
                );
              }
              return originalElement;
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Fotos;