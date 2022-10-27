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
import { firebase } from "../database/firebase";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CreateJournal,
  allJournal,
  UpdateJournal,
  DeleteJournal,
} from "../Api/Journal";
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
const Journal_ = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setrows] = React.useState([]);

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
  //   edit journal
  const [open, setOpen] = React.useState(false);
  const [imageurl, setimageurl] = React.useState(null);
  const [heading, setheading] = React.useState(null);
  const [subheading, setsubheading] = React.useState(null);
  const [description, setdescription] = React.useState(null);
  const [journalid, setjournalid] = React.useState(null);

  const handleOpen = async (e) => {
    var singledata = await rows.filter((data) => {
      return data.id === Number(e.target.id);
    });
    if (singledata.length !== 0) {
      setheading(singledata[0].heading);
      setsubheading(singledata[0].subheading);
      setdescription(singledata[0].description);
      setimageurl(singledata[0].image);
      setjournalid(singledata[0].id);
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [loading, setloading] = useState(false);
  const validate = (values) => {
    const errors = {};
    if (!values.heading) {
      errors.heading = "Heading Required";
    }
    if (!values.description) {
      errors.description = "Description Required";
    }
    if (!values.subheading) {
      errors.subheading = "Sub Heading Required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      heading: "",
      subheading: "",
      description: "",
    },
    validate,
    onSubmit: async (values) => {
      setloading(true);
      var store_id = sessionStorage.getItem("store_id");

      if (imageurl === null) {
        setloading(false);

        toast.error("Please Select Journal Image..", {
          autoClose: 5000,
          transition: Slide,
        });
      } else {
        setloading(false);

        values["image"] = imageurl;
        values["store"] = store_id;
        var creteproduct = await CreateJournal(values);
        if (creteproduct.message === "SUCCESS") {
          setloading(false);

          toast.success("Journal Added Successfully..", {
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
  const geturl = async (e) => {
    toast.info("Please Wait...", {
      autoClose: 5000,
      transition: Slide,
    });
    let file = e.target.files;
    if (file[0].size / 1024 / 1024 > 2) {
      toast.info("Image size is too large!.. Image must be within 2 MB", {
        autoClose: 5000,
        transition: Slide,
      });
    } else {
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
      setimageurl(imgurl1);
    }
  };
  useEffect(() => {
    getalldata();
  }, []);
  const getalldata = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var alljournal = await allJournal();
    var store_journal = alljournal.filter((data) => {
      return data.store == store_id;
    });
    setrows(store_journal);
  };
  const updatebtn = async () => {
    var description = document.getElementById("description").value;
    var heading = document.getElementById("heading").value;
    var subheading = document.getElementById("subheading").value;
    var data = {
      heading: heading,
      subheading: subheading,
      description: description,
      image: imageurl,
      id: journalid,
    };
    var updatedata = await UpdateJournal(data);
    if (updatedata === "Updated Successfully") {
      toast.success("Journal Updated Successfully..", {
        autoClose: 5000,
        transition: Slide,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };
  const deltebtn = async (e) => {
    var deletedata = await DeleteJournal({ id: e.target.id });
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
                All Journal
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
                  <h1 className="font-bold	mb-4 font-serif">
                    About Your Journal
                  </h1>
                  <form onSubmit={formik.handleSubmit}>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="What’s your Journal name?"
                      name="heading"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.heading}
                    />
                    {formik.errors.heading ? (
                      <div className="text-red-500">
                        {formik.errors.heading}
                      </div>
                    ) : null}
                    <label>Image</label>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      type="file"
                      onChange={geturl}
                    />
                    <label>Sub Heading</label>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="Journal's Sub Heading"
                      name="subheading"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.subheading}
                    />
                    {formik.errors.subheading ? (
                      <div className="text-red-500">
                        {formik.errors.subheading}
                      </div>
                    ) : null}
                    <label>Description</label>
                    <textarea
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="Journal's Description"
                      name="description"
                      onChange={formik.handleChange}
                      defaultValue={formik.values.description}
                    />
                    {formik.errors.description ? (
                      <div className="text-red-500">
                        {formik.errors.description}
                      </div>
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
                  {/* <div className="mb-4 flex items-center justify-between">
                  <div>
                    <input
                      className="border p-2"
                      placeholder="Search For Journal"
                      id="searchcategory"
                    />
                    <button className="border p-2 ml-4 hover:bg-white-400">
                      Submit
                    </button>
                    <button className="border p-2 ml-4 hover:bg-white-400">
                      Reset
                    </button>
                  </div>
                </div> */}
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 640 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell className="text-md text-black-800 font-bold">
                              Journal Image
                            </TableCell>
                            <TableCell className="text-md text-black-800 font-bold">
                              Journal Heading
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
                                  <TableCell>
                                    <img
                                      src={row.image}
                                      alt="Logo"
                                      width={80}
                                      height={80}
                                    />
                                  </TableCell>
                                  <TableCell>{row.heading}</TableCell>
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

            <input
              className="border w-full mb-2 p-3 rounded"
              placeholder="What’s your Journal name?"
              defaultValue={heading}
              id="heading"
            />
            <label>Image</label>
            <input
              className="border w-full mb-2 p-3 rounded"
              type="file"
              onChange={geturl}
            />
            <label>Sub Heading</label>
            <input
              className="border w-full mb-2 p-3 rounded"
              placeholder="Journal's Sub Heading"
              defaultValue={subheading}
              id="subheading"
            />
            <label>Description</label>
            <textarea
              className="border w-full mb-2 p-3 rounded"
              placeholder="Journal's Description"
              defaultValue={description}
              id="description"
            />
            <button
              className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
              onClick={updatebtn}
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Journal_;
