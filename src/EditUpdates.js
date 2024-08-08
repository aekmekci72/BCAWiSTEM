import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Import the auth object from your firebase.js
import Navbar from './Navbar';
import './Updates.css';

const ManageUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [newUpdateImages, setNewUpdateImages] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async (email) => {
      try {
        const response = await fetch(`http://localhost:5000/get_role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user role');
        }

        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const email = user.email;
        fetchUserRole(email);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetch('https://wistemweb.onrender.com/updates')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const updatesArray = Array.isArray(data) ? data : [data];
        setUpdates(updatesArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching updates:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleAddUpdate = () => {
    const newUpdate = {
      author: userRole,
      content: newUpdateContent,
      timestamp: new Date().toISOString(),
      images: newUpdateImages,
    };

    fetch('http://localhost:5000/addupdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUpdate),
    })
      .then(response => response.json())
      .then(data => {
        setUpdates([data, ...updates]);
        setNewUpdateContent('');
        setNewUpdateImages([]);
      })
      .catch(error => {
        console.error('Error adding update:', error);
      });
  };

  const handleDeleteUpdate = (id) => {
    fetch('http://localhost:5000/delete_update', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ update_id: id }),
    })
      .then(() => {
        setUpdates(updates.filter(update => update.id !== id));
      })
      .catch(error => {
        console.error('Error deleting update:', error);
      });
  };

  const handleRemoveImage = (index) => {
    setNewUpdateImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  const handleImageClick = (image) => {
    setExpandedImage(image);
  };

  const handleCloseClick = () => {
    setExpandedImage(null);
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      setNewUpdateImages((prevImages) => [...prevImages, ...data.imagePaths]);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  if (loading) return <div className="loading">Loading updates...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div>
      <Navbar />
      <section id="manage-updates" className="updates-container">
        <div className="updates-box bounce-in">
          <h2 className="updates-title">Manage Updates</h2>
          <div className="add-update">
            <textarea
              value={newUpdateContent}
              onChange={(e) => setNewUpdateContent(e.target.value)}
              placeholder="Write your update here..."
            />
            <input type="file" multiple onChange={handleImageUpload} />
            <div className="image-previews">
              {newUpdateImages.map((imagePath, index) => (
                <div key={index} className="image-preview-container">
                  <img
                    src={imagePath}
                    alt={`preview-${index}`}
                    className="image-preview"
                  />
                  <button
                    className="remove-image-button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleAddUpdate}>Add Update</button>
          </div>
          <div className="updates-feed">
            {updates.map((update, index) => (
              <div key={update.id} className={`update-card pop-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="update-header">
                  <h3>{update.author}</h3>
                  <span className="update-time">{new Date(update.timestamp).toLocaleDateString()}</span>
                  <button className="delete-button" onClick={() => handleDeleteUpdate(update.id)}>🗑️</button>
                </div>
                <p className="update-content">{update.content}</p>
                {update.images && update.images.length > 0 && (
                  <div className="update-images">
                    {update.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`update-${update.id}-${imgIndex}`}
                        className="update-image"
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {expandedImage && (
        <div className="expanded-image-overlay" onClick={handleCloseClick}>
          <div className="expanded-image-container">
            <img src={expandedImage} alt="Expanded" className="expanded-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUpdates;
