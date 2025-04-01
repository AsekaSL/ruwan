import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import profile from './profile2.jpg';
import axios from 'axios';

// Admin Panel Component
const AdminPanel = ({addLink,deleteLink}) => {
  const [zoomLink, setZoomLink] = useState('');
  const [savedLink, setSavedLink] = useState('');

  useEffect(() => {
    // Load saved link from localStorage
    const savedZoomLink = localStorage.getItem('zoomLink');
    if (savedZoomLink) {
      setSavedLink(savedZoomLink);
    }
  }, []);

  const handleSaveLink = () => {
    if (!zoomLink.trim()) {
      alert('Please enter a valid Zoom link');
      return;
    }
    addLink({link: zoomLink});
    localStorage.setItem('zoomLink', zoomLink);
    setSavedLink(zoomLink);
    setZoomLink('');
  };

  const handleDeleteLink = () => {
    if (window.confirm('Are you sure you want to delete the current Zoom link?')) {
      deleteLink();
      localStorage.removeItem('zoomLink');
      setSavedLink('');
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel - Manage Zoom Links</h1>
      <div className="zoom-link-form">
        <input
          type="text"
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          placeholder="http://zoom.us/j/123456789"
          className="zoom-link-input"
        />
        <button onClick={handleSaveLink} className="save-link-button">
          Save Zoom Link
        </button>
      </div>
      {savedLink && (
        <div className="current-link">
          <h3>Current Active Link:</h3>
          <div className="link-actions">
            <p>{savedLink}</p>
            <button onClick={handleDeleteLink} className="delete-link-button">
              Delete Link
            </button>
          </div>
        </div>
      )}
      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
};

// Home Component
const Home = () => {
  const [activeZoomLink, setActiveZoomLink] = useState('');

  useEffect(() => {
    // Load zoom link from localStorage
    const savedZoomLink = localStorage.getItem('zoomLink');
    if (savedZoomLink) {
      setActiveZoomLink(savedZoomLink);
    }
  }, []);

  const handleJoinClass = () => {
    if (activeZoomLink) {
      window.open(activeZoomLink, '_blank');
    } else {
      alert('No active class link available. Please check back later.');
    }
  };

  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <div className="content-wrapper">
        <div className="content-section">
          <h1>Welcome to <span className="highlight">Physics Class</span></h1>
          <p className="subtitle">Join your online physics class with just one click</p>
          
          <button onClick={handleJoinClass} className="join-button">Join Class Now</button>
          
          <div className="class-status">
            <p className="status-text">
              {activeZoomLink 
                ? "Class is ready to join! Click the button above."
                : "No class is currently scheduled. Please check back later."}
            </p>
          </div>

          <div className="contact-info">
            <h3>Contact Information:</h3>
            <div className="contact-details">
              <p><i className="phone-icon"></i> Phone: 071 683 6765</p>
              <p><i className="phone-icon"></i> Phone: 076 078 65645</p>
              <p><i className="phone-icon"></i> Phone: 071 683 6766</p>
              <a style={{textDecoration: 'none', color: 'inherit'}} href="https://maps.app.goo.gl/HejgekKon9joBYjAA"><i  className="location-icon"></i> Location: No. 03, Mihindu Mawatha, Mahara</a>
            </div>
          </div>

          <div className="social-links">
            <a onClick={() => navigate('/admin')} target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
              <i className="linkedin-icon"></i>
            </a>
            <a target="_blank" rel="noopener noreferrer" className="social-icon github">
              <i className="github-icon"></i>
            </a>
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-image-container">
            <img src={profile} alt="Physics Teacher" className="profile-image" />
          </div>
        </div>
      </div>
    </main>
  );
};

// Main App Component
function App() {

  const [link,setLink] = useState('');

  const getLink = () => {
    axios.get("http://43.204.214.221:3001/link")
    .then((response) => {
      if(response.data[0] != undefined) {
        setLink(response.data[0].link);
        localStorage.setItem('zoomLink', response.data[0].link);
      }
    })
    .catch((error) => {
      console.error("Error fetching link:", error);
    })
  };

  const addLink = (data) => {
    axios.post("http://43.204.214.221:3001/addlink",data)
    .then((response) => {

    })
    .catch((error) => {
      console.error("Error adding link:", error);
    });
  };

  const deleteLink = () => {
    axios.delete("http://43.204.214.221:3001/deletelink")
    .then((response) => {

    })
    .catch((error) => {
      console.error("Error adding link:", error);
    });
  };

  useEffect(() => {
    getLink();
  },[]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel addLink={(data) => addLink(data)} deleteLink={deleteLink} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
