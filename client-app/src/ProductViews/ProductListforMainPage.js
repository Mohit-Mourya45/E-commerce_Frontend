// src/productviews/ProductListforMainPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Bill from "../CustomerViews/Bill";
import CustomerLoginPopup from "../CustomerViews/CustomerLoginPopup";
import "../index.css";
import "./ProductListforMainPage.css";

function ProductListforMainPage() {
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

  // ================= LOAD DATA =================
  useEffect(() => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/product/showproduct`)
      .then((res) => {
        setPList(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
        setPList([]);
      });

    axios
      .get(`${REACT_APP_BASE_API_URL}/productcatg/showproductcatg`)
      .then((res) => {
        setPCatgList(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
        setPCatgList([]);
      });

    const session =
      sessionStorage.getItem("userSession") ||
      localStorage.getItem("userSession");

    if (session) {
      const obj = JSON.parse(session);
      setCustomerSession(obj);
      setCId(obj.cid);
    }
  }, []);

  // ================= LOGIN =================
  const handleLoginSuccess = (sessionData) => {
    setCustomerSession(sessionData);
    setCId(sessionData.cid);
    setShowLogin(false);
  };

  // ================= BUY =================
  const handleBuyButton = (pid) => {
    if (!cid) {
      setShowLogin(true);
      return;
    }

    axios
      .get(`${REACT_APP_BASE_API_URL}/product/showproductstatus/${pid}`)
      .then((res) => {
        if (res.data?.status === "Active") {
          const selected = plist.find((item) => item.pid === pid);
          if (!selected) return;

          setSelItems((prev) => {
            const exists = prev.find((i) => i.pid === pid);
            if (exists) return prev;
            return [...prev, selected];
          });

          setQuantities((prev) => ({
            ...prev,
            [pid]: (prev[pid] || 0) + 1,
          }));

          setItemCount((prev) => prev + 1);

          // ✅ POPUP FIX
          alert("🛒 Product added to cart");
        } else {
          alert("Product out of stock");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error checking product status");
      });
  };

  // ================= QUANTITY =================
  const increaseQty = (pid) => {
    setQuantities((prev) => ({
      ...prev,
      [pid]: (prev[pid] || 1) + 1,
    }));
    setItemCount((prev) => prev + 1);
  };

  const decreaseQty = (pid) => {
    setQuantities((prev) => {
      const newQty = (prev[pid] || 1) - 1;

      if (newQty <= 0) {
        setSelItems((old) => old.filter((item) => item.pid !== pid));
        const updated = { ...prev };
        delete updated[pid];
        return updated;
      }

      return { ...prev, [pid]: newQty };
    });

    setItemCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // ================= SEARCH =================
  const handleSearch = (evt) => {
    const catgId = evt.target.value;

    if (catgId === "select") return;

    const url =
      catgId > 0
        ? `${REACT_APP_BASE_API_URL}/product/showproductbycatgid/${catgId}`
        : `${REACT_APP_BASE_API_URL}/product/showproduct`;

    axios
      .get(url)
      .then((res) => {
        setPList(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
        setPList([]);
      });
  };

  // ================= CHECKOUT =================
  const handleCheckOutButton = () => {
    if (!cid) {
      setShowLogin(true);
      return;
    }

    if (selitems.length === 0) {
      alert("Please add products first");
      return;
    }

    setShowBill(true);
  };

  // ================= BILL PAGE =================
  if (showBill) {
    return (
      <Bill
        data={{ selitems, cid, quantities }}
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

  // ================= UI =================
  return (
    <>
      {showLogin && (
        <CustomerLoginPopup
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* HEADER */}
      <header className="eshop-header">
        <div className="eshop-title">🛍️ E-Shop</div>

        <div className="eshop-search">
          <select className="select" onChange={handleSearch}>
            <option value="select">Search by Category</option>
            <option value="0">All Products</option>

            {pcatglist.map((c) => (
              <option key={c.pcatgid} value={c.pcatgid}>
                {c.pcatgname}
              </option>
            ))}
          </select>

          <span className="cart" data-count={itemcount}>
            🛒
          </span>

          <button className="checkout-btn" onClick={handleCheckOutButton}>
            Checkout
          </button>
        </div>
      </header>

      {/* PRODUCTS */}
      <div className="product-list-wide">
        {plist.map((item) => {
          const cname =
            pcatglist.find((c) => c.pcatgid === item.pcatgid)?.pcatgname ||
            "N/A";

          const qty = quantities[item.pid] || 0;

          return (
            <div className="product-card dark-card" key={item.pid}>
              <img
                className="product-image"
                src={item.ppicname}
                alt={item.pname}
              />

              <h4>{item.pname}</h4>

              <p>
                ₹{item.oprice}{" "}
                <span className="strike">₹{item.pprice}</span>
              </p>

              <p>{cname}</p>

              {qty > 0 ? (
                <div className="quantity-controls">
                  <button onClick={() => decreaseQty(item.pid)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => increaseQty(item.pid)}>+</button>
                </div>
              ) : (
                <button
                  className="buy"
                  onClick={() => handleBuyButton(item.pid)}
                >
                  🛒 Buy
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ProductListforMainPage;