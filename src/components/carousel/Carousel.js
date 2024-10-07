import React, { useState, useEffect } from 'react';
import './Carousel.css'; // Import styles for the carousel component

const Carousel = () => {
  const [photos, setPhotos] = useState([]);
  const [photoNumber, setPhotoNumber] = useState(0);
  const totalPhotos = 8; // Total number of photos

  useEffect(() => {
    generatePhotoUrls(1, totalPhotos); // Generate image URLs on component mount
    startAutoScroll();

    // Cleanup on component unmount
    return () => {
      stopAutoScroll();
    };
  }, []);

  useEffect(() => {
    // Update photo display when photoNumber changes
    const handle = (event) => {
      if (event.key === 'ArrowRight') nextPhoto();
      if (event.key === 'ArrowLeft') previousPhoto();
    };
    window.addEventListener('keydown', handle);

    return () => {
      window.removeEventListener('keydown', handle);
    };
  }, [photoNumber]);

  let autoScrollInterval;

  const generatePhotoUrls = (start, end) => {
    const basePath = `${process.env.PUBLIC_URL}/img/carouselFotos/foto`;
    const fileExtension = '.jpg';
    const urls = [];

    for (let i = start; i <= end; i++) {
      urls.push(`${basePath}${i}${fileExtension}`);
    }
    setPhotos(urls);
  };

  const nextPhoto = () => {
    setPhotoNumber((prev) => (prev + 1) % totalPhotos); // Loop back to the first photo
  };

  const previousPhoto = () => {
    setPhotoNumber((prev) => (prev - 1 + totalPhotos) % totalPhotos); // Loop back to the last photo
  };

  const startAutoScroll = () => {
    autoScrollInterval = setInterval(nextPhoto, 5000); // 5-second interval
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval); // Clear interval to stop auto-scrolling
    }
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      <div className="carousel-slide">
        {photos.length > 0 && <img src={photos[photoNumber]} alt={`photo ${photoNumber}`} />}
      </div>

      {/* Buttons for manual slide navigation */}
      <button className="prev" onClick={previousPhoto}>
        &#10094;
      </button>
      <button className="next" onClick={nextPhoto}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
