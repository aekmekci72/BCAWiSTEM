import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Updates.css'; // Make sure to import the CSS file

const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

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

  const handleImageClick = (image) => {
    setExpandedImage(image);
  };

  const handleCloseClick = () => {
    setExpandedImage(null);
  };

  if (loading) return <div className="loading">Loading updates...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div>
      <Navbar />
      <section id="updates" className="updates-container">
        <div className="updates-box bounce-in">
          <h2 className="updates-title">Latest Updates</h2>
          <div className="updates-feed">
            {updates.map((update, index) => (
              <div key={update.id} className={`update-card pop-in`} style={{animationDelay: `${index * 0.1}s`}}>
                <div className="update-header">
                  <h3>{update.author}</h3>
                  <span className="update-time">{new Date(update.timestamp).toLocaleString()}</span>
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

export default Updates;