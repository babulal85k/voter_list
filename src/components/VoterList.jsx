import { useState, useEffect } from "react";

const VoterList = () => {
  const [voters, setVoters] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fetch voter list
  useEffect(() => {
    fetch("https://voter-server-jjta.onrender.com/voters")
      .then((response) => response.json())
      .then((data) => setVoters(data))
      .catch((error) => console.error("Error loading voter data:", error));
  }, []);

  // Handle login
  const handleLogin = () => {
    fetch("https://voter-server-jjta.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.username) {
          setLoggedInUser(data.username);
          setUsername("");
          setPassword("");
        } else {
          alert("Invalid login credentials");
        }
      })
      .catch((error) => console.error("Login error:", error));
  };

  // Handle logout
  const handleLogout = () => {
    fetch("https://voter-server-jjta.onrender.com/logout", {
      method: "POST",
    })
      .then(() => setLoggedInUser(null))
      .catch((error) => console.error("Logout error:", error));
  };

  // Handle marking
  const handleMarkChange = (id) => {
    if (!loggedInUser) {
      alert("You must be logged in to mark voters.");
      return;
    }

    setVoters((prevVoters) => {
      const updatedVoters = prevVoters.map((voter) =>
        voter.id === id ? { ...voter, marked: !voter.marked } : voter
      );

      // Save changes to backend
      fetch("https://voter-server-jjta.onrender.com/save-voters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVoters),
      }).catch((error) => console.error("Error saving data:", error));

      return updatedVoters;
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg mt-5">
      <h2 className="text-xl font-bold mb-4 text-center">Voter List</h2>

      {/* Login Form */}
      {!loggedInUser ? (
        <div className="mb-4 flex flex-col items-center space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-3 rounded w-full max-w-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded w-full max-w-sm"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-5 py-3 rounded w-full max-w-sm text-lg"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="mb-4 flex justify-between items-center">
          <span className="text-green-600 font-medium text-lg">
            Logged in as {loggedInUser}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      )}

      {/* Voter List */}
      <ul className="space-y-3">
        {voters.map((voter) => (
          <li
            key={voter.id}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
          >
            <div className="flex flex-col">
              <span className="font-medium text-lg">{voter.name}</span>
              <span className="text-sm text-gray-600">
                Father: {voter.father_name}
              </span>
            </div>
            <input
              type="checkbox"
              checked={voter.marked}
              onChange={() => handleMarkChange(voter.id)}
              className="h-6 w-6 text-blue-600"
              disabled={!loggedInUser} // Disable if not logged in
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoterList;
