import classes from "../styles/Login.module.css";
import { useFormik } from "formik";
import { CreateUser } from "../Api/User";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
const Register = () => {
  const [errorlist, seterrorlist] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "First Name Is Required";
      }
      if (!values.lastname) {
        errors.lastname = "Last Name Is Required";
      }
      var numbers = /[a-z]/g;
      if (!values.phone) {
        errors.phone = "Mobile Number Required";
      } else if (values.phone.toString().length > 10) {
        errors.phone = "Must be 10 characters";
      }

      if (!values.email) {
        errors.email = "Email Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      var lowerCaseLetters = /[a-z]/g;
      var upperCaseLetters = /[A-Z]/g;
      var numbers = /[0-9]/g;
      var specialchar = /[!@#$%^&amp;*()_+]/g;
      if (!values.password) {
        errors.password = "Password required";
      } else if (!values.password.match(lowerCaseLetters)) {
        errors.password = "Password must have lower case letters";
      } else if (!values.password.match(upperCaseLetters)) {
        errors.password = "Password must have upper case letters";
      } else if (!values.password.match(numbers)) {
        errors.password = "Password must have number";
      } else if (!values.password.match(specialchar)) {
        errors.password = "Password must have special characters";
      } else if (values.password.length < 8) {
        errors.password = "Must be 8 characters";
      }
      seterrorlist(errors);
      if (Object.keys(errors).length === 0) {
        values["type"] = "admin";
        var createuser = await CreateUser(values);
        if (createuser.message === "SUCCESS") {
          sessionStorage.setItem("user_id", createuser.data.user_id);
          toast.success("User Register Successfully..", {
            autoClose: 2000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.replace("/Store_setup");
          }, 2000);
        } else {
          toast.error(createuser.message, {
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
    if (user_id !== null) {
      window.location.replace("/dashboard");
    }
  };
  return (
    <div className={classes.LoginPage}>
      <div className={`${classes.login_img} ${classes.Register_img}`}>
        <h1 className="text-5xl">Welcome You...</h1>

        <img src="/login_.png" alt="Vercel Logo" />
      </div>
      <div>
        <div
          className={`mx-4 ${classes.login_details} ${classes.Register_details}`}
        >
          <img src="/1.png" />

          <h1 className="text-1xl ">Create an account to setup your store</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex">
              <div className="w-full mr-1 my-1">
                {" "}
                <input
                  className="border w-full mb-2 p-3 rounded"
                  placeholder=" First Name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  defaultValue={formik.values.name}
                />
                {errorlist !== null ? (
                  <div className="text-red-500">{errorlist.name}</div>
                ) : null}
              </div>
              <div className="w-full ml-1 my-1">
                {" "}
                <input
                  className="border w-full mb-2 p-3 rounded"
                  placeholder="Last Name"
                  name="lastname"
                  type="text"
                  onChange={formik.handleChange}
                  defaultValue={formik.values.lastname}
                />
                {errorlist !== null ? (
                  <div className="text-red-500">{errorlist.lastname}</div>
                ) : null}
              </div>
            </div>
            <div className="w-full">
              <div className="my-1" style={{ display: "flex" }}>
                <div style={{ width: "20%" }}>
                  <input
                    className="border w-full mb-2 p-3 rounded"
                    placeholder="Mobile"
                    type="tel"
                    name="phone"
                    disabled
                    value="+91"
                    onChange={formik.handleChange}
                    defaultValue={formik.values.phone}
                  />
                </div>
                <div style={{ width: "90%" }}>
                  <input
                    className="border w-full mb-2 p-3 rounded"
                    placeholder="Mobile"
                    type="number"
                    name="phone"
                    onChange={formik.handleChange}
                    defaultValue={formik.values.phone}
                  />
                </div>
              </div>
              {errorlist !== null ? (
                <div className="text-red-500">{errorlist.phone}</div>
              ) : null}
            </div>
            <div className="my-1  w-full">
              <input
                className="border w-full mb-2 p-3 rounded"
                placeholder="Email"
                type="email"
                name="email"
                onChange={formik.handleChange}
                defaultValue={formik.values.email}
              />
              {errorlist !== null ? (
                <div className="text-red-500">{errorlist.email}</div>
              ) : null}
            </div>
            <div className=" w-full my-1">
              <input
                className="border w-full mb-2 p-3 rounded"
                placeholder="Password"
                type="text"
                name="password"
                onChange={formik.handleChange}
                defaultValue={formik.values.password}
              />
              {errorlist !== null ? (
                <div className="text-red-500">{errorlist.password}</div>
              ) : null}
            </div>

            <button className="font-bold rounded bg-yellow-600 loginBtn	text-white-1000 w-full py-2 px-4 mt-4">
              Sign up
            </button>
          </form>

          <p>
            <a href="/login"> Already have an account ?</a>
          </p>
        </div>
        <div className="shadow-lg"></div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
