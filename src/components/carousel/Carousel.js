import React, { useState, useEffect, useRef } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import "./Carousel.css"; // Import your carousel styles

const Carousel = () => {
  const [photos, setPhotos] = useState([]); // Store photo URLs
  const [photoIndex, setPhotoIndex] = useState(0); // Track current photo index
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const autoScrollInterval = useRef(null); // Ref for auto-scroll interval

  useEffect(() => {
    fetchPhotos(); // Fetch photos from Firebase
    startAutoScroll(); // Start auto-scrolling

    return () => stopAutoScroll(); // Cleanup interval on unmount
  }, []);

  // Fetch photos from Firebase Storage
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const storage = getStorage(); // Initialize Firebase Storage
      const storageRef = ref(storage, "carousel/"); // Path to your folder in Storage
      const response = await listAll(storageRef); // Get all items in the folder

      // Fetch download URLs for each file
      const urls = await Promise.all(
        response.items.map((item) => getDownloadURL(item))
      );

      setPhotos(urls); // Save URLs to state
      setPhotoIndex(0); // Start from the first photo
    } catch (err) {
      setError("Failed to load photos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the next photo
  const nextPhoto = () => {
    setPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  // Navigate to the previous photo
  const previousPhoto = () => {
    setPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  // Start auto-scroll
  const startAutoScroll = () => {
    stopAutoScroll(); // Prevent multiple intervals
    autoScrollInterval.current = setInterval(nextPhoto, 5000); // Change every 5 seconds
  };

  // Stop auto-scroll
  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={stopAutoScroll} // Pause auto-scroll on hover
      onMouseLeave={startAutoScroll} // Resume auto-scroll on mouse leave
    >
      <div className="carousel-slide">
        {loading && <p>Loading photos...</p>} {/* Loading state */}
        {error && <p className="error">{error}</p>} {/* Error message */}
        {photos.length > 0 ? (
          <img
            src={photos[photoIndex]}
            alt={`Slide ${photoIndex + 1}`}
            className="carousel-image"
          />
        ) : !loading && <p>No photos available.</p>} {/* No photos message */}
      </div>

      {/* Navigation Buttons */}
      <button
        className="prev"
        onClick={previousPhoto}
        disabled={photos.length === 0}
        aria-label="Previous photo"
      >
        &#10094;
      </button>
      <button
        className="next"
        onClick={nextPhoto}
        disabled={photos.length === 0}
        aria-label="Next photo"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
