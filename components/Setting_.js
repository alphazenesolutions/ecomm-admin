import axios from "axios";
import React, { useEffect, useState } from "react";
import Nav_ from "./Nav_";
import Sidebar_ from "./Sidebar_";
import { viewStore, UpdateStore } from "../Api/Store";
import { firebase } from "../database/firebase";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Checkpassword } from "../Api/User";
import { Viewuser,updatePassword } from '../Api/User'

const Setting_ = () => {
  const [storename, setstorename] = useState(null);
  const [storelogo, setstorelogo] = useState(null);
  const [storedomain, setstoredomain] = useState(null);
  const [storepincode, setstorepincode] = useState(null);
  const [storestate, setstorestate] = useState(null);
  const [storecity, setstorecity] = useState(null);
  const [passwordchangeoption, setpasswordchangeoption] = useState(false);
  const [updateid, setupdateid] = useState(null);
  useEffect(() => {
    getalldata();
  }, []);
  const getalldata = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var Single_Store = await viewStore({
      id: Number(store_id),
    });
    if (Single_Store.data.length !== 0) {
      setstorename(Single_Store.data[0].storename);
      setstorelogo(Single_Store.data[0].logo);
      setstoredomain(Single_Store.data[0].domain);
      setstorepincode(Single_Store.data[0].pincode);
      setstorestate(Single_Store.data[0].state);
      setstorecity(Single_Store.data[0].city);
      const zipcodeInfo = await axios
        .get(
          `https://api.postalpincode.in/pincode/${Single_Store.data[0].pincode}`
        )
        .then((res) => {
          return res.data;
        });
      if (zipcodeInfo[0].PostOffice !== null) {
        setTimeout(async () => {
          setcitylist(zipcodeInfo[0].PostOffice);
        }, 2000);
      }
    }
    var singleuser = await Viewuser({ user_id: sessionStorage.getItem("user_id") });
    if (singleuser.data.length !== 0) {
      setupdateid(singleuser.data[0].id)
    }
  };
  const [citylist, setcitylist] = useState([]);
  const handleChangecity = (e) => {
    setstorecity(e.target.value);
  };
  const updatebtn = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var data = {
      storename: storename,
      city: storecity,
      state: storestate,
      pincode: storepincode,
      domain: storedomain,
      logo: storelogo,
      id: store_id,
    };
    const updatedStore_ = await UpdateStore(data);
    if (updatedStore_.message === "Updated Successfully") {
      toast.success("Store Updated Successfully..", {
        autoClose: 2000,
        transition: Slide,
      });
      getalldata();
    }
  };
  const geturl = async (e) => {
    toast.info("Please Wait Image is uploading...", {
      autoClose: 5000,
      transition: Slide,
    });
    let file = e.target.files;
    let file13 = new Promise((resolve, reject) => {
      var storageRef = firebase.storage().ref("journal/" + file[0].name);
      storageRef.put(file[0]).then(function (snapshot) {
        storageRef.getDownloadURL().then(function (url) {
          //img download link ah ketakiradhu
          setTimeout(() => resolve(url), 1000);
        });
      });
    });
    var imgurl1 = await file13;
    setstorelogo(imgurl1);
    toast.success("Image Uploaded...", {
      autoClose: 5000,
      transition: Slide,
    });
  };
  const setstorenamevalue = async (e) => {
    setstorename(e.target.value);
  };
  const setdomainvalue = async (e) => {
    setstoredomain(e.target.value);
  };
  const setpinvalue = async (e) => {
    setstorepincode(e.target.value);
  };
  const passwordchange = async () => {
    setpasswordchangeoption(!passwordchangeoption);
  };
  const changepassword = async () => {
    var email = document.getElementById("email").value;
    var oldpassword = document.getElementById("oldpassword").value;
    var newpassword = document.getElementById("newpassword").value;
    if (email.length == 0) {
      toast.error("Email is Required..", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (oldpassword.length == 0) {
      toast.error("Old Password is Required..", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (newpassword.length == 0) {
      toast.error("New Password is Required..", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      var data = {
        email: email,
        password: oldpassword,
      };
      var checkpassword = await Checkpassword(data);
      if (checkpassword == true) {
        var datanew = {
          password: newpassword,
          id: updateid,
        };
        var updatedata = await updatePassword(datanew)
        if (updatedata.message === "Updated Successfully") {
          toast.success("User Updated Successfully...", {
            autoClose: 2000,
            transition: Slide,
          });
        }
      }
    }
  };
  return (
    <div className="flex ">
      <Sidebar_ />
      <div className="w-full">
        <Nav_ />
        <div className="w-full p-8 Dashboard">
          <div className="flex">
            {passwordchangeoption === false ? (
              <button
                className="border-solid border-2 p-3 mr-4 mb-4 bg-black-500 text-white-1000 hover:bg-white-400"
                onClick={passwordchange}
              >
                Store Setting
              </button>
            ) : (
              <button
                className="border-solid border-2 p-3 mr-4 mb-4 hover:bg-white-400"
                onClick={passwordchange}
              >
                Store Setting
              </button>
            )}
            {passwordchangeoption === false ? (
              <button
                className="border-solid border-2 p-3 mr-4 mb-4 hover:bg-white-400"
                onClick={passwordchange}
              >
                Password Setting
              </button>
            ) : (
              <button
                className="border-solid border-2 p-3 mr-4 mb-4 bg-black-500 text-white-1000 hover:bg-white-400"
                onClick={passwordchange}
              >
                Password Setting
              </button>
            )}
          </div>
          {passwordchangeoption === false ? (
            <div>
              <div className="Store_setting">
                <div className="w-9/12 m-auto	items-center">
                  <div>
                    <div className="shadow-lg p-8">
                      <h1 className="font-bold	mb-4">
                        Get a head start on your store setup.
                      </h1>
                      {storelogo !== null ? (
                        <img src={storelogo} width="140px" height="60" />
                      ) : null}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="What’s your store name?"
                        name="storename"
                        type="file"
                        onChange={geturl}
                      />
                      <div>
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="What’s your store name?"
                          name="storename"
                          type="text"
                          defaultValue={storename}
                          onChange={setstorenamevalue}
                        />

                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Domain"
                          name="storename"
                          type="text"
                          defaultValue={storedomain}
                          onChange={setdomainvalue}
                        />
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Pin code"
                          name="pincode"
                          type="number"
                          defaultValue={storepincode}
                          onChange={setpinvalue}
                        />

                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Country"
                          name="country"
                          value="INDIA"
                          type="text"
                          disabled
                        />
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="state"
                          name="state"
                          defaultValue={storestate}
                          type="text"
                          disabled
                        />
                        <select
                          className="border w-full mb-2 p-3 rounded"
                          onChange={handleChangecity}
                        >
                          <option>Select City</option>
                          {citylist.length !== 0
                            ? citylist.map((data, index) =>
                                storecity === data.Name ? (
                                  <option
                                    value={storecity}
                                    selected
                                    key={index}
                                  >
                                    {storecity}
                                  </option>
                                ) : (
                                  <option value={data.Name} key={index}>
                                    {data.Name}
                                  </option>
                                )
                              )
                            : null}
                        </select>
                        <button
                          className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
                          onClick={updatebtn}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    <div className="shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="Store_setting">
                <div className="w-9/12 m-auto	items-center">
                  <div>
                    <div className="shadow-lg p-8">
                      <h1 className="font-bold	mb-4">Change Password</h1>
                      <div>
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Enter Your Email"
                          id="email"
                          type="text"
                        />
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Old Password"
                          id="oldpassword"
                          type="password"
                        />
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="New Password"
                          id="newpassword"
                          type="password"
                        />
                        <button
                          className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
                          onClick={changepassword}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    <div className="shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Setting_;
