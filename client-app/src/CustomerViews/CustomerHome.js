// import React from "react";
// import "./CustomerHome.css";
// import ProductList from "../ProductViews/ProductList";
// import ReactDOM from "react-dom/client";

// function CustomerHome({ customer, onLogout }) {
//   const root = ReactDOM.createRoot(document.getElementById('root'));
//   const handleProductButton=()=>{
//   root.render(<ProductList data={customer.Cid}/>);
// }
//   return(
//      <div>
//       <h4>Welcome Customer Home </h4>
//       <h5>{customer.CustomerName}</h5>
//       <img src={customer.CPicName} height={100} width={100} style={{borderRadius:50}} alt="customer pic" />
//       <button type="submit" onClick={handleProductButton} style={{background:"green",color:"white"}}>Shoping</button>
//      </div>
//   );

// }
// export default CustomerHome;


import React, { useState } from "react";
import "./CustomerHome.css";
import ProductList from "../ProductViews/ProductList";
import ViewCustomerProfile from "./CustomerProfile";
import EditCustomerProfile from "./EditCustomerProfile";
import ChangePassword from "./Customer_Change_Pass";

function CustomerHome({ customer, onLogout }) {
  const [activeView, setActiveView] = useState("home");
  if (!customer) { return <h2>Loading...</h2>; }

  if (activeView === "shopping") {
    return (
      <div className="product-view-container">
        <button
          className="back-btn"
          onClick={() => setActiveView("home")}
        >
          Back
        </button>
        <ProductList data={customer.Cid} />
      </div>
    );
  }

  if (activeView === "viewprofile") {
    return (
      <div className="product-view-container">
        <button
          className="back-btn"
          onClick={() => setActiveView("home")}
        >
          Back
        </button>
        <ViewCustomerProfile data={customer.Cid} />
      </div>
    );
  }

  if (activeView === "editprofile") {
    return (
      <div className="product-view-container">
        <button
          className="back-btn"
          onClick={() => setActiveView("home")}
        >
          Back
        </button>
        <EditCustomerProfile
  user={customer}
  onClose={() => setActiveView("home")}
  onUpdate={() => setActiveView("home")}
/>
      </div>
    );
  }

  if (activeView === "changepassword") {
    return (
      <div className="product-view-container">
        <button
          className="back-btn"
          onClick={() => setActiveView("home")}
        >
          Back
        </button>
        {/* <ChangePassword data={customer.Cid } /> */}
      <ChangePassword
  Cid={customer.Cid}
  CUserId={customer.CUserId}
/>
      </div>
    );
  }

  return (
    <div className="customer-home">
      <h2 className="welcome-title">Welcome Customer</h2>

      <img
        src={customer.CPicName}
        alt="Customer"
        className="customer-image"
      />

      <h3 className="customer-name">{customer.CustomerName}</h3>

      <div className="button-group">
        <button
          className="shopping-btn"
          onClick={() => setActiveView("shopping")}
        >
          Shopping
        </button>

        <button
          className="profile-btn"
          onClick={() => setActiveView("viewprofile")}
        >
          View Profile
        </button>

        <button
          className="edit-btn"
          onClick={() => setActiveView("editprofile")}
        >
          Edit Profile
        </button>

        <button
          className="password-btn"
          onClick={() => setActiveView("changepassword")}
        >
          Change Password
        </button>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default CustomerHome;