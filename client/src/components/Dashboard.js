import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [auth, setAuth] = useState([]);
  const location = useLocation();
  const user = location.state?.id;

  useEffect(() => {
    fetch("https://11eb-45-118-208-34.ngrok-free.app/api/project", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_author: user,
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
        setAuth(data);  // Store fetched data in auth
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [user]);

  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Dashboard</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          variant="contained"
          onClick={() => navigate('/new-project')}
          className="create-project-btn"
        >
          + Create New Project
        </button>
      </header>

      <div className="content">
        <aside className="side-panel">
          <h3>Ongoing Projects</h3>
          <ul>
            {auth.projects && auth.projects.length > 0 ? (
              auth.projects.map((project, index) => (
                <li key={index}>
                  <button
                    variant="contained"
                    onClick={() => navigate('/project', { state: { pexp: auth.projects[index] } })}
                  >
                    {project.Project_name}
                  </button>
                </li>
              ))
            ) : (
              <li>No projects found</li>
            )}
          </ul>
        </aside>

        <main className="main-content">
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
