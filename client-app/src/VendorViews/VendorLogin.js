import React, {useState} from "react";
import axios from "axios";
import VenderHome from "./VendorHome";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function VenderLogin() {
    const [vuid, setVuid] = useState("");
    const [vupass, setVupass] = useState("");
    const [vender, setVender] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const REACT_APP_BASE_API_URL =  process.env.REACT_APP_BASE_API_URL;

    const handleLogin = async() => {
        try{
            const res = await axios.post(`${REACT_APP_BASE_API_URL}/vendor/login`, {
                vuid,
                vupass,
            });
            if(res.data && res.data.VUserId) {
                if(res.data.Status === "Inactive") {
                    alert("User not active. Please wait for admin activation.")
                    return;
                }
                setVender(res.data);
            }
            else{
                alert("Invalid login");
            }
        }
        catch(err) {
            console.error(err);
            alert("login failed");
        }
    };
    const handleLogout = () => {
        setVender(null);
    };
    if(vender) {
        return <VenderHome vender={vender} onLogout={handleLogout} />;
    }
    return (
        <div className="venderlogin-container">
            <div className="venderlogin-form">
                <h4 className="venderlogin-title">Vender Login</h4>
                <input type="text"
                placeholder="Vendor User ID"
                value={vuid}
                onChange={(e) => setVuid(e.target.value)}
                />
                <div className="password-field">
                    <input 
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={vupass}
                    onChange={(e) => setVupass(e.target.value)}
                    />
                    <span 
                    className="eye-icon"
                    onClick={() => setShowPass(!showPass)}
                    >
                        {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                </div>
                <button className="venderlogin-button" onClick={handleLogin}>
                    Login
                    </button>
            </div>
        </div>
    );
}
export default VenderLogin;