import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VendorMgt.css";

function VendorMgt() {
  const API = process.env.REACT_APP_BASE_API_URL;

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVendors = async () => {
    try {
      const res = await axios.get(
        `${API}/vendor/getvendorcount`
      );

      setVendors(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const manageVendor = async (vid, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "Active"
          ? "Inactive"
          : "Active";

      await axios.put(
        `${API}/vendor/vendermanage/${vid}/${newStatus}`
      );

      alert("Vendor Status Updated Successfully");

      loadVendors();
    } catch (err) {
      console.error(err);
      alert("Unable to update vendor status");
    }
  };

  if (loading) {
    return <h2>Loading Vendors...</h2>;
  }

  return (
    <div className="vendor-mgt">
      <h2>Vendor Management</h2>

      <table style={{backgroundColor:"black"}}>
        <thead>
          <tr>
            <th>VID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>User ID</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody style={{backgroundColor:"black"}}>
          {vendors.map((vendor) => (
            <tr style={{backgroundColor:"black"}} key={vendor.Vid}>
              <td>{vendor.Vid}</td>

              <td>
                <img
                  src={vendor.VPicName}
                  alt="Vendor"
                  className="vendor-img"
                />
              </td>

              <td>{vendor.VenderName}</td>
              <td>{vendor.VUserId}</td>
              <td>{vendor.VEmail}</td>
              <td>{vendor.VContact}</td>

              <td>
                <span
                  className={
                    vendor.Status === "Active"
                      ? "active-status"
                      : "inactive-status"
                  }
                >
                  {vendor.Status}
                </span>
              </td>

              <td>
                <button
                  className={
                    vendor.Status === "Active"
                      ? "deactivate-btn"
                      : "activate-btn"
                  }
                  onClick={() =>
                    manageVendor(
                      vendor.Vid,
                      vendor.Status
                    )
                  }
                >
                  {vendor.Status === "Active"
                    ? "Deactivate"
                    : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendorMgt;