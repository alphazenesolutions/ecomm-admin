import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import classes from "../styles/Login.module.css";
import { CreateUser } from "../Api/User";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import SearchIcon from "@mui/icons-material/Search";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Avatar } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
// import available from "../../Assests/image/available.jpeg";
// import notavailable from "../../Assests/image/notavailable.jpeg";
import LoadingButton from "@mui/lab/LoadingButton";
import Citylist from "./citylist.json";
import { SingleStore } from "../Api/Store";
import "swiper/css";
import "swiper/css/pagination";
import { firebase } from "../database/firebase";
// import required modules
import { allTheme } from "../Api/Theme";
//
import { useFormik } from "formik";
import { CreateStore, UpdateStore } from "../Api/Store";
import pincodeDirectory from "india-pincode-lookup";
//
const steps = [
  "Already Have Domain ?",
  "Choose Your Domain",
  "Choose Your Theme",
];

const Signup_ = () => {
  // signup
  const [errorlist, seterrorlist] = useState(null);
  const [isloading_s, setisloading_s] = useState(false);
  const [isloading_Store, setisloading_Store] = useState(false);
  const formik_1 = useFormik({
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
        setisloading_s(false);

        errors.name = "First Name Is Required";
      }
      if (!values.lastname) {
        setisloading_s(false);

        errors.lastname = "Last Name Is Required";
      }
      var numbers = /[a-z]/g;
      if (!values.phone) {
        setisloading_s(false);

        errors.phone = "Mobile Number Required";
      } else if (values.phone.toString().length > 10) {
        setisloading_s(false);

        errors.phone = "Must be 10 characters";
      }

      if (!values.email) {
        setisloading_s(false);

        errors.email = "Email Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        setisloading_s(false);

        errors.email = "Invalid email address";
      }
      var lowerCaseLetters = /[a-z]/g;
      var upperCaseLetters = /[A-Z]/g;
      var numbers = /[0-9]/g;
      var specialchar = /[!@#$%^&amp;*()_+]/g;
      if (!values.password) {
        setisloading_s(false);

        errors.password = "Password required";
      } else if (!values.password.match(lowerCaseLetters)) {
        setisloading_s(false);

        errors.password = "Password must have lower case letters";
      } else if (!values.password.match(upperCaseLetters)) {
        setisloading_s(false);

        errors.password = "Password must have upper case letters";
      } else if (!values.password.match(numbers)) {
        setisloading_s(false);

        errors.password = "Password must have number";
      } else if (!values.password.match(specialchar)) {
        setisloading_s(false);

        errors.password = "Password must have special characters";
      } else if (values.password.length < 8) {
        errors.password = "Must be 8 characters";
      }
      seterrorlist(errors);
      if (Object.keys(errors).length === 0) {
        setisloading_s(true);
        values["type"] = "admin";
        var createuser = await CreateUser(values);
        if (createuser.message === "SUCCESS") {
          sessionStorage.setItem("user_id", createuser.data.user_id);
          toast.success("User Register Successfully..", {
            autoClose: 2000,
            transition: Slide,
          });
          setTimeout(() => {
            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
              newSkipped = new Set(newSkipped.values());
              newSkipped.delete(activeStep);
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
            setisloading_s(false);
          }, 2000);
        } else {
          setisloading_s(false);
          toast.error(createuser.message, {
            autoClose: 2000,
            transition: Slide,
          });
        }
      } else {
        setisloading_s(false);
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
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleBacknew = () => {
    setisDomain(false);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const [subscriptionPlan, setsubscriptionPlan] = useState([]);
  const [subscriptionLayout, setsubscriptionLayout] = useState([]);
  const [checkdomainresult, setcheckdomainresult] = useState(null);
  const [selectedtheme, setselectedtheme] = useState(null);
  const [subscription_plan_id, setsubscription_plan_id] = useState(null);
  const [domainlist, setdomainlist] = useState([]);
  const [domainname, setdomainname] = useState(null);
  const [loading, setloading] = useState(false);
  const [statelist, setstatelist] = useState([]);
  const [citylist, setcitylist] = useState([]);

  useEffect(() => {
    getalldata();
    getThemedata();
    setstatelist(Citylist.states);
  }, []);
  const getalldata = async () => {
    var user_id = sessionStorage.getItem("user_id");
    var alldata = await axios
      .get(`http://165.232.187.184:4071/api/subscription/subscriptionPlanList`)
      .then((res) => {
        return res.data;
      });
    setsubscriptionPlan(alldata.plan_list);
    var alldatanew = await axios
      .get(
        `http://165.232.187.184:4071/api/subscription/subscriptionLayoutList`
      )
      .then((res) => {
        return res.data;
      });
    setsubscriptionLayout(alldatanew.layout_list);
    setstatelist(Citylist.states);
    var Single_Store = await SingleStore({
      id: user_id,
    });
    if (Single_Store.data.length !== 0) {
      setcurrentStore_id(Single_Store.data[0].id);
    }
  };

  //   isDomain
  const [isDomain, setisDomain] = useState(false);
  const [imagurl, setimagurl] = useState(null);
  const [city, setcity] = useState(null);
  const [state, setstate] = useState(null);
  const [pincode, setpincode] = useState(null);
  const domainChecking = () => {
    setisDomain(true);
  };
  // layout
  const [alltheme_data, setalltheme_data] = useState([]);
  const getThemedata = async () => {
    var all_Theme = await allTheme();
    setalltheme_data(all_Theme);
  };

  const selecttheme = (e) => {
    setselectedtheme(e.target.id);
  };
  // Store Setup
  useEffect(() => {
    var user_id = sessionStorage.getItem("user_id");
    setuser_id(user_id);
  }, []);
  const [user_id, setuser_id] = useState(null);

  const [currentStore_id, setcurrentStore_id] = useState(null);
  const formik = useFormik({
    initialValues: {
      storename: "",
      user_id: "",
      country: "India",
      currency: "INR",
      city: "",
      state: "",
      pincode: "",
      theme: "null",
    },
    onSubmit: async (values) => {
      if (!values.storename) {
        toast.error("Store Name Is Required...", {
          autoClose: 5000,
          transition: Slide,
        });
      } else if (pincode === null) {
        toast.error("Pincode Is Required...", {
          autoClose: 5000,
          transition: Slide,
        });
      } else if (state === null) {
        toast.error("Please Select State...", {
          autoClose: 5000,
          transition: Slide,
        });
      } else if (city === null) {
        toast.error("Please Select City...", {
          autoClose: 5000,
          transition: Slide,
        });
      } else if (imagurl === null) {
        toast.error("Please Upload Logo...", {
          autoClose: 5000,
          transition: Slide,
        });
      } else {
        values.user_id = sessionStorage.getItem("user_id");
        values["logo"] = imagurl;
        values["city"] = city;
        values["state"] = state;
        values["pincode"] = pincode;

        if (currentStore_id === null) {
          setisloading_Store(true);
          var createstore = await CreateStore(values);
          if (createstore.message === "SUCCESS") {
            setcurrentStore_id(createstore.data.id);
            sessionStorage.setItem("store_id", createstore.data.id);
            toast.success("Store Created Successfully..", {
              autoClose: 2000,
              transition: Slide,
            });
            getalldata();
            setTimeout(() => {
              let newSkipped = skipped;
              if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
              }

              setActiveStep((prevActiveStep) => prevActiveStep + 1);
              setSkipped(newSkipped);
              setisloading_Store(false);
            }, 2000);
          } else {
            setisloading_Store(false);

            toast.error(createstore.message, {
              autoClose: 2000,
              transition: Slide,
            });
          }
        } else {
          setisloading_Store(true);

          values["id"] = currentStore_id;
          const updatedStore_ = await UpdateStore(values);
          if (updatedStore_.message === "Updated Successfully") {
            toast.success("Store Updated Successfully..", {
              autoClose: 2000,
              transition: Slide,
            });
            getalldata();
            setTimeout(() => {
              let newSkipped = skipped;
              if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
              }

              setActiveStep((prevActiveStep) => prevActiveStep + 1);
              setSkipped(newSkipped);
              setisloading_Store(false);
            }, 2000);
          } else {
            setisloading_Store(false);
          }
        }
      }
    },
  });
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
    setimagurl(imgurl1);
    toast.success("Image Uploaded...", {
      autoClose: 5000,
      transition: Slide,
    });
  };
  const handleChangestate = async (e) => {
    var singlestate = await statelist.filter((data) => {
      return data.state === e.target.value;
    });
    setcitylist(singlestate[0].city_list);
    setstate(e.target.value);
  };
  const handleChangecity = async (e) => {
    setcity(e.target.value);
  };
  const changepincode = async (e) => {
    setpincode(e.target.value);
    const zipcodeInfo = await axios
      .get(`https://api.postalpincode.in/pincode/${e.target.value}`)
      .then((res) => {
        return res.data;
      });
    if (zipcodeInfo[0].PostOffice !== null) {
      setstate(zipcodeInfo[0].PostOffice[0].State);
      setcitylist(zipcodeInfo[0].PostOffice);
    }
  };
  return (
    <>
      <div className="SingUpPage  ">
        <div>
          <Box sx={{ width: "70%", margin: "auto" }}>
            <Stepper activeStep={activeStep} style={{ marginBottom: "30px" }}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption"></Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}></StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {activeStep == 2 && (
                  <div className="Stepper_container_1">
                    <div className="Domain_setup">
                      <img className="wemix" src="/1.png" />

                      <h1>Configure Your Domain </h1>
                      <div className="Domain_setup_inputs">
                        <input
                          className=" w-full mb-2 p-3 rounded"
                          placeholder="Domain name"
                          type="text"
                        />
                        <button>Add</button>
                        <button
                          onClick={() => {
                            window.location.reload();
                          }}
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {activeStep == 0 && (
                  <div className="Stepper_container_1">
                    <div>
                      <div
                        className={`mx-4 ${classes.login_details} ${classes.Register_details}`}
                      >
                        <img src="/1.png" />

                        <h1 className="text-1xl ">
                          Create an account to setup your store
                        </h1>
                        <form onSubmit={formik_1.handleSubmit}>
                          <div className="flex">
                            <div className="w-full mr-1 my-1">
                              {" "}
                              <input
                                className="border w-full mb-2 p-3 rounded"
                                placeholder=" First Name"
                                name="name"
                                type="text"
                                onChange={formik_1.handleChange}
                                defaultValue={formik_1.values.name}
                              />
                              {errorlist !== null ? (
                                <div className="text-red-500">
                                  {errorlist.name}
                                </div>
                              ) : null}
                            </div>
                            <div className="w-full ml-1 my-1">
                              {" "}
                              <input
                                className="border w-full mb-2 p-3 rounded"
                                placeholder="Last Name"
                                name="lastname"
                                type="text"
                                onChange={formik_1.handleChange}
                                defaultValue={formik_1.values.lastname}
                              />
                              {errorlist !== null ? (
                                <div className="text-red-500">
                                  {errorlist.lastname}
                                </div>
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
                                  onChange={formik_1.handleChange}
                                  defaultValue={formik_1.values.phone}
                                />
                              </div>
                              <div style={{ width: "90%" }}>
                                <input
                                  className="border w-full mb-2 p-3 rounded"
                                  placeholder="Mobile"
                                  type="number"
                                  name="phone"
                                  onChange={formik_1.handleChange}
                                  defaultValue={formik_1.values.phone}
                                />
                              </div>
                            </div>
                            {errorlist !== null ? (
                              <div className="text-red-500">
                                {errorlist.phone}
                              </div>
                            ) : null}
                          </div>
                          <div className="my-1  w-full">
                            <input
                              className="border w-full mb-2 p-3 rounded"
                              placeholder="Email"
                              type="email"
                              name="email"
                              onChange={formik_1.handleChange}
                              defaultValue={formik_1.values.email}
                            />
                            {errorlist !== null ? (
                              <div className="text-red-500">
                                {errorlist.email}
                              </div>
                            ) : null}
                          </div>
                          <div className=" w-full my-1">
                            <input
                              className="border w-full mb-2 p-3 rounded"
                              placeholder="Password"
                              type="password"
                              name="password"
                              onChange={formik_1.handleChange}
                              defaultValue={formik_1.values.password}
                            />
                            {errorlist !== null ? (
                              <div className="text-red-500">
                                {errorlist.password}
                              </div>
                            ) : null}
                          </div>

                          {!isloading_s && (
                            <button className="font-bold rounded bg-yellow-600 loginBtn	text-white-1000 w-full py-2 px-4 mt-4">
                              Sign up
                            </button>
                          )}
                          {isloading_s && (
                            <button
                              className={`${classes.login_loading} rounded 	text-white-1000  py-3 px-4 mt-4 loginBtn`}
                              loading={loading}
                              disabled
                            >
                              Loading…
                            </button>
                          )}
                        </form>

                        <p>
                          <a href="/login"> Already have an account ?</a>
                        </p>
                      </div>
                      <div className="shadow-lg"></div>
                    </div>
                  </div>
                )}
                {activeStep == 1 && (
                  <div className="Stepper_container__1">
                    <div>
                      <div>
                        <div className="p-8">
                          <img className="wemix" src="/1.png" />

                          <h1 className="font-bold	mb-4">
                            Get a head start on your store setup.
                          </h1>
                          {imagurl !== null ? (
                            <img src={imagurl} width="140px" height="60" />
                          ) : null}
                          <input
                            className="border w-full mb-2 p-3 rounded"
                            placeholder="What’s your store name?"
                            name="storename"
                            type="file"
                            onChange={geturl}
                          />
                          <form onSubmit={formik.handleSubmit}>
                            <input
                              className="border w-full mb-2 p-3 rounded"
                              placeholder="What’s your store name?"
                              name="storename"
                              type="text"
                              onChange={formik.handleChange}
                              defaultValue={formik.values.storename}
                            />

                            <input
                              className="border w-full mb-2 p-3 rounded"
                              placeholder="Pin code"
                              name="pincode"
                              type="number"
                              onChange={changepincode}
                            />
                            <input
                              className="border w-full mb-2 p-3 rounded"
                              placeholder="Country"
                              name="country"
                              value="INDIA"
                              type="text"
                              disabled
                              onChange={formik.handleChange}
                              defaultValue={formik.values.country}
                            />
                            <input
                              className="border w-full mb-2 p-3 rounded"
                              placeholder="State"
                              name="state"
                              defaultValue={state}
                              type="text"
                              disabled
                            />

                            {/* <select
                              className="border w-full mb-2 p-3 rounded"
                              onChange={handleChangestate}
                              defaultValue={formik.values.state}
                            >
                              <option>Select State</option>
                              {statelist.length !== 0
                                ? statelist.map((data, index) => (
                                    <option value={data.state} key={index}>
                                      {data.state}
                                    </option>
                                  ))
                                : null}
                            </select> */}

                            <select
                              className="border w-full mb-2 p-3 rounded"
                              onChange={handleChangecity}
                              defaultValue={formik.values.city}
                            >
                              <option>Select City</option>
                              {citylist.length !== 0
                                ? citylist.map((data, index) => (
                                    <option value={data.Name} key={index}>
                                      {data.Name}
                                    </option>
                                  ))
                                : null}
                            </select>

                            {currentStore_id !== null ? (
                              <button className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4">
                                Update
                              </button>
                            ) : (
                              <>
                                {!isloading_Store && (
                                  <button className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4">
                                    Save
                                  </button>
                                )}
                                {isloading_Store && (
                                  <button
                                    className={`${classes.login_loading} rounded 	text-white-1000 bg-black-500 w-full py-3 px-4 mt-4 loginBtn`}
                                    loading={loading}
                                    disabled
                                  >
                                    Loading…
                                  </button>
                                )}
                              </>
                            )}
                          </form>
                        </div>
                        <div className="shadow-lg"></div>
                      </div>
                      <ToastContainer />
                    </div>
                  </div>
                )}

                {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  {activeStep != 0 &&
                    activeStep != 4 &&
                    (isDomain === true ? (
                      <Button
                        className="BackBtn"
                        disabled={activeStep === 0}
                        onClick={handleBacknew}
                        sx={{ mr: 1 }}
                      >
                        back
                      </Button>
                    ) : (
                      <Button
                        className="BackBtn"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Previous
                      </Button>
                    ))}

                  <Box sx={{ flex: "1 1 auto" }} />

                  {activeStep != 4 && activeStep != 1 && activeStep != 3 && (
                    <Button className="BackBtn" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                  {activeStep == 1 && (
                    <Button className="BackBtn" onClick={haveDomain_handler}>
                      Next
                    </Button>
                  )}

                  {activeStep == 3 && (
                    <Button className="BackBtn" onClick={selectTheme_handler}>
                      Next
                    </Button>
                  )}
                  {activeStep == 4 && (
                    <Button
                      className="BackBtn"
                      onClick={() => {
                        window.location.replace("/dashboard");
                      }}
                    >
                      Finish
                    </Button>
                  )}
                </Box> */}
              </React.Fragment>
            )}
          </Box>
        </div>

        <div className="StoreSetUpImg">
          <h1 className="text-3xl">Fill your profile details</h1>
          <img src="./login_.png" />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup_;
