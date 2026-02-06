import React, { useState } from "react";
import "./signup.css";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import {toast} from "react-toastify"


export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  

  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const response = await axios.post("http://localhost:5000/boopi/register",{
      username : username,
      password : password
    });
    if (response.status === 201) {
        sessionStorage.setItem("user_id", response.data.id);
        navigate("/app");
      }
  }
    catch(e){
      if (e.response?.status === 409){
        toast.error(e.response.data.message)
        return;
      }
      toast.error("Something went wrong. Please try again.");
    }

  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>username</label>
            <input
              type="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};
