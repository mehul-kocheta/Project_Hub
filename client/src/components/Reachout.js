import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, FaInstagram, FaTwitter, 
  FaLinkedin, FaGithub, FaPaperPlane 
} from 'react-icons/fa';
import Navbar from './Navbar';

const Reachout = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    document.querySelectorAll('.animate').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your form submission logic here
    // For example, sending to an email service or backend
    console.log(formData);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  const socialLinks = [
    {
      name: 'Email',
      icon: <FaEnvelope />,
      link: 'mailto:pranupranjal850@gmail.com',
      color: '#EA4335'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      link: 'https://instagram.com/pranu_pranjal',
      color: '#E4405F'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      link: 'https://x.com/_pranu_pranjal_',
      color: '#1DA1F2'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin />,
      link: 'https://www.linkedin.com/in/pranu-pranjal-646505264/',
      color: '#0A66C2'
    },
    // {
    //   name: 'GitHub',
    //   icon: <FaGithub />,
    //   link: 'https://github.com/PranuPranjal',
    //   color: ' #ffff00'
    // }
  ];

  return (
    <div>
      <Navbar/>
    <section id="contact" className="reachout-section">
      <div className="reachout-container">
        <h2 className="reachout-title animate">Let's Connect</h2>
        <p className="reachout-subtitle animate">Get in touch with us</p>

        <div className="reachout-content">
          <div className="social-links-container animate">
            <h3>Connect With Us On</h3>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  style={{ '--hover-color': social.color }}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-form-container animate">
            <h3>Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} 
                <FaPaperPlane className="send-icon" />
              </button>
            </form>
          </div>
        </div>
        <p></p>
      </div>

    </section>
    </div>
  );
};

export default Reachout;
