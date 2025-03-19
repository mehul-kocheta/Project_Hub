import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Checkbox, FormControlLabel, LinearProgress, Button, TextField, Card, CardContent, Chip, Grid, Paper, Fade, IconButton, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaComment, FaComments, FaProjectDiagram, FaGithub, FaUser, FaMeetup, FaCamera, FaTimes } from 'react-icons/fa';
import { RiUserAddLine } from "react-icons/ri";
<<<<<<< HEAD
import { FaRegClock } from 'react-icons/fa';
=======
>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5
import { SiChatbot } from "react-icons/si";
import { MdOutlineAddTask } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { MdVisibility } from "react-icons/md";
import '../App.css';
import LLM from './Llm';
import Chat from './Chat';
import Navbar from './Navbar';

const Projects = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [git, setGit] = useState('');
  const location = useLocation();
  const index = location.state?.pexp;
  const uid = location.state?.id;
  const pwd = location.state?.pass;
  console.log(uid, index, pwd);
  const proname = location.state?.proname;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  const visibleCollaborators = showMore ? collaborators : collaborators.slice(0, 4);
  const navigate = useNavigate();
  const [showLLM, setShowLLM] = useState(false); 
  const [isHovered, setIsHovered] = useState(false); 
  const [isHoveredMeet, setIsHoveredMeet] = useState(false);
  const [isHoveredllm , setIsHoveredllm ] = useState(false);

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
<<<<<<< HEAD
          console.log(data.project.Deadline);
          setPendingRequests(data.project.Requests);
          setDeadline(data.project.Deadline);
=======
          console.log(data.project);
          setPendingRequests(data.project.Requests);
          setDeadline(data.prject.Deadline);
>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5
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
<<<<<<< HEAD
          setCollaborators([...collaborators, name+': Requested']);
=======
          // setCollaborators([...collaborators, name]);
>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5
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
<<<<<<< HEAD
      window.location.reload();
=======
>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5
      // Optionally, you can also add them to collaborators
      setCollaborators([...collaborators, user.name]); 
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleToggleLLM = () => {
    setShowLLM((prev) => !prev); // Toggle the visibility of LLM
  };

  const handleMeet = () => {
    fetch('/api/create_meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: index,
      })
    })

  }
  return (
    <div>
    <Navbar  />
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', marginTop: '3%' }}>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
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
            {proname}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              padding: '25px',
              borderRadius: '20px',
              background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
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
                Collaborators
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
                      color: 'white',
                      background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.1) 0%, rgba(200, 80, 192, 0.1) 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }
                    }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      borderRadius: '12px',
                      backgroundColor: '#f5f5f5',
                      '& fieldset': {
                        border: 'none',
                      },
                     
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
<<<<<<< HEAD
                  <RiUserAddLine size={24} />Add Collaborator
=======
                  <RiUserAddLine />Add Collaborator
>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5
                </Button>
              </Box>
            </Paper>
          </Grid>

<<<<<<< HEAD
=======
          <Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              padding: '25px',
              borderRadius: '20px',
              background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
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
                Deadline
              </Typography>
              <Typography><FaTimes size={24}/> {deadline}</Typography>
            </Paper>
            </Grid>
          </Grid>

>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              padding: '25px',
              borderRadius: '20px',
              color: 'white',
              background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
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
                Tasks
              </Typography>
<<<<<<< HEAD
              <Typography variant="subtitle1" sx={{ mb: 1, color: 'red' }}><FaRegClock /> {deadline}</Typography>
              
=======
>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Progress</Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    color: 'white',
                    backgroundColor: 'rgba(65, 88, 208, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                      borderRadius: 4,
                    }
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, color: 'white' }}>
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
                      color: 'white',
                      alignItems: 'center',
                      padding: '8px',
                      borderRadius: '12px',
                      mb: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(65, 88, 208, 0.05)',
                      }
                    }}>
                      <Checkbox style={{color: 'white'}}
                        checked={task.completed}
                        onChange={() => handleTaskChange(task.featureKey)}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      borderRadius: '12px',
                      backgroundColor: '#f5f5f5',
                      '& fieldset': {
                        border: 'none'
                        // borderColor: 'transparent',
                      },
                      // '&:hover fieldset': {
                      //   borderColor: '#4158D0',
                      // },
                      // '&.Mui-focused fieldset': {
                      //   borderColor: '#4158D0',
                      // }
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
<<<<<<< HEAD
                  <MdOutlineAddTask size={24} /> Add Task
=======
                  <MdOutlineAddTask /> Add Task
>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5
                </Button>
              </Box>
            </Paper>
          </Grid>

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
                        background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
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
<<<<<<< HEAD
                        <Typography variant="h6" sx={{ fontWeight: 500,color: 'white' }}>
=======
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5
                          {request}
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
                    background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
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

          <Grid item xs={12}>
            <Paper sx={{ 
              padding: '25px',
              borderRadius: '20px',
              background: 'rgba(65, 88, 208, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            }}>
              <Typography variant="h6" sx={{ 
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                mb: 3,
              }}>
               GitHub Repository
              </Typography>

              {git ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 2,
                      borderRadius: '12px',
                      color: 'white',
                      background: 'rgba(65, 88, 208, 0.05)',
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Repository Details
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong><FaProjectDiagram/> Project Name:</strong> {git["Project name"]}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong><RiAdminFill /> Owner:</strong> {git["Project owner"]}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong><MdDateRange /> Last Release:</strong> {git["Last release"]}
                      </Typography>
                      <Typography variant="body2">
                        <strong><MdVisibility /> Visibility:</strong> {git["Security/visibility level"]}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 2,
                      color: 'white',
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

        <Tooltip title={showLLM ? 'Hide LLM' : 'Show LLM'}>
          <Button
            variant='contained'
            onMouseEnter={() => setIsHoveredllm(true)}
            onMouseLeave={() => setIsHoveredllm(false)}
            onClick={handleToggleLLM}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 30,
              background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
              color: 'white',
              width: 56,
              height: 56,
              width: isHoveredllm ? '120px' : '50px',
              justifyContent: isHoveredllm ? 'space-between' : 'center',
              borderRadius: '30px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              marginBottom: 1,
            }}
          >
            <SiChatbot size={24} />
            {isHoveredllm && <span style={{ marginLeft: '8px' }}>Fixie</span>}
          </Button>
        </Tooltip>
      </Box>

      {showLLM && (
        <Box sx={{ width: '750px', borderLeft: '1px solid #ccc', padding: 2}}>
          <LLM pid={index} />

        </Box>
      )}
      <Box sx={{ position: 'fixed', bottom: 30, right: 30 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/chat', {state:{index: index, user: uid, pwd: pwd}})}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
            justifyContent: isHovered ? 'space-between' : 'center',
            padding: '10px 20px',
            transition: 'width 0.3s, padding 0.3s',
            width: isHovered ? '120px' : '50px',
            borderRadius: '20px',
          }}
        >
          <FaComment size={24} />
          {isHovered && <span style={{ marginLeft: '8px' }}>Chat</span>}
        </Button>
      </Box>
      <Box sx={{ position: 'fixed', bottom: 160, right: 30 }}>
<<<<<<< HEAD
        <a href='https://mail.google.com' target='_blank'><Button
=======
        <a href='www.gmail.com'><Button
>>>>>>> a243281fec0e7a09b6c4beeace2ac621f45d0cc5
          variant="contained"
          onClick={handleMeet}
          onMouseEnter={() => setIsHoveredMeet(true)}
          onMouseLeave={() => setIsHoveredMeet(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
            justifyContent: isHoveredMeet ? 'space-between' : 'center',
            padding: '10px 20px',
            transition: 'width 0.3s, padding 0.3s',
            width: isHoveredMeet ? '120px' : '50px',
            borderRadius: '20px',
          }}
        >
          <FaCamera size={24} />
          {isHoveredMeet && <span style={{ marginLeft: '8px' }}>Meet</span>}
        </Button></a>
      </Box>
    </Box>
    </div>
  );
};

export default Projects;
