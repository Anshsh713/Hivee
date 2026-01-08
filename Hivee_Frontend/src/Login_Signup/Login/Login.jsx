import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ stateReset }) {
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [see, setSee] = useState("password");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    if (!email) {
      setError("Email is required");
      setloading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setloading(false);
      return;
    }
    if (!password) {
      setError("Password is required");
      setloading(false);
      return;
    }
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setEmail("");
    setPassword("");
    setError("");
    setloading(false);
  };
  const togglePassword = () => {
    setSee((state) => (state === "password" ? "text" : "password"));
  };
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
    setloading(false);
    setSee("password");
  }, [stateReset]);
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
          <div className="password">
            <input
              type={see}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={togglePassword}>
              <i
                className={`fa-solid ${
                  see === "password" ? "fa-eye" : "fa-eye-slash"
                }`}
              ></i>
            </button>
          </div>
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
