import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, Grid, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material';
import { Email, Phone } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const UserProfile = () => {
  const location = useLocation();
  const user = location.state?.id;
  // const pid = location.state?.pid;
  const ori_id = location.state?.ori_id;
  console.log(user);
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
          console.log(data);
          setUserData(data);  // Store fetched data in auth
        })
        .catch((error) => console.error("Fetch error:", error));
    }, []);

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={5}>
        <Avatar alt={userData.data.user_id} sx={{ width: 120, height: 120 }} />
        <Typography variant="h4" mt={2}>{userData.data.user_id}</Typography>
      </Box>

      {/* Projects */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Projects</Typography>
        <Grid container spacing={3}>
          {userData.data.Projects && userData.data.Projects.length > 0 ? (
            userData.data.Projects.map((projectId) => {
              const project = userData.projects.find((proj) => proj._id === projectId);
              return (
                <Grid item xs={12} sm={6} key={projectId}>
                  <Card variant="contained"
                      onClick={() => navigate('/viewproject', { state: { pid: projectId, ori_id: ori_id } })}
                      sx={{ marginTop: '15px' }}>
                    <CardContent>
                      <Typography variant="h6">{project.Project_name}</Typography>
                      <Typography variant="body2">{project.Project_descrp}</Typography>
                      <Typography variant="body2" color="textSecondary">Skills: {project.Skills.join(', ')}</Typography>
                      <Typography variant="body2" color="textSecondary">Contributors: {project.Contributors.join(', ') || 'None'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography>No projects available.</Typography>
          )}
        </Grid>
      </Box>

      {/* Friends List */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Friends List</Typography>
        <List>
          {userData.Friend && userData.Friend.length > 0 ? (
            userData.Friend.map((friend, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>{friend[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={friend} />
              </ListItem>
            ))
          ) : (
            <Typography>No friends added yet.</Typography>
          )}
        </List>
      </Box>
    </Container>
  );
};

export default UserProfile;
