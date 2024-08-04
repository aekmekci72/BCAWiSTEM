import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/resources')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const resourcesArray = Array.isArray(data) ? data : [data];
        setResources(resourcesArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
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

  if (loading) return <div className="loading">Loading resources...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div>
      <Navbar />
      <section id="updates" className="updates-container">
        <div className="updates-box bounce-in">
          <h2 className="updates-title">Resources and Opportunities</h2>
          <div className="updates-feed">
            {resources.map((resource, index) => (
              <div key={resource.id} className={`update-card pop-in`} style={{animationDelay: `${index * 0.1}s`}}>
                <div className="update-header">
                  <h3>{resource.author}</h3>
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                    {resource.link}
                  </a>
                </div>
                <p className="update-content">{resource.message}</p>
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

export default Resources;
