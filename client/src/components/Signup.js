import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container } from '@mui/material';


const SignUp = () => {
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    mobile: '',
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
    try {
      const response = await axios.put('/api/register', formData);
      setMessage(response.data.message);
      console.log(response.data.message);
      navigate('/signin');
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}>
        <Box sx={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
        }}>
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{
              marginBottom: 4,
              fontWeight: 600,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="id"
              autoComplete="name"
              autoFocus
              value={formData.id}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: '5px',
                marginBottom: '16px',
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: '5px',
                marginBottom: '16px',
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="mobile"
              autoComplete="phone"
              value={formData.mobile}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: '5px',
                marginBottom: '16px',
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="pwd"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.pwd}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: '5px',
                marginBottom: '16px',
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
