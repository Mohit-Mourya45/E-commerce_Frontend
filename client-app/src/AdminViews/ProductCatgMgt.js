import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductCatgMgt() {
    const [pcatgid, setPCatgId] = useState(0);
    const [pcatgname, setPCatgName] = useState("");
    const [pcatgList, setPCatgList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false); // Edit state
 

    useEffect(() => {
        fetchCategoryList();
    }, []);

    const fetchCategoryList = () => {
        axios.get("http://localhost:9090/productcatg/showproductcatg")
            .then((res) => {
                setPCatgList(res.data);
                if (!isEditMode) {
                    setPCatgId(res.data.length + 1);
                }
            })
            .catch((err) => alert(err));
    };

   const handleSaveButton = () => {
    if (!pcatgname.trim()) {
        alert("Category name cannot be empty.");
        return;
    }

    axios.post("http://localhost:9090/productcatg/addproductcatg", {
        pcatgid: pcatgid,
        pcatgname: pcatgname,
        status: "Active"
    })
    .then((res) => {
        alert("Category saved successfully");
        setPCatgName("");
        setIsEditMode(false);
        fetchCategoryList();
    })
    .catch((err) => alert(err));
};
    const handleUpdateButton = () => {
    if (!pcatgname.trim()) {
        alert("Category name cannot be empty.");
        return;
    }

    axios.put(
        "http://localhost:9090/productcatg/updateproductcatg/" + pcatgid,
        {
            pcatgname: pcatgname,
            status: "Active"
        }
    )
    .then((res) => {
        alert("Category updated successfully");
        setPCatgName("");
        setIsEditMode(false);
        fetchCategoryList();
    })
    .catch((err) => alert(err));
};

    const handleEdit = (item) => {
        setPCatgId(item.pcatgid);
        setPCatgName(item.pcatgname);
        setIsEditMode(true);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "blue" }}>Product Category Form</h2>

            <table style={{ margin: "0 auto" ,backgroundColor:"black"}}>
                <tbody>
                    <tr>
                        <td>Product Id:</td>
                        <td>{pcatgid}</td>
                    </tr>
                    <tr>
                        <td>Category Name:</td>
                        <td>
                            <input
                                type="text"
                                value={pcatgname}
                                className="form-control"
                                onChange={(e) => setPCatgName(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {
                                isEditMode ? (
                                    <button onClick={handleUpdateButton}className='btn btn-primary'>Update</button>
                                ) : (
                                    <button onClick={handleSaveButton}className='btn btn-success'>Save</button>
                                )
                            }
                        </td>
                        <td>
                            <button onClick={fetchCategoryList} className='btn btn-secondary'>Show</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h3 style={{ color: "blue", backgroundColor: "lightgray", marginTop: "30px" }}>
                Product Category List
            </h3>

            <table border="1" style={{backgroundColor:"black", margin: "0 auto", width: "70%", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Category Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pcatgList.map((item) => (
                        <tr key={item.pcatgid}>
                            <td>{item.pcatgid}</td>
                            <td>{item.pcatgname}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}className='btn btn-primary'>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductCatgMgt;