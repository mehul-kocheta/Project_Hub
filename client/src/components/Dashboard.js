import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, TextField, Grid, Paper, Fade, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import '../App.css';

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
        console.log(response.data.projects);
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
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: '40px' }}>
        Dashboard
      </Typography>

      {/* User Profile Button */}
      <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/myprofile', { state: { id: user , pid: auth.projects._id, pass: pass, ori_id: user} })}
          startIcon={<AccountCircleIcon />}
        >
          View Profile
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Search Users Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: '20px', borderRadius: '10px', position: 'relative' }}>
            <Typography variant="h6" sx={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <AccountCircleIcon sx={{ marginRight: '10px' }} /> Search Users
            </Typography>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUserSearchResult();
                }
              }}
              sx={{ marginBottom: '20px' }}
            />
            <Button onClick={handleUserSearchResult} variant="contained" fullWidth startIcon={<SearchIcon />}>
              Search Users
            </Button>

            {/* User Search Results */}
            {userSearchResult.length > 0 && (
              <Box sx={{ marginTop: '20px' }}>
                {userSearchResult.map((account, index) => (
                  <Fade in key={index}>
                    <Box
                      onClick={() => navigate('/profile', { state: { id: userSearchTerm, pid: auth.projects._id, ori_id: user } })}
                      sx={{
                        cursor: 'pointer',
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    >
                      <Typography variant="subtitle1">{account.user_id}</Typography>
                      {account.Projects && (
                        <Typography variant="body2">
                          Projects: {account.Projects.length}
                        </Typography>
                      )}
                    </Box>
                  </Fade>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Search Projects Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: '20px', borderRadius: '10px', position: 'relative' }}>
            <Typography variant="h6" sx={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ marginRight: '10px' }} /> Search Projects
            </Typography>
            <TextField
              fullWidth
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ marginBottom: '20px' }}
            />
            <Button onClick={handlegetResult} variant="contained" fullWidth startIcon={<SearchIcon />}>
              Search Projects
            </Button>
          </Paper>
          {/* Project Search Results */}
          {searchResult.length > 0 && (
            <Box sx={{ marginTop: '20px' }}>
              {searchResult.map((project, index) => (
                <Fade in key={index}>
                  <Box
                    onClick={() => navigate('/viewproject', { state: { id: userSearchTerm, pid: project.project_id, ori_id: user } })}
                    sx={{
                      cursor: 'pointer',
                      padding: '10px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  >
                    <Typography variant="subtitle1">{project.project_name}</Typography>
                    {project.project_descrp && (
                      <Typography variant="body2">
                        Description: {project.project_descrp}
                      </Typography>
                    )}
                  </Box>
                </Fade>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Ongoing Projects Section */}
      <Box sx={{ marginTop: '40px' }}>
        <Typography variant="h5" sx={{ marginBottom: '20px' }}>
          Ongoing Projects
        </Typography>
        <Grid container spacing={3}>
          {auth.projects && auth.projects.length > 0 ? (
            auth.projects.map((project, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: '20px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }
                    }}
                  >
                    <Typography variant="h6">{project.Project_name}</Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/project', { state: { pexp: project._id, id: user, pass: pass } })}
                      sx={{ marginTop: '15px' }}
                    >
                      View Project
                    </Button>
                  </Paper>
                </Fade>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ marginLeft: '15px' }}>
              No projects found
            </Typography>
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
            '&:hover': { backgroundColor: '#3f51b5' },
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'scale(1.1)' }
          }}
        >
          <AddCircleIcon sx={{ fontSize: 60 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Dashboard;
