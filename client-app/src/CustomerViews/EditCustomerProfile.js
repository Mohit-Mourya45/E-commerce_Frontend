import React, { useEffect, useState } from "react";
import axios from "axios";

function EditCustomerProfile({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState(null);
  const [stlist, setStList] = useState([]);
  const [ctlist, setCtList] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
 const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // Load existing customer + states
  useEffect(() => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/customer/getcustomerdetails/${user.Cid}`)
      .then((res) => {
  console.log("Customer Data:", res.data);

  setFormData({
    ...res.data,
    CStId: res.data.CStId,
    CCtId: res.data.CCtId
  });

  if (res.data.CStId) {
    axios
      .get(
        `${REACT_APP_BASE_API_URL}/city/showcitybystate/${res.data.CStId}`
      )
      .then((ctRes) => {
        console.log("Cities:", ctRes.data);
        setCtList(ctRes.data);
      })
      .catch((err) => console.error(err));
  }
})
      .catch((err) => console.error(err));

    axios
      .get(`${REACT_APP_BASE_API_URL}/state/show/`)
      .then((res) => setStList(res.data))
      .catch((err) => console.error(err));
  }, [user.Cid]);

  if (!formData) return <div>Loading...</div>;

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle state change -> load cities
  const handleStateChange = (e) => {
    const stid = e.target.value;
    setFormData({ ...formData, StId: stid, CtId: "" });
    axios
      .get(`${REACT_APP_BASE_API_URL}/city/showcitybystate/${stid}`)
      .then((res) => setCtList(res.data))
      .catch((err) => console.error(err));
  };

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Image URL resolver (works for Cloudinary + local)
  const getImageUrl = (picName) => {
    if (!picName) return "/default-avatar.png";
    if (picName.startsWith("http")) return picName;
    return `${REACT_APP_BASE_API_URL}/customerimages/${picName}`;
  };

  // Validate inputs
  const validate = () => {
    const errs = {};
    if (!formData.CUserName?.trim())
      errs.CUserName = "Full Name is required";
    if (!formData.CStId) errs.StId = "State is required";
    if (!formData.CCtId) errs.CtId = "City is required";
    if (!formData.CAddress?.trim())
      errs.CAddress = "Address is required";

    const contactStr = String(formData.CContact ?? "");
    if (!/^\d{10}$/.test(contactStr))
      errs.CContact = "Contact must be exactly 10 digits";

    if (!formData.CEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.CEmail = "Valid email is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const form = new FormData();
      form.append("CUserName", formData.CUserName);
      form.append("CUserId", formData.CUserId);
      form.append("CStId", formData.CStId);
      form.append("CCtId", formData.CCtId);
      form.append("CAddress", formData.CAddress);
      form.append("CContact", formData.CContact);
      form.append("CEmail", formData.CEmail);

      if (newImage) {
        form.append("CPicName", newImage);
      }

      const res = await axios.put(
        `${REACT_APP_BASE_API_URL}/customer/update/${user.Cid}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message);
      const updatedUser = res.data.customer;

      // Save updated user in storage
      const storage =
        localStorage.getItem("userSession") !== null
          ? localStorage
          : sessionStorage;
      storage.setItem("userSession", JSON.stringify(updatedUser));

      onUpdate(updatedUser);
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error updating profile";
      alert(msg);
    }
  };

  return (
    <div style={{ marginTop: 20, padding: 15, border: "1px solid #ccc" }}>
      <h4>Edit Profile</h4>

      {/* Name */}
      <input
        type="text"
        name="CUserName"
        value={formData.CUserName || ""}
        onChange={handleChange}
        placeholder="Full Name"
      />
      {errors.CUserName && (
        <p style={{ color: "red" }}>{errors.CUserName}</p>
      )}
      <br />

      {/* State */}
      <select name="CStId" value={formData.StId || ""} onChange={handleStateChange}>
        <option value="">-- Select State --</option>
        {stlist.map((s) => (
          <option key={s.stid} value={s.stid}>
            {s.stname}
          </option>
        ))}
      </select>
      {errors.StId && <p style={{ color: "red" }}>{errors.StId}</p>}
      <br />

      {/* City */}
      <select
        name="CCtId"
        value={formData.CtId || ""}
        onChange={(e) => setFormData({ ...formData, CtId: e.target.value })}
      >
        <option value="">-- Select City --</option>
        {ctlist.map((c) => (
          <option key={c.ctid} value={c.ctid}>
            {c.ctname}
          </option>
        ))}
      </select>
      {errors.CtId && <p style={{ color: "red" }}>{errors.CtId}</p>}
      <br />

      {/* Address */}
      <input
        type="text"
        name="CAddress"
        value={formData.CAddress || ""}
        onChange={handleChange}
        placeholder="Address"
      />
      {errors.CAddress && <p style={{ color: "red" }}>{errors.CAddress}</p>}
      <br />

      {/* Contact */}
      <input
        type="tel"
        name="CContact"
        value={formData.CContact ?? ""}
        onChange={(e) =>
          setFormData({ ...formData, CContact: e.target.value })
        }
        placeholder="Contact"
      />
      {errors.CContact && <p style={{ color: "red" }}>{errors.CContact}</p>}
      <br />

      {/* Email */}
      <input
        type="email"
        name="CEmail"
        value={formData.CEmail || ""}
        onChange={handleChange}
        placeholder="Email"
      />
      {errors.CEmail && <p style={{ color: "red" }}>{errors.CEmail}</p>}
      <br />

      {/* Profile Image */}
      <p>Profile Image:</p>
      <img
        src={preview ? preview : getImageUrl(formData.CPicName)}
        height={80}
        width={80}
        style={{ borderRadius: "50%", objectFit: "cover", border: "1px solid #ddd" }}
        alt="Customer"
      />
      <br />
      <input type="file" onChange={handleFileChange} />
      <br />

      <button onClick={handleSubmit} style={{ marginRight: 10 }}>
        Save
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default EditCustomerProfile;