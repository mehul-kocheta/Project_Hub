import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import '../App.css';

const LLMChat = (pid) => {
  console.log(pid.pid);
  const [prompt, setPrompt] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/llm_chat', {
        project_id: pid.pid,
        prompt: prompt,
      });

      if (response.status === 200) {
        setResponseMessage(response.data.response);
      } else {
        setResponseMessage('Failed to get response from server.');
      }
    } catch (error) {
      setResponseMessage('An error occurred: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ padding: 2, background: 'linear-gradient(to bottom, #1e293b, #0f172a)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Ask Fixie !
      </Typography>

      <Box sx={{ marginBottom: 2, padding: 2, color: 'white', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', height: '200px', overflowY: 'auto' }}>
        <Typography variant="body1" sx={{ color: 'color' }}>
          <span dangerouslySetInnerHTML={{ __html: responseMessage.replace(/\n/g, '<br />') }} />
        </Typography>
      </Box>

      <TextField
        variant="outlined"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        fullWidth
        sx={{ marginBottom: 2, border: 'none' }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={handleSendMessage}
          // endIcon={<FaPaperPlane size={24}/>}
          sx={{
            background: 'linear-gradient(135deg, #3148C0 0%, #B840B0 100%)',
            color: 'white',
          }}
        >
          <FaPaperPlane size={24}/>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </Box>
    </Box>
  );
};

export default LLMChat;
