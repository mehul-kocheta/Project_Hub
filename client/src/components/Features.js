import React, { useEffect } from 'react';
import { 
  FaGithub, FaExternalLinkAlt, FaReact, 
  FaNodeJs, FaDatabase, FaCode, 
  FaDocker
} from 'react-icons/fa';
import { 
  SiTailwindcss, SiMongodb, SiExpress, 
  SiFirebase, SiTypescript, 
  SiFlask,
  SiMysql,
  SiNgrok,
  SiKubernetes,
  SiWeb3Dotjs
} from 'react-icons/si';
import collab from '../assets/collaborate.jpg';
import network from '../assets/download.png';
import ui from '../assets/ui.jpg';
import ai from '../assets/ai.jpg';

const Features = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.project-card').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      title: "Collaborative Projects",
      description: "Easily connect with users who share your project interests and work together seamlessly.",
      image: collab,
      // technologies: [
      //   { name: "React", icon: <FaReact /> },
      //   { name: "Node.js", icon: <FaNodeJs /> },
      //   { name: "Flask", icon: <SiFlask /> },
      //   { name: "MySQL", icon: <SiMysql /> },
      //   { name: "MongoDB", icon: <SiMongodb />},
      //   { name: "NGROK", icon: <SiNgrok />},
      //   { name: "Docker", icon: <FaDocker />},
      //   { name: "Kubernetes", icon: <SiKubernetes />}
      // ],
      // links: {
      //   github: "https://github.com/mehul-kocheta/Project_Hub",
      //   // live: "https://project1.com"
      // }
    },
    {
      title: "Networking Opportunities",
      description: "Meet new people, share ideas, and build connections that help you grow.",
      image: network,
      // technologies: [
      //   { name: "React", icon: <FaReact /> },
      //   { name: "Node.js", icon: <FaNodeJs /> },
      //   { name: "Express", icon: <SiExpress />},
      //   { name: "MongoDB", icon: <SiMongodb /> },
      //   { name: "D3.js", icon: <SiWeb3Dotjs /> },
      //   { name: "Docker", icon: <FaDocker />},
      //   { name: "Kubernetes", icon: <SiKubernetes />}
        
      // ],
      // links: {
      //   github: "https://github.com/PranuPranjal/Financial-Dashboard",
      //   // live: "https://project2.com"
      // }
    },
    {
      title: "Easy-to-Use Interface",
      description: "The platform is designed to be user-friendly, so you can get started with minimal effort.",
      image: ui,
      // technologies: [
      //   { name: "React", icon: <FaReact /> },
      //   { name: "Node.js", icon: <FaNodeJs /> },
      //   { name: "Express", icon: <SiExpress />},
      //   { name: "MongoDB", icon: <SiMongodb /> },
      //   { name: "D3.js", icon: <SiWeb3Dotjs /> },
      //   { name: "Docker", icon: <FaDocker />},
      //   { name: "Kubernetes", icon: <SiKubernetes />}
        
      // ],
      // links: {
      //   github: "https://github.com/PranuPranjal/Financial-Dashboard",
      //   // live: "https://project2.com"
      // }
    },
    {
      title: "SmartCode Assist",
      description: "Boost your productivity with our AI-powered coding assistant, offering real-time code suggestions and debugging support.",
      image: ai,
      // technologies: [
      //   { name: "React", icon: <FaReact /> },
      //   { name: "Node.js", icon: <FaNodeJs /> },
      //   { name: "Express", icon: <SiExpress />},
      //   { name: "MongoDB", icon: <SiMongodb /> },
      //   { name: "D3.js", icon: <SiWeb3Dotjs /> },
      //   { name: "Docker", icon: <FaDocker />},
      //   { name: "Kubernetes", icon: <SiKubernetes />}
        
      // ],
      // links: {
      //   github: "https://github.com/PranuPranjal/Financial-Dashboard",
      //   // live: "https://project2.com"
      // }
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        <h2 className="projects-title">Features</h2>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="project-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="project-image-container">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-image"
                />
                <div className="project-links">
                  
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
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-tech">
                  
                  {/* <div className="tech-list">
                    {project.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="tech-item">
                        {tech.icon}
                        <span>{tech.name}</span>
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
