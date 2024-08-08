import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Resources.css';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newResource, setNewResource] = useState({  link: '', message: '' });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = () => {
    fetch('https://wistemweb.onrender.com/resources')
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
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    fetch('https://wistemweb.onrender.com/addresource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newResource),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add resource');
        }
        return response.json();
      })
      .then(() => {
        fetchResources();
        setNewResource({ author: '', link: '', message: '' });
      })
      .catch(error => {
        console.error('Error adding resource:', error);
        setError(error);
      });
  };

  const handleDeleteResource = (id) => {
    fetch('https://wistemweb.onrender.com/delete_resource', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resource_id: id }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete resource');
        }
        return response.json();
      })
      .then(() => {
        fetchResources();
      })
      .catch(error => {
        console.error('Error deleting resource:', error);
        setError(error);
      });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
  };

  if (loading) return <div className="loading">Loading resources...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div>
      <Navbar />
      <section id="manage-resources" className="updates-container">
        <div className="updates-box bounce-in">
          <h2 className="updates-title">Manage Resources</h2>
          <form onSubmit={handleAddResource} className="add-resource-form">

            <input
              type="url"
              name="link"
              placeholder="Link"
              value={newResource.link}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              value={newResource.message}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Add Resource</button>
          </form>
          <div className="updates-feed">
            {resources.map((resource) => (
              <div key={resource.id} className="update-card pop-in">
                <div className="update-header">
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                    {resource.link}
                  </a>
                  <button onClick={() => handleDeleteResource(resource.id)} className="delete-button">
                  🗑️
                  </button>
                </div>
                <p className="update-content">{resource.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageResources;
