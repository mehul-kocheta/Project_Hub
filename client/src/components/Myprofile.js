import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Avatar, Grid, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaDownload, FaUserGraduate, FaEye,
  FaUniversity, FaCode, FaBookReader, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import Navbar from './Navbar';
import proimg from '../assets/ProjectHub.jpg';

const MyProfile = () => {
  const location = useLocation();
  const user = location.state?.id;
  // const pid = location.state?.req;
  const ori_id = location.state?.ori_id;
  const pass = location.state?.pass;
  const [userData, setUserData] = useState(null);
  // const [pid, setpid] = useState('');
  const navigate = useNavigate();
  console.log(user);
  let pid = '';

  

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
        setUserData(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [user]);

  const acceptRequest = async () => {
    try {
      await axios.post('/api/accept_contributor', {
        project_id: pid,
        id: user,
        pwd: pass,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Navbar />
    <Container>
      {console.log(userData)}
    <section id="info" className="info-section">
      <div className="info-container">
        <div className="info-left animate">
          <div className="profile-image-container">
            <img 
              src='#'
              alt={userData.data.user_id}
              className="profile-image"
            />
            {console.log(userData.data.user_id)}
            {/* <div className="profile-image-overlay">
              <span>Full Stack Developer</span>
            </div> */}
          </div>
          <div className="quick-info">
            {/* <div className="quick-info-item">
              <FaMapMarkerAlt className="quick-info-icon" />
              <span></span>
            </div> */}
            
            <div className="education-info">
              <div className="education-item">
                <FaUserGraduate className="quick-info-icon" />
                <div className="education-details">
                  <span className="degree">{userData.data.Degree}</span>
                  {/* <span className="year">2022 - 2026</span> */}
                </div>
              </div>
              <div className="education-item">
                <FaUniversity className="quick-info-icon" />
                <div className="education-details">
                  <span className="college">{userData.data.College_name}</span>
                </div>
              </div>

              {/* <div className="education-item">
                <FaCode className="quick-info-icon" />
                <div className="education-details">
                  <span className="major">Major: Mechanical Engineering</span>
                </div>
              </div> */}

              {/* <div className="education-item">
                <FaBookReader className="quick-info-icon" />
                <div className="education-details">
                  <span className="minor">Minor: Software Engineering</span>
                </div>
              </div> */}
            </div>

            {/* <a href={CV} target='_blank' className="download-cv">
              <FaDownload /> Download CV
            </a> */}
          </div>
        </div>

        <div className="info-right">
          <div className="info-header animate">
            <h2 className="info-name">{userData.data.user_id}</h2>
            {/* <p className="info-title">Full Stack Developer</p> */}
          </div>
          
          <div className="info-details animate">
            <div className="contact-grid">
              
              <div className="info-item">
                <a href={userData.data.Email} className="contact-link">
                  <div className="icon-box">
                    <FaEnvelope className="contact-icon" />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">{userData.data.Email}</span>
                  </div>
                </a>
              </div>
              
              <div className="info-item">
                <a href={userData.data.github} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="icon-box">
                    <FaGithub className="contact-icon" />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">GitHub</span>
                    <span className="contact-value">{userData.data.github}</span>
                  </div>
                </a>
              </div>
              
              <div className="info-item">
                <a href={userData.data.Linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="icon-box">
                    <FaLinkedin className="contact-icon" />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">LinkedIn</span>
                    <span className="contact-value">{userData.data.Linkedin}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="info-bio animate">
            <h3>About Me</h3>
            <p>
            {userData.data.about}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="skills" className="skills-section">
      <div className="skills-container">
        <h2 className="skills-title">My Skills</h2>
        <p className="skills-subtitle">Technologies I work with</p>
        
        <div className="skills-grid">
        <div className="skill-category">
          <div className="skills-list">
            {userData.data.Skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="skill-item">
                <span className="skill-name">{skill}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
          
        
      </div>
    </section>

    {/* Projects */}
    <section id="projects" className="projects-section">
      <div className="projects-container">
      <h2 className="projects-title">Featured Projects</h2>

      <div className="projects-grid">
        {userData.data.Projects && userData.data.Projects.length > 0 ? (
          userData.data.Projects.map((projectId) => {
            const project = userData.projects.find((proj) => proj._id === projectId);
            return (
              <div 
            key={projectId} 
            className="project-card"
            style={{ animationDelay: `${projectId * 0.2}s` }}
            variant="contained" onClick={() => navigate('/project', { state: { id: user , pexp: project._id, pass: pass} })}
          >
            <div className="project-image-container">
              <img 
                src={proimg}
                alt={project.Project_name} 
                className="project-image"
              />
              <div className="project-links">
                <a 
                  href={project.Project_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  <FaGithub /> Code
                </a>
                {/* <a 
                  href={project.links.live} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  <FaExternalLinkAlt /> Live Demo
                </a> */}
              </div>
            </div>

            <div className="project-content">
              <h3 className="project-title">{project.Project_name}</h3>
              <p className="project-description">{project.Project_descrp}</p>
              
              <div className="project-tech">
                <h4 className="tech-title">Technologies Used:</h4>
                <div className="tech-list">
                  {project.Skills.map((tech, techIndex) => (
                    <div key={techIndex} className="tech-item">
                      {/* {tech.icon} */}
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>

          );
        })
        ) : (
          <Typography>No projects available.</Typography>
        )}
      </div>
      </div>
    </section>

    <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ 
              marginBottom: '25px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}>
              Pending Requests
            </Typography>
            
            <Grid container spacing={3}>
              {/* {console.log(userData.requests[0]._id)} */}
              {userData.requests && userData.requests.length > 0 ? (
                userData.requests.map((request, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        padding: '20px',
                        borderRadius: '20px',
                        background: '#2d3748',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { 
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          
                          <Box >
                          Project Id: {pid = userData.requests[index]._id }
                          {/* {setpid(userData.requests[index]._id)} */}
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                              {console.log(pid)}
                              
                              {userData.requests[index].Project_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{color: 'white'}}>
                              by {userData.requests[index].Project_author}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={() => navigate('/viewproject', {state:{id: userData.requests[index]._id}}) 
                               
                            }
                            sx={{
                              borderColor: '#4158D0',
                              color: '#4158D0',
                              '&:hover': {
                                borderColor: '#3148C0',
                                backgroundColor: 'rgba(65, 88, 208, 0.04)',
                              }
                            }}
                          >
                            View Project
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => acceptRequest(request)}
                            sx={{
                              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                              borderRadius: '12px',
                              padding: '8px 20px',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Accept
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{
                    padding: '30px',
                    textAlign: 'center',
                    background: '#2d3748',
                    borderRadius: '20px',
                  }}>
                    <Typography variant="body1" sx={{ 
                      color: '#666',
                      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      No pending requests
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
            </Grid>
            </Grid>
            <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/editprofile', { state: { id: user, pwd: pass } })}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
          color: 'white',
          borderRadius: '10%',
          padding: '15px 20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
            transform: 'translateY(-2px)',
          },
          transition: 'background-color 0.3s, transform 0.3s',
        }}
      >
        <FaEdit style={{ marginRight: '8px' }} />
        Edit Profile
      </Button>
  </Container>
  </div>
  
    
  );
};

export default MyProfile;
