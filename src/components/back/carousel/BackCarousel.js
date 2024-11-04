import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import API_URL from '../../../config/config'; // Ensure the path to your config file is correct
import './BackCarousel.css'; // Import CSS for styling
import BackNav from '../nav/BackNav';

const BackCarousel = () => {
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
            const response = await fetch(`${API_URL}carousel/images`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }

            const data = await response.json();
            setImages(data); // Set fetched images
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
            const response = await fetch(`${API_URL}carousel/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${userToken}`
                },
                body: formData
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
        const name = filename.split('/').pop();
        try {
            const response = await fetch(`${API_URL}carousel/images/${name}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${userToken}`
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
        return <p className="warning-message">Please log in to manage carousel images.</p>;
    }

    if (loading) {
        return <p className="loading-message">Loading...</p>;
    }

    return (
        <div>
            <BackNav />
            <div className="BackCarousel-container">
                <h2>Admin - Manage Carousel Images</h2>
                {successMessage && <p className="BackCarousel-success-message">{successMessage}</p>}
                {errorMessage && <p className="BackCarousel-error-message">{errorMessage}</p>}

                <div className="BackCarousel-upload-section">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="BackCarousel-file-input"
                        placeholder="Select an image to upload..."
                    />
                    <button onClick={handleUpload} className="BackCarousel-upload-button">Upload Image</button>
                </div>

                <h3>Uploaded Images</h3>
                <div className="BackCarousel-image-list">
                    {images.length === 0 ? (
                        <p>No images uploaded.</p>
                    ) : (
                        images.map((image) => (
                            <div key={image.publicUrl} className="BackCarousel-image-item">
                                <img
                                    src={image.publicUrl}
                                    alt={image.name}
                                    className="BackCarousel-image-preview"
                                />
                                <div className="BackCarousel-image-details">
                                    <p className="BackCarousel-image-name">{image.name}</p>
                                    <button
                                        onClick={() => handleDelete(image.name)} // Use image.name for deletion
                                        className="BackCarousel-delete-button"
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

export default BackCarousel;
