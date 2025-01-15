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
      navigate('/signin'); // Navigate to the sign-in page after successful sign-up
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#1e1e2e',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography component="h1" variant="h5" color="#ffffff">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              '& .MuiInputBase-root': {
                color: '#333', // Darker text for better visibility
              },
              marginBottom: '16px', // Adjusting space between fields
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
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              '& .MuiInputBase-root': {
                color: '#333',
              },
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
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              '& .MuiInputBase-root': {
                color: '#333',
              },
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
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              '& .MuiInputBase-root': {
                color: '#333',
              },
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
              backgroundColor: '#007bff',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
              color: '#fff',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            Sign Up
          </Button>
        </Box>

        <Box sx={{ marginTop: 2, width: '100%' }}>
          <Typography variant="body2" color="#ffffff">
            Already have an account?{' '}
            <Link to="/signin" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign In
            </Link>
          </Typography>
        </Box>

        {message && (
          <Typography color="error" sx={{ marginTop: 2, width: '100%' }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default SignUp;
