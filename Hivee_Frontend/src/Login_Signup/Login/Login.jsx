import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/UserContext";
import {
  UNSAFE_createClientRoutesWithHMRRevalidationOptOut,
  useNavigate,
} from "react-router-dom";
import "./Login.css";

export default function Login({ stateReset }) {
  const [error, setError] = useState(""); // check for errors of login page
  const [errorR, setErrorR] = useState(""); // check for errors for password reset
  const [loading, setloading] = useState(false); // loading state
  const [email, setEmail] = useState(""); // login page email
  const [password, setPassword] = useState(""); // login page password
  const {
    loginUser,
    Password_Reset_requesting,
    Password_Reset_Verify,
    Password_Reseting,
  } = useAuth(); // api from Usercontext
  const navigate = useNavigate(); // navigate through pages
  const [see, setSee] = useState("password");
  const [showreset, setShowreset] = useState(false);
  const [emailR, setEmailR] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [state, setState] = useState("Email");
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);

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
      setEmail("");
      setPassword("");
      setError("");
      setloading(false);
    } catch (error) {
      setError(error.message);
    }
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

  const email_verification = async (e) => {
    e.preventDefault();
    setloading(true);
    if (!emailR) {
      setErrorR("Email is required");
      setloading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailR)) {
      setErrorR("Please enter a valid email address");
      setloading(false);
      return;
    }

    try {
      await Password_Reset_requesting(emailR);
      setState("OTP");
    } catch (error) {
      setErrorR(error.message);
    }
    setloading(false);
  };

  const otp_verification = async () => {
    if (!otp) {
      setErrorR("OTP is required");
      return;
    }
    setloading(true);
    setErrorR("");
    try {
      await Password_Reset_Verify(emailR, otp);
      setOtp("");
      setState("Password");
    } catch (error) {
      setErrorR(error.message);
    }
    setloading(false);
  };

  const resendotp = async () => {
    setResending(true);
    try {
      setOtp("");
      await Password_Reset_requesting(emailR);
      setResending(false);
    } catch (error) {
      setErrorR(error.message);
    }
    setResending(false);
  };

  const passwordreseting = async () => {
    setloading(true);
    if (!passwordR) {
      setErrorR("Password is required");
      setloading(false);
      return;
    }
    try {
      await Password_Reseting(emailR, passwordR);
      setTimeout(() => {
        setShowreset(!showreset);
        setState("Email");
        setErrorR("");
        setEmailR("");
        setPasswordR("");
        setOtp("");
        setSee("password");
      }, 100);
    } catch (error) {
      setErrorR(error.message);
    }
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
        <div className="Forgot">
          <p
            onClick={() => {
              setShowreset(!showreset);
              setEmailR(email);
              setPasswordR(password);
              setError("");
            }}
          >
            Forgot Password
          </p>
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
        </div>
      </div>
      {showreset && (
        <div className="password-reset">
          <div className="password-box">
            {state === "Email" && (
              <div className="Email-verfiy">
                <div className="title">
                  <h2>Email Verification</h2>
                  <button
                    onClick={() => {
                      setShowreset(!showreset);
                      setEmailR("");
                      setPasswordR("");
                      setOtp("");
                      setState("Email");
                    }}
                  >
                    <i className="fa-solid fa-x"></i>
                  </button>
                </div>
                {errorR && <div className="reset-error">{errorR}</div>}
                <div className="input-verify">
                  <input
                    type="text"
                    placeholder="Email ID"
                    value={emailR}
                    autoComplete="email"
                    onChange={(e) => setEmailR(e.target.value)}
                  />
                </div>
                <div className="email-button">
                  <button onClick={email_verification} disabled={loading}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              </div>
            )}
            {state === "OTP" && (
              <div className="OTP-verify">
                <div className="title">
                  <h2>OTP Verification</h2>
                  <button
                    onClick={() => {
                      setShowreset(!showreset);
                      setEmailR("");
                      setPasswordR("");
                      setOtp("");
                      setState("Email");
                    }}
                  >
                    <i className="fa-solid fa-x"></i>
                  </button>
                </div>
                {errorR && <div className="reset-error">{errorR}</div>}
                <div className="Otp-verification">
                  <input
                    type="text"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="otp-input"
                  />
                </div>
                <div className="otp-button">
                  <button
                    onClick={otp_verification}
                    disabled={loading}
                    className="verify"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button className="otp-resend-btn" onClick={resendotp}>
                    {resending ? "Resending OTP..." : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}
            {state === "Password" && (
              <div className="password-reseting">
                <div className="title">
                  <h2>Enter your New Password</h2>
                  <button
                    onClick={() => {
                      setShowreset(!showreset);
                      setEmailR("");
                      setPasswordR("");
                      setOtp("");
                      setState("Email");
                    }}
                  >
                    <i className="fa-solid fa-x"></i>
                  </button>
                </div>
                {errorR && <div className="reset-error">{errorR}</div>}
                <div className="password">
                  <input
                    type={see}
                    placeholder="New Password"
                    value={passwordR}
                    autoComplete="current-password"
                    onChange={(e) => setPasswordR(e.target.value)}
                  />
                  <button type="button" onClick={togglePassword}>
                    <i
                      className={`fa-solid ${
                        see === "password" ? "fa-eye" : "fa-eye-slash"
                      }`}
                    ></i>
                  </button>
                </div>
                <div className="password-button">
                  <button onClick={passwordreseting} disabled={loading}>
                    {loading ? "Reseting..." : "Reset"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
