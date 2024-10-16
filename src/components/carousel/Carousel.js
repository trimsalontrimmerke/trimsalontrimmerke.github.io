import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Import styles for the carousel component
import API_URL from '../../config/config'; // Ensure the path to your config file is correct

const Carousel = () => {
  const [photos, setPhotos] = useState([]);
  const [photoNumber, setPhotoNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPhotos, setTotalPhotos] = useState(0); // Use state to dynamically set total photos
  const autoScrollInterval = useRef(null); // Use ref to hold interval ID

  useEffect(() => {
    fetchPhotos(); // Fetch photos on component mount
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

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${API_URL}carousel/images`); // Adjust API endpoint if needed
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      // Set the photos using the publicUrl
      setPhotos(data.map(photo => photo.publicUrl));
      setTotalPhotos(data.length); // Update totalPhotos based on fetched data
      setPhotoNumber(0); // Reset photo number to 0 to show the first photo
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextPhoto = () => {
    setPhotoNumber((prev) => (prev + 1) % totalPhotos); // Loop back to the first photo
  };

  const previousPhoto = () => {
    setPhotoNumber((prev) => (prev - 1 + totalPhotos) % totalPhotos); // Loop back to the last photo
  };

  const startAutoScroll = () => {
    autoScrollInterval.current = setInterval(nextPhoto, 5000); // 5-second interval
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current); // Clear interval to stop auto-scrolling
    }
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      <div className="carousel-slide">
        {loading && <p>Loading photos...</p>}
        {error && <p>Error fetching photos: {error}</p>}
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
