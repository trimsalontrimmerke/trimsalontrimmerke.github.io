// src/components/Fotos.js
import React, { useState, useEffect } from 'react';
import './Fotos.css'; // Your CSS styles
import API_URL from '../../config/config'; // Ensure the path to your config file is correct

function Fotos() {
  const [photos, setPhotos] = useState([]);
  const [photosPerPage, setPhotosPerPage] = useState(getPhotosPerPage());
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getPhotosPerPage() {
    const screenWidth = window.innerWidth;
    return screenWidth < 576 ? 1 : 6; // Mobile: 1 photo per page, others: 6 photos
  }

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${API_URL}fotos/images`); // Adjust API endpoint if needed
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      // Reverse the photos array before setting it to state
      setPhotos(data.map(photo => photo.publicUrl));
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(); // Fetch photos on component mount
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(photos.length / photosPerPage)) {
      return; // Don't change page if it's out of bounds
    }
    setCurrentPage(page);
  };

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);
  const totalPages = Math.ceil(photos.length / photosPerPage);

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
      {error && <p>Error fetching photos: {error}</p>}

      <div className="fotos-grid">
        {currentPhotos.map((photo, index) => (
          <div className="fotos-gallery-item" key={index}>
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="fotos-img img-fluid"
              onError={() => console.error(`Failed to load image: ${photo}`)} // Error handling
            />
          </div>
        ))}
      </div>

      {/* Centered Pagination */}
      <nav className="fotos-pagination-container" aria-label="Page navigation">
        <ul className="fotos-pagination justify-content-center">
          <li className={`fotos-page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="fotos-page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Vorige
            </button>
          </li>

          {photosPerPage > 1 && (
            Array.from({ length: totalPages }, (_, index) => (
              <li className={`fotos-page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
                <button className="fotos-page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))
          )}

          <li className={`fotos-page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
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
