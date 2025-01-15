import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Checkbox, FormControlLabel, LinearProgress, Button, TextField, Card, CardContent, Chip, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
          setCollaborators([...collaborators, name]);
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
        user_id: uid, // Assuming user object has an id property
        name: user,
        pwd: pwd,
      });
      // Remove accepted user from pending requests
      setPendingRequests(pendingRequests.filter((request) => request.id !== user.id));
      // Optionally, you can also add them to collaborators
      setCollaborators([...collaborators, user.name]); // Assuming user object has a name property
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Dashboard</h1>
        <Button
          variant="contained"
          onClick={() => navigate('/new-project')}
          startIcon={<AddIcon />}
          className="create-project-btn"
          sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#007bff', transform: 'scale(1.05)' } }}
        >
          + Create New Project
        </Button>
      </header>

      <div className="content">
        <main className="main-content">
          <section className="collaborators">
            <h2>Collaborators</h2>
            <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
              {collaborators.map((collaborator, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'fadeIn 0.5s ease-in-out',
                  }}
                >
                  <PersonIcon fontSize="large" sx={{ color: '#007bff' }} />
                  <span>{collaborator}</span>
                </Box>
              ))}
            </Box>
            <Box sx={{ marginTop: 2 }}>
              <TextField
                label="Add Collaborator"
                variant="outlined"
                value={newCollaborator}
                onChange={(e) => setNewCollaborator(e.target.value)}
                fullWidth
              />
              <Button onClick={handleAddCollaborator} sx={{ marginTop: 1 }} variant="contained" startIcon={<AddIcon />}>
                Add Collaborator
              </Button>
            </Box>
          </section>

          <section className="tasks">
            <h2>Task Management</h2>
            <Typography variant="h6">Project Progress</Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ marginTop: 1, animation: 'fadeIn 0.8s ease-in-out' }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
              {completedTasks} of {totalTasks} tasks completed
            </Typography>

            <div className="task-list" style={{ marginTop: 20 }}>
              {tasks.map((task) => (
                <div className="task" key={task.featureKey}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleTaskChange(task.featureKey, !task.completed)}
                        icon={<CheckCircleIcon />}
                        checkedIcon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
                      />
                    }
                    label={task.featureKey}
                    sx={{ animation: 'fadeIn 0.8s ease-in-out' }}
                  />
                </div>
              ))}
            </div>

            <Box sx={{ marginTop: 2 }}>
              <TextField
                label="New Task"
                variant="outlined"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                fullWidth
              />
              <Button onClick={handleAddTask} sx={{ marginTop: 1 }} variant="contained" startIcon={<AddIcon />}>
                Add Task
              </Button>
            </Box>
          </section>

          <section className="pending-requests">
            <h2>Pending Requests</h2>
            {pendingRequests.length > 0 ? (
              <Box>
                {pendingRequests.map((user) => (
                  <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <PersonIcon fontSize="large" sx={{ color: '#007bff', marginRight: 1 }} />
                    <span>{user.name}</span>
                    <Button
                      onClick={() => acceptRequest(user)}
                      variant="contained"
                      sx={{ marginLeft: 2 }}
                    >
                      Accept
                    </Button>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2">No pending requests</Typography>
            )}
          </section>
        </main>
      </div>
      <div className="github-info">
        <h2>GitHub Repository</h2>
      {git ? (
        <Box sx={{ marginTop: 3 }}>
          <Card sx={{ marginBottom: 3, padding: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Project: {git["Project name"]}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Project Owner:</strong> {git["Project owner"]}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>GitHub URL:</strong> <a href={git["Github URL"]} target="_blank" rel="noopener noreferrer">{git["Github URL"]}</a>
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Last Maintained:</strong> {new Date(git["Last maintained"]).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Last Release:</strong> {git["Last release"]}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Security/Visibility Level:</strong> {git["Security/visibility level"]}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ marginBottom: 3, padding: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Programming Languages Used:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {git["Programming languages used"].map((language, index) => (
                  <Chip key={index} label={language} sx={{ marginBottom: 1 }} color="primary" />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ marginBottom: 3, padding: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Users with Access:
              </Typography>
              {git["List users with access"].length > 0 ? (
                git["List users with access"].map((user, index) => (
                  <Typography key={index} variant="body1">{user}</Typography>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">No users with access</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ padding: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Open Issues:
              </Typography>
              {git["Open issues"].length > 0 ? (
                git["Open issues"].map((issue, index) => (
                  <Typography key={index} variant="body1">{issue}</Typography>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">No open issues</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 3 }}>Loading GitHub information...</Typography>
      )}
    </div>
    </div>
  );
};

export default Projects;
