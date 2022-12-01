import React, { useEffect, useState } from "react";
import classes from "../styles/Nav.module.css";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import { SingleStore } from "../Api/Store";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
const Nav_ = () => {
  useEffect(() => {
    getuserdata();
  }, []);
  const [storename, setstorename] = useState("null");
  const getuserdata = async () => {
    var user_id = sessionStorage.getItem("user_id");
    if (user_id !== null) {
      var mystore = await SingleStore({ id: user_id });
      if (mystore.data.length !== 0) {
        setstorename(mystore.data[0].storename);
      }
    } else {
      setstorename(null);
    }
  };
  const loginHandler = () => {
    window.location.replace("/login");
  };
  const viewstore = () => {
    window.location.replace("/Setting");
  };
  return (
    <div className={classes.NavContainer}>
      <div></div>
      <div className="flex items-center">
        <div className="flex items-center">
          <LocalPhoneIcon />
          <p className="ml-3 mr-4" onClick={loginHandler}>
            +91 9876543210
          </p>
        </div>
        {storename === null ? (
          <div className="flex items-center">
            <PersonIcon />
            <p className="ml-3 mr-4" onClick={loginHandler}>
              Login
            </p>
          </div>
        ) : (
          <div className="flex items-center" style={{ cursor: "pointer" }}>
            <StoreIcon />
            <p className="ml-3 mr-4" onClick={viewstore}>
              {storename}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav_;
