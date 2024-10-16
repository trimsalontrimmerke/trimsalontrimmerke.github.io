import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import API_URL from '../../../config/config'; // Ensure the path to your config file is correct

const BackFotos = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userToken, setUserToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const auth = getAuth();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUserToken(token);
        setIsLoggedIn(true);
        fetchImages(token); // Fetch images when logged in
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch images from the backend
  const fetchImages = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}fotos/images`, { // Corrected endpoint
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImages(data);
    } catch (error) {
      setErrorMessage('Error fetching images.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload selected image
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}fotos/upload`, { // Corrected endpoint
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}` // Pass the Firebase Auth token
        },
        body: formData // Send the file data
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      setSuccessMessage(result.message);
      setSelectedFile(null); // Reset the selected file
      fetchImages(userToken); // Refresh the images list
    } catch (error) {
      setErrorMessage('Error uploading image.');
    } finally {
      setLoading(false);
    }
  };

  // Delete an image
  const handleDelete = async (filename) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}fotos/images/${filename}`, { // Corrected endpoint
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userToken}` // Pass the Firebase Auth token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setSuccessMessage('Image deleted successfully!');
      fetchImages(userToken); // Refresh the images list
    } catch (error) {
      setErrorMessage('Error deleting image.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <p>Please log in to manage photos.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Admin - Manage Photos</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Image</button>
      </div>

      <h3>Uploaded Images</h3>
      <div className="image-list">
        {images.length === 0 ? (
          <p>No images uploaded.</p>
        ) : (
          images.map((image) => (
            <div key={image.name} className="image-item">
              <img src={image.publicUrl} alt={image.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
              <div>
                <p>{image.name}</p>
                <button onClick={() => handleDelete(image.name)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BackFotos;
