import React, { useState } from "react";
import "./CustomerMain.css";

import CustomerLogin from "./CustomerLogin";
import CustomerReg from "./CustomerReg";

function CustomerMain() {
  const [page, setPage] = useState("");

  if (page === "login") {
    return (
      <CustomerLogin
        onBack={() => setPage("")}
      />
    );
  }

  if (page === "register") {
    return (
      <CustomerReg
        onBack={() => setPage("")}
      />
    );
  }

  return (
    <div className="main-container">
      <div className="main-card">
        <h1>Customer Portal</h1>

        <button
          className="main-btn"
          onClick={() => setPage("login")}
        >
          Customer Login
        </button>

        <button
          className="main-btn"
          onClick={() => setPage("register")}
        >
          Customer Registration
        </button>
      </div>
    </div>
  );
}

export default CustomerMain;