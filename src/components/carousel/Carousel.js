import React, { useState, useEffect, useRef } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import "./Carousel.css"; // Import your carousel styles

const Carousel = () => {
  const [photos, setPhotos] = useState([]); // Store photo URLs
  const [photoIndex, setPhotoIndex] = useState(0); // Track current photo index
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const autoScrollInterval = useRef(null); // Ref for auto-scroll interval
  const photosRef = useRef([]); // Ref to hold the latest photos array

  useEffect(() => {
    fetchPhotos(); // Fetch photos from Firebase
    startAutoScroll(); // Start auto-scrolling

    return () => stopAutoScroll(); // Cleanup interval on unmount
  }, []);

  // Sync photos state with ref whenever it changes
  useEffect(() => {
    photosRef.current = photos; // Update ref whenever `photos` changes
  }, [photos]);

  // Retry logic for fetching URLs
  const getDownloadURLWithRetry = async (item, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await getDownloadURL(item); // Attempt to get URL
      } catch (err) {
        if (err.code === "storage/object-not-found") {
          console.error(`404 error for ${item.fullPath}, attempt ${attempt}`);
        } else {
          console.error(`Error fetching ${item.fullPath}, attempt ${attempt}:`, err);
        }
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        } else {
          console.error(`Failed to fetch ${item.fullPath} after ${retries} attempts.`);
        }
      }
    }
    return null; // Return null if all retries fail
  };

  // Fetch photos from Firebase Storage
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const storage = getStorage(); // Initialize Firebase Storage
      const storageRef = ref(storage, "carousel/"); // Path to your folder in Storage
      const response = await listAll(storageRef); // Get all items in the folder

      // Fetch download URLs for each file with retry logic
      const urls = await Promise.all(
        response.items.map((item) => getDownloadURLWithRetry(item))
      );

      // Filter out null values (failed fetches)
      setPhotos(urls.filter((url) => url !== null));
      setPhotoIndex(0); // Start from the first photo
    } catch (err) {
      setError("Failed to load photos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the next photo
  const nextPhoto = () => {
    setPhotoIndex((prevIndex) => {
      const currentPhotos = photosRef.current; // Use ref to get the latest photos
      if (currentPhotos.length === 0) {
        return 0; // Ensure the index stays valid if there are no photos
      }
      return (prevIndex + 1) % currentPhotos.length; // Calculate the next index safely
    });
  };

  // Navigate to the previous photo
  const previousPhoto = () => {
    setPhotoIndex((prevIndex) => {
      const currentPhotos = photosRef.current; // Use ref to get the latest photos
      if (currentPhotos.length === 0) {
        return 0;
      }
      return (prevIndex - 1 + currentPhotos.length) % currentPhotos.length;
    });
  };

  // Start auto-scroll
  const startAutoScroll = () => {
    stopAutoScroll(); // Prevent multiple intervals
    autoScrollInterval.current = setInterval(() => {
      if (photosRef.current.length > 0) {
        nextPhoto(); // Use ref to access the latest photos array
      }
    }, 5000); // Change every 5 seconds
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
      
    >
      <div className="carousel-slide"
       onMouseEnter={stopAutoScroll} // Pause auto-scroll on hover
       onMouseLeave={startAutoScroll} // Resume auto-scroll on mouse leave
       >
     
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
