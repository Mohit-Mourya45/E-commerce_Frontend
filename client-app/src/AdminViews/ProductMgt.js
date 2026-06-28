import React, { useState, useEffect } from "react";
 import axios from "axios";
function ProductMgt() 
{
    const [pcatgid,setPcatgId] = useState("");
    const [pcatgname,setPcatgName] = useState(""); 
    const[status,setStatus] = useState("");
    const [stlist,setStlist]=useState([]); //create an array to store state data 

    const handlePcatgIdText = ( evt) => {
        setPcatgId(evt.target.value);
    }
    const handlePcatgNameText = (evt) => {
        setPcatgName(evt.target.value);
    }
    const handleStatusText =(evt) => {
        setStatus(evt.target.value);
    }
    const handleSaveButton=()=> {
        var obj= {
            pcatgid:pcatgid,
            pcatgname:pcatgname,
            status:1
        };
        axios.post(`${process.env.REACT_APP_BASE_API_URL}/productcatg/addproductcatg`,obj).then(res => {
            alert("Data Saved");
            setStlist([res.data]);
        }).catch((err) => {
            alert(err)
        })
    }
     //useEffect(() => {
     //   axios.get("http://localhost:9090/state/getall").then((res) => {
     //       //alert(res.data.length)
     //       var nextStId=res.data.length+1;
     //       setStId(nextStId);
     //   }).catch((err) => {
     //       alert(err);
     //   })
            
    //})
    const handleShowButton = () => {
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/productcatg/showproductcatg`).then((res) => {
            console.log(res.data);
            setStlist(res.data);
            setPcatgId("");
            setPcatgName("");
            setStatus("");
        }).catch((err)=> {
            alert(err);
        } )
    }

   
    const handleUpdateButton =() => {
        var obj ={
            pcatgid:Number(pcatgid),
            pcatgname:pcatgname,
            status:Number(status)

        }
        axios.put(
    `${process.env.REACT_APP_BASE_API_URL}/productcatg/updateproductcatg/${pcatgid}`,
    obj
).then(res => {
    alert("Data Updated");
    setPcatgId("");
    setPcatgName("");
    setStatus("");
}).catch((err) => {
    alert(err);
});
    }

    return (
        <div>
            <center>
                <h1 class="h1">Product Category Management Form</h1>
                <table border={1}>
                    <tr>
                        <td>Enter Product  Id</td>
                        <td> <input type="number" onChange={handlePcatgIdText} value = {pcatgid}/></td>
                    </tr>
                    <tr>
                        <td>Enter Product Name</td>
                        <td> <input type="text" onChange={handlePcatgNameText} value={pcatgname}/></td>
                    </tr>
                   
                    <tr>
                    
                        <td>
                            <button type="submit" onClick={handleSaveButton}>Save</button>
                        </td>
                       
                    </tr>
                    <tr>
                        <td>
                            <button type="submit" onClick={handleShowButton}>Show All</button>
                        </td>
                         
                    </tr>
                     <tr>
                        <td>
                            <button type="submit" onClick={handleUpdateButton}>Update</button>
                        </td>
                         
                    </tr>
                </table>
                <table border={1}>
                    <tr>
                        <th>Product Id</th>
                        <th>Product Name</th>
                        <th>Status</th>
                    </tr>
                    {   
                        stlist.map((item) => (
                            <tr >
                                <td>{item.pcatgid}</td>
                                <td>{item.pcatgname}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))
                    }
                </table>
            </center>
        </div>
    )
}
export default ProductMgt;
