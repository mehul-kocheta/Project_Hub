import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Grid, 
  Paper, 
  Fade, 
  IconButton,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import '../App.css';

// Define theme outside of component
const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    }
  },
  palette: {
    primary: {
      main: '#4158D0',
    },
    secondary: {
      main: '#C850C0',
    }
  }
});

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [userSearchResult, setUserSearchResult] = useState([]);
  const [auth, setAuth] = useState([]);
  const location = useLocation();
  const user = location.state?.id;
  const pass = location.state?.pass;
//   console.log(user)

  useEffect(() => {
    fetch("/api/project", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_author: user,
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
        setAuth(data);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [user]);

  const navigate = useNavigate();

  const handlegetResult = async () => {
    try {
      const response = await axios.post('/api/search_projects', {
        substring: searchTerm
      });
      if (response) {
        setSearchResult(response.data.projects);
        console.log(response);
      }
    } catch (error) {
      console.error('Error finding:', error);
    }
  };

  const handleUserSearchResult = async () => {
    try {
      const response = await axios.post('/api/search_accounts', {
        name: userSearchTerm
      });
      if (response.data && response.data.accounts) {
        setUserSearchResult(response.data.accounts);
      }
    } catch (error) {
      console.error('Error finding users:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
        {/* User Profile Button - Moved to top right */}
        <Box sx={{ 
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 2
        }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/myprofile', { state: { id: user, pass: pass, ori_id: user} })}
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
            {user}
          </Button>
        </Box>

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
            Dashboard
          </Typography>

          <Grid container spacing={4}>
            {/* Search Users Section */}
            <Grid item xs={12} md={6}>
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
                <Typography variant="h6" sx={{ 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#4158D0',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}>
                  <PersonSearchOutlinedIcon sx={{ marginRight: '10px' }} /> Search Users
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <TextField
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUserSearchResult();
                      }
                    }}
                    InputProps={{
                      startAdornment: <SearchOutlinedIcon sx={{ color: '#9e9e9e', mr: 1 }} />,
                    }}
                    sx={{
                      flexGrow: 1,
                      width: 'calc(100% - 60px)',
                      '& .MuiOutlinedInput-root': {
                        height: '45px',
                        borderRadius: '12px',
                        backgroundColor: '#f5f5f5',
                        fontSize: '1rem',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                          '& fieldset': {
                            borderColor: '#4158D0',
                          }
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4158D0',
                        },
                      }
                    }}
                  />
                  <Button 
                    onClick={handleUserSearchResult}
                    size="small"
                    sx={{
                      minWidth: '45px',
                      width: '45px',
                      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                      color: 'white',
                      borderRadius: '6px',
                      padding: '3px 0',
                      height: '28px',
                      fontSize: '0.8rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
                      }
                    }}
                  >
                    Go
                  </Button>
                </Box>

                {/* User Search Results */}
                {userSearchResult.length > 0 && (
                  <Box sx={{ 
                    marginTop: '20px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#C850C0',
                      borderRadius: '3px',
                    }
                  }}>
                    {userSearchResult.map((account, index) => (
                      <Fade in key={index}>
                        <Paper
                          onClick={() => navigate('/profile', { state: { id: userSearchTerm,  ori_id: user } })}
                          sx={{
                            cursor: 'pointer',
                            padding: '12px 16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '10px',
                            marginBottom: '8px',
                            transition: 'all 0.2s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            '&:hover': { 
                              transform: 'translateX(5px)',
                              backgroundColor: 'rgba(65, 88, 208, 0.05)',
                            }
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {account.user_id}
                            </Typography>
                            {account.Projects && (
                              <Typography variant="body2" color="text.secondary">
                                {account.Projects.length} Projects
                              </Typography>
                            )}
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#4158D0',
                              fontSize: '0.75rem'
                            }}
                          >
                            View Profile →
                          </Typography>
                        </Paper>
                      </Fade>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Search Projects Section */}
            <Grid item xs={12} md={6}>
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
                <Typography variant="h6" sx={{ 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#4158D0',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}>
                  <WorkIcon sx={{ marginRight: '10px' }} /> Search Projects
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <TextField
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlegetResult();
                      }
                    }}
                    InputProps={{
                      startAdornment: <SearchOutlinedIcon sx={{ color: '#9e9e9e', mr: 1 }} />,
                    }}
                    sx={{
                      flexGrow: 1,
                      width: 'calc(100% - 60px)',
                      '& .MuiOutlinedInput-root': {
                        height: '45px',
                        borderRadius: '12px',
                        backgroundColor: '#f5f5f5',
                        fontSize: '1rem',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                          '& fieldset': {
                            borderColor: '#4158D0',
                          }
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4158D0',
                        },
                      }
                    }}
                  />
                  <Button 
                    onClick={handlegetResult}
                    size="small"
                    sx={{
                      minWidth: '45px',
                      width: '45px',
                      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                      color: 'white',
                      borderRadius: '6px',
                      padding: '3px 0',
                      height: '28px',
                      fontSize: '0.8rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
                      }
                    }}
                  >
                    Go
                  </Button>
                </Box>

                {/* Project Search Results */}
                {searchResult.length > 0 && (
                  <Box sx={{ 
                    marginTop: '20px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#C850C0',
                      borderRadius: '3px',
                    }
                  }}>
                    {searchResult.map((project, index) => (
                      <Fade in key={index}>
                        <Paper
                          onClick={() => navigate('/viewproject', { state: { id: userSearchTerm, pid: project.project_id, ori_id: user } })}
                          sx={{
                            cursor: 'pointer',
                            padding: '12px 16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '10px',
                            marginBottom: '8px',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': { 
                              transform: 'translateX(5px)',
                              backgroundColor: 'rgba(65, 88, 208, 0.05)',
                            }
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {project.project_name}
                          </Typography>
                          {project.project_descrp && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {project.project_descrp}
                            </Typography>
                          )}
                        </Paper>
                      </Fade>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Ongoing Projects Section */}
          <Box sx={{ marginTop: '40px' }}>
            <Typography variant="h5" sx={{ 
              marginBottom: '25px',
              color: '#1a237e',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '100%',
                height: '3px',
                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                borderRadius: '2px',
                transform: 'scaleX(0)',
                transition: 'transform 0.3s ease',
              },
              '&:hover::after': {
                transform: 'scaleX(1)',
              }
            }}>
              Ongoing Projects
            </Typography>
            
            <Grid container spacing={3}>
              {auth.projects && auth.projects.length > 0 ? (
                auth.projects.map((project, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Paper
                        elevation={0}
                        sx={{
                          padding: '25px',
                          borderRadius: '20px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.1) 0%, rgba(200, 80, 192, 0.1) 100%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          },
                          '&:hover': { 
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                            '&::before': {
                              opacity: 1,
                            }
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#1a237e',
                              marginBottom: '15px',
                              fontWeight: 600,
                              fontSize: '1.1rem',
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-5px',
                                left: 0,
                                width: '40px',
                                height: '2px',
                                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                                transition: 'width 0.3s ease',
                              }
                            }}
                          >
                            {project.Project_name}
                          </Typography>

                          <Button
                            variant="contained"
                            onClick={() => navigate('/project', { state: { pexp: project._id, id: user, pass: pass } })}
                            sx={{
                              mt: 2,
                              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                              borderRadius: '12px',
                              padding: '8px 20px',
                              fontSize: '0.875rem',
                              textTransform: 'none',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                              },
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 5px 15px rgba(65, 88, 208, 0.3)',
                                '&::before': {
                                  opacity: 1,
                                }
                              },
                              '& .MuiButton-label': {
                                position: 'relative',
                                zIndex: 1,
                              }
                            }}
                          >
                            View Project
                          </Button>
                        </Box>
                      </Paper>
                    </Fade>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Fade in>
                    <Paper
                      sx={{
                        padding: '30px',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '20px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#666',
                          fontSize: '1rem',
                          fontStyle: 'italic',
                          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        No projects found
                      </Typography>
                    </Paper>
                  </Fade>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Create New Project Button */}
          <Box sx={{ position: 'fixed', bottom: 30, right: 30 }}>
            <IconButton
              color="primary"
              size="large"
              onClick={() => navigate('/new-project', { state: { user: user, pwd: pass } })}
              sx={{
                backgroundColor: '#3f51b5',
                color: '#fff',
                padding: '15px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                '&:hover': { 
                  backgroundColor: '#303f9f',
                  transform: 'scale(1.1) rotate(180deg)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <AddCircleIcon sx={{ fontSize: 60 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;