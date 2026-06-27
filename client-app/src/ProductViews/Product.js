import React,{useState, useEffect} from "react";
import axios from "axios";
import "./Product.css";

function Product ({data}) {
    const venderid = 1;  //data;
    const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

    const [pid, setPId] = useState();
    const [pname, setPName] = useState("");
    const [pprice, setPPrice] = useState("");
    const [oprice, setOPrice] = useState("");
    const [ppicname, setPPicName] = useState("");
    const [pcatgid, setPCatgId] =useState("");
    const [pcatglist, setPCatgList] = useState([]);
    const [image, setImage] = useState({preview: "" , data: ""});
    const [plist, setPList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);


    // ===========================LOAD CATEGORY & PID==============
    useEffect(() => {
        getNewPid();
        axios.get(`${REACT_APP_BASE_API_URL}/productcatg/showproductcatg`)
        .then(res => setPCatgList(res.data))
        .catch(err => alert(err.message));
    }, []);

    // ==========================LOAD PRODUCTS
    useEffect(() => {
        fetchProducts();
    }, [venderid]);

    const fetchProducts = () => {
        if(!venderid) return;
        axios.get(`${REACT_APP_BASE_API_URL}/product/showproductbyvender/${venderid}`)
        .then(res => setPList(res.data))
        .catch(err => alert(err.message));
    };

    const getNewPid =() => {
        axios.get(`${REACT_APP_BASE_API_URL}/product/getmaxpid`)
        .then(res => setPId(res.data.length + 1))
        .catch(err => alert(err.message));
    };


    // ===================IMAGE SELECT==============

    const handleFileChange = e => {
        const file = e.target.files[0];
        if(!file) return;

        setImage({
            preview: URL.createObjectURL(file),
            data: file,
        });
        setImageUploaded(false);
    };


    // =================UPLOAD IMAGSE================== 
    const handleUpload = async () => {
        if(!image.data) return alert("Select image first");

        const formData = new FormData();
        formData.append("file", image.data);

        try{
            const res = await fetch (
                `${REACT_APP_BASE_API_URL}/product/saveproductimage`, {method: "POST", body: formData }
            );
            const data = await res.json();

            if(res.ok) {
                setPPicName(data.imageUrl);    //CLOUDINARY URL
                setImageUploaded(true);
                alert("Image Uploaded");
            } else{
                alert("Upload failed");
            }
        } catch(err) {
            alert(err.message);

        }
    };

    // ===============SAVE / UPDATE====================
    const handleSaveButton =() => {
        const obj = {
            pid, pname, pprice, oprice, ppicname, pcatgid, vid: venderid, status:"Inactive",
        };
        console.log("pcatgid =", pcatgid);

        const apiCall = isEditing? axios.put(`${REACT_APP_BASE_API_URL}/product/updateproduct/${pid}`, obj)
        : axios.post(`${REACT_APP_BASE_API_URL}/product/saveproduct`, obj);

        apiCall
        .then(() => {
            alert(isEditing ? "Product Updated" : "Product Added");
            fetchProducts();
            closePopup();
        })
        .catch(err => alert(err.message));
    };

    // ===================EDIT---------------------
    const handleEdit = item => {
        setPId(item.pid);
        setPName(item.pname);
        setPPrice(item.pprice);
        setOPrice(item.oprice);
        setPPicName(item.ppicname);
        setPCatgId(item.pcatgid);

        setImage({
            preview: item.ppicname,        //Cloudinary url
            data: "",
        });

        setImageUploaded(true);
        setIsEditing(true);
        setShowPopup(true);
    };


    // ------------------------DELETE------------------
    const handleDelete = pid => {
        if(!window.confirm("Delete product?")) return;
        axios.put(`${REACT_APP_BASE_API_URL}/product/updateproductstatus/${pid}/Inactive`)
        .then(() => {
            alert("Product Deleted");
            fetchProducts();
        }).catch(err => alert(err.message));
    };

    const closePopup = () => {
        setShowPopup(false);
        setIsEditing(false);
        setImageUploaded(false);
        setPName("");
        setPPrice("");
        setOPrice("");
        setPPicName("");
        setPCatgId("");
        setImage({preview: "", data: ""});
        getNewPid();

    };


    

    return ( 
        <div style={{padding: 20} }>
            <h2 style={{textAlign: "center"}}>Manage Products</h2>

            <button onClick={() => setShowPopup(true)}>➕Add new product</button>
            {/* -------------------------------MODEL----------------------------- */}
            {showPopup && (
                <div className="model-overlay">
                    <div className="model-box">
                        <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>
                        <label>Product ID: <b>{pid}</b></label>
                        <input placeholder="Name " value={pname} onChange={e=> setPName(e.target.value)}/>
                        <input type="number" placeholder="Price" value={pprice} onChange={e => setPPrice(e.target.value)}/>
                         <input type="number" placeholder=" offer Price" value={oprice} onChange={e => setOPrice(e.target.value)}/>

                         <select value={pcatgid} onChange={e=>setPCatgId(e.target.value)}>
                            <option value="">--Select Category--</option>
                            {pcatglist.map(c => (
                                <option key={c.pcatgid} value={c.pcatgid}>{c.pcatgname}</option>
                            ))}
                         </select>

                         <input type="file" onChange={handleFileChange}/>
                         {image.preview && (
                            <img src={image.preview} alt="preview" width="90"/>
                         )}
                         <button onClick={handleUpload}>Upload Image</button>

                         <div className="modal-actions">
                            <button onClick={closePopup}>Cancel</button>
                            <button disabled={!imageUploaded} onClick={handleSaveButton}>
                                {isEditing ? "Update" : "save" }
                            </button>
                            </div>

                    </div>
                    </div>
            )}

            {/* ===================TABLE========================= */}
            <table className="product-table">
                <thead>
                    <tr>
                        <th>#</th><th>Name</th><th>Price</th><th>Offer</th>
                        <th>Category</th><th>Image</th><th>Status</th><th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {plist.map((item, i) => (
                        <tr key={item.pid}>
                            <td>{ i+1}</td>
                            <td>{item.pname}</td>
                            <td>{item.pprice}</td>
                            <td>{item.oprice}</td>
                            <td>{pcatglist.find(c => c.pcatgid == item.pcatgid)?.pcatgname}</td>
                            <td>
                                <img src={item.ppicname}
                                width='50'
                                style={{borderRadius: 4}}
                                alt={item.pname}/>
                            </td>
                            <td>{item.status}</td>
                            <td>
                                <button   className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(item.pid)}>Delete</button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Product;