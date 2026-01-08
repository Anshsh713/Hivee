import React, { useState } from "react";
import "./Login.css";
export default function Login() {
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
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
    console.log("Email:", email);
    console.log("Password:", password);
    setEmail("");
    setPassword("");
    setError("");
    setloading(false);
  };
  return (
    <div className="Login-Container">
      <div className="Login-text">
        <h1>Login</h1>
      </div>
      <div className="error">
        <p>{error}</p>
      </div>
      <form className="Login-form" onSubmit={handleSubmit}>
        <div className="Login-Input">
          <input
            type="text"
            placeholder="Email ID"
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
        <div className="Forgot">
          <p>Forgot Password</p>
        </div>
        <div className="Submit">
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </form>
      <div className="socal-box">
        <div className="Social-Login-text">
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
