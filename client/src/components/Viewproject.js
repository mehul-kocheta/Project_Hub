import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { FaUserFriends, FaClipboardList, FaClock, FaCheckCircle, FaRocket, FaPaperPlane, FaCode, FaDatabase, FaPaintBrush } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import '../App.css';

const Viewproject = () => {
    const location = useLocation();
    const pid = location.state?.id;
    const ori_id = location.state?.ori_id;
    console.log(ori_id);


    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track error state
    const [collabRequestStatus, setCollabRequestStatus] = useState(null); // Track collaboration request status

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

    // Loading screen
    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    // Error screen
    if (error) {
        return <Typography color="error">{`Error: ${error}`}</Typography>;
    }

    // If no project is available, show a message
    if (!project) {
        return <Typography>No project found</Typography>;
    }

    return (
        <div className="project-dash-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div className="project-dash">
                <div className="project-header">
                    <h1 className="project-title"><FaRocket />{project.Project_name}</h1>
                    <p className="project-description"> {project.Project_descrp || 'No description available'}</p>
                </div>
                <div className="collaborators">
                    <h2><FaUserFriends /> Collaborators</h2>
                    <div className="collaborator-list"></div>
                    <Typography variant="body1" gutterBottom><strong>Author:</strong> {project.Project_author || 'Unknown'}</Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Contributors:</strong> {project.Contributors && project.Contributors.length > 0 ? project.Contributors.join(', ') : 'No contributors'}
                    </Typography>
                </div>
                <div className="skills">
                    <h2><FaClipboardList /> Skills</h2>
                    <div className="skills-list">
                        <strong>Skills:</strong> {project.Skills && project.Skills.length > 0 ? project.Skills.join(', ') : 'No skills listed'}
                    </div>
                </div>

                {project.Project_URL && (
                    <Typography variant="body1" gutterBottom>
                        <strong>Project URL:</strong> <a href={project.Project_URL} target="_blank" rel="noopener noreferrer">{project.Project_URL}</a>
                    </Typography>
                )}

                {project.Features && Object.keys(project.Features).length > 0 && (
                    <Box sx={{ marginTop: '16px' }}>
                        <Typography variant="h6" gutterBottom>Features</Typography>
                        {/* Render features here */}
                    </Box>
                )}

                {/* Collaboration Request Button */}
                <Box sx={{ marginTop: '16px' }}>
                    <Button
                        className='collab-button'
                        variant="contained"
                        onClick={handleCollabRequest}
                        disabled={collabRequestStatus === 'loading'}
                    >
                        {collabRequestStatus === 'loading' ? 'Sending Request...' : 'Send Collaboration Request'}
                    </Button>
                    {collabRequestStatus === 'success' && <Typography color="success">Request sent successfully!</Typography>}
                    {collabRequestStatus === 'error' && <Typography color="error">Failed to send request. Please try again.</Typography>}
                </Box>
            </div>
        </div>
    );
};

export default Viewproject;
