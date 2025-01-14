import React, { useEffect, useState } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, Container, Grid } from '@mui/material';


const RemoveAccount = () => {
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
      const response = await axios.post('https://57f1-45-118-208-34.ngrok-free.app/api/rm_acc', formData);
      // console.log('Response:', response);  
      setMessage(response.data.message);

      // const data = await response.json();  // Parse the response as JSON
      // setMessage(data);
      if(response.data.status === 200){
        navigate('/');
      }
      
    } catch (error) {
      setMessage('Error: ' + error.response.data.message);
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
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="name"
            name="id"
            autoComplete="name"
            value={formData.id}
            onChange={handleChange}
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Box sx={{ marginTop: 2 }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link to="/removeaccount" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Sign Up
          </Link>
        </Typography>
        </Box>
        {message && <Typography color="error">{message}</Typography>}
      </Box>
    </Container>
  );
};

export default RemoveAccount;
