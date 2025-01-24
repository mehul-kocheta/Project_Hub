import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaPhone, FaLinkedin, FaGithub, FaGraduationCap, FaCode, FaFileUpload, FaSignInAlt } from 'react-icons/fa'; 
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Autocomplete, Chip, Box, Typography } from '@mui/material';
import axios from 'axios';
import '../App.css'; 

function Signup() {
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        phone: '',
        pwd: '',
        Linkedin: '',
        github: '',
        college_name: '',
        degree: '',
        skills: [],
        about: ''
      });
      const [inputSkill, setInputSkill] = useState('');
      const [availableSkills, setAvailableSkills] = useState([]);
      useEffect(() => {
        fetch("/api/get_skills", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                skills: "Python"
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            if (Array.isArray(data.skills)) {
                // Extract only the first element (skill name) from each array
                const skillNames = data.skills.map(skill => skill[0]);
                setAvailableSkills(skillNames);
            } else {
                console.error("Unexpected response format:", data.skills);
                setAvailableSkills([]);
            }
        })
        .catch((error) => console.error("Fetch error:", error));
    }, []);
    
      const [message, setMessage] = useState('');
      const [ confirmPassword, setConfirmPassword ] = useState('');
    
      const navigate = useNavigate();
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!username || !email || !password || !confirmPassword || !phone || !linkedin || !github || !skills || !college || !degree || !resume) {
        //     setMessage("All fields are required!");
        //     return;
        // }
        if (formData.pwd !== confirmPassword) {
            setMessage("Passwords do not match!");
        } else {
            setMessage("");
            try {
                const response = await axios.put('/api/register', formData);
                setMessage(response.data.message);
                console.log(response.data.message);
                navigate('/signin'); // Navigate to the sign-in page after successful sign-up
              } catch (error) {
                setMessage('Error: ' + error.response?.data?.message || 'An error occurred');
              }
            // console.log("Form submitted:", { username, email, password, phone, linkedin, github, skills, college, degree, resume });
        }
    };

    return (
        <div className="signup-container animate">
            <h1 className="signup-title">Join Us Today!</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="input-label">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                className="signup-input"
                                name='id'
                                value={formData.id}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="signup-input"
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="signup-input"
                                name='pwd'
                                value={formData.pwd}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="signup-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaPhone className="input-icon" />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="signup-input"
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaLinkedin className="input-icon" />
                            <input
                                type="url"
                                placeholder="LinkedIn Profile"
                                className="signup-input"
                                name='Linkedin'
                                value={formData.Linkedin}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaGithub className="input-icon" />
                            <input
                                type="url"
                                placeholder="GitHub Profile"
                                className="signup-input"
                                name='github'
                                value={formData.github}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaGraduationCap className="input-icon" />
                            <input
                                type="text"
                                placeholder="College"
                                className="signup-input"
                                name='college_name'
                                value={formData.college_name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaGraduationCap className="input-icon" />
                            <input
                                type="text"
                                placeholder="Degree"
                                className="signup-input"
                                name='degree'
                                value={formData.degree}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                placeholder="About"
                                className="signup-input"
                                name='about'
                                value={formData.about}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="input-label">
                            <FaCode className="input-icon" />
                            <Autocomplete
                                multiple
                                freeSolo
                                options={availableSkills} // Pass the list of skill names
                                value={formData.skills}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, skills: newValue });
                                }}
                                inputValue={inputSkill}
                                onInputChange={(event, newInputValue) => {
                                    setInputSkill(newInputValue);
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip style={{color: 'white'}}
                                            variant="outlined"
                                            label={option}
                                            {...getTagProps({ index })}
                                            key={index}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField style={{width: '300px', color: 'white'}}
                                        {...params}
                                        variant="outlined"
                                        className='signup-input'
                                        placeholder='Your Skills'
                                        fullWidth
                                    />
                                )}
                            />

                        </label>
                    </div>
                    {/* <div className="form-group">
                        <label className="input-label">
                            <FaFileUpload className="input-icon" />
                            <input
                                type="file"
                                className="signup-input file-input"
                                onChange={(e) => setResume(e.target.files[0])}
                            
                            />
                            <span className="input-label-text">Upload Resume</span>
                        </label>
                    </div> */}
         <Box sx={{ marginTop: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body2" color="#ffffff">
            Already have an account?{' '}
            <Link to="/signin" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign In <FaSignInAlt />
            </Link>
          </Typography>
        </Box>
        <br></br>
                {/* {resume && <p className="file-name">Selected File: {resume.name}</p>} */}
                {message && <p className="error-message">{message}</p>}
                <button type="submit" className="submit-button">
                    <FaUserPlus className="button-icon" /> Sign Up
                </button>
            </form>
        </div>
    );
}

export default Signup;
