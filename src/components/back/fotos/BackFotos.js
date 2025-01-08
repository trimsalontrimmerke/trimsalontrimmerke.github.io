import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, listAll, deleteObject, getDownloadURL } from 'firebase/storage'; // Firebase Storage imports
import './BackFotos.css'; // Import CSS for styling
import BackNav from '../nav/BackNav';
import useAuth from '../../../hooks/useAuth';  // Import the custom hook

const BackFotos = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const { userToken, isLoggedIn, loading: authLoading, errorMessage: authError } = useAuth(); // Use the custom hook
  const storage = getStorage(); // Initialize Firebase Storage

  useEffect(() => {
    if (isLoggedIn) {
      fetchImages(); // Fetch images if logged in
    }
  }, [isLoggedIn]);

  // Fetch images from Firebase Storage
  const fetchImages = async () => {
    setLoading(true);
    try {
      const storageRef = ref(storage, 'fotos/');
      const result = await listAll(storageRef); // List all files in the "fotos" folder

      const imageUrls = await Promise.all(
        result.items.map(async (imageRef) => {
          const url = await getDownloadURL(imageRef); // Get the URL for each image
          return { name: imageRef.name, publicUrl: url };
        })
      );

      setImages(imageUrls.reverse()); // Display images in reverse order (latest first)
    } catch (error) {
      setErrorMessage('Error fetching images.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection for upload
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload selected image to Firebase Storage
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    const fileRef = ref(storage, `fotos/${selectedFile.name}`);
    setLoading(true);

    try {
      await uploadBytes(fileRef, selectedFile); // Upload file to Firebase Storage
      setSuccessMessage('Image uploaded successfully!');
      setSelectedFile(null); // Reset selected file
      fetchImages(); // Refresh image list
    } catch (error) {
      setErrorMessage('Error uploading image.');
    } finally {
      setLoading(false);
    }
  };

  // Delete image from Firebase Storage
  const handleDelete = async (filename) => {
    setLoading(true);
    const fileRef = ref(storage, `fotos/${filename}`);

    try {
      await deleteObject(fileRef); // Delete file from Firebase Storage
      setSuccessMessage('Image deleted successfully!');
      fetchImages(); // Refresh image list
    } catch (error) {
      setErrorMessage('Error deleting image.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <p className="loading-message">Loading authentication...</p>;
  }

  if (!isLoggedIn) {
    return <p className="warning-message">Please log in to manage photos.</p>;
  }

  if (loading) {
    return <p className="loading-message">Loading...</p>;
  }

  return (
    <div>
      <BackNav />
      <div className="BackFotos-container">
        <h2>Admin - Manage Photos</h2>
        {successMessage && <p className="BackFotos-success-message">{successMessage}</p>}
        {errorMessage && <p className="BackFotos-error-message">{errorMessage}</p>}

        <div className="BackFotos-upload-section">
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="BackFotos-file-input" 
            placeholder="Select an image to upload..." 
          />
          <button onClick={handleUpload} className="BackFotos-upload-button">Upload Image</button>
        </div>

        <h3>Uploaded Images</h3>
        <div className="BackFotos-image-list">
          {images.length === 0 ? (
            <p>No images uploaded.</p>
          ) : (
            images.map((image) => (
              <div key={image.publicUrl} className="BackFotos-image-item">
                <img 
                  src={image.publicUrl} 
                  alt={image.name} 
                  className="BackFotos-image-preview" 
                />
                <div className="BackFotos-image-details">
                  <p className="BackFotos-image-name">{image.name}</p>
                  <button 
                    onClick={() => handleDelete(image.name)} 
                    className="BackFotos-delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BackFotos;
