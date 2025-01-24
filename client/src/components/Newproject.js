import React, { useEffect, useState, useRef } from 'react';
import { FaProjectDiagram, FaFileAlt, FaCode, FaGithub, FaCalendarAlt } from 'react-icons/fa';
import { TextField, Autocomplete, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

function NewProject() {
    const location = useLocation();
    const id = location.state?.user;
    const pwd = location.state?.pwd;
    const [projectData, setProjectData] = useState({
        id: id,
        pwd: pwd,
        project_name: '',
        project_descrp: '',
        skills: [],
        github: '',
        deadline: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };

    const [message, setMessage] = useState('');
    const [inputSkill, setInputSkill] = useState('');
    const [availableSkills, setAvailableSkills] = useState([]);
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
                const skillNames = data.skills.map(skill => skill[0]);
                setAvailableSkills(skillNames);
            } else {
                console.error("Unexpected response format:", data.skills);
                setAvailableSkills([]);
            }
        })
        .catch((error) => console.error("Fetch error:", error));
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(""); // Reset message on form submission
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
            navigate(-1);
        })
        .catch((error) => {
            setMessage('Error registering project: ' + error.message);
            console.error('Error registering project:', error);
        });
    };

    return (
        <div className="create-project-container animate">
            <h1 className="create-project-title">Create New Project</h1>
            <form className="create-project-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="input-label">
                        <FaProjectDiagram className="input-icon" />
                        <input
                            type="text"
                            placeholder="Project Name"
                            className="signup-input"
                            name='project_name'
                            value={projectData.project_name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="input-label">
                        <FaFileAlt className="input-icon" />
                        <textarea
                            placeholder="Project Description"
                            className="signup-input"
                            name='project_descrp'
                            value={projectData.project_descrp}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="input-label">
                        <FaCode className="input-icon" />
                        <Autocomplete
                            multiple
                            freeSolo
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
                                    <Chip style={{color: 'white'}}
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                        key={index}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField style={{width: '300px'}}
                                    {...params}
                                    variant="outlined"
                                    className='signup-input'
                                    placeholder='Required Skills'
                                    fullWidth
                                />
                            )}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="input-label">
                        <FaGithub className="input-icon" />
                        <input
                            type="url"
                            placeholder="GitHub Link"
                            className="signup-input"
                            name='github'
                            value={projectData.github}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="input-label">
                        <FaCalendarAlt className="input-icon" />
                        <input
                            type="datetime-local"
                            className="signup-input"
                            name='deadline'
                            value={projectData.deadline}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                {message && <p className="error-message">{message}</p>}
                <button type="submit" className="submit-button">
                    Create Project
                </button>
            </form>
        </div>
    );
}

export default NewProject;
