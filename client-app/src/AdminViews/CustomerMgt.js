import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerMgt.css";

function CustomerMgt() {
  const API = process.env.REACT_APP_BASE_API_URL;

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const res = await axios.get(
        `${API}/customer/getcustomercount`
      );

      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const manageCustomer = async (cid, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "Active"
          ? "Inactive"
          : "Active";

      await axios.put(
        `${API}/customer/customermanage/${cid}/${newStatus}`
      );

      alert("Customer Status Updated");

      loadCustomers();
    } catch (err) {
      console.error(err);
      alert("Unable to update customer status");
    }
  };

  if (loading) {
    return <h2>Loading Customers...</h2>;
  }

  return (
    <div className="customer-mgt">
      <h2>Customer Management</h2>

      <table style={{backgroundColor:"black"}}>
        <thead>
          <tr>
            <th>CID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>User ID</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((cust) => (
            <tr style={{backgroundColor:"black"}} key={cust.Cid}>
              <td>{cust.Cid}</td>

              <td>
                <img
                  src={cust.CPicName}
                  alt="Customer"
                  className="customer-img"
                />
              </td>

              <td>{cust.CustomerName}</td>
              <td>{cust.CUserId}</td>
              <td>{cust.CEmail}</td>
              <td>{cust.CContact}</td>

              <td>
                <span
                  className={
                    cust.Status === "Active"
                      ? "active-status"
                      : "inactive-status"
                  }
                >
                  {cust.Status}
                </span>
              </td>

              <td>
                <button
                  className={
                    cust.Status === "Active"
                      ? "deactivate-btn"
                      : "activate-btn"
                  }
                  onClick={() =>
                    manageCustomer(
                      cust.Cid,
                      cust.Status
                    )
                  }
                >
                  {cust.Status === "Active"
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

export default CustomerMgt;