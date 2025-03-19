import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, Grid, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaDownload, FaUserGraduate, FaEye,
  FaUniversity, FaCode, FaBookReader } from 'react-icons/fa';
import proimg from '../assets/ProjectHub.jpg';
import '../App.css';
import Navbar from './Navbar';

const UserProfile = () => {
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach(entry => {
  //         if (entry.isIntersecting) {
  //           entry.target.classList.add('animate-in');
  //         }
  //       });
  //     },
  //     { threshold: 0.1 }
  //   );

  //   document.querySelectorAll('.project-card').forEach((el) => observer.observe(el));
  //   return () => observer.disconnect();
  // }, []);
  const location = useLocation();
  const user = location.state?.id;
  const pid = location.state?.pid;
  const ori_id = location.state?.ori_id;
  console.log(user);
  const [userData, setUserData] = useState(null);
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
          console.log(data);
          setUserData(data);  // Store fetched data in auth
        })
        .catch((error) => console.error("Fetch error:", error));
    }, []);

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
  <Container>
    <Navbar />
    <section id="info" className="info-section">
      <div className="info-container">
        <div className="info-left animate">
          <div className="profile-image-container">
            <img 
              src='{Pic}'
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
                <a href="mailto:pranupranjal850@gmail.com" className="contact-link">
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
                <a href="https://github.com/PranuPranjal" target="_blank" rel="noopener noreferrer" className="contact-link">
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
                <a href="https://www.linkedin.com/in/pranu-pranjal-646505264/" target="_blank" rel="noopener noreferrer" className="contact-link">
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
            {/* {userData.about} */}
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
            variant="contained" onClick={() => navigate('/viewproject', { state: { id: project._id, ori_id: ori_id} })}
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

    
  </Container>
);
};

export default UserProfile;
