import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Customer_Change_pass.css";

function Customer_Change_Pass({ Cid,CUserId }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New Password and Confirm Password do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:9191/customer/changepassword",
        {
          CUserId,
          OldPassword: oldPassword,
          NewPassword: newPassword,
        }
      );

      setMessage(res.data.message || "Password Changed Successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Password Change Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="changepass-container">
      <div className="changepass-card">
        <h2>Change Password</h2>

        <p className="userid-text">
          User ID : <strong>{CUserId}</strong>
        </p>

        {message && <div className="message-box">{message}</div>}

        <form onSubmit={handleSubmit}>
          <label>Old Password</label>
          <div className="password-field">
            <input
              type={showPassword.old ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter Old Password"
            />
            <span
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  old: !showPassword.old,
                })
              }
            >
              {showPassword.old ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label>New Password</label>
          <div className="password-field">
            <input
              type={showPassword.new ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter New Password"
            />
            <span
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  new: !showPassword.new,
                })
              }
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label>Confirm New Password</label>
          <div className="password-field">
            <input
              type={showPassword.confirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
            />
            <span
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  confirm: !showPassword.confirm,
                })
              }
            >
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Please Wait..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Customer_Change_Pass;