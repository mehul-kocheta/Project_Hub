import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, IconButton, AppBar, Toolbar } from '@mui/material';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa'; // Importing icons
import '../App.css'; // Ensure your styles are included

const MessageForm = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [projectData, setProjectData] = useState(null);
    const location = useLocation();
    const index = location.state?.index;
    const uid = location.state?.user;
    const pwd = location.state?.pwd;
    const endOfMessagesRef = useRef(null); // Reference for scrolling to the bottom

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            project_id: parseInt(index, 10),
            sender_id: uid,
            message: message,
            pwd: pwd
        };

        // Immediately update the local state with the new message
        const newMessage = {
            sender: uid,
            message: message
        };

        setProjectData((prevData) => ({
            ...prevData,
            Messages: [...prevData.Messages, newMessage] // Add the new message to the existing messages
        }));

        // Scroll to the bottom after adding the message
        scrollToBottom();

        try {
            const response = await fetch('/api/post_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Message sent successfully!');
                setMessage(''); // Clear the input after sending
            } else {
                console.log('Error sending message: ' + result.message);
            }
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    };

    const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
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
                if (data && data.project.Messages) {
                    setProjectData(data.project);
                }
            })
            .catch((error) => console.error("Fetch error:", error));
    }, [index]);

    useEffect(() => {
        scrollToBottom(); // Scroll to the bottom when projectData changes
    }, [projectData]);

    return (
        <Box className="chat-container">
            
            <Box className="chatbox">
                {projectData && projectData.Messages.length > 0 ? (
                    projectData.Messages.map((msg, index) => (
                        <Box key={index} className={`message-container ${msg.sender === uid ? 'user-message' : 'receiver-message'}`}>
                            <Box className={`message-box ${msg.sender === uid ? 'user-box' : 'receiver-box'}`}>
                                <Typography variant="subtitle2" className="message-sender">{msg.sender}</Typography>
                                <Typography variant="body2">{msg.message}</Typography>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body1" className="no-messages">No messages yet.</Typography>
                )}
                <div ref={endOfMessagesRef} /> {/* Reference for scrolling */}
            </Box>
            <form onSubmit={handleSubmit} className="message-form">
                <TextField
                    variant="outlined"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="message-input"
                />
                <IconButton
                    type="submit"
                    className="send-button"
                >
                    <FaPaperPlane />
                </IconButton>
            </form>
        </Box>
    );
};

export default MessageForm;
