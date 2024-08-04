// MainApp.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App';
import HomePage from './HomePage';
import Board from './Board';
import Resources from './Resources';
import Updates from './Updates';
import Login from './Login';
import Archive from './Archive';
import Signup from './Signup';


import reportWebVitals from './reportWebVitals';

function MainApp() {
  return (
    <Router basename="/wistemweb">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<App />} />
          <Route path="/board" element={<Board />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/archive" element={<Archive />} />
    
        </Routes>
      </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();