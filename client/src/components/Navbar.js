import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import './Navbar.css'; // Add a CSS file for custom styling

function Navbar() {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Project Hub
        </Typography>
        
        {/* User Avatar and Dropdown */}
        <div className="navbar-user">
          <img
            src="https://via.placeholder.com/40"
            alt="User Avatar"
            className="user-avatar"
          />
          <div className="user-dropdown">
            <span className="dropdown-title">Account</span>
            <ul className="dropdown-menu">
              <li><button variant="contained" onClick={() => navigate('/UserProfile')} >My Profile</button></li>
              <li><a href="#settings">Settings</a></li>
              {/* Logout button linking to Sign In page */}
              <li><Link to="/signin">Logout</Link></li>
              <li><Link to="/removeaccount">Delete Account</Link></li>
            </ul>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
