import React, { useState } from "react";
import "./AdminHome.css";

import StateMgt from "./StateMgt";
import CityMgt from "./CityMgt";
import ProductCatgMgt from "./ProductCatgMgt";
import CustomerMgt from "./CustomerMgt";
import VendorMgt from "./VendorMgt";

function AdminHome({ admin, onLogout }) {
  const [activePage, setActivePage] = useState("");

  const renderPage = () => {
    switch (activePage) {
      case "state":
        return <StateMgt />;
      case "city":
        return <CityMgt />;
      case "productcatg":
        return <ProductCatgMgt />;
      case "customer":
        return <CustomerMgt />;
      case "vendor":
        return <VendorMgt />;
        
      default:
        return (
          <div className="admin-welcome">
            <h2>Welcome Admin</h2>

            <div className="admin-card">
              <p>
                <strong>Admin ID:</strong>{" "}
                {admin?.AdminId || admin?.Aid || "ADMIN"}
              </p>

              <p>
                <strong>Name:</strong>{" "}
                {admin?.AdminName || admin?.AName || "Administrator"}
              </p>
            </div>

            <p className="info-text">
              Select any option from the left menu.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>

        <button
          className={activePage === "state" ? "active" : ""}
          onClick={() => setActivePage("state")}
        >
          State Management
        </button>

        <button
          className={activePage === "city" ? "active" : ""}
          onClick={() => setActivePage("city")}
        >
          City Management
        </button>

        <button
          className={activePage === "productcatg" ? "active" : ""}
          onClick={() => setActivePage("productcatg")}
        >
          Product Category
        </button>
         
         <button
            className={activePage === "customer" ? "active" : ""}
            onClick={() => setActivePage("customer")}
        >
          Customer Management
        </button>

       <button
            className={activePage === "vendor" ? "active" : ""}
            onClick={() => setActivePage("vendor")}
        >
          Vendor Management
      </button>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Content Area */}
      <div className="admin-content">{renderPage()}</div>
    </div>
  );
}

export default AdminHome;