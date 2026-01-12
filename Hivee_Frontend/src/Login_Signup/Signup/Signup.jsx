import React, { useState, useEffect } from "react"; // Getting React lib.
import "./Signup.css"; // Joining with css
import { useAuth } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Signup({ stateReset }) {
  // Sign up component
  const [error, setError] = useState(""); // UseState if a error is occur to display it
  const [loading, setloading] = useState(false); // Seting for loading untill data is saving
  const [username, setUsername] = useState(""); // Storing User Username
  const [email, setEmail] = useState(""); // Storing User Email ID
  const [password, setPassword] = useState("");
  const { signupUser, loginUser, signupUser_by_verify } = useAuth();
  const navigate = useNavigate();
  const [see, setSee] = useState("password");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);

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
      await signupUser(username, email, password);
      setShowOtp(true);
    } catch (error) {
      setError(error.message);
    }
    setloading(false);
  };
  const togglePassword = () => {
    setSee((state) => (state === "password" ? "text" : "password"));
  };
  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
    setloading(false);
    setSee("password");
  }, [stateReset]);

  const verifyOtp = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }

    setloading(true);
    setError("");

    try {
      await signupUser_by_verify(username, email, password, otp);
      setOtp("");
      await loginUser(email, password);
      setShowOtp(false);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setloading(false);
  };

  const resendOtp = async () => {
    setResending(true);
    try {
      setOtp("");
      await signupUser(username, email, password);
      setResending(false);
    } catch (err) {
      setError(err.message);
    }
    setResending(false);
  };

  const closingotp = () => {
    setShowOtp(false);
    setEmail("");
    setUsername("");
    setPassword("");
    setError("");
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
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password">
            <input
              type={see}
              placeholder="Password"
              value={password}
              autoComplete="current-password"
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
        <div className="Submit">
          <button type="submit" disabled={loading}>
            {loading ? "Joining..." : "Join"}
          </button>
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
        </div>
      </div>
      {showOtp && (
        <div className="otp-overlay">
          <div className="otp-box">
            <div className="title">
              <h2>Email Verification</h2>
              <button onClick={closingotp}>
                <i className="fa-solid fa-x"></i>
              </button>
            </div>
            <p className="otp-subtext">
              Enter the 6-digit OTP sent to <b>{email}</b>
            </p>

            {error && <div className="otp-error">{error}</div>}

            <input
              type="text"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="otp-input"
            />

            <button
              className="otp-verify-btn"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button className="otp-resend-btn" onClick={resendOtp}>
              {resending ? "Resending OTP..." : "Resend OTP"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
