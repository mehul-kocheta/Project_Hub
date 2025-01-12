import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Checkbox, FormControlLabel, LinearProgress, Button, TextField } from '@mui/material';
import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Projects = () => {
  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState(''); 
  const location = useLocation();
  const { projects } = location.state || { projects: {} };
  console.log(Object.keys(projects.Features));

  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'Pranu Pranjal', profilePic: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Mehul Jain', profilePic: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Krishna Tayal', profilePic: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Divyanshu Bajpayee', profilePic: 'https://via.placeholder.com/40' },
  ]);

  const [newCollaborator, setNewCollaborator] = useState('');
  const [showMore, setShowMore] = useState(false);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  const visibleCollaborators = showMore ? collaborators : collaborators.slice(0, 4);
  const navigate = useNavigate();

  // Initialize tasks based on features from the project
//   useEffect(() => {
//     if (projects.Features) {
//       const initialTasks = Object.keys(projects.Features).map((featureKey) => ({
//         featureKey,
//         completed: projects.Features[featureKey].completed || false, // Default completed state
//       }));
//       setTasks(initialTasks);
//     }
//   }, [projects]);

  // Handle task completion toggle
  const handleTaskChange = (featureKey) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.featureKey === featureKey ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Add new task
  const handleAddTask = async () => {
    if (newTask) {
      const featureData = { [newTask]: 0 };
  
      try {
        
        const response = await axios.post('https://11eb-45-118-208-34.ngrok-free.app/api/add_feature', {
          project_id: 39,  
          pwd: "kk",  
          id: "Pranu Pranjal", 
          feature_data: featureData,  
        });
        if (response.data) {
          // Adding the new task to the tasks list (also consider merging with existing features)
          setTasks([...tasks, { featureKey: newTask, completed: false }]);  // Add the new task to the frontend tasks list
          setNewTask('');  // Clear the input field after adding the task
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Add new collaborator
  const handleAddCollaborator = () => {
    if (newCollaborator) {
      setCollaborators([
        ...collaborators,
        { id: collaborators.length + 1, name: newCollaborator, profilePic: 'https://via.placeholder.com/40' },
      ]);
      setNewCollaborator('');
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Dashboard</h1>
        <button variant="contained" onClick={() => navigate('/new-project')} className="create-project-btn">+ Create New Project</button>
      </header>

      <div className="content">
        <main className="main-content">
          <section className="collaborators">
            <Box sx={{ position: 'relative' }}>
              <Button
                variant="contained"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  zIndex: 10,
                }}
                href="https://your-meeting-link.com"
                target="_blank"
              >
                Start Meeting
              </Button>
            </Box>
            <h2>Collaborators</h2>
            <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
              {visibleCollaborators.map((collaborator) => (
                <Box key={collaborator.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={collaborator.profilePic}
                    alt={collaborator.name}
                    className="collaborator-avatar"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      marginBottom: '10px',
                    }}
                  />
                  <span>{collaborator.name}</span>
                </Box>
              ))}
            </Box>
            {collaborators.length > 4 && (
              <Button onClick={() => setShowMore(!showMore)} sx={{ marginTop: 2 }}>
                {showMore ? 'Show Less' : 'Show More'}
              </Button>
            )}
            <Box sx={{ marginTop: 2 }}>
              <TextField
                label="Add Collaborator"
                variant="outlined"
                value={newCollaborator}
                onChange={(e) => setNewCollaborator(e.target.value)}
                fullWidth
              />
              <Button onClick={handleAddCollaborator} sx={{ marginTop: 1 }} variant="contained">
                Add Collaborator
              </Button>
            </Box>
          </section>

          <section className="tasks">
            <h2>Task Management</h2>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ width: '48%' }}>
                <Typography variant="h6">Project Progress</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ marginTop: 1 }} />
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  {completedTasks} of {totalTasks} tasks completed
                </Typography>
                <div className="task-list" style={{ marginTop: 20 }}>
                  {Object.keys(projects.Features).map((featureKey) => {
                    const task = tasks.find((task) => task.featureKey === featureKey);
                    const completed = task ? task.completed : false;
                    return (
                      <div className="task" key={featureKey}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={completed}
                              onChange={() => handleTaskChange(featureKey)}
                              color="primary"
                            />
                          }
                          label={featureKey}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* Add Task Input */}
                <Box sx={{ marginTop: 2 }}>
                  <TextField
                    label="New Task"
                    variant="outlined"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    fullWidth
                  />
                  <Button onClick={handleAddTask} sx={{ marginTop: 1 }} variant="contained">
                    Add Task
                  </Button>
                </Box>
              </Box>

              <Box sx={{ width: '48%' }}>
                <Typography variant="h6">Deadlines</Typography>
                <div className="task">
                  <Typography variant="body1">Lorem ipsum dolor sit amet.</Typography>
                  <p>Due: Tomorrow</p>
                </div>
                <div className="task">
                  <Typography variant="body1">Consectetur adipiscing elit.</Typography>
                  <p>Due: Next Week</p>
                </div>
              </Box>
            </Box>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Projects;
