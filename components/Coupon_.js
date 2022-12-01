import React, { useEffect, useState } from "react";
import Sidebar_ from "./Sidebar_";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CreateCoupon,
  allCoupon,
  UpdateCoupon,
  DeleteCoupon,
} from "../Api/Coupon";
import Nav_ from "./Nav_";
import { LoadingButton } from "@mui/lab";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
};

const Coupon_ = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setrows] = React.useState([]);
  const [errorlist, seterrorlist] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [isNew, setisNew] = useState(false);
  const Nav_newProduct = () => {
    setisNew(false);
  };
  const Nav_allProduct = () => {
    setisNew(true);
  };

  const [open, setOpen] = React.useState(false);
  const [name, setname] = React.useState(null);
  const [code, setcode] = React.useState(null);
  const [minamount, setminamount] = React.useState(null);
  const [maxamount, setmaxamount] = React.useState(null);
  const [expirydate, setexpirydate] = React.useState(null);
  const [offerprice, setofferprice] = React.useState(null);
  const [couponid, setcouponid] = React.useState(null);

  const handleOpen = async (e) => {
    var singledata = await rows.filter((data) => {
      return data.id === Number(e.target.id);
    });
    if (singledata.length !== 0) {
      setname(singledata[0].name);
      setcode(singledata[0].code);
      setminamount(singledata[0].minamount);
      setmaxamount(singledata[0].maxamount);
      setexpirydate(singledata[0].expirydate);
      setexpirydate(singledata[0].expirydate);
      setofferprice(singledata[0].offerprice);
      setcouponid(singledata[0].id);
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [loading, setloading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      minamount: "",
      maxamount: "",
      expirydate: "",
      type: "",
      offerprice: "",
    },

    onSubmit: async (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Coupon Name Required";
      }
      if (!values.code) {
        errors.code = "Coupon Code Required";
      }
      if (!values.minamount) {
        errors.minamount = "Coupon Min Amount Required";
      }
      if (!values.maxamount) {
        errors.maxamount = "Coupon Max Amount Required";
      }
      if (!values.expirydate) {
        errors.expirydate = "Coupon Expiry Date Required";
      }
      if (!values.type) {
        errors.type = "Coupon Type Required";
      }
      if (!values.offerprice) {
        errors.offerprice = "Coupon Offer Price Required";
      }
      seterrorlist(errors);
      if (Object.keys(errors).length === 0) {
        var store_id = sessionStorage.getItem("store_id");
        setloading(true);
        values["store"] = store_id;
        var creteproduct = await CreateCoupon(values);
        if (creteproduct.message === "SUCCESS") {
          setloading(false);
          toast.success("Coupon Added Successfully..", {
            autoClose: 5000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
    },
  });

  useEffect(() => {
    getalldata();
  }, []);
  const getalldata = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var allcoupon = await allCoupon();
    var store_coupon = allcoupon.filter((data) => {
      return data.store == store_id;
    });
    setrows(store_coupon);
  };
  const updatebtn = async () => {
    var name = document.getElementById("name").value;
    var code = document.getElementById("code").value;
    var minamount = document.getElementById("minamount").value;
    var maxamount = document.getElementById("maxamount").value;
    var offerprice = document.getElementById("offerprice").value;
    var expirydate = document.getElementById("expirydate").value;
    var data = {
      name: name,
      code: code,
      minamount: minamount,
      maxamount: maxamount,
      offerprice: offerprice,
      expirydate: expirydate,
      id: couponid,
    };
    var updatedata = await UpdateCoupon(data);
    if (updatedata === "Updated Successfully") {
      toast.success("Coupon Updated Successfully..", {
        autoClose: 5000,
        transition: Slide,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };
  const deltebtn = async (e) => {
    var deletedata = await DeleteCoupon({ id: e.target.id });
    if (deletedata === "Deleted Successfully") {
      window.location.reload();
    }
  };
  return (
    <div>
      {" "}
      <div className="flex ">
        <Sidebar_ />
        <div>
          <Nav_ />
          <div className="col-span-2 p-8 Products">
            <div className="flex ">
              <button
                onClick={Nav_newProduct}
                className="border-solid border-2 p-3 mr-4 mb-4 hover:bg-white-400"
              >
                All Coupon
              </button>
              <button
                onClick={Nav_allProduct}
                className="border-solid border-2 p-3 mr-4 mb-4 hover:bg-white-400"
              >
                Add New
              </button>
            </div>
            <div>
              {isNew && (
                <div className="shadow-lg p-8">
                  <h1 className="font-bold	mb-4 font-serif">Coupon Name</h1>
                  <form onSubmit={formik.handleSubmit}>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="Coupon Name"
                      name="name"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.name}
                    />
                    {errorlist !== null ? (
                      <div className="text-red-500">{errorlist.name}</div>
                    ) : null}

                    <h1 className="font-bold	mb-4 font-serif">Coupon Code</h1>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="Coupon Code"
                      name="code"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.code}
                    />
                    {errorlist !== null ? (
                      <div className="text-red-500">{errorlist.code}</div>
                    ) : null}
                    <h1 className="font-bold	mb-4 font-serif">
                      Coupon Min Amount
                    </h1>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="Coupon Min Amount"
                      name="minamount"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.minamount}
                    />
                    {errorlist !== null ? (
                      <div className="text-red-500">{errorlist.minamount}</div>
                    ) : null}
                    <h1 className="font-bold	mb-4 font-serif">
                      Coupon Max Amount
                    </h1>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="Coupon Max Amount"
                      name="maxamount"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.maxamount}
                    />
                    {errorlist !== null ? (
                      <div className="text-red-500">{errorlist.maxamount}</div>
                    ) : null}

                    <h1 className="font-bold	mb-4 font-serif">Expiry Date</h1>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="Coupon Expiry Date"
                      type="date"
                      name="expirydate"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.expirydate}
                    />
                    {errorlist !== null ? (
                      <div className="text-red-500">{errorlist.expirydate}</div>
                    ) : null}
                    <h1 className="font-bold	mb-4 font-serif">User Type</h1>
                    <select
                      className="border w-full mb-2 p-3 rounded"
                      onChange={formik.handleChange}
                      name="type"
                      defaultValue={formik.values.type}
                    >
                      <option value="">Select User</option>
                      <option value="All User">All User</option>
                      <option value="Regular User">Regular User</option>
                      <option value="New User">New  User</option>
                    </select>
                    {errorlist !== null ? (
                      <div className="text-red-500">{errorlist.type}</div>
                    ) : null}
                    <h1 className="font-bold mb-4 font-serif">
                      Coupon Offer Price
                    </h1>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="Coupon Offer Price"
                      name="offerprice"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.offerprice}
                    />
                    {errorlist !== null ? (
                      <div className="text-red-500">{errorlist.offerprice}</div>
                    ) : null}
                    {!loading && (
                      <button className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4">
                        Save
                      </button>
                    )}
                    {loading && (
                      <LoadingButton
                        className="rounded bg-white-400	text-white-1000 w-full p-3 mt-4"
                        loading
                      >
                        Submit
                      </LoadingButton>
                    )}
                  </form>
                </div>
              )}

              {!isNew && (
                <div>
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 640 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell className="text-md text-black-800 font-bold">
                              Coupon Name
                            </TableCell>
                            <TableCell className="text-md text-black-800 font-bold">
                              Coupon Code
                            </TableCell>
                            <TableCell className="text-md text-black-800 font-bold">
                              Coupon Min Amount
                            </TableCell>
                            <TableCell className="text-md text-black-800 font-bold">
                              Coupon Max Amount
                            </TableCell>
                            <TableCell className="text-md text-black-800 font-bold">
                              Offer Price
                            </TableCell>
                            <TableCell className="text-md text-black-800 font-bold">
                              Coupon Type
                            </TableCell>
                            <TableCell className="text-md text-black-800 font-bold">
                              Coupon Expiry Date
                            </TableCell>
                            <TableCell className="text-md text-black-800 font-bold">
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                >
                                  <TableCell>{row.name}</TableCell>
                                  <TableCell>{row.code}</TableCell>
                                  <TableCell>{row.minamount}</TableCell>
                                  <TableCell>{row.maxamount}</TableCell>
                                  <TableCell>{row.offerprice}</TableCell>
                                  <TableCell>{row.type}</TableCell>
                                  <TableCell>{row.expirydate}</TableCell>
                                  <TableCell>
                                    {" "}
                                    <button
                                      id={row.id}
                                      onClick={handleOpen}
                                      className="bg-red-500 text-white-1000 p-2 mr-2"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="bg-red-500 text-white-1000 p-2"
                                      id={row.id}
                                      onClick={deltebtn}
                                    >
                                      Delete
                                    </button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="shadow-lg p-8">
            <h1 className="font-bold	mb-4 font-serif">Edit Your Journal</h1>
            <label>Coupon Name</label>
            <input
              className="border w-full mb-2 p-3 rounded"
              placeholder="What’s your Journal name?"
              defaultValue={name}
              id="name"
            />
            <label>Coupon Code</label>
            <input
              className="border w-full mb-2 p-3 rounded"
              placeholder="What’s your Journal name?"
              defaultValue={code}
              id="code"
            />
            <label>Coupon Max Amount</label>
            <input
              className="border w-full mb-2 p-3 rounded"
              placeholder="What’s your Journal name?"
              defaultValue={maxamount}
              id="maxamount"
            />
            <label>Coupon Min Amount</label>
            <input
              className="border w-full mb-2 p-3 rounded"
              placeholder="What’s your Journal name?"
              defaultValue={minamount}
              id="minamount"
            />
            <label>Coupon Offer Price</label>
            <input
              className="border w-full mb-2 p-3 rounded"
              placeholder="What’s your Journal name?"
              defaultValue={offerprice}
              id="offerprice"
            />
            <label>Coupon Expirt Date</label>
            <input
              className="border w-full mb-2 p-3 rounded"
              placeholder="What’s your Journal name?"
              defaultValue={expirydate}
              type="date"
              id="expirydate"
            />
            <button
              className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
              onClick={updatebtn}
            >
              Update
            </button>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Coupon_;
