import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import LandingPage from './components/Landingpage.js';
import Dashboard from './components/Dashboard'; 
import SignIn from './components/Signin';       
import SignUp from './components/Signup';       
import NewProject from './components/Newproject';
import RemoveAccount from './components/Removeaccount';
import Projects from './components/Projects.js';
import UserProfile from './components/Profile.js';
import MyProfile from './components/Myprofile.js';
import EditProfile from './components/Editprofile.js';
import Viewproject from './components/Viewproject.js';
import MessageForm from './components/Chat.js';
import LLMChat from './components/Llm.js';
import Reachout from './components/Reachout.js';
import MyProjects from './components/Myprojects.js';

function App() {
  return (
    <Router>
      <div>
        {/* Navbar Component */}
        {/* <Navbar /> */}

        {/* Routes */}
        <Box sx={{ p: 2 }}>
          <Routes>
            <Route path='/' element={<LandingPage />}/>
            <Route path="/dashboard" element={<Dashboard />} />  {/* Default to Dashboard */}
            <Route path="/signin" element={<SignIn />} />
            {/* <Route path='/navbar' element={<Navbar />}/> */}
            <Route path="/signup" element={<SignUp />} />
            <Route path='/new-project' element={<NewProject/>}/>
            <Route path='/project' element={<Projects/>}/>
            <Route path='/profile' element={<UserProfile/>}/>
            <Route path='/viewproject' element={<Viewproject/>}/>
            <Route path='/myproject' element={<MyProjects/>}/>
            <Route path='/myprofile' element={<MyProfile/>}/>
            <Route path='/editprofile' element={<EditProfile/>}/>
            <Route path='chat' element={<MessageForm />}/>
            <Route path='/removeaccount' element={<RemoveAccount/>}/>
            <Route path='/llm' element={<LLMChat />}/>
            <Route path='/contact' element={<Reachout />}/>
          </Routes>
          {/* <GoogleOAuthProvider clientId="296708240295-sublesndur4s2ptp0bhi5s9ljtd9f79a.apps.googleusercontent.com"> Replace with your Google Client ID */}
            {/* <SignUp /> */}
          {/* </GoogleOAuthProvider> */}
        </Box>
      </div>
    </Router>
  );
}

export default App;

