import React, { useState } from 'react';
import { 
  FaHome, FaUser, FaCode, FaBriefcase, 
  FaEnvelope 
} from 'react-icons/fa';
import { TbLogout } from "react-icons/tb";
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = ({ user, pass }) => {
  const location = useLocation(); // Detects the current route
  const navigate = useNavigate();  // For programmatic navigation

  const id = location.state?.id;   // Pass user ID
  const pwd = location.state?.pass; 

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const routes = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaHome /> },
    { path: '/myprofile', name: 'Profile', icon: <FaUser /> },
    { path: '/project', name: 'Projects', icon: <FaBriefcase /> },
    { path: '/contact', name: 'Contact', icon: <FaEnvelope /> },
    
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/dashboard">PROJECT HUB</a>
        </div>

        <div className="navbar-mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </div>

        <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {routes.map((route) => (
            <li key={route.path}>
              <a
                href={route.path}
                className={location.pathname === route.path ? 'active' : ''} 
                onClick={(e) => {
                  e.preventDefault();
                  navigate(route.path, { state: { id: id, pass: pwd } }); 
                }}
              >
                {route.icon} {route.name}
              </a>
              
            </li>
            
          ))}
          <li>
          <a href='/signIn'>
          <TbLogout /> Logout
          </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
