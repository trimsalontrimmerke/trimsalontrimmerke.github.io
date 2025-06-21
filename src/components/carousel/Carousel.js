import React, { useState, useEffect } from "react";
import { Carousel as AntdCarousel } from "antd";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import "antd/dist/reset.css"; // ✅ works in AntD v5

import "./Carousel.css"; // Your custom styles

const Carousel = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const getDownloadURLWithRetry = async (item, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await getDownloadURL(item);
      } catch (err) {
        console.error(`Error fetching ${item.fullPath}, attempt ${attempt}:`, err);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    return null;
  };

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, "carousel/");
      const response = await listAll(storageRef);
      const urls = await Promise.all(
        response.items.map((item) => getDownloadURLWithRetry(item))
      );
      setPhotos(urls.filter((url) => url !== null));
    } catch (err) {
      setError("Failed to load photos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="carousel-container">
      {loading && <p>Loading photos...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && photos.length === 0 && <p>No photos available.</p>}

      {photos.length > 0 && (
        <AntdCarousel autoplay dots arrows>
          {photos.map((url, index) => (
            <div key={index} className="carousel-slide">
              <img
                src={url}
                alt={`Slide ${index + 1}`}
                className="carousel-image"
              />
            </div>
          ))}
        </AntdCarousel>
      )}
    </div>
  );
};

export default Carousel;
