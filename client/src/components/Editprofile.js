import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUpload, FaUserPlus, FaPhone, FaLinkedin, FaGithub, FaGraduationCap, FaCode, FaFileUpload, FaSignInAlt } from 'react-icons/fa'; 
import axios from 'axios';


const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.id;
  const pwd = location.state?.pwd;
  // State to store the form fields
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
          user_id: user,
          email: '',
          phone: '',
          pwd: pwd,
          linkedin: '',
          github: '',
          college_name: '',
          degree: '',
          about: ''
        });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('/api/change_acc_details', formData);

      
      setSuccess(response.data.messsage);
      navigate(-1);
    } catch (error) {
      setError(error.message); // Set error if the request failed
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: '20px', marginTop: '50px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>

        {/* Display error or success message */}
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">Profile updated successfully!</Typography>}

        <div className="signup-container animate">
            <form className="signup-form" onSubmit={handleSubmit}>
          
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
                                name='linkedin'
                                value={formData.linkedin}
                                onChange={handleChange}
                                
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
                               
                            />
                        </label>
                    </div>
                    {/* <div className="form-group">
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
                    </div> */}
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
         
        <br></br>
                <button type="submit" className="submit-button">
                    <FaUpload className="button-icon" /> Update Profile
                </button>
            </form>
        </div>
        </Box>
        </Container>
      
  );
};

export default EditProfile;
