import React, { useEffect ,useState } from 'react';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; 
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import '../App.css';

function Signin() {
    const [formData, setFormData] = useState({
        id: '',
        pwd: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!email || !password) {
        //     setMessage("All fields are required!");
        //     return;
        // }
        setMessage("");
        try {
            const response = await axios.post('/api/login', formData);
            setMessage(response.data.message);
      
            if (response.data.status === 200) {
              navigate('/dashboard', { state: { id: formData.id, pass: formData.pwd } });
            }
          } catch (error) {
            setMessage('Error: ' + error.response?.data?.message || 'An error occurred');
          }
        // console.log("Form submitted:", { email, password });
    };

    return (
        <div className="signin-container animate">
            <h1 className="signin-title">Welcome Back!</h1>
            <form className="signin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="input-label">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="text"
                            placeholder="User Name"
                            className="signin-input"
                            name='id'
                            value={formData.id}
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
                            className="signin-input"
                            name='pwd'
                            value={formData.pwd}
                            onChange={handleChange}
                            required 
                        />
                    </label>
                </div>
                <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems:'center', width: '100%' }}>
          <Typography variant="body2" color="#ffffff">
            Don't have an account?{' '}
            <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign Up <FaUserPlus />
            </Link>
          </Typography>
        </Box>
        <br></br>
                {message && <p className="error-message">{message}</p>}
                <button type="submit" className="submit-button">
                    <FaSignInAlt className="button-icon" /> Sign In
                </button>
            </form>
        </div>
    );
}

export default Signin;
