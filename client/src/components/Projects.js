import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Checkbox, FormControlLabel, LinearProgress, Button, TextField, Card, CardContent, Chip, Grid, Paper, Fade, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddTaskIcon from '@mui/icons-material/AddTask';
import GitHubIcon from '@mui/icons-material/GitHub';
import AssignmentIcon from '@mui/icons-material/Assignment';
import '../App.css'; // Ensure the CSS is adjusted to support animations

const Projects = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [git, setGit] = useState('');
  const location = useLocation();
  const index = location.state?.pexp;
  const uid = location.state?.id;
  const pwd = location.state?.pass;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  const visibleCollaborators = showMore ? collaborators : collaborators.slice(0, 4);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/get_features", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: index,
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.features) {
          const formattedTasks = Object.keys(data.features).map((featureKey) => ({
            featureKey,
            completed: data.features[featureKey] === 1, 
          }));
          setTasks(formattedTasks);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [index]);
  useEffect(() =>{
    fetch("/api/get_github", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        project_id: index,
        })
    })
        .then((response) => response.json())
        .then((data) => {
        if (data) {
            console.log(data.data);
            setGit(data.data);
        }
        })
        .catch((error) => console.error("Fetch error:", error));
    }, [index]);

  useEffect(() => {
    // Fetch collaborators
    fetch("/api/get_contributors", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: index,
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.contributors) {
          setCollaborators(data.contributors);
        }
      })
      .catch((error) => console.error("Fetch error:", error));

    // Fetch users with pending requests
    fetch("/api/get_project_id", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: index,
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.project.Requests) {
          console.log(data.project.Requests);
          setPendingRequests(data.project.Requests);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [index]);

  const handleTaskChange = async (featureKey) => {
    try {
      await axios.post('/api/toggle_feature', {
        project_id: index,
        id: uid,
        pwd: pwd,
        feature_name: featureKey,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.featureKey === featureKey ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating feature status:", error);
    }
  };

  const handleAddTask = async () => {
    if (newTask) {
      const featureData = { [newTask]: 0 };
      try {
        const response = await axios.post('/api/add_feature', {
          project_id: index,
          pwd: pwd,
          id: uid,
          feature_data: featureData,
        });
        if (response.data) {
          setTasks([...tasks, { featureKey: newTask, completed: false }]);
          setNewTask('');
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleAddCollaborator = async () => {
    if (newCollaborator) {
      const name = newCollaborator;
      try {
        const response = await axios.post('/api/add_contributor', {
          project_id: index,
          pwd: pwd,
          id: uid,
          contributor_name: name,
        });
        if (response.data) {
          // setCollaborators([...collaborators, name]);
          setNewCollaborator('');
        }
      } catch (error) {
        console.error('Error adding collaborator:', error);
      }
    }
  };

  const acceptRequest = async (user) => {
    console.log(user);
    try {
      await axios.post('/api/accept_request', {
        project_id: index,
        user_id: uid, 
        name: user,
        pwd: pwd,
      });
      // Remove accepted user from pending requests
      setPendingRequests(pendingRequests.filter((request) => request.id !== user.id));
      // Optionally, you can also add them to collaborators
      setCollaborators([...collaborators, user.name]); 
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <Box sx={{ 
      padding: '30px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
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
      {/* Header Section */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        mb: 4
      }}>
        <Typography variant="h3" sx={{ 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          mb: 3
        }}>
          Project Dashboard
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Collaborators Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            padding: '25px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex',
              alignItems: 'center',
              color: '#4158D0',
              fontWeight: 600,
              mb: 3
            }}>
              <PersonIcon sx={{ mr: 1 }} /> Collaborators
            </Typography>

            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3
            }}>
              {collaborators.map((collaborator, index) => (
                <Fade in key={index} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.1) 0%, rgba(200, 80, 192, 0.1) 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    }
                  }}>
                    <PersonIcon sx={{ color: '#4158D0', mr: 1 }} />
                    <Typography>{collaborator}</Typography>
                  </Box>
                </Fade>
              ))}
            </Box>

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Add new collaborator..."
                value={newCollaborator}
                onChange={(e) => setNewCollaborator(e.target.value)}
                InputProps={{
                  startAdornment: <PersonAddIcon sx={{ color: '#9e9e9e', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    borderRadius: '12px',
                    backgroundColor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4158D0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4158D0',
                    }
                  }
                }}
              />
              <Button
                onClick={handleAddCollaborator}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                  borderRadius: '12px',
                  padding: '8px 20px',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
                  }
                }}
              >
                Add Collaborator
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Tasks Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            padding: '25px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex',
              alignItems: 'center',
              color: '#4158D0',
              fontWeight: 600,
              mb: 3
            }}>
              <AssignmentIcon sx={{ mr: 1 }} /> Tasks
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Progress</Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(65, 88, 208, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                    borderRadius: 4,
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                {completedTasks} of {totalTasks} tasks completed
              </Typography>
            </Box>

            <Box sx={{ 
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
              {tasks.map((task, index) => (
                <Fade in key={index} timeout={500} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '12px',
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(65, 88, 208, 0.05)',
                    }
                  }}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleTaskChange(task.featureKey)}
                      icon={<CheckCircleIcon />}
                      checkedIcon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
                    />
                    <Typography>{task.featureKey}</Typography>
                  </Box>
                </Fade>
              ))}
            </Box>

            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                placeholder="Add new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                InputProps={{
                  startAdornment: <AddTaskIcon sx={{ color: '#9e9e9e', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    borderRadius: '12px',
                    backgroundColor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4158D0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4158D0',
                    }
                  }
                }}
              />
              <Button
                onClick={handleAddTask}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                  borderRadius: '12px',
                  padding: '8px 20px',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
                  }
                }}
              >
                Add Task
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Pending Requests Section */}
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
            {pendingRequests && pendingRequests.length > 0 ? (
              pendingRequests.map((request, index) => (
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      '&:hover': { 
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {request}
                        {/* {console.log(request)} */}
                      </Typography>
                    </Box>
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

        {/* GitHub Info Section */}
        <Grid item xs={12}>
          <Paper sx={{ 
            padding: '25px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex',
              alignItems: 'center',
              color: '#4158D0',
              fontWeight: 600,
              mb: 3
            }}>
              <GitHubIcon sx={{ mr: 1 }} /> GitHub Repository
            </Typography>

            {git ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: 'rgba(65, 88, 208, 0.05)',
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Repository Details
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Project Name:</strong> {git["Project name"]}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Owner:</strong> {git["Project owner"]}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Last Release:</strong> {git["Last release"]}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Visibility:</strong> {git["Security/visibility level"]}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: 'rgba(65, 88, 208, 0.05)',
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Languages Used
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {git["Programming languages used"].map((lang, index) => (
                        <Chip
                          key={index}
                          label={lang}
                          sx={{
                            background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Loading GitHub information...
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Projects;
