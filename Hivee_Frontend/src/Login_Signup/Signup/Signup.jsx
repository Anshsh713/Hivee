import React, { useState } from "react"; // Getting React lib.
import "./Signup.css"; // Joining with css

export default function Signup() {
  // Sign up component
  const [error, setError] = useState(""); // UseState if a error is occur to display it
  const [loading, setloading] = useState(false); // Seting for loading untill data is saving
  const [username, setUsername] = useState(""); // Storing User Username
  const [email, setEmail] = useState(""); // Storing User Email ID
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    if (!username) {
      setUsername("User");
    }
    if (!email) {
      setError("Email is required");
      setloading(false);
      return;
    }
    if (!email.includes("@gmail.com")) {
      setError("Please enter a valid email");
      setloading(false);
      return;
    }
    if (!password) {
      setError("Password is required");
      setloading(false);
      return;
    }
    setError("");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    setUsername("");
    setEmail("");
    setPassword("");
    setloading(false);
  };
  return (
    <div className="Signup-container">
      <div className="Signup-text">
        <h1>Create account</h1>
      </div>
      <div className="error">
        <p>{error}</p>
      </div>
      <form className="Signup-form" onSubmit={handleSubmit}>
        <div className="Signup-Input">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="Submit">
          <button type="submit">Login</button>
        </div>
      </form>
      <div className="socal-box">
        <div className="Social-Signup-text">
          <p>or login with Social platform</p>
        </div>
        <div className="social-Platform">
          <button>
            <span>
              <i className="fa-brands fa-google"></i>
            </span>
          </button>
          <button>
            <span>
              <i className="fa-brands fa-github"></i>
            </span>
          </button>
          <button>
            <span>
              <i className="fa-brands fa-facebook-f"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
