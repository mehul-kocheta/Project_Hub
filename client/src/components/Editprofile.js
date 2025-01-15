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
      const response = await fetch('https://4fee-61-0-228-101.ngrok-free.app/api/change_acc_details', {
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
      <Box sx={{ padding: '20px', marginTop: '50px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>

        {/* Display error or success message */}
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">Profile updated successfully!</Typography>}

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
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default EditProfile;
