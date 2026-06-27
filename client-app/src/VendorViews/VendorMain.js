import React, { useState } from "react";
import "./VendorMain.css";

import VenderLogin from "./VendorLogin";
import VenderReg from "./VendorReg";

function VendorMain() {
  const [page, setPage] = useState("");

  if (page === "login") {
    return (
      <VenderLogin
        onBack={() => setPage("")}
      />
    );
  }

  if (page === "register") {
    return (
      <VenderReg
        onBack={() => setPage("")}
      />
    );
  }

  return (
    <div className="main-container">
      <div className="main-card">
        <h1>Vendor Portal</h1>

        <button
          className="main-btn"
          onClick={() => setPage("login")}
        >
          Vendor Login
        </button>

        <button
          className="main-btn"
          onClick={() => setPage("register")}
        >
          Vendor Registration
        </button>
      </div>
    </div>
  );
}

export default VendorMain;