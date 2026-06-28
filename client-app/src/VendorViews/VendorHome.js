import React from "react";
import "./VendorHome.css";

function VenderHome({ vender, onLogout }) {
    if (!vender) {
        return <h4>Loading vendor data...</h4>;
    }
console.log(vender);
console.log(vender?.VPicName);
     return (
        <div className="vendor-home-container">
            <div className="vendor-home-card">
                <h2 className="vendor-home-title">
                    Welcome to Vendor Home
                </h2>

                <img
                    className="vendor-profile-pic"
                    
                    src={vender?.VPicName}
                    alt="vendor pic"
                />

                <h3 className="vendor-name">
                    {vender?.VendorName}
                </h3>

                <button className="logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default VenderHome;