// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">BCA WiSTEM</Link>
      </div>
      <div className="nav-links">
        <Link to="/updates"> Updates </Link>
        <Link to="/resources">Resources</Link>
        <Link to="/board">Board</Link>
        <Link to="/archive">Archive</Link>
      </div>
    </nav>
  );
};

export default Navbar;