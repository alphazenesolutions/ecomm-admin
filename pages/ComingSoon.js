import React from "react";
import classes from "../styles/ComingSoon.module.css";
import Sidebar_ from "../components/Sidebar_";
const ComingSoon = () => {
  return (
    <div className="flex ">
      <Sidebar_ />
      <div style={{ width: "100vw" }}>
        <div className={classes.ComingSoon}>
          <div className={classes.ComingSoon_overlay}></div>
          <div className={classes.ComingSoon_content}>
            <img src="./logooo.png" />
            <h1>OUR NEW PAGE IS COMING SOON !</h1>
            <img className={classes.ComingSoon_img} src="./login_.png" />
            <button
              onClick={() => {
                window.location.replace("dashboard");
              }}
            >
              GO TO DASHBOARD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
