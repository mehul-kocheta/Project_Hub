import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container } from '@mui/material';


const SignIn = () => {
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
    try {
      const response = await axios.post('/api/login', formData);
      setMessage(response.data.message);

      if (response.data.status === 200) {
        navigate('/dashboard', { state: { id: formData.id, pass: formData.pwd } });
      }
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'An error occurred'));
    }
  };

  return (
    <Container maxWidth="xs">
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
          {message && (
            <Typography sx={{
              color: 'error.main',
              marginBottom: 2,
              textAlign: 'center'
            }}>
              {message}
            </Typography>
          )}

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
            Welcome Back
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Username"
              name="id"
              autoComplete="name"
              value={formData.id}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#4158D0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C850C0',
                  },
                },
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
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#4158D0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C850C0',
                  },
                },
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
              Sign In
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                style={{
                  background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
