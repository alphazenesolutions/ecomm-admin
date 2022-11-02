import { useFormik } from "formik";
import { LoginUser } from "../Api/User";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "../styles/Login.module.css";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import FormControl from "@mui/material/FormControl";
import { useSelector } from "react-redux";
import { SingleStore } from "../Api/Store";
import React, { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

const Login = () => {
  const [errorlist, seterrorlist] = useState(null);
  const [isloading, setisloading] = useState(false);
  const [loading, setLoading] = React.useState(true);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Email Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password Required";
      }
      seterrorlist(errors);
      if (Object.keys(errors).length === 0) {
        setisloading(true);
        var loginuser = await LoginUser(values);
        if (loginuser.message === "SUCCESS") {
          var Single_Store = await SingleStore({
            id: loginuser.data.checkuser[0].user_id,
          });
          sessionStorage.setItem(
            "user_id",
            loginuser.data.checkuser[0].user_id
          );
          sessionStorage.setItem("store_id", Single_Store.data[0].id);
          sessionStorage.setItem("token", loginuser.data.token);
          toast.success("Welcome Back", {
            autoClose: 2000,
            transition: Slide,
          });
          setTimeout(() => {
            setisloading(false);

            window.location.replace("/dashboard");
          }, 2000);
        } else {
          setisloading(false);

          toast.error(loginuser.message, {
            autoClose: 2000,
            transition: Slide,
          });
        }
      }
    },
  });
  useEffect(() => {
    getuserdata();
  }, []);

  const getuserdata = async () => {
    var user_id = sessionStorage.getItem("user_id");
    var store_id = sessionStorage.getItem("store_id");
    if (user_id !== null && store_id !== null) {
      window.location.replace("/dashboard");
    }
  };
  return (
    <div className={classes.LoginPage}>
      <div className={`${classes.login_img}`}>
        <h1 className="text-5xl">Welcome Back...</h1>
        <img src="/login_.png" alt="Vercel Logo" />
      </div>
      <div>
        <div className={` mx-4 ${classes.login_details}`}>
          <img src="/1.png" />
          <h1 className="text-2xl mb-4 ">Onboard to the dashboard</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full">
              <FormControl variant="standard">
                <Input
                  style={{ width: "400px" }}
                  name="email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  defaultValue={formik.values.email}
                  endAdornment={
                    <InputAdornment position="end">
                      {" "}
                      <EmailIcon />
                    </InputAdornment>
                  }
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />
              </FormControl>
              {errorlist !== null ? (
                <div
                  className="text-red-500"
                  style={{ paddingLeft: "5px", paddingTop: "2px" }}
                >
                  {errorlist.email}
                </div>
              ) : null}
            </div>
            <div className="w-full">
              <FormControl variant="standard" sx={{ mt: 3 }}>
                <Input
                  style={{ width: "400px" }}
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  defaultValue={formik.values.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <LockIcon />
                    </InputAdornment>
                  }
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />
              </FormControl>

              {errorlist !== null ? (
                <div
                  className="text-red-500 "
                  style={{ paddingLeft: "5px", paddingTop: "2px" }}
                >
                  {errorlist.password}
                </div>
              ) : null}
            </div>
            {!isloading && (
              <button className="rounded 	text-white-1000  py-3 px-4 mt-4 loginBtn">
                Login
              </button>
            )}

            {isloading && (
              <button
                className={`${classes.login_loading} rounded 	text-white-1000  py-3 px-4 mt-4 loginBtn`}
                loading={loading}
                disabled
              >
                Loading…
              </button>
            )}
          </form>

          {/* <p className="text-yellow-500 mt-4">Forgot your password?</p> */}
          {/* <div className="flex items-center mt-4">
            <input className="mr-2" type="checkbox" />
            <label>Keep me signed in</label>
          </div> */}
          <p className=" mt-4">
            <a href="/Store_setup">Create new account</a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
