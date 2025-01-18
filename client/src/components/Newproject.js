import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container, Chip, Autocomplete } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';


const NewProject = () => {
    const location = useLocation();
    const id = location.state?.user;
    const pwd = location.state?.pwd;
    console.log(id);
    console.log(pwd);
    const [projectData, setProjectData] = useState({
        id: id,
        pwd: pwd,
        project_name: '',
        project_descrp: '',
        skills: [],
        github: '',
    });

    const [inputSkill, setInputSkill] = useState('');
    const [availableSkills, setAvailableSkills] = useState([]);  // Use state to manage availableSkills
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/get_skills", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                skills: "Python"
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            if (Array.isArray(data.skills)) {
                setAvailableSkills(data.skills);  
            } else {
                console.error("Unexpected response format:", data.skills);
                setAvailableSkills([]);  
            }
        })
        .catch((error) => console.error("Fetch error:", error));
    }, []);  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/project_register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData), 
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to register project');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Project registered successfully:', data);
            navigate(-1)
        })
        .catch((error) => {
            console.error('Error registering project:', error);
        });
    };

    return (
        <Container maxWidth="md">
            <Box sx={{
                marginTop: 8,
                marginBottom: 8,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
            }}>
                <Typography 
                    component="h1" 
                    variant="h4"
                    sx={{
                        marginBottom: 4,
                        fontWeight: 600,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Create New Project
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="project_name"
                        label="Project Name"
                        name="project_name"
                        value={projectData.project_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="description"
                        label="Project Description"
                        name="project_descrp"
                        multiline
                        rows={4}  
                        value={projectData.project_descrp}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="github"
                        label="GitHub URL"
                        name="github"
                        value={projectData.github}
                        onChange={handleChange}
                    />
                    <Autocomplete
                        multiple
                        freeSolo
                        id="skills-required"
                        options={availableSkills}  
                        value={projectData.skills}
                        onChange={(event, newValue) => {
                            setProjectData({ ...projectData, skills: newValue });
                        }}
                        inputValue={inputSkill}
                        onInputChange={(event, newInputValue) => {
                            setInputSkill(newInputValue);
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                    key={index}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Skills Required"
                                placeholder="Add skills"
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#4158D0',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#C850C0',
                                        },
                                    },
                                }}
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                            },
                        }}
                    >
                        Create Project
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NewProject;
