import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Avatar, Grid, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Box, Paper, Stack, Chip } from '@mui/material';
import { Email, Phone, Logout } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8],
  },
}));

// Theme colors
const colors = {
  primary: '#4158D0',
  secondary: '#C850C0',
  accent: '#FFCC70',
  background: '#f6f9fc',
  cardBg: '#ffffff'
};

const MyProfile = () => {
  const location = useLocation();
  const user = location.state?.id;
  // const pid = location.state?.pid;
  const ori_id = location.state?.ori_id;
  const pass = location.state?.pass;
  console.log(user);
  const [userData, setUserData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/get_account", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user,
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUserData(data);  // Store fetched data in auth
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const acceptRequest = async () => {
    try {
      const response = await axios.post('/api/accept_contributor', {
        project_id: userData.requests[0]._id,
        id: user,
        pwd: pass,
      });
      
      // Refresh the page or update the UI after successful acceptance
      if (response.status === 200) {
        // Remove the accepted request from the state
        setUserData(prevData => ({
          ...prevData,
          requests: prevData.requests.slice(1) // Remove the first request
        }));
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleLogout = () => {
    navigate('/signin');
  };

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: 'auto',
      background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px',
        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        opacity: 0.1,
        zIndex: 0,
      }
    }}>
      {/* Add Logout Button */}
      <Box sx={{ 
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 2
      }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleLogout}
          startIcon={<Logout sx={{ fontSize: 20 }} />}
          sx={{
            background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            minWidth: 'auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Edit Profile Button */}
      <Box sx={{ 
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 2
      }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate('/editprofile', { state: { id: user, pwd: pass } })}
          startIcon={<AccountCircleIcon sx={{ fontSize: 20 }} />}
          sx={{
            background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            minWidth: 'auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Profile Header */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: 'none',
          fontWeight: 800,
        }}>
          Profile
        </Typography>

        <Paper sx={{ 
          padding: '25px', 
          borderRadius: '15px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          background: 'linear-gradient(145deg, #ffffff, #f4f4f4)',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)'
          }
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2 
          }}>
            <Avatar 
              alt={userData.data.user_id} 
              sx={{ 
                width: 120, 
                height: 120,
                border: '4px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              }} 
            />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {userData.data.user_id}
            </Typography>
          </Box>
        </Paper>

        {/* Projects Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ 
              marginBottom: '25px',
              color: '#1a237e',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}>
              Projects
            </Typography>
            
            <Grid container spacing={3}>
              {userData.data.Projects && userData.data.Projects.length > 0 ? (
                userData.data.Projects.map((projectId) => {
                  const project = userData.projects.find((proj) => proj._id === projectId);
                  return (
                    <Grid item xs={12} md={4} key={projectId}>
                      <Paper
                        elevation={0}
                        sx={{
                          padding: '25px',
                          borderRadius: '20px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': { 
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                          }
                        }}
                      >
                        <Typography variant="h6" sx={{ 
                          color: '#4158D0',
                          marginBottom: '15px',
                          fontWeight: 600 
                        }}>
                          {project.Project_name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {project.Project_descrp}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {project.Skills.map(skill => (
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                                color: 'white',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                },
                                transition: 'all 0.3s ease'
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{
                    padding: '30px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                  }}>
                    <Typography variant="body1" sx={{ 
                      color: '#666',
                      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      No projects found
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Friends List Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ 
              marginBottom: '25px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}>
              Friends List
            </Typography>
            
            <Grid container spacing={3}>
              {userData.Friend && userData.Friend.length > 0 ? (
                userData.Friend.map((friend, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        padding: '20px',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        '&:hover': { 
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                          width: 50,
                          height: 50,
                        }}
                      >
                        {friend[0]}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {friend}
                      </Typography>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{
                    padding: '30px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                  }}>
                    <Typography variant="body1" sx={{ 
                      color: '#666',
                      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      No friends added yet
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Pending Requests Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ 
              marginBottom: '25px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}>
              Pending Requests
            </Typography>
            
            <Grid container spacing={3}>
              {userData.requests && userData.requests.length > 0 ? (
                userData.requests.map((request, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        padding: '20px',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { 
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                            }}
                          >
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                              {userData.requests[0].Project_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              by {userData.requests[0].Project_author}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={() => navigate('/viewproject', {state:{pid: userData.requests[0]._id}}) 
                               
                            }
                            sx={{
                              borderColor: '#4158D0',
                              color: '#4158D0',
                              '&:hover': {
                                borderColor: '#3148C0',
                                backgroundColor: 'rgba(65, 88, 208, 0.04)',
                              }
                            }}
                          >
                            View Project
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => acceptRequest(request)}
                            sx={{
                              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                              borderRadius: '12px',
                              padding: '8px 20px',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Accept
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{
                    padding: '30px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                  }}>
                    <Typography variant="body1" sx={{ 
                      color: '#666',
                      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      No pending requests
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MyProfile;
