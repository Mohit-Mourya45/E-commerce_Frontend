import React, { useState, useEffect } from "react";
 import axios from "axios";
function StateMgt() 
{
    const [stid,setStId] = useState("");
    const [stname,setStName] = useState(""); 
    const[status,setStatus] = useState("");
    const [stlist,setStlist]=useState([]); //create an array to store state data 

    const handleStIdText = ( evt) => {
        setStId(evt.target.value);
    }
    const handleStNameText = (evt) => {
        setStName(evt.target.value);
    }
    const handleStatusText =(evt) => {
        setStatus(evt.target.value);
    }
    const handleSaveButton=()=> {
        var obj= {
            stid:stid,
            stname:stname,
            status:1
        };
       axios.post(
    `${process.env.REACT_APP_BASE_API_URL}/state/save`,
    obj
).then(res => {
    alert("Data Saved");
    setStId("");
    setStName("");
}).catch((err) => {
    alert(err);
});
    }
    useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/state/getall`)
    .then((res) => {
        const nextStId = res.data.length + 1;
        setStId(nextStId);
    })
    .catch((err) => {
        alert(err);
    });
            
    })
  const handleShowButton = () => {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/state/getall`)
    .then((res) => {
        console.log(res.data);
        setStlist(res.data);
    })
    .catch((err) => {
        alert(err);
    });
}

   const handleSearchButton = () => {
    axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/state/search/${stid}`
    )
    .then((res) => {
        setStName(res.data.stname);
        setStatus(res.data.status);
    })
    .catch((err) => {
        alert(err);
    });
}
   const handleNewButton = () => {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/state/getall`)
    .then((res) => {
        const nextStId = res.data.length + 1;
        setStId(nextStId);
        setStName("");
    })
    .catch((err) => {
        alert(err);
    });
}
    const handleUpdateButton =() => {
        var obj ={
            stid:Number(stid),
            stname:stname,
            status:Number(status)

        }
       axios.put(
    `${process.env.REACT_APP_BASE_API_URL}/state/update`,
    obj
).then(res => {
    alert("Data Updated");
    setStId("");
    setStName("");
    setStatus("");
}).catch((err) => {
    alert(err);
});
    }
    const handleDeleteButton = () => {
    axios.delete(
        `${process.env.REACT_APP_BASE_API_URL}/state/delete/${stid}`
    )
    .then(res => {
        alert("Data Deleted");
        setStId("");
        setStName("");
        setStatus("");
    })
    .catch((err) => {
        alert(err);
    });
}
    return (
        <div>
            <center>
                <h1 className="h1">Save state details form </h1>
                <table border={1}>
                    <thead>
                    <tr>
                        <td>Enter State Id</td>
                        <td> <input type="number" onChange={handleStIdText} value = {stid}/></td>
                    </tr>
                    <tr>
                        <td>Enter State Name</td>
                        <td> <input type="text" onChange={handleStNameText} value={stname}/></td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td> <input type="text" onChange={handleStatusText} value={status}/></td>
                    </tr>
                    <tr>
                    
                        <td>
                            <button type="submit" onClick={handleSaveButton}>Save</button>
                        </td>
                        <td>
                            <button type="submit" onClick={handleSearchButton}>Search</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button type="submit" onClick={handleShowButton}>Show All</button>
                        </td>
                        <td>
                             <button type="submit" onClick={handleNewButton}>New</button>
                        </td>   
                    </tr>
                     <tr>
                        <td>
                            <button type="submit" onClick={handleUpdateButton}>Update</button>
                        </td>
                        <td>
                             <button type="submit" onClick={handleDeleteButton}>Delete</button>
                        </td>   
                    </tr>
                    </thead>
                </table>
                <table border={1}
                 style={{
                color: "black",
                backgroundColor: "white",
                width: "50%"
    }}
                >
                    <thead>
                    <tr>
                        <th>State Id</th>
                        <th>State Name</th>
                        <th>Status</th>
                    </tr>
                     </thead>

                     <tbody>
                    {   
                        stlist.map((item) => (
                            <tr  key={item.stid}>
                                <td>{item.stid}</td>
                                <td>{item.stname}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))
                    }
                   </tbody>
                </table>
            </center>
        </div>
    )
}
export default StateMgt;
