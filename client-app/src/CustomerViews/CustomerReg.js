import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./CustomerReg.css";

function CustomerReg() {
    const [cuserid, setCUserId] = useState("");
    const [cuserpass, setCUserPass] = useState("");
    const [crepass, setCRePass] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [showRePass, setShowRePass] = useState(false);

    const [CUserName, setCUserName] = useState("");
    const [caddress, setCAddress] = useState("");
    const [ccontact, setCContact] = useState("");
    const [cemail, setCEmail] = useState("");

    const [cid, setCId] = useState(1);
    const [stlist, setStList] = useState([]);
    const [ctlist, setCtList] = useState([]);

    const [CStId, setCStId] = useState("");
    const [CCtId, setCCtId] = useState("");

    const [image, setImage] = useState({
        preview: "",
        data: ""
    });

    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState({});
    const [customerList, setCustomerList] = useState([]);

    const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

    // Load states when component loads
useEffect(() => {
    axios
        .get(`${REACT_APP_BASE_API_URL}/state/getall`)
        .then((res) => {
            console.log("States =", res.data);
            setStList(res.data);
        })
        .catch((err) => console.log(err));
}, [REACT_APP_BASE_API_URL]);
// Load cities when state changes
useEffect(() => {
    if (CStId !== "") {
        axios
            .get(`${REACT_APP_BASE_API_URL}/city/showcitybystate/${CStId}`)
            .then((res) => {
                console.log("Cities =", res.data);
                setCtList(res.data);
            })
            .catch((err) => console.log(err));
    }
}, [CStId, REACT_APP_BASE_API_URL]);

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const fetchCustomerList = async () => {
        try {
            const res = await axios.get(
                `${REACT_APP_BASE_API_URL}/customer/getcustomercount`
            );

            setCustomerList(res.data);
            setCId(res.data.length + 1);
        } catch (err) {
            console.log("FULL ERROR =", err);

            if (err.response) {
                console.log("STATUS =", err.response.status);
                console.log("DATA =", err.response.data);

                alert("Backend Error : " + err.response.data);
            } else {
                alert("Error : " + err.message);
            }
        }
    };

    const validateForm = () => {
        let temp = {};
        let valid = true;

        if (!cuserid || cuserid.length < 4) {
            temp.cuserid = "UserId must be at least 4 characters";
            valid = false;
        } else if (
            customerList.some(
                (c) =>
                    c.CUserId &&
                    c.CUserId.toLowerCase() === cuserid.toLowerCase()
            )
        ) {
            temp.cuserid = "User ID already exists";
            valid = false;
        }

        if (!cuserpass || cuserpass.length < 6) {
            temp.cuserpass = "Password must be at least 6 characters";
            valid = false;
        }

        if (crepass !== cuserpass) {
            temp.vrepass = "Passwords do not match";
            valid = false;
        }

        if (!/^[A-Za-z ]+$/.test(CUserName)) {
            temp.CUserName = "Customer name must contain only letters";
            valid = false;
        }

        if (!caddress) {
            temp.caddress = "Address is required";
            valid = false;
        }

        if (!/^\d{10}$/.test(ccontact)) {
            temp.ccontact = "Contact must be 10 digits";
            valid = false;
        }

        if (!/\S+@\S+\.\S+/.test(cemail)) {
            temp.cemail = "Enter a valid email";
            valid = false;
        } else if (
            customerList.some(
                (c) =>
                    c.CEmail &&
                    c.CEmail.toLowerCase() === cemail.toLowerCase()
            )
        ) {
            temp.cemail = "Email already exists";
            valid = false;
        }

        if (!image.data) {
            temp.cpicname = "Please upload a profile photo";
            valid = false;
        }

        setErrors(temp);
        return valid;
    };

    const handleRegisterButton = async () => {
        if (!validateForm()) return;

        try {
            const formData = new FormData();

            formData.append("CID", cid);
            formData.append("CUserId", cuserid);
            formData.append("CUserPass", cuserpass);
            formData.append("CUserName", CUserName);
            formData.append("CAddress", caddress);
            formData.append("CStId", CStId);
            formData.append("CCtId", CCtId);
            formData.append("CContact", ccontact);
            formData.append("CEmail", cemail);
            formData.append("file", image.data);

            await axios.post(
                `${REACT_APP_BASE_API_URL}/customer/register`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Customer Registered Successfully");

            setCUserId("");
            setCUserPass("");
            setCRePass("");
            setCUserName("");
            setCAddress("");
            setCContact("");
            setCEmail("");

            setImage({
                preview: "",
                data: ""
            });

            setErrors({});

            fetchCustomerList();
        } catch (err) {
            console.error(err);

            if (err.response) {
                alert("Error : " + err.response.data);
            } else {
                alert("Error : " + err.message);
            }
        }
    };

    const handleFileChange = (evt) => {
        if (!evt.target.files[0]) return;

        const img = {
            preview: URL.createObjectURL(evt.target.files[0]),
            data: evt.target.files[0]
        };

        setImage(img);
    };

    return (
        <div className="customerreg-container">
            <div className="customerreg-form">
                <h2>Customer Registration</h2>

                <p className="status">{status}</p>

                <div className="form-group">
                    <label>Customer ID</label>
                    <span className="readOnly">{cid}</span>
                </div>

                <div className="form-group">
                    <label>User ID</label>
                    <input
                        type="text"
                        value={cuserid}
                        onChange={(e) => setCUserId(e.target.value)}
                    />
                    <span className="error">{errors.cuserid}</span>
                </div>

                <div className="form-group password-field">
                    <label>Password</label>

                    <div className="input-with-icon">
                        <input
                            type={showPass ? "text" : "password"}
                            value={cuserpass}
                            onChange={(e) => setCUserPass(e.target.value)}
                        />

                        <span
                            className="eye-icon"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <span className="error">{errors.cuserpass}</span>
                </div>

                <div className="form-group">
                    <label>Re-enter Password</label>

                    <div className="input-with-icon">
                        <input
                            type={showRePass ? "text" : "password"}
                            value={crepass}
                            onChange={(e) => setCRePass(e.target.value)}
                        />

                        <span
                            className="eye-icon"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowRePass(!showRePass)}
                        >
                            {showRePass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <span className="error">{errors.vrepass}</span>
                </div>

                <div className="form-group">
                    <label>Customer Name</label>

                    <input
                        type="text"
                        value={CUserName}
                        onChange={(e) => setCUserName(e.target.value)}
                    />

                    <span className="error">{errors.CUserName}</span>
                </div>

                <div className="form-group">
                    <label>Address</label>

                    <input
                        type="text"
                        value={caddress}
                        onChange={(e) => setCAddress(e.target.value)}
                    />

                    <span className="error">{errors.caddress}</span>
                </div>

               <div className="form-group">
    <label>Select State</label>

    <select
        value={CStId}
        onChange={(e) => setCStId(e.target.value)}
    >
        <option value="">Select State</option>

        {stlist.map((state) => (
            <option
                key={state._id}
                value={state.stid}
            >
                {state.stname}
            </option>
        ))}
    </select>
</div>

<div className="form-group">
    <label>Select City</label>

    <select
        value={CCtId}
        onChange={(e) => setCCtId(e.target.value)}
    >
        <option value="">Select City</option>

        {ctlist.map((city) => (
            <option
                key={city._id}
                value={city.ctid}
            >
                {city.ctname}
            </option>
        ))}
    </select>
</div>

                <div className="form-group">
                    <label>Contact</label>

                    <input
                        type="text"
                        value={ccontact}
                        onChange={(e) => setCContact(e.target.value)}
                    />

                    <span className="error">{errors.ccontact}</span>
                </div>

                <div className="form-group">
                    <label>Email</label>

                    <input
                        type="email"
                        value={cemail}
                        onChange={(e) => setCEmail(e.target.value)}
                    />

                    <span className="error">{errors.cemail}</span>
                </div>

                <div className="form-group">
                    <label>Upload Photo</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {image.preview && (
                        <img
                            src={image.preview}
                            alt="Preview"
                            className="preview"
                            width="120"
                        />
                    )}

                    <span className="error">{errors.cpicname}</span>
                </div>

                <div className="form-actions">
                    <button
                        onClick={handleRegisterButton}
                        className="btn btn-primary"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CustomerReg;