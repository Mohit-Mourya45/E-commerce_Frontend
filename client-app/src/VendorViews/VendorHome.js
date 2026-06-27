import React from "react";
import "./VendorHome.css";

function VenderHome({ vender, onLogout }) {
    if (!vender) {
        return <h4>Loading vendor data...</h4>;
    }

    return (
        <div>
            <h4>Welcome to Vendor Home</h4>

            <h5>{vender?.VendorName}</h5>

            <img
                src={"http://localhost:9090/uploads/" + vender?.VPicName}
                height={100}
                width={100}
                style={{ borderRadius: "50%" }}
                alt="vendor pic"
            />
        </div>
    );
}

export default VenderHome;