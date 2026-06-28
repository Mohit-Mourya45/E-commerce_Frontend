import React, { useState } from "react";
import AdminLogin from "./AdminViews/AdminLogin";
import CustomerMain from "./CustomerViews/CustomerMain";
import VendorMain from "./VendorViews/VendorMain";
import ProductListforMainPage from "./ProductViews/ProductListforMainPage";
import Product from "./ProductViews/Product";
import "./App.css";
import mainpic from "./mainpic.jpg";

function App() {
  const [page, setPage] = useState("");

  if (page === "admin") {
    return <AdminLogin />;
  }

  if (page === "customer") {
    return <CustomerMain />;
  }

  if (page === "vendor") {
    return <VendorMain />;
  }

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          E-Shopee........
        </div>

        <div className="nav-buttons">
          <button
            className="nav-btn admin-btn"
            onClick={() => setPage("admin")}
          >
            Admin Login
          </button>

          <button
            className="nav-btn customer-btn"
            onClick={() => setPage("customer")}
          >
            Customer Portal
          </button>

          <button
            className="nav-btn vendor-btn"
            onClick={() => setPage("vendor")}
          >
            Vendor Portal
          </button>
        </div>
      </nav>

      
      <div className="hero-section">        
        <img src={mainpic}  alt="mainpic" width={1140} height={250} style={{borderRadius:15}}/>
      </div>
     
      
      {/* Products */}
      <div className="product-section">
        <ProductListforMainPage />
      </div>
    </div>
  );
}

export default App;