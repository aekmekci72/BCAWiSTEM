import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth(); // Get the current user from the auth context

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <Link to="/">BCA WiSTEM</Link>
        </div>
        <div className="nav-links">
          <Link to="/updates">Updates</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/board">Board</Link>
          <Link to="/archive">Archive</Link>
          {currentUser && (
            <>
              <Link to="/editupdates">Manage Updates</Link>
              <Link to="/editresources">Manage Resources</Link>
            </>
          )}
        </div>
        <button className="menu-toggle" onClick={toggleDropdown}>
          &#9776;
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            <Link to="/updates" onClick={toggleDropdown}>Updates</Link>
            <Link to="/resources" onClick={toggleDropdown}>Resources</Link>
            <Link to="/board" onClick={toggleDropdown}>Board</Link>
            <Link to="/archive" onClick={toggleDropdown}>Archive</Link>
            {currentUser && (
              <>
                <Link to="/editupdates" onClick={toggleDropdown}>Edit Updates</Link>
                <Link to="/editresources" onClick={toggleDropdown}>Edit Resources</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;