import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock,FaPaperPlane, FaEye, FaDrawPolygon, FaGithub, FaRProject, FaSearch, FaSignInAlt, FaUser } from 'react-icons/fa';
// import {  } from 'react-icons/si'; 
import { Box, Typography, Button, TextField, Grid, Fade, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';
import proimg from '../assets/ProjectHub.jpg';
import Navbar from './Navbar';

const Dashboard = () => {
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
        skills: userSkills,
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
    <Box sx={{ marginTop: '40px', textAlign: 'left' }}>
      <section id="projects" className="projects-section">
        <div className="projects-container">
          <h2 className="projects-title">Recommended Projects</h2>
          <div className="projects-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {projects && projects.length > 0 ? (
              projects.map((project, index) => (
                <div
                  variant="contained"
                  onClick={() => navigate('/viewproject', { state: { id: project._id, ori_id: user }})}
                  key={index}
                  className='project-card'
                  style={{ width: '100%', maxWidth: '600px', margin: '10px 0' }}
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
      <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto', marginTop: '60px' }}>
        <Grid container spacing={4} sx={{ padding: '0 20px' }}>
          {/* Left Column: Projects Section */}
          <Grid item xs={12} md={8}>
            

            <Grid container spacing={4}>
              {/* Search Users Section */}
              <Grid item xs={12} md={6}>
                <div className='form-group' style={{ display: 'flex', alignItems: 'center' }}>
                  <label className='input-label' style={{ flexGrow: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUserSearchResult();
                        }
                      }}
                      variant="outlined"
                      sx={{
                        borderRadius: '10px',
                        backgroundColor: '#2c3e50',
                        color: 'white',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#3498db',
                          },
                          '&:hover fieldset': {
                            borderColor: '#2980b9',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2980b9',
                          },
                          '& input': {
                            color: 'white',
                          },
                        },
                      }}
                    />
                  </label>
                  <IconButton onClick={handleUserSearchResult} sx={{ marginLeft: '10px', backgroundColor: '#3498db', borderRadius: '50%' }}>
                    <FaSearch style={{ color: 'white' }} />
                  </IconButton>
                </div>

                {/* User Search Results */}
                {userSearchResult.length > 0 && (
                  <Box sx={{ marginTop: '20px' }}>
                    {userSearchResult.map((account, index) => (
                      <Fade in key={index}>
                        <Box
                          onClick={() => navigate('/profile', { state: { id: userSearchTerm } })}
                          sx={{
                            cursor: 'pointer',
                            padding: '15px',
                            backgroundColor: '#34495e',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ecf0f1' }}>{account.user_id}</Typography>
                          {account.Projects && (
                            <Typography variant="body2" sx={{ color: '#bdc3c7' }}>
                              Projects: {account.Projects.length}
                            </Typography>
                          )}
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Search Projects Section */}
              <Grid item xs={12} md={6}>
                <div className='form-group' style={{ display: 'flex', alignItems: 'center' }}>
                  <label className='input-label' style={{ flexGrow: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      variant="outlined"
                      sx={{
                        borderRadius: '10px',
                        backgroundColor: '#2c3e50',
                        color: 'white',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#3498db',
                          },
                          '&:hover fieldset': {
                            borderColor: '#2980b9',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2980b9',
                          },
                        },
                      }}
                    />
                  </label>
                  <IconButton onClick={handlegetResult} sx={{ marginLeft: '10px', backgroundColor: '#3498db', borderRadius: '50%' }}>
                    <FaSearch style={{ color: 'white' }} />
                  </IconButton>
                </div>

                {/* Project Search Results */}
                {searchResult.length > 0 && (
                  <Box sx={{ marginTop: '20px' }}>
                    {searchResult.map((project, index) => (
                      <Fade in key={index}>
                        <Box
                          onClick={() => navigate('/viewproject', { state: { id: project._id, ori_id: user } })}
                          sx={{
                            cursor: 'pointer',
                            padding: '15px',
                            backgroundColor: '#34495e',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ecf0f1' }}>{project.Project_name}</Typography>
                          {project.project_descrp && (
                            <Typography variant="body2" sx={{ color: '#bdc3c7' }}>
                              Description: {project.Project_descrp}
                            </Typography>
                          )}
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Main Section: Recommended Projects */}
            <Box sx={{ marginBottom: '40px' }}>
              <RecommendedProjects projects={pro.projects} user={user} pass={pass} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ marginTop: '40px', textAlign: 'left' }}>
              <section id="projects" className="projects-section">
                <div className="projects-container">
                  <h2 className="projects-title">Your Projects</h2>
                  <div className="projects-grid">
                    {auth.projects && auth.projects.length > 0 ? (
                      auth.projects.map((project, index) => (
                        <div variant="contained"
                        onClick={() => navigate('/project', { state: { pexp: project._id, id: user, pass: pass, proname: project.Project_name } })} key={index} className='project-card' style={{ width: '100%', maxWidth: '250px', height: '200px', margin: '10px auto' }}>
                          <div className="project-image-container" style={{ height: '60%' }}>
                            <img 
                              src={proimg}
                              alt={project.Project_name} 
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
                          <div className="project-content" style={{ height: '40%', overflow: 'hidden' }}>
                            <h3 className="project-title" style={{ fontSize: '1rem' }}>{project.Project_name}</h3>
                            {/* <p className="project-description" style={{ fontSize: '0.875rem' }}>{project.Project_descrp}</p> */}
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
          </Grid>
        </Grid>

        {/* Create New Project Button */}
        <Box sx={{ position: 'fixed', bottom: 30, right: 30 }}>
          <IconButton
            color="primary"
            size="large"
            onClick={() => navigate('/new-project', { state: { user: user, pwd: pass } })}
            sx={{
              backgroundColor: '#3f51b5',
              color: '#fff',
              '&:hover': { backgroundColor: '#3f51b5' },
              transition: 'transform 0.2s ease-in-out',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <FaDrawPolygon sx={{ fontSize: 60 }} />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
