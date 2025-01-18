import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard'; 
import SignIn from './components/Signin';       
import SignUp from './components/Signup';       
import NewProject from './components/Newproject';
import RemoveAccount from './components/Removeaccount';
import Projects from './components/Projects.js';
import UserProfile from './components/Profile.js';
import MyProfile from './components/Myprofile.js';
import EditProfile from './components/Editprofile.js';
import LandingPage from './components/Landingpage.js';
import Viewproject from './components/Viewproject.js';
import Footer from './components/Footer.js';

function App() {
  return (
    <Router>
      <div>
        <Box sx={{ p: 2 }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path='/' element={<LandingPage/>}/> 
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path='/new-project' element={<NewProject/>}/>
            <Route path='/project' element={<Projects/>}/>
            <Route path='/profile' element={<UserProfile/>}/>
            <Route path='/viewproject' element={<Viewproject/>}/>
            <Route path='/myprofile' element={<MyProfile/>}/>
            <Route path='/editprofile' element={<EditProfile/>}/>
            <Route path='/removeaccount' element={<RemoveAccount/>}/>
          </Routes>
        </Box>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;

