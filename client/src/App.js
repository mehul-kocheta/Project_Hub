// import logo from './logo.svg';
// import './App.css';

// import React from 'react';
// import Dashboard from './components/dashboard'; 

// function App() {
//   return (
//     <div className="App">
//       <Dashboard />
//     </div>
//   );
// }

// export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
// import Dashboard from './components/Dashboard'; 
// import SignIn from './components/Singin';       
// import SignUp from './components/Signup';       

// function App() {
//   return (
//     <Router>
//       <div>
//         {/* App Bar with Navigation Links */}
//         <AppBar position="static">
//           <Toolbar>
//             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//               Project Hub
//             </Typography>
//             <Button color="inherit" component={Link} to="/signin">
//               Sign In
//             </Button>
//             <Button color="inherit" component={Link} to="/signup">
//               Sign Up
//             </Button>
//           </Toolbar>
//         </AppBar>

//         {/* Routes */}
//         <Box sx={{ p: 2 }}>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />  {/* Default to Dashboard */}
//             <Route path="/signin" element={<SignIn />} />
//             <Route path="/signup" element={<SignUp />} />
//           </Routes>
//         </Box>
//       </div>
//     </Router>
//   );
// }

// export default App;

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
import Viewproject from './components/Viewproject.js';

function App() {
  return (
    <Router>
      <div>
        {/* Navbar Component */}
        <Navbar />

        {/* Routes */}
        <Box sx={{ p: 2 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />  {/* Default to Dashboard */}
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
          {/* <GoogleOAuthProvider clientId="296708240295-sublesndur4s2ptp0bhi5s9ljtd9f79a.apps.googleusercontent.com"> Replace with your Google Client ID */}
            {/* <SignUp /> */}
          {/* </GoogleOAuthProvider> */}
        </Box>
      </div>
    </Router>
  );
}

export default App;

