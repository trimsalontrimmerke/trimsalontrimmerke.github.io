import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, listAll, deleteObject, getDownloadURL } from 'firebase/storage'; // Firebase Storage imports
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp,  where, deleteDoc, doc} from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
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
  // Fetch images from Firestore and Firebase Storage
const fetchImages = async () => {
  setLoading(true);
  try {
 
    // Query Firestore for metadata
    const firestoreCollection = collection(db, "images"); // Use `db` here
   
    const q = query(firestoreCollection, orderBy("uploadTime", "desc")); // Order by upload time
    const querySnapshot = await getDocs(q);

    // Fetch download URLs from Firebase Storage
    const imageUrls = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const url = await getDownloadURL(ref(storage, data.path)); // Use `storage` here
        return { name: data.name, publicUrl: url, uploadTime: data.uploadTime.toDate() }; // Include upload time
      })
    );

    setImages(imageUrls);
  } catch (error) {
    setErrorMessage("Error fetching images.");
    console.error("Fetch error:", error);
  } finally {
    setLoading(false);
  }
};

  // Handle file selection for upload
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }
  
    const fileRef = ref(storage, `fotos/${selectedFile.name}`);
    setLoading(true);
  
    try {
      // Step 1: Upload file to Firebase Storage
      await uploadBytes(fileRef, selectedFile);
  
      // Step 2: Save metadata in Firestore with a timestamp
      const firestoreCollection = collection(db, "images"); // Use `db` for Firestore
      await addDoc(firestoreCollection, {
        name: selectedFile.name, // File name
        path: `fotos/${selectedFile.name}`, // File path in storage
        uploadTime: serverTimestamp() // Timestamp for upload time
      });
  
      // Step 3: Notify the user and reset the state
      setSuccessMessage("Image uploaded successfully!");
      setSelectedFile(null); // Reset selected file
      fetchImages(); // Refresh image list
    } catch (error) {
      setErrorMessage("Error uploading image.");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    setLoading(true);
    const fileRef = ref(storage, `fotos/${filename}`);
  
    try {
      // Step 1: Delete file from Firebase Storage
      await deleteObject(fileRef);
  
      // Step 2: Find and delete metadata from Firestore
      const firestoreCollection = collection(db, "images");
      const q = query(firestoreCollection, where("name", "==", filename)); // Query Firestore for the file's metadata
      const querySnapshot = await getDocs(q);
  
      // Delete all matching documents (should ideally only be one document)
      const deletePromises = querySnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(db, "images", docSnapshot.id))
      );
      await Promise.all(deletePromises);
  
      // Step 3: Notify the user and refresh the image list
      setSuccessMessage("Image deleted successfully!");
      fetchImages(); // Refresh image list
    } catch (error) {
      setErrorMessage("Error deleting image.");
      console.error("Delete error:", error);
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
