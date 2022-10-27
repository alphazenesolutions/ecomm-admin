import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
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
//
const steps = [
  "Store Setup",
  "Already Have Domain ?",
  "Choose Your Domain",
  "Choose Your Theme",
  "Get Your Site",
];

const Signup_ = () => {
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
  const selectTheme_handler = async () => {
    const updatedStore_ = await UpdateStore({
      id: currentStore_id,
      theme: selectedtheme,
    });
    if (updatedStore_.message == "Updated Successfully") {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };
  const haveDomain_handler = async () => {
    var domainName = document.getElementById("haveDomain").value;
    const updatedStore_ = await UpdateStore({
      id: currentStore_id,
      domain: domainName,
    });
    if (updatedStore_.message == "Updated Successfully") {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 2);
      setSkipped(newSkipped);
    }
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
  const searchbtn = async () => {
    var domain = document.getElementById("domain").value;
    var check = domain.includes(".");
    if (domain.length !== 0) {
      if (check === true) {
        setloading(true);
        setdomainname(domain);
        const options = {
          method: "GET",
          url: `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=at_d5hP7WuoVTCBB4a6cQbBv0jhL35MF&domainName=${domain}&credits=DA`,
        };
        axios
          .request(options)
          .then(function (response) {
            if (response.data.DomainInfo.domainAvailability === "UNAVAILABLE") {
              setcheckdomainresult(false);
              setloading(false);
            } else {
              setcheckdomainresult(true);
              setloading(false);
            }
          })
          .catch((error) => {
            toast.error(error.response.data.messages, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setloading(false);
          });
      } else {
        setloading(false);
        toast.error("Please Provide a Valid Domain name !", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.error("Please Enter Domain name !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const domaincheck = () => {
    toast.error("Please Choose Your Domain...", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  //   isDomain
  const [isDomain, setisDomain] = useState(false);
  const [imagurl, setimagurl] = useState(null);
  const [city, setcity] = useState(null);
  const [state, setstate] = useState(null);
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

  const validate = (values) => {
    const errors = {};
    if (!values.storename) {
      errors.name = "Store Name Is Required";
    }
    if (!values.pincode) {
      errors.pincode = "Pincode Required";
    } else if (values.pincode.length > 6) {
      errors.pincode = "Must be 6 characters";
    }
    return errors;
  };
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
    validate,
    onSubmit: async (values) => {
      if (state === null) {
        toast.error("Please Select State..", {
          autoClose: 5000,
          transition: Slide,
        });
      } else if (city === null) {
        toast.error("Please Select City..", {
          autoClose: 5000,
          transition: Slide,
        });
      } else if (imagurl === null) {
        toast.error("Please Upload Logo..", {
          autoClose: 5000,
          transition: Slide,
        });
      } else {
        values.user_id = user_id;
        values["logo"] = imagurl;
        values["city"] = city;
        values["state"] = state;
        if (currentStore_id === null) {
          var createstore = await CreateStore(values);
          if (createstore.message === "SUCCESS") {
            setcurrentStore_id(createstore.data.id);
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
            }, 2000);
          } else {
            toast.error(createstore.message, {
              autoClose: 2000,
              transition: Slide,
            });
          }
        } else {
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
            }, 2000);
          }
        }
      }
    },
  });
  const geturl = async (e) => {
    toast.info("Please Wait...", {
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

  return (
    <>
      <div className="SingUpPage  ">
        <div className="p-8">
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep}>
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
                    <StepLabel {...labelProps}>{label}</StepLabel>
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
                      <h1>Choose Your Domain </h1>
                      <div className="Domain_setup_inputs">
                        <FormControl sx={{ m: 1 }} variant="outlined">
                          <OutlinedInput
                            defaultValue={domainname}
                            placeholder="Search Your Domain"
                            id="domain"
                            endAdornment={
                              loading === true ? (
                                <LoadingButton loading className="searchDomain">
                                  Submit
                                </LoadingButton>
                              ) : (
                                <SearchIcon
                                  className="searchDomain"
                                  onClick={searchbtn}
                                />
                              )
                            }
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                              "aria-label": "weight",
                            }}
                          />
                        </FormControl>
                        {checkdomainresult !== null ? (
                          checkdomainresult == true ? (
                            <>
                              <div className="Available_domain">
                                <div className="Available_domain_lft">
                                  <h1>Hurray..!</h1>
                                  <h1>
                                    Your Domain is{" "}
                                    <span className="Available">Available</span>{" "}
                                  </h1>
                                </div>
                                <div className="Available_domain_rgt">
                                  <img src="./available.jpeg" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="Available_domain">
                              <div className="Available_domain_lft">
                                <h1>Oops..!</h1>
                                <h1>
                                  Domain is{" "}
                                  <span className="NotAvailable">
                                    {" "}
                                    Not Available
                                  </span>{" "}
                                </h1>
                              </div>
                              <div className="Available_domain_rgt">
                                <img src="./notavailable.jpeg" />
                              </div>
                            </div>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
                {activeStep == 1 && (
                  <div className="Stepper_container_1">
                    <div className="Domain_setup mt-32">
                      <h1>Already Have Domain ?</h1>

                      <div className="Domain_setup_inputs">
                        {!isDomain && (
                          <div className="flex justify-between w-full">
                            <button
                              onClick={domainChecking}
                              className="border py-2 px-8 mr-2 hover:bg-white-400"
                            >
                              Have One
                            </button>
                            <button
                              onClick={handleNext}
                              className="border py-2 hover:bg-white-400 px-8 ml-2"
                            >
                              Create One
                            </button>
                          </div>
                        )}
                        {isDomain && (
                          <FormControl sx={{ m: 1 }} variant="outlined">
                            <OutlinedInput
                              defaultValue={domainname}
                              placeholder="Search Your Domain"
                              id="haveDomain"
                              aria-describedby="outlined-weight-helper-text"
                              inputProps={{
                                "aria-label": "weight",
                              }}
                            />
                          </FormControl>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeStep == 3 && (
                  <div className="Stepper_container_1">
                    <div className="theme_head">
                      <h1>Choose a theme you want</h1>
                      <div className="Theme">
                        <div className="Themes">
                          {alltheme_data.length != 0 && (
                            <>
                              {alltheme_data.map((data) => {
                                return (
                                  <div>
                                    {selectedtheme == data.name && (
                                      <img
                                        className="active_img"
                                        src={data.thumbnail}
                                        alt=""
                                        id={data.name}
                                        onClick={selecttheme}
                                      />
                                    )}
                                    {selectedtheme != data.name && (
                                      <img
                                        src={data.thumbnail}
                                        alt=""
                                        id={data.name}
                                        onClick={selecttheme}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeStep == 0 && (
                  <div className="Stepper_container__1">
                    <div className="w-9/12 m-auto	 px-16 mt-16 items-center">
                      <div>
                        <div className="shadow-lg p-8">
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
                            {formik.errors.storename ? (
                              <div className="text-red-500">
                                {formik.errors.storename}
                              </div>
                            ) : null}
                            <input
                              className="border w-full mb-2 p-3 rounded"
                              placeholder="Pin code"
                              name="pincode"
                              type="number"
                              onChange={formik.handleChange}
                              defaultValue={formik.values.pincode}
                            />
                            {formik.errors.pincode ? (
                              <div className="text-red-500">
                                {formik.errors.pincode}
                              </div>
                            ) : null}
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
                            {formik.errors.country ? (
                              <div className="text-red-500">
                                {formik.errors.country}
                              </div>
                            ) : null}
                            <select
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
                            </select>

                            <select
                              className="border w-full mb-2 p-3 rounded"
                              onChange={handleChangecity}
                              defaultValue={formik.values.city}
                            >
                              <option>Select City</option>
                              {citylist.length !== 0
                                ? citylist.map((data, index) => (
                                    <option value={data} key={index}>
                                      {data}
                                    </option>
                                  ))
                                : null}
                            </select>

                            {formik.errors.city ? (
                              <div className="text-red-500">
                                {formik.errors.city}
                              </div>
                            ) : null}
                            {currentStore_id !== null ? (
                              <button className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4">
                                Update
                              </button>
                            ) : (
                              <button className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4">
                                Save
                              </button>
                            )}
                          </form>
                        </div>
                        <div className="shadow-lg"></div>
                      </div>
                      <ToastContainer />
                    </div>
                  </div>
                )}
                {activeStep == 4 && (
                  <div className="Stepper_container_1">
                    <div className="w-9/12 m-auto	 p-16 pt-16 items-center">
                      <div>
                        <div className="shadow-lg p-8">
                          <div className="Available_domain">
                            <div className="Available_domain_lft">
                              <button className="border">GET YOUR SITE</button>
                            </div>
                            <div className="get_domain">
                              <img src="./available.jpeg" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <ToastContainer />
                    </div>
                  </div>
                )}

                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
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
                </Box>
              </React.Fragment>
            )}
          </Box>
        </div>

        {/* <div className="StoreSetUpImg">
          <img src="./login_.png" />
        </div> */}
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup_;
