import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Container, Chip, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import '../App.css';

const Viewproject = () => {
    const location = useLocation();
    const pid = location.state?.pid;
    const ori_id = location.state?.ori_id;

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collabRequestStatus, setCollabRequestStatus] = useState(null);

    useEffect(() => {
        if (!pid) {
            setError("Project ID not found in location state");
            setLoading(false);
            return;
        }

        fetch("/api/get_project_id", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_id: pid,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.project) {
                    setProject(data.project);
                } else {
                    throw new Error("Project data not found in response");
                }
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [pid]);

    const handleCollabRequest = () => {
        setCollabRequestStatus('loading');
        fetch('/api/send_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_id: pid,
                user_id: ori_id,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setCollabRequestStatus('success');
            })
            .catch((error) => {
                setCollabRequestStatus('error');
                console.error("Request error:", error);
            });
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)'
            }}>
                <CircularProgress sx={{ color: '#4158D0' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)'
            }}>
                <Typography sx={{ color: '#ff3d57', fontWeight: 500 }}>
                    {`Error: ${error}`}
                </Typography>
            </Box>
        );
    }

    if (!project) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)'
            }}>
                <Typography sx={{ 
                    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 500
                }}>
                    No project found
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            padding: '40px 20px',
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
                zIndex: 0
            }
        }}>
            <Container maxWidth="lg">
                <Paper elevation={0} sx={{ 
                    padding: '40px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'transform 0.3s ease',
                    '&:hover': { 
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                    }
                }}>
                    <Typography variant="h3" gutterBottom sx={{ 
                        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        mb: 4
                    }}>
                        {project.Project_name}
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ color: '#4158D0', fontWeight: 600, mb: 2 }}>
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            {project.Project_descrp || 'No description available'}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ color: '#4158D0', fontWeight: 600, mb: 2 }}>
                            Project Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="body1" sx={{ color: '#555' }}>
                                <strong>Author:</strong> {project.Project_author || 'Unknown'}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#555' }}>
                                <strong>Contributors:</strong> {project.Contributors && project.Contributors.length > 0 ? project.Contributors.join(', ') : 'No contributors'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ color: '#4158D0', fontWeight: 600, mb: 2 }}>
                            Skills Required
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {project.Skills && project.Skills.map((skill, index) => (
                                <Chip
                                    key={index}
                                    label={skill}
                                    sx={{
                                        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                                        color: 'white',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {project.Project_URL && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ color: '#4158D0', fontWeight: 600, mb: 2 }}>
                                Project URL
                            </Typography>
                            <a 
                                href={project.Project_URL} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    color: '#4158D0',
                                    textDecoration: 'none'
                                }}
                            >
                                {project.Project_URL}
                            </a>
                        </Box>
                    )}

                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handleCollabRequest}
                            disabled={collabRequestStatus === 'loading'}
                            startIcon={<SendIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                                padding: '10px 30px',
                                borderRadius: '12px',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                },
                                transition: 'all 0.3s ease',
                                textTransform: 'none'
                            }}
                        >
                            {collabRequestStatus === 'loading' ? 'Sending Request...' : 'Send Collaboration Request'}
                        </Button>
                        
                        {collabRequestStatus === 'success' && (
                            <Typography sx={{ color: '#4caf50', mt: 2, fontWeight: 500 }}>
                                Request sent successfully!
                            </Typography>
                        )}
                        
                        {collabRequestStatus === 'error' && (
                            <Typography sx={{ color: '#ff3d57', mt: 2, fontWeight: 500 }}>
                                Failed to send request. Please try again.
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Viewproject;
