    import React,{useEffect, useState} from "react";
    import axios from "axios";
    import "../index.css";

    function CityMgt()
    {
        const[ctid,setCtId]=useState("");
        const[ctname,setCtName]=useState("");
        const[stid,setStId]=useState("");
        const[status,setStatus]=useState("");
        const[ctlist,setCtList]=useState([]);
        const[stlist,setStList]=useState([]);

        const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
        var statename="";

        const handleCtIdText=(evt) => {
            setCtId(evt.target.value);
        }

        const handleCtNameText=(evt) => {
            setCtName(evt.target.value);
        }

        const handleStIdSelect=(evt) => {
            setStId(evt.target.value);
        }

        const handleStatusText=(evt) => {
            setStatus(evt.target.value);
        }

        /*handle page load event or this function will execute automatically at the loading time of component*/

        useEffect(()=> {
            //alert (REACT_APP_BASE_API_URL)
            axios.get(REACT_APP_BASE_API_URL+"/state/getall").then((res)=> {
                setStList(res.data);
            }).catch((err) => {
                alert(err);
            });
        },[]);
        const handleAddNewButton = () => {

        axios.get(REACT_APP_BASE_API_URL+"/city/getall")
        .then((res) => {

            const maxId = res.data.length > 0
                ? Math.max(...res.data.map(item => item.ctid))
                : 0;

            setCtId(maxId + 1);
            setStatus(1);
        })
        .catch((err) => {
            alert(err);
        });
    }
        const handleSaveButton=() => {
            if(ctid==""||ctid=="undefined"||ctname==""||ctname=="undefined"||stid==""||stid=="undefined"||status==""||status=="undefined"||stid=="0")
            {
                alert("Please fill all fields");
                return;
            }
            else{

                axios.get(REACT_APP_BASE_API_URL+"/city/searchbyname/"+ctname).then((res) => {
                    if(res.data.ctname!=undefined)
                    {
                        alert("city name already exists");
                    }else{
                        var obj={
                            ctid:ctid,
                            ctname:ctname,
                            stid:stid,
                            status:status
                        }
                        axios.post(REACT_APP_BASE_API_URL+"/city/save/",obj).then((res)=> {
                            alert(res.data);
                            setCtId("");
                            setCtName("");
                            setStId("");
                            setStatus("");
                        }).catch((err) => {
                            alert(err);
                        });
                    }
                
                }).catch((err) => {
                    alert(err);
                });
            }
        }
        const handleShowButton=() => {
            axios.get(
                REACT_APP_BASE_API_URL+"/city/getall").then((res)=> {
                    console.log("cities",res.data);
                    setCtList(res.data);
                }).catch((err)=> {
                    alert(err);
                });
            }
            const handleSearchButton=() => {
                if(ctid!=undefined && ctid!="")
                {
                    axios.get(REACT_APP_BASE_API_URL+"/city/search/"+ctid).then((res) => {
                        if(res.data.stid!=undefined)
                        {
                            setCtId(res.data.ctid);
                            setCtName(res.data.ctname);
                            setStId(res.data.stid);

                            setStatus(res.data.status);
                        }else{
                            alert("Data not found ");
                        }

                    }).catch((err) => {
                        alert(err);
                    });
                }
                if(ctname!=undefined && ctname!= "")
                {
                    axios.get(REACT_APP_BASE_API_URL+"/city/searchbyname/"+ctname).then((res) => {
                        if(res.data.stid!=undefined)
                        {
                            setCtId(res.data.ctid);
                            setCtName(res.data.ctname);
                            setStId(res.data.stid);

                            setStatus(res.data.status);
                        }else{
                            alert("Data not found");
                        }
                    }).catch((err) => {
                        alert(err);
                    });
                }
            }
            const handleUpdateButton=()=> {
                if(ctid==""||ctid==undefined||ctname==""||ctname==undefined||status==""||status==undefined||stid==""||stid==undefined)
                {
                    alert("Please fill all fields");
                    return;
                }
                else{
                    var obj ={
                        ctid:ctid,
                        ctname:ctname,
                        stid:stid,
                        status:status
                    }
                    axios.put(REACT_APP_BASE_API_URL+"/city/update/",obj).then((res)=> {
                        alert(res.data);
                        setCtId("");
                        setCtName("");
                        setStId("");
                        setStatus("");
                    }).catch((err) => {
                        alert(err);
                    });
                }

            }

            const handleDeleteButton=() => {
                if(ctid!=undefined && ctid!="")
                {
                    axios.delete(REACT_APP_BASE_API_URL+"/city/delete/"+ctid).then((res) => {
                        alert(res.data);
                    }).catch((err)=> {
                        alert(err);
                    });
                }else{
                    alert("Fill state id to delete");
                }
            }
            return (
                <div>
                    <center>
                        <h1 className="h1">City Management</h1>
                        <div className="myDiv">
                        <center>
                        <table border={1}
                        style={{
                                color:"black",
                                backgroundColor:"white"
                            }}>
                            <tbody>
                        <tr>
                            <td>City Id</td>
                            <td>
                            <input type="number" onChange={handleCtIdText} value={ctid} className="form-control"/></td>
                        </tr>
                        <tr>
                            <td>City Name</td>
                            <td>
                                <input type="text" onChange={handleCtNameText} className="form-control" value={ctname}/>
                            </td>
                        </tr>
                        <tr>
                            <td>State Name</td>
                            <td>
                                <select onChange={handleStIdSelect} 
                                id="stdropdown" name="stateddl"
                                className="form-control" >
                                    <option
                                    value="0">Select State </option>
                                    {
                                        stlist.map((item) => (
                                            <option value ={item.stid} key ={item.stid}>{item.stname}</option>
                                        ))
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>
                                <input type="text" onChange={handleStatusText} 
                                className="form-control" value={status} />
                            </td>
                        </tr>
                        <tr>

                        </tr>

                        <tr>

                        </tr>
                        </tbody>
                        </table>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <button type="submit" onClick={handleAddNewButton}
                                    className="btn btn-primary"
                                    >New</button>
                                </td>
                                <td>
                                    <button type="submit" onClick={handleSaveButton}
                                    className="btn btn-success"
                                    >Save</button>
                                </td>
                                <td>
                                    <button type="submit " onClick={handleShowButton}
                                    className="btn btn-secondary"
                                    >Show</button>
                                </td>
                                <td>
                                    <button type="submit" onClick={handleSearchButton}
                                    className="btn btn-success"
                                    >Search</button>
                                </td>
                                <td>
                                    <button type="submit" onClick={handleUpdateButton}
                                    className="btn btn-primary"
                                    >Update</button>
                                </td>
                                <td>
                                    <button type="submit" onClick={handleDeleteButton}
                                    className="btn btn-danger"
                                    >Delete</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </center>
                        </div>
                    <div className="myDiv2">
                        <center>
                            <table border={1}
                            style={{
                                color:"black",
                                backgroundColor:"white"
                            }}>
                                <thead>
                                <tr>
                                    <th>City id</th>
                                    <th>City Name</th>
                                    <th>State Name</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                    <tbody>
                                {
                                    ctlist.map ((item) => (
                                        <tr key={item.ctid}>
                                            <td>{item.ctid}</td>
                                            <td>{item.ctname}</td>
                                            <td>{
                                                stlist.map((stitem) => {
                                                    if(item.stid===stitem.stid)
                                                    {
                                                        statename=stitem.stname;
                                                    }
                                                })
                                            }
                                            {statename}
                                            </td>
                                            <td>
                                            {item.status==1 ? <h5>enabled </h5>:<h5>disable</h5>}
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                            </center>
                            </div>
                    </center>
                </div>
            );

        }
    export default CityMgt;