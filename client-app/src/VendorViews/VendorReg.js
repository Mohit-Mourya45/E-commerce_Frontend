    // Vendor Registration form 

    import React, { useEffect, useState} from "react";
    import axios from "axios";
    import { FaEye , FaEyeSlash } from "react-icons/fa";
    //import "./VendorReg.css"

    function VendorReg() {
            const [vuserid,setVUserId] = useState("");
            const [vuserpass,setVUserPass] = useState("");
            const [vrepass , setRePass] = useState("");
            const [showPass , setShowPass] = useState(false);
            const [showRePass ,setShowRePass] = useState(false);
            const [vendername,setVendorName] = useState(""); 
            const [vaddress, setVAddress] = useState("");
            const [vcontact ,setVContact] = useState("");
            const [vemail , setVEmail] = useState("");
            const [vpicname , setVPicName] = useState("");
            const [vid , setVId] = useState("");
            const [image , setImage] = useState({preview:"" ,data:""});
            const [status , setVStatus] = useState("");
            const [errors , setErrors] = useState({});
            const [vendorList , setVendorList] = useState([]);
            const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;

            useEffect(() => {
                fetchVendorList();
            } , []);

            const fetchVendorList = async () => {
                try {
                    const res = await axios.get(`${REACT_APP_BASE_API_URL}/vendor/getvendorcount/`);
                    setVendorList(res.data);
                    setVId(res.data.length + 1);
                } catch(err) {
                    alert(err);
                }
            };
            const validataForm = () => {
                let temp = {} ;
                let valid = true;

                if(!vuserid || vuserid.length <4 ){
                    temp.vuserid="User ID must be at least 4 characters";
                    valid=false;
                } else if (vendorList.some((v) => v.VUserId === vuserid )) {
                    temp.vuserid =  "User ID already exists";
                    valid = false;
                }

                if(!vuserpass || vuserpass.length <6 ) {
                    temp.vuserpass="Password length must be atleast 6 characters";
                    valid=false;
                }
                
                if(vrepass !== vuserpass) {
                    temp.vrepass="Passwords do not match";
                    valid=false;
                }

                if(!vendername.match(/^[A-Za-z]+$/)) {
                    temp.vendername = "Vendor name must contain onyl letters";
                    valid=false;
                }

                if(!vaddress){
                    temp.vaddress = "Address is required";
                    valid=false;
                }
                if(!/^\d{10}$/.test(vcontact)) {
                    temp.contact = "Contact must be 10 digits";
                    valid=false;
                }

                if(!/\S+@\S+\.\S+/.test(vemail)) {
                    temp.vemail = "Enter a valid email address";
                    valid=false;
                }else if (vendorList.some((v) => v.VEmail === vemail )) {
                    temp.vemail = "Email already Exists";
                    valid= false;
                }

                if(!image.data) {
                    temp.vpicname = "Please upload a profile photo";
                    valid=false;
                }
                setErrors(temp);
                return valid;
            };
                const handleRegisterButton  =async () => {
                    if(!validataForm()) return;
                
                try {
                    const vendorObj = {
                        VUserId:vuserid,
                        VUserPass:vuserpass,
                        VenderName:vendername,
                        VAddress:vaddress,
                        VContact:vcontact,
                        VEmail:vemail,
                        VPicName:"",
                        Vid:vid,
                        Status:"Inactive"
                    };
                    await axios.post(`${REACT_APP_BASE_API_URL}/vendor/register/`,vendorObj);

                    const formData = new FormData();
                    formData.append("file",image.data);
                    formData.append("VenderName",vendername);
                    formData.append("VAddress",vaddress);
                    formData.append("VContact",vcontact);
                    formData.append("VEmail",vemail);

                    const uploadRes = await axios.put(
                        `${REACT_APP_BASE_API_URL}/vendor/update/${vuserid}`,formData,
                        {headers : {"Content-Type": "multipart/form-data"}}
                    );
                    console.log("UPLOAD RESPONSE =", JSON.stringify(uploadRes.data, null, 2));
                    setVPicName(uploadRes.data.updateData.VPicName);
                    setVStatus("Registration and image upload successfully");
                    alert("Vendor Registered Successfully !! ");

                    setVUserId("");
                    setVUserPass("");
                    setRePass("");
                    setVendorName("");
                    setVAddress("");
                    setVContact("");
                    setVEmail("");
                    setImage({preview:"",data:""});
                    fetchVendorList();


                }catch (err) {
                    console.log(err);
                    alert("Error registering vendor or uploading image"+err);
                }
            };
            const handleFileChange = (evt) => {
                const img = {
                    preview : URL.createObjectURL(evt.target.files[0]),data:evt.target.files[0]
                };
                setImage(img);
            };

            return (
                <div>
                <div className="venderreg-container">
                    <div className="venderreg-form">
                        <h2>Vendor Registration</h2>
                        <p className="status">{status}</p>

                        <div className="form-group">
                            <label>Vendor ID</label>
                            <span className="readonly">{vid}</span>
                        </div>
                        <div className="form-group">
                            <label>User ID</label>
                            <input type="text" value={vuserid} onChange={(e) => setVUserId(e.target.value)} />
                            <span className="error">{errors.vuserid}</span>
                        </div>
                        <div className="form-group password-field">
                            <label>Enter Password</label>
                            <div className="input-with-icon">
                                <input type={showPass ? "text" : "password"}
                                    value={vuserpass}
                                    onChange={(e) => setVUserPass(e.target.value)} />

                                <span
                                    className="eye-icon"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ cursor: "pointer" }}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <span className="error">{errors.vuserpass}</span>
                    </div>
                    <span className="error">{errors.vuserpass}</span>
                </div> 
                <div className="form-group password-field">
                        <label>Re-enter Password</label>
                        <div className="input-with-icon">
                            <input
                                type={showRePass ? "text" : "password"}
                            value={vrepass}
                            onChange={(e) => setRePass(e.target.value)}
                            />
                    <span 
                    className="eye-icon"
                    onClick={() => setShowRePass(!showRePass)}
                    style={{cursor:"pointer"}} >
                        {showRePass ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    </div>
                    <span className="error">{errors.vrepass}</span>
                        </div>
                    <div className="form-group">
                        <label>Vendor Name</label>
                        <input
                        type="text"
                        value={vendername}
                        onChange={(e) => setVendorName(e.target.value)}/>
                        <span className="error">{errors.vendername}</span>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input 
                        type="text"
                        value={vaddress}
                        onChange={(e) => setVAddress(e.target.value)}/>
                        <span className="error">{errors.vaddress}</span>
                    </div>
                    <div className="form-group"> 
                        <label>Contact</label>
                        <input
                        type="number"
                        value={vcontact}
                        onChange={(e) => setVContact(e.target.value)}/>
                        <span className="error">{errors.vcontact}</span>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input 
                        type="email"
                        value={vemail}
                        onChange={(e) => setVEmail(e.target.value)}/>
                        <span className="error">{errors.vemail}</span>
                    </div>
                    <div className="form-group">
                        <label>Upload Photo</label>
                        <input type="file" onChange={handleFileChange}/>
                        {image.preview && ( <img src={image.preview } alt="preview" 
                        className="preview" />)}
                        <span className="error">{errors.vpicname}</span>
                    </div>
                    <div className="form-actions">
                        <button onClick={handleRegisterButton} className="btn btn-primary">Register</button>
                    </div>
            </div>
        
            );

    }
    export default VendorReg;