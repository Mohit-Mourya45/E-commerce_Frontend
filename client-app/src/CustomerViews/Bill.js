import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import logo from "../logo.svg";
import "./Bill.css";

function Bill({ data, onBack, onPaymentSuccess, updateCart, onRemoveItem }) {
    const [customer, setCustomer] = useState({
        name: "",
        address: "",
        contact: "",
    });

    const [date, setDate] = useState("");
    const [items, setItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [isPaymentDone, setIsPaymentDone] = useState(false);
    const [billId, setBillId] = useState("");

    // ---------------------------------------------------
    // HELPER: FORMAT DATE
    // ---------------------------------------------------
    const getCurrentDate = () => {
        const d = new Date();
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    // -------------------------------------------
    // LOAD CUSTOMER & ITEM IND=FORMATION
    // -------------------------------------------
    useEffect(() => {
        if(!data || !data.cid || !data.selitems) return;

        setItems(data.selitems);
        setDate(getCurrentDate());

        // Initialize qty
        const qtyObj = {};
        data.selitems.forEach((item) => {
            qtyObj[item.pid] = data.quantities?.[item.pid] || 1;
        });
        setQuantities(qtyObj);

        axios.get(`http://localhost:9090/customer/getcustomerdetails/${data.cid}`)
        .then((res) => {
            setCustomer({
                name: res.data.CUserName,
                address: res.data.CAddress,
                contact: res.data.CContact,
            });
        })
        .catch((err) => alert(err));
    }, [data]);

    // ----------------------------------
    // TOTAL CALCULATION
    // --------------------------------------
    const totalAmount = items.reduce(
        (acc, item) => acc + item.oprice * (quantities[item.pid] || 1),
        0
    );


    // ------------------------------
    // QUANTITY INCREASE/DECREASE
    // --------------------------
    const increaseQty = (pid) => {
        setQuantities((prev) => {
            const newQty = (prev[pid] || 1) + 1;
            updateCart?.(pid, newQty);
            return {...prev, [pid]: newQty};
        });
    };

    const decreaseQty = (pid) => {
    setQuantities((prev) => {
        const newQty = Math.max(1, (prev[pid] || 1) - 1);

        updateCart?.(pid, newQty);

        return {
            ...prev,
            [pid]: newQty,
        };
    });
};
    // --------------------------
    // REMOVE ITEM
    // --------------------------------
    const removeItemHandler = (pid) => {
        setItems((prev) => prev.filter((item) => item.pid !== pid));

        setQuantities((prev) => {
            const q = {...prev};
            delete q[pid];
            return q;
        });
        onRemoveItem?.(pid);
    };


    // ----------------------------------
    // LOAD REAZORPAY SCRIPT
    // ----------------------------------
    const loadScript = (src) => 
        new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror =() => resolve(false);
            document.body.appendChild(script);
        });

        // -----------------------------------
        // SAVE BILL IN DB
        // ---------------------------------
        const saveBill = useCallback(async () => {
            if(!items.length) return;

            const res = await axios.get("http://localhost:9090/bill/getbillid");
            const nextId = parseInt(res.data[0].billid) + 1;
            console.log("Bill ID Response:", res.data);
            setBillId(nextId);

            const today = getCurrentDate();
            for(const item of items) {
                const qty = quantities[item.pid];
                const subtotal = item.oprice * qty;

                await axios.post("http://localhost:9090/bill/billsave", {
                    billid: nextId,
                    billdate: today,
                    cid: data.cid,
                    pid: item.pid,
                    qty,
                });

                await axios.post("http://localhost:9090/sales/add", {
                    venderId: item.vid,
                    productId: item.pid,
                    quantity: qty,
                    totalPrice: subtotal,
                    billid: nextId,
                    date: today,
                });
            }

            return nextId;

        }, [items, quantities, data]);

        // ----------------------------------------------
        // PAYMENT + RAZORPAY
        // ------------------------------------------
        const displayRazorpay = async () => {
            if(isPaymentDone) return alert("Payment aleady done!");

            if(!items.length) return alert("No items in Bill!");

            const saveBillId = await saveBill();

            const loaded = await loadScript("http://checkout.razorpay.com/v1/checkout.js");
            if(!loaded) return alert ("Failed to load Raxorpay");

            const amountInPaisa = totalAmount * 100;

            const order = await axios.post(`http://localhost:9090/payment/orders/${amountInPaisa}`);
            const { id: order_id,amount, currency } = order.data;

            const options = {
                key: "rzp_test_8CxHBNuMQt1Qn8",     //isme razorpay ki key dalni hai
                amount: amount.toString(),
                currency,
                name: "E-Commerce Shop",
                description: "Test Transacton",
                image: {logo},
                order_id,
                handler: async function (response) {
                    await axios.post("http://localhost:9090/paymentdetails/paymentdetailsave",{
                        orderCreationId: order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                        cid:  data.cid,
                        amount: amount/100,
                        billid:saveBillId,
                    });
                    setIsPaymentDone(true);
                    alert("Payment Successfull!");
                    onPaymentSuccess?.();
                },
                prefill: {
                    name: customer.name,
                    email: "lovanshimayank03@gmail.com",
                    contact: customer.contact || "9999999999",
                },
                notes: { address: "Universe-7"},
                theme: { color: "#61dafb"},
            };
            new window.Razorpay(options).open();
        };



        // -----------------------------------------------------
        // UI RENDERING (CLEAN JSX)
        // ----------------------------------------
        return(
            <div className="bill-container">
                <h2 className="bill-title">Customer Invoice</h2>
                <button className="back-btn" onClick={onBack} >
                    ← Back to Product List
                </button>

                {!data ? (
                    <div style={{color: "red"}}>No billing data available</div>
                ) : (
                    <>
                    <table className="customer-table">
                        <tbody>
                            <tr><td>Customer ID</td><td>{data.cid}</td></tr>
                            <tr><td>Name</td><td>{customer.name}</td></tr>
                            <tr><td>Address</td><td>{customer.address}</td></tr>
                            <tr><td>Contact</td><td>{customer.contact}</td></tr>
                            <tr><td>Bill Date</td><td>{date}</td></tr>
                        </tbody>
                    </table>

                    <div className="bill-content">
                        <h4 className="bill-heading">Bill</h4>

                        <table className="bill-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                    <th>Photo</th>
                                    <th>Action</th>                                    
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((item) => {
                                    const qty = quantities[item.pid];
                                    const subtotal = item.oprice * qty;

                                    return(
                                        <tr key = {item.pid}>
                                            <td>{item.pid}</td> 
                                            <td>{item.pname}</td>
                                                
                                            <td>
                                                <button className="qty-btn" onClick={() => decreaseQty(item.pid)}>-</button>
                                                <span style={{margin: "0 8px"}}>{qty}</span>
                                                <button className="qty-btn" onClick={() => increaseQty(item.pid)}>+</button>
                                            </td>
                                            <td>₹{item.oprice}</td>
                                            <td>₹{subtotal}</td>
                                            <td>
                                                <img
                                                    src={item.ppicname} className="product-image" alt="" />
                                            </td>

                                            <td>
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => removeItemHandler(item.pid)}
                                                    >Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <h4 className="total-box">
                            Total amount = ₹{totalAmount}
                        </h4>

                        <button onClick={displayRazorpay}
                        disabled={!items.length}
                       className="pay-btn">
                            Pay Now
                        </button>
                    </div>
                    </>
                )}
            </div>

        );
}

export default Bill;