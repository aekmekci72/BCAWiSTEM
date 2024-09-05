// MainApp.js (or index.js)
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App';
import HomePage from './HomePage';
import Board from './Board';
import Resources from './Resources';
import Updates from './Updates';
import Archive from './Archive';
import EditUpdates from './EditUpdates';
import EditResources from './EditResources';
import Login from './Login';
import Signup from './Signup';

import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

import reportWebVitals from './reportWebVitals';

function MainApp() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<App />} />
          <Route path="/board" element={<Board />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/editupdates" element={<ProtectedRoute element={EditUpdates} />} />
          <Route path="/editresources" element={<ProtectedRoute element={EditResources} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
