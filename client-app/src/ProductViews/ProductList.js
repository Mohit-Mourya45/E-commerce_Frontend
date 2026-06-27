import React, {useEffect, useState} from "react";
import axios from "axios";
import Bill from "../CustomerViews/Bill";
import CustomerLoginPopup from "../CustomerViews/CustomerLoginPopup";
import "../index.css";
import "./ProductList.css";

function ProductList(props) {
    const [itemcount, setItemCount] = useState(0);
    const [selitems, setSelItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [cid, setCId] = useState(null);
    const [customerSession, setCustomerSession] = useState(null);
    const [pcatglist, setPCatgList] = useState([]);
    const [plist, setPList] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [showBill, setShowBill] = useState(false);

    const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        setCId(props.data);
        axios.get(`${REACT_APP_BASE_API_URL}/product/showproduct`)
        .then((res) => setPList(res.data))
        .catch((err) => alert(err));

        axios.get(`${REACT_APP_BASE_API_URL}/productcatg/showproductcatg`)
        .then((res) => setPCatgList(res.data))
        .catch((err) => alert(err));

        const session = sessionStorage.getItem("userSession") || 
        localStorage.getItem("userSession");

        if(session) {
            const obj = JSON.parse(session);
            setCustomerSession(obj);
            setCId(obj.cid);
        }
    
    }, [props.data, REACT_APP_BASE_API_URL]);

    const handleLoginSuccess = (sessionData) => {
        setCustomerSession(sessionData);
        setCId(sessionData.cid);
        setShowLogin(false);
    };
    const handleBuyButton = (pid) => {
        if(!cid) {
            setShowLogin(true);
            return;
        }
        const selected = plist.find((item) => item.pid === pid);

        if(!selected) return;

        const alreadyAdded = selitems.find((item) => item.pid === pid);

        if(alreadyAdded) {
            alert("Product already added to the cart");
            return;
        }
        setSelItems((prev) => [...prev, selected]);

        setQuantities((prev) => ({
            ...prev,
            [pid]: 1, 
        }));

        setItemCount((prev) => prev + 1);
    };
    const handleCheckOutButton = () => {
        if(!cid) {
            setShowLogin(true);
            return;
        }

        if(selitems.length === 0) {
            alert("Please buy some products before checkout");
            return;
        }

        setShowBill(true);
    };

    const handleSearch = (evt) => {
        const catgId = evt.target.value;

        if(catgId === "select") return;

        const url = 
            catgId > 0
                ? `${REACT_APP_BASE_API_URL}/product/showproductbycatgid/${catgId}`
                : `${REACT_APP_BASE_API_URL}/product/showproduct`;

        axios.get(url)
        .then((res) => setPList(res.data))
        .catch((err) => alert(err));
    };

    if(showBill) {
        return (
            <Bill
                data={{ selitems, cid, quantities}}
                onBack={() => setShowBill(false)}
                onPaymentSuccess={() => {
                    setSelItems([]);
                    setQuantities({});
                    setItemCount(0);
                    setShowBill(false);
                }}
            />
        );
    }
    return(
        <>
            {showLogin && (
                <CustomerLoginPopup
                    onClose={() => setShowLogin(false)}
                    onLoginSuccess = {handleLoginSuccess}
                    />
            )}
            {/* HEADER */}
            <header className="eshop-header">
                <div className="eshop-title">E-Shop</div>

                <div className="eshop-search">
                    <select className="select" onChange={handleSearch}>
                        <option value="select">Search by Category</option>
                        <option value="0">All Products</option> 

                        {pcatglist.map((pcatgitem)  => (
                            <option
                            key={pcatgitem.pcatgid}
                            value={pcatgitem.pcatgid}
                            >
                                {pcatgitem.pcatgname}
                            </option>
                        ))}
                    </select>

                    <span className="cart" data-count={itemcount}>🛒</span>

                    <button
                    className="checkout-btn"
                    onClick={handleCheckOutButton}
                    > Checkout</button>
                </div>
            </header>

            {/* PRODUCTS */}
            <div className="product-list-wide">
                {plist.map((item) => {
                    const cname = 
                        pcatglist.find((c) => c.pcatgid == item.pcatgid)?.pcatgname ||
                        "N/A";

                        const imageUrl = item.ppicname?.startsWith("http")
                            ? item.ppicname
                            : item.ppicname;

                        return (
                            <div className="product-card dark-card" key={item.pid}>
                                <img 
                                className="product-image"
                                src={imageUrl}
                                alt={item.pname}
                                />

                                <h4>{item.pname}</h4>

                                <p>
                                    ₹{item.oprice}{" "}
                                    <span className="strike">₹{item.pprice}</span>
                                </p>

                                <p>{cname}</p>

                                <button 
                                    className="but"
                                    onClick= {() => handleBuyButton(item.pid)}
                                    >
                                        🛒Buy
                                    </button>
                            </div>
                        );
                })}
            </div>
        </>
    );

}

export default ProductList;