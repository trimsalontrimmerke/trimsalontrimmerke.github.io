import React, { useState } from 'react';
import './Fotos.css'; // Your CSS styles

// Function to simulate fetching photo URLs
const fetchPhotos = () => {
  const totalPhotos = 8; // Adjust total number of photos as needed
  const basePath = `${process.env.PUBLIC_URL}/img/fotos/foto`;
  const fileExtension = '.jpg';

  // Create an array of photo URLs
  return Array.from({ length: totalPhotos }, (_, index) => {
    return `${basePath}${totalPhotos - index}${fileExtension}`;
  });
};

function Fotos() {
  const [photos, setPhotos] = useState(fetchPhotos());
  const [photosPerPage, setPhotosPerPage] = useState(getPhotosPerPage());
  const [currentPage, setCurrentPage] = useState(1);

  function getPhotosPerPage() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 576) {
      return 1; // Mobile: 1 photo per page
    }
    return 6; // Tablet and Desktop: 6 photos per page
  }

  const handlePageChange = (page) => {
    // Ensure page is within valid range
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

      <div className="fotos-grid">
        {currentPhotos.map((photo, index) => (
          <div className="fotos-gallery-item" key={index}>
            <img src={photo} alt={`Photo ${index + 1}`} className="fotos-img img-fluid" />
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
              disabled={currentPage === 1} // Disable if on the first page
            >
              &laquo; Vorige
            </button>
          </li>

          {/* Conditional rendering of page numbers */}
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
              disabled={currentPage === totalPages} // Disable if on the last page
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
