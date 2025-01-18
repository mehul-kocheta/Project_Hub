import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const EditProfile = () => {
  const location = useLocation();
  const user = location.state?.id;
  const pwd = location.state?.pwd;
  // State to store the form fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/change_acc_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user, // Assuming the user_id is static for now
          pwd: pwd, // Assuming the password is static for now
          email: email || undefined, // Only send if provided
          phone: phone || undefined, // Only send if provided
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSuccess(true); // Set success if the request was successful
      console.log('Response:', data);
      
    } catch (error) {
      setError(error.message); // Set error if the request failed
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
        }}>
          <Typography 
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
            Edit Profile
          </Typography>

          {/* Success/Error messages with gradient styling */}
          {success && (
            <Typography sx={{
              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              marginBottom: 2,
            }}>
              Profile updated successfully!
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: '20px' }}
            />
            <TextField
              label="Phone (Optional)"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ marginBottom: '20px' }}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                },
              }}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default EditProfile;
