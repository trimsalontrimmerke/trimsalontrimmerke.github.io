import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Import styles for the carousel component
import API_URL from '../../config/config'; // Ensure the path to your config file is correct

const Carousel = () => {
  const [photos, setPhotos] = useState([]); // Store the photos fetched from the API
  const [photoNumber, setPhotoNumber] = useState(0); // Track the current photo index
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const autoScrollInterval = useRef(null); // Use ref to hold interval ID

  useEffect(() => {
    fetchPhotos(); // Fetch photos on component mount
    startAutoScroll(); // Start auto-scrolling

    // Cleanup on component unmount
    return () => {
      stopAutoScroll();
    };
  }, []);

  // Fetch photos from the storage API
  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${API_URL}carousel/images`); // API endpoint for fetching images
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      // Assuming 'data' returns an array of objects containing the publicUrl
      console.log(data); // Debug log to check the fetched data
      setPhotos(data.map(photo => photo.publicUrl)); // Extract public URLs from the data
      setPhotoNumber(0); // Reset photo number to 0 to show the first photo
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError(error.message); // Set the error message state
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  // Navigate to the next photo
  const nextPhoto = () => {
    if (photos.length === 0) return; // Prevent updating if no photos
    setPhotoNumber((prev) => (prev + 1) % photos.length); // Loop back to the first photo
  };

  // Navigate to the previous photo
  const previousPhoto = () => {
    if (photos.length === 0) return; // Prevent updating if no photos
    setPhotoNumber((prev) => (prev - 1 + photos.length) % photos.length); // Loop back to the last photo
  };

  // Start the auto-scrolling feature
  const startAutoScroll = () => {
    autoScrollInterval.current = setInterval(nextPhoto, 5000); // Change photo every 5 seconds
  };

  // Stop the auto-scrolling feature
  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current); // Clear interval to stop auto-scrolling
    }
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={stopAutoScroll} // Stop auto-scroll on hover
      onMouseLeave={startAutoScroll} // Resume auto-scroll on mouse leave
    >
      <div className="carousel-slide">
        {loading && <p>Loading photos...</p>} {/* Loading message */}
        {error && <p>Error fetching photos: {error}</p>} {/* Error message */}
        {photos.length > 0 ? (
          <img src={photos[photoNumber]} alt={`photo ${photoNumber}`} /> // Display current photo
        ) : (
          <p>No photos available.</p> // Message if no photos are available
        )}
      </div>

      {/* Buttons for manual slide navigation */}
      <button className="prev" onClick={previousPhoto} disabled={photos.length === 0}>
        &#10094;
      </button>
      <button className="next" onClick={nextPhoto} disabled={photos.length === 0}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
