import React, { useState } from "react";
import "./AuthPage.css";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

export default function AuthPage() {
  const [mode, setMode] = useState("signup");

  const handleToggle = () => {
    const expanding = mode === "signup" ? "expand-left" : "expand-right";
    const targetMode = mode === "signup" ? "login" : "signup";
    setMode(expanding);
    setTimeout(() => {
      setMode(targetMode);
    }, 800);
  };
  return (
    <div className="Main">
      <div className={`Main-Container ${mode}`}>
        <div className="Cover">
          <div className="Cover-text">
            <h1>{mode === "login" ? "Welcome Back !" : "Hello, Welcome!"}</h1>
            <p>
              {mode === "login"
                ? "Already have an account ?"
                : "Don't have an account ?"}
            </p>
          </div>
          <div className="Cover-button">
            <button onClick={handleToggle}>
              {mode === "login" ? "Login" : "Join Hivee"}
            </button>
          </div>
        </div>
        <Signup stateReset={mode} />
        <Login stateReset={mode} />
      </div>
    </div>
  );
}
