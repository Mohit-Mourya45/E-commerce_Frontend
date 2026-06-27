import React, { useState } from "react";
import "./AdminLogin.css";
import AdminHome from "./AdminHome";

function AdminLogin() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const admin = {
    AdminId: "Admin",
    AdminName: "Administrator"
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (userid === "Admin" && password === "Abc@123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid User ID or Password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserid("");
    setPassword("");
  };

  if (isLoggedIn) {
    return (
      <AdminHome
        admin={admin}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        <div className="form-group">
          <label>User ID</label>
          <input
            type="text"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            placeholder="Enter User ID"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <div className="credentials">
          {/* <p><b>User ID:</b> Admin</p>
          <p><b>Password:</b> Abc@123</p> */}
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;