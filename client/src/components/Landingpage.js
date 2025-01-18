import React from 'react';
import { Box, Button, Typography, Grid, Container, Card, CardContent, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import { ArrowForward } from '@mui/icons-material';
import '@fontsource/poppins'; // Ensure to add this in your project or link to Google Fonts

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#f8f9fe', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero Section - Updated gradient and styling */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center',
          padding: '20px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{ fontWeight: '700', marginBottom: '20px', fontFamily: 'Poppins, sans-serif', fontSize: { xs: '36px', sm: '48px' } }}
          >
            Revolutionize Project Collaboration
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: '30px', fontSize: { xs: '18px', sm: '24px' } }}>
            Connect with like-minded individuals, collaborate on projects, and achieve more together.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signin')}
            sx={{
              fontSize: '18px',
              padding: '12px 36px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#4158D0',
              ':hover': { 
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
              boxShadow: '0px 6px 15px rgba(0,0,0,0.2)',
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* About Section - Updated styling */}
      <Container sx={{ padding: '80px 0' }} maxWidth="md">
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center', 
            marginBottom: '50px', 
            fontWeight: '600',
            background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}
        >
          About the Platform
        </Typography>
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', color: '#555', lineHeight: '1.8', fontSize: '20px' }}
        >
          Our platform connects individuals from various fields and skill levels, empowering them to collaborate on projects
          that push boundaries. Whether you're a developer, designer, or business strategist, we bring the right people
          together to make your vision a reality.
        </Typography>
      </Container>

      {/* Features Section - Updated card styling */}
      <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '80px 0' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              marginBottom: '50px', 
              fontWeight: '600',
              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Key Features
          </Typography>
          <Grid container spacing={5} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: '100%',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  ':hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 6px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconButton sx={{ 
                    fontSize: '48px', 
                    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    <HomeIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginTop: '20px' }}>
                    Collaborative Projects
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px', color: '#666' }}>
                    Easily connect with users who share your project interests and work together seamlessly.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: '100%',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  ':hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 6px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconButton sx={{ 
                    fontSize: '48px', 
                    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    <GroupIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginTop: '20px' }}>
                    Networking Opportunities
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px', color: '#666' }}>
                    Meet new people, share ideas, and build connections that help you grow.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: '100%',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  ':hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 6px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconButton sx={{ 
                    fontSize: '48px', 
                    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    <SettingsIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: '600', marginTop: '20px' }}>
                    Easy-to-Use Interface
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px', color: '#666' }}>
                    The platform is designed to be user-friendly, so you can get started with minimal effort.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - Updated styling */}
      <Box 
        sx={{ 
          backgroundImage: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
          color: '#fff', 
          padding: '80px 0', 
          textAlign: 'center' 
        }}
      >
        <Typography variant="h3" sx={{ marginBottom: '20px', fontWeight: '600' }}>
          Ready to Collaborate?
        </Typography>
        <Typography variant="h5" sx={{ marginBottom: '40px', fontWeight: '400' }}>
          Join our community today and start collaborating on exciting projects.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/signup')}
          sx={{
            fontSize: '18px',
            padding: '12px 36px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#4158D0',
            ':hover': { 
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
            boxShadow: '0px 6px 15px rgba(0,0,0,0.2)',
          }}
        >
          Sign Up Now
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
