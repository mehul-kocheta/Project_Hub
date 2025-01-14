import React, { useEffect, useState } from "react";
import axios from "axios";
import '../App.css'

// Main User Profile Component
const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [newDetails, setNewDetails] = useState({});
  const [friendsList, setFriendsList] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch user profile details from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://0e4d-61-0-228-101.ngrok-free.app/api/user"
        );
        const data = response.data;
        setUserDetails(data.userDetails);
        setFriendsList(data.friends);
        setCompletedProjects(data.completedProjects);
        setOngoingProjects(data.ongoingProjects);
        setSkills(data.skills);
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = () => {
    setEditing(true);
    setNewDetails(userDetails);
  };

  const handleSaveClick = async () => {
    setEditing(false);
    // Save the updated details to the backend
    try {
      await axios.post(
        "https://0e4d-61-0-228-101.ngrok-free.app/api/update-user",
        newDetails
      );
      setUserDetails(newDetails);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      const newMessage = { message: chatInput, sender: "You" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setChatInput("");
      // Optional: Send chat message to backend or friends
    }
  };

  return (
    <div className="user-profile">
      <h1>User Profile</h1>

      <div className="profile-details">
        {editing ? (
          <div>
            <input
              type="text"
              value={newDetails.name}
              onChange={(e) =>
                setNewDetails({ ...newDetails, name: e.target.value })
              }
            />
            <input
              type="email"
              value={newDetails.email}
              onChange={(e) =>
                setNewDetails({ ...newDetails, email: e.target.value })
              }
            />
            <button onClick={handleSaveClick}>Save</button>
          </div>
        ) : (
          <div>
            <p>Name: {userDetails.name}</p>
            <p>Email: {userDetails.email}</p>
            <button onClick={handleEditClick}>Edit</button>
          </div>
        )}
      </div>

      <FriendsList friends={friendsList} />
      <SkillsSection skills={skills} />
      <Projects completed={completedProjects} ongoing={ongoingProjects} />

      <div className="chat-section">
        <h2>Chat</h2>
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <strong>{message.sender}: </strong>
              {message.message}
            </div>
          ))}
        </div>
        <form onSubmit={handleChatSubmit}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

// Friends List Component
const FriendsList = ({ friends }) => {
  return (
    <div className="friends-list">
      <h2>Friends</h2>
      <ul>
        {friends.map((friend, index) => (
          <li key={index}>{friend.name}</li>
        ))}
      </ul>
    </div>
  );
};

// Skills Section Component
const SkillsSection = ({ skills }) => {
  return (
    <div className="skills-section">
      <h2>Skills</h2>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

// Projects Component
const Projects = ({ completed, ongoing }) => {
  return (
    <div className="projects">
      <h2>Completed Projects</h2>
      <ul>
        {completed.map((project, index) => (
          <li key={index}>{project}</li>
        ))}
      </ul>

      <h2>Ongoing Projects</h2>
      <ul>
        {ongoing.map((project, index) => (
          <li key={index}>{project}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
