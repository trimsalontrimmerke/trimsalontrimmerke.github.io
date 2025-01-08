import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import './BackCarousel.css'; // Import CSS for styling
import BackNav from '../nav/BackNav';
import useAuth from '../../../hooks/useAuth';  // Import the custom hook

const BackCarousel = () => {
    const [images, setImages] = useState([]); // Stores the list of carousel images
    const [loading, setLoading] = useState(true); // Controls loading state
    const [errorMessage, setErrorMessage] = useState(''); // Stores error messages
    const [successMessage, setSuccessMessage] = useState(''); // Stores success messages
    const [selectedFile, setSelectedFile] = useState(null); // Holds the selected file for upload

    const { isLoggedIn, loading: authLoading, errorMessage: authError } = useAuth(); // Use the custom hook
    const storage = getStorage(); // Firebase storage reference

    useEffect(() => {
        if (isLoggedIn) {
            fetchImages(); // Fetch images from Firebase Storage if logged in
        }
    }, [isLoggedIn]);

    // Fetch images from Firebase Storage
    const fetchImages = async () => {
        setLoading(true);
        const storageRef = ref(storage, 'carousel/'); // Reference to 'carousel' folder in Firebase Storage

        try {
            const imageRefs = await listAll(storageRef); // List all images in the 'carousel' folder
            const imageUrls = await Promise.all(
                imageRefs.items.map(async (imageRef) => {
                    const url = await getDownloadURL(imageRef); // Get the download URL for each image
                    return {
                        name: imageRef.name,
                        publicUrl: url,
                    };
                })
            );
            setImages(imageUrls); // Set the image URLs in state
        } catch (error) {
            setErrorMessage('Error fetching images from Firebase.');
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Upload selected image to Firebase Storage
    const handleUpload = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        const storageRef = ref(storage, `carousel/${selectedFile.name}`); // Reference to the file in Firebase Storage

        setLoading(true);
        try {
            await uploadBytes(storageRef, selectedFile); // Upload file to Firebase
            setSuccessMessage('Image uploaded successfully.');
            fetchImages(); // Refresh the images list
            setSelectedFile(null); // Reset file input after successful upload
        } catch (error) {
            setErrorMessage('Error uploading image.');
        } finally {
            setLoading(false);
        }
    };

    // Delete image from Firebase Storage
    const handleDelete = async (filename) => {
        setLoading(true);
        const imageRef = ref(storage, `carousel/${filename}`); // Reference to the image in Firebase Storage

        try {
            await deleteObject(imageRef); // Delete the image from Firebase
            setSuccessMessage('Image deleted successfully!');
            fetchImages(); // Refresh the images list
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
                            <div key={image.name} className="BackCarousel-image-item">
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
