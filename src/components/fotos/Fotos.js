// src/components/Fotos.js
import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import {db , storage} from '../../firebaseConfig'
import "./Fotos.css"; // Your CSS styles

function Fotos() {
  const [photos, setPhotos] = useState([]);
  const [photosPerPage, setPhotosPerPage] = useState(getPhotosPerPage());
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamically determine the number of photos per page based on screen width
  function getPhotosPerPage() {
    const screenWidth = window.innerWidth;
    return screenWidth < 576 ? 1 : 6; // Mobile: 1 photo per page, others: 6 photos
  }

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      // Step 1: Fetch metadata from Firestore, ordered by upload time
      const firestoreCollection = collection(db, "images");
      const q = query(firestoreCollection, orderBy("uploadTime", "desc")); // Order by upload time, newest first
      const querySnapshot = await getDocs(q);
  
      // Step 2: Fetch download URLs for each image
      const urls = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const url = await getDownloadURL(ref(storage, data.path)); // Get the URL for the image from Firebase Storage
          return url;
        })
      );
  
      // Step 3: Set the sorted URLs
      setPhotos(urls); // Set the array of image URLs
  
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Failed to load photos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(); // Fetch photos on component mount
  }, []);

  // Handle page changes
  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(photos.length / photosPerPage)) {
      return; // Don't change page if it's out of bounds
    }
    setCurrentPage(page);
  };

  // Determine the photos to display on the current page
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);
  const totalPages = Math.ceil(photos.length / photosPerPage);

  // Update the number of photos per page on window resize
  window.onresize = () => {
    const newPhotosPerPage = getPhotosPerPage();
    if (newPhotosPerPage !== photosPerPage) {
      setPhotosPerPage(newPhotosPerPage);
      setCurrentPage(1);
    }
  };

  return (
    <div className="fotos-container">
      <h1 className="text-center">Foto’s van onze blije klantjes</h1>

      {loading && <p>Loading photos...</p>}
      {error && <p className="error">{error}</p>}

      <div className="fotos-grid">
        {currentPhotos.map((photo, index) => (
          <div className="fotos-gallery-item" key={index}>
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="fotos-img img-fluid"
              onError={() => console.error(`Failed to load image: ${photo}`)} // Handle image loading errors
            />
          </div>
        ))}
      </div>

      {/* Centered Pagination */}
      <nav className="fotos-pagination-container" aria-label="Page navigation">
        <ul className="fotos-pagination justify-content-center">
          <li className={`fotos-page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="fotos-page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Vorige
            </button>
          </li>

          {photosPerPage > 1 &&
            Array.from({ length: totalPages }, (_, index) => (
              <li
                className={`fotos-page-item ${currentPage === index + 1 ? "active" : ""}`}
                key={index}
              >
                <button
                  className="fotos-page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

          <li
            className={`fotos-page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="fotos-page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Volgende &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Fotos;
