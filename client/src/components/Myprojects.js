import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock,FaPaperPlane, FaEye, FaDrawPolygon, FaGithub, FaRProject, FaSearch, FaSignInAlt, FaUser } from 'react-icons/fa';
// import {  } from 'react-icons/si'; 
import { Box, Typography, Button, TextField, Grid, Fade, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';
import proimg from '../assets/ProjectHub.jpg';
import Navbar from './Navbar';

const MyProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [req, setReq] = useState([]);
  const [userSearchResult, setUserSearchResult] = useState([]);
  const [userSkills, setUserSkills] = useState('');
  const [auth, setAuth] = useState([]);
  const [pro, setPro] = useState([]);
  const location = useLocation();
  const user = location.state?.id;
  const pass = location.state?.pass;

  useEffect(() => {
    fetch("/api/project", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_author: user,
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAuth(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [user]);
  console.log(userSkills);
  useEffect(() => {
    fetch("/api/search_projects", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        substring: userSkills[0],
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPro(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [user]);

  const navigate = useNavigate();
  useEffect(() => {
    fetch("/api/get_account", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user,
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.data.Skills);
        setUserSkills(data.data.Skills);
        setReq(data.data.Requests);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [user]);

  const handlegetResult = async () => {
    try {
      const response = await axios.post('/api/search_projects', {
        substring: searchTerm
      });
      if (response) {
        setSearchResult(response.data.projects);
        console.log(response.data.projects);
      }
    } catch (error) {
      console.error('Error finding:', error);
    }
  };

  const handleUserSearchResult = async () => {
    try {
      const response = await axios.post('/api/search_accounts', {
        name: userSearchTerm
      });
      if (response.data && response.data.accounts) {
        setUserSearchResult(response.data.accounts);
      }
    } catch (error) {
      console.error('Error finding users:', error);
    }
  };

  // New RecommendedProjects component
  console.log(pro.projects);
  const RecommendedProjects = ({ projects, user, pass }) => (
    <Box sx={{ marginTop: '0spx', textAlign: 'centre' }}>
      <section id="projects" className="projects-section" style={{alignItems: 'center'}}>
        <div className="projects-container" style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', }}>
          <h2 className="projects-title">Your Projects</h2>
          <div className="projects-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {projects && projects.length > 0 ? (
              projects.map((project, index) => (
                <div
                  variant="contained"
                  onClick={() => navigate('/project', { state: { id: project._id, ori_id: user }})}
                  key={index}
                  className='project-card'
                  style={{ width: '100%', maxWidth: '600px', height: '400px', margin: '10px 0' }}
                >
                  <div className="project-image-container" style={{ height: '40%' }}>
                    <img 
                      src={proimg}
                      alt='{project.Project_name}' 
                      className="project-image"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="project-links">
                      <a 
                        href={project.Project_URL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        Code
                      </a>
                    </div>
                  </div>
                  <div className="project-content" style={{ height: '60%', overflow: 'hidden' }}>
                    <h3 className="project-title">{project.Project_name}</h3>
                    <p className="project-description">{project.Project_descrp}</p>
                    
                    <div className="project-tech">
                      <h4 className="tech-title">Technologies Used:</h4>
                      <div className="tech-list">
                        {project.Skills.map((tech, techIndex) => (
                          <div key={techIndex} className="tech-item">
                            <span>{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body1" sx={{ marginLeft: '15px' }}>
                No projects found
              </Typography>
            )}
          </div>
        </div>
      </section>
    </Box>
  );

  return (
    <div>
      <Navbar user={user} pass={pass} pid={req} />
      <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto', marginTop: '6px' }}>
        <Grid container spacing={4} sx={{ padding: '0 20px' }}>
            <Box sx={{ marginBottom: '40px' }}>
                <RecommendedProjects projects={pro.projects} user={user} pass={pass} />
            </Box>
        </Grid>
      </Box>
    </div>
  );
};

export default MyProjects;
