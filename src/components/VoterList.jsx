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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Voter List</h2>
        </div>

        {/* Login Form or Logged-in Info */}
        <div className="p-6">
          {!loggedInUser ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-semibold text-lg">
                Welcome, {loggedInUser}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Voter List Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border border-gray-300">#</th>
                <th className="p-3 border border-gray-300">Voter Name</th>
                <th className="p-3 border border-gray-300">Father's Name</th>
                <th className="p-3 border border-gray-300">Marked</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter, index) => (
                <tr
                  key={voter.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-all`}
                >
                  <td className="p-3 border border-gray-300 text-center">
                    {index + 1}
                  </td>
                  <td className="p-3 border border-gray-300">{voter.name}</td>
                  <td className="p-3 border border-gray-300">{voter.father_name}</td>
                  <td className="p-3 border border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={voter.marked}
                      onChange={() => handleMarkChange(voter.id)}
                      className="w-5 h-5 cursor-pointer"
                      disabled={!loggedInUser}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VoterList;
