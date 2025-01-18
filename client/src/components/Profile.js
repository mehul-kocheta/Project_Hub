import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, Grid, Card, CardContent, Box, Paper, Fade } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const UserProfile = () => {
  const location = useLocation();
  const user = location.state?.id;
  const ori_id = location.state?.ori_id;
  const [userData, setUserData] = useState(null);
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
        setUserData(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  if (!userData) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
      }}>
        <Typography variant="h5" sx={{ color: '#fff' }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f9fc 0%, #f0f4f8 100%)',
      padding: '2rem',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{
              p: 4,
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            }}>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar 
                  alt={userData.data.user_id} 
                  sx={{ 
                    width: 100, 
                    height: 100,
                    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                  }} 
                />
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {userData.data.user_id}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" sx={{ 
              mb: 2,
              fontWeight: 600,
              color: '#1a237e'
            }}>
              Projects
            </Typography>
            <Grid container spacing={2}>
              {userData.data.Projects && userData.data.Projects.length > 0 ? (
                userData.data.Projects.map((projectId) => {
                  const project = userData.projects.find((proj) => proj._id === projectId);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={projectId}>
                      <Fade in timeout={500}>
                        <Card 
                          onClick={() => navigate('/viewproject', { state: { pid: projectId, ori_id: ori_id } })}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 12px 20px rgba(65, 88, 208, 0.15)',
                            }
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {project.Project_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {project.Project_descrp}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {project.Skills.map((skill, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                                    color: '#fff',
                                  }}
                                >
                                  {skill}
                                </Box>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      No projects available.
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" sx={{ 
              mb: 2,
              fontWeight: 600,
              color: '#1a237e'
            }}>
              Friends List
            </Typography>
            <Paper sx={{
              p: 3,
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}>
              <Grid container spacing={2}>
                {userData.Friend && userData.Friend.length > 0 ? (
                  userData.Friend.map((friend, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 16px rgba(65, 88, 208, 0.15)',
                        }
                      }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                          }}>
                            {friend[0]}
                          </Avatar>
                          <Typography>{friend}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography sx={{ textAlign: 'center', color: '#666' }}>
                      No friends added yet.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserProfile;
