import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaUserPlus, FaReact } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { HiMiniArrowRightStartOnRectangle } from "react-icons/hi2";
import '../App';
import Features from './Features';
import Contact from './contact';
import icon from '../assets/logokri.jpg';

function LandingPage() {
  const navigate = useNavigate();

  const fadeRotate = {
    initial: {
      opacity: 0,
      rotate: -10,
      scale: 0.9
    },
    animate: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="App" style={{ overflow: 'hidden' }}>
      
      {/* Header with icon */}
      <header style={{ display: 'flex', alignItems: 'center', padding: '20px', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#61dafb' }}>
        {/* <FaReact size={40} style={{ marginRight: '10px' }} /> */}
        <h1 style={{ fontSize: '2em', margin: 0 }}>ProjectHub</h1>
      </header>

      {/* Drop from top animation for home section */}
      <motion.section
        id="home"
        className="home-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeRotate}
        style={{ margin: '10px 0', willChange: 'opacity, transform' }}
      >
        <div className="home-content">
          <TypeAnimation
            sequence={[
              'W', 100,
              'We', 100,
              'Wel', 100,
              'Welc', 100,
              'Welco', 100,
              'Welcom', 100,
              'Welcome', 100,
              'Welcome t', 100,
              'Welcome to', 100,
              'Welcome to P', 100,
              'Welcome to Pr', 100,
              'Welcome to Pro', 100,
              'Welcome to Proj', 100,
              'Welcome to Proje', 100,
              'Welcome to Projec', 100,
              'Welcome to Project', 100,
              'Welcome to Project', 100,
              'Welcome to ProjectH', 100,
              'Welcome to ProjectHu', 100,
              'Welcome to ProjectHub', 100,
              'Welcome to ProjectHub !', 1000,
            ]}
            wrapper="h1"
            speed={100}
            style={{ 
              fontSize: '3em',
              display: 'inline-block',
              background: 'linear-gradient(45deg, #64ffda, #48cead)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            repeat={1}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5, duration: 1 }}
            style={{ 
              fontSize: '1.5em',
              marginTop: '20px',
              color: '#8892b0'
            }}
          >
            Revolutionize Project Collaboration
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5, duration: 1 }}
            style={{ 
              fontSize: '1.5em',
              marginTop: '20px',
              color: '#8892b0'
            }}
          >
            Connect with like-minded individuals, collaborate on projects, and achieve more together.
          </motion.p>
          <br></br>
          <br></br>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button 
              style={{ width: '500px', alignSelf: 'center' }} 
              type="button" 
              className="submit-button"
              onClick={() => navigate('/signin')}
            >
              {/* <FaUserPlus className="button-icon" /> Get Started */}
              {/* <img src={icon} ></img> */}
              <HiMiniArrowRightStartOnRectangle className="button-icon" /> Get Started
            </button>
          </div>
        </div>
      </motion.section>

      {/* Fade and rotate animation for Projects section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.1 }}
        variants={fadeRotate}
        style={{ margin: '10px 0', willChange: 'opacity, transform' }}
      >
        <Features />
      </motion.section>

      {/* Expand in animation for Contact section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.1 }}
        variants={fadeRotate}
        style={{ margin: '10px 0', willChange: 'opacity, transform' }}
      >
        <Contact />
      </motion.section>
    </div>
  );
}

export default LandingPage;
