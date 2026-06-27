  // import React, { useEffect, useState } from "react";
  // import axios from "axios";
  // import "./CustomerProfile"

  // function CustomerProfile() {
  //   const [profile, setProfile] = useState({
  //     CustomerName: "",
  //     StId: "",
  //     CtId: "",
  //     CAddress: "",
  //     CContact: "",
  //     CEmail: "",
  //     CPicName: ""
  //   });

  //   const cid = JSON.parse(localStorage.getItem("userSession"))?.cid; 
  // const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  //   useEffect(() => {
  //     axios.get(`${REACT_APP_BASE_API_URL}/customer/getcustomerdetails/${cid}`)
  //       .then(res => setProfile(res.data))
  //       .catch(err => console.error(err));
  //   }, [cid]);

  //   const handleChange = (e) => {
  //     setProfile({ ...profile, [e.target.name]: e.target.value });
  //   };

  //   const handleUpdate = () => {
  //     axios.put(`${REACT_APP_BASE_API_URL}/customer/update/${cid}`, profile)
  //       .then(res => {
  //         alert(res.data.message);
  //         setProfile(res.data.customer);
  //       })
  //       .catch(err => alert("Error updating profile"));
  //   };


  // const handleFileUpload = async (e) => {
  //   const formData = new FormData();
  //   formData.append("file", e.target.files[0]);

  //   try {
  //     const res = await axios.post(`${REACT_APP_BASE_API_URL}/customer/savecustomerimage`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" }
  //     });

  //     setProfile({ ...profile, CPicName: res.data.filename }); // store file name
  //   } catch (err) {
  //     console.error("File upload failed", err);
  //   }
  // };

  //   return (
  //   <div className="customer-profile-container">
  //     <div className="customer-profile-card">
  //       <h2 className="customer-profile-title">
  //         Edit Customer Profile
  //       </h2>

  //       <div className="profile-image-section">
  //         {profile.CPicName && (
  //           <img
  //             src={profile.CPicName}
  //             alt="Profile"
  //             className="profile-image"
  //           />
  //         )}
  //       </div>

  //       <div className="profile-form">
  //         <div className="profile-field">
  //           <label>Customer Name</label>
  //           <input
  //             name="CustomerName"
  //             value={profile.CustomerName}
  //             onChange={handleChange}
  //           />
  //         </div>

  //         <div className="profile-field">
  //           <label>State ID</label>
  //           <input
  //             name="StId"
  //             value={profile.StId}
  //             onChange={handleChange}
  //           />
  //         </div>

  //         <div className="profile-field">
  //           <label>City ID</label>
  //           <input
  //             name="CtId"
  //             value={profile.CtId}
  //             onChange={handleChange}
  //           />
  //         </div>

  //         <div className="profile-field">
  //           <label>Address</label>
  //           <input
  //             name="CAddress"
  //             value={profile.CAddress}
  //             onChange={handleChange}
  //           />
  //         </div>

  //         <div className="profile-field">
  //           <label>Contact</label>
  //           <input
  //             name="CContact"
  //             value={profile.CContact}
  //             onChange={handleChange}
  //           />
  //         </div>

  //         <div className="profile-field">
  //           <label>Email</label>
  //           <input
  //             type="email"
  //             name="CEmail"
  //             value={profile.CEmail}
  //             onChange={handleChange}
  //           />
  //         </div>

  //         <div className="profile-field file-upload">
  //           <label>Profile Picture</label>
  //           <input
  //             type="file"
  //             onChange={handleFileUpload}
  //           />
  //         </div>

  //         <button
  //           className="update-btn"
  //           onClick={handleUpdate}
  //         >
  //           Update Profile
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
  // }

  // export default CustomerProfile;


  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import "./CustomerProfile.css";

  function CustomerProfile() {
    const [profile, setProfile] = useState(null);

    const cid = JSON.parse(localStorage.getItem("userSession"))?.Cid;
    const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
      axios
        .get(`${REACT_APP_BASE_API_URL}/customer/getcustomerdetails/${cid}`)
        .then((res) => setProfile(res.data))
        .catch((err) => console.error(err));
    }, [cid, REACT_APP_BASE_API_URL]);

    if (!profile) {
      return <h3>Loading Profile...</h3>;
    }

    return (
      <div className="customer-profile-container">
        <div className="customer-profile-card">
          <h2 className="customer-profile-title">
            Customer Profile
          </h2>

         <div className="profile-image-section">
          {profile.CPicName ? (
          <img
            src={profile.CPicName}
          alt="Customer"
          className="profile-image"
      />
  ) : (
    <p>No Profile Image</p>
  )}
</div>

          <div className="profile-details">

            <div className="profile-row">
              <span className="label">Customer Name</span>
              <span>{profile.CUserName}</span>
            </div>

            <div className="profile-row">
              <span className="label">User ID</span>
              <span>{profile.CUserId}</span>
            </div>

            <div className="profile-row">
              <span className="label">State ID</span>
              <span>{profile.CStId}</span>
            </div>

            <div className="profile-row">
              <span className="label">City ID</span>
              <span>{profile.CCtId}</span>
            </div>

            <div className="profile-row">
              <span className="label">Address</span>
              <span>{profile.CAddress}</span>
            </div>

            <div className="profile-row">
              <span className="label">Contact</span>
              <span>{profile.CContact}</span>
            </div>

            <div className="profile-row">
              <span className="label">Email</span>
              <span>{profile.CEmail}</span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  export default CustomerProfile;