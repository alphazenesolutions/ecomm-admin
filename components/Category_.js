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
import { Allcategory, Creatcategory, Deltecategory } from "../Api/Category";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../database/firebase";
import { Allcategorytype } from "../Api/CategoryType";
import slugify from "slugify";
import Nav_ from "./Nav_";
import { LoadingButton } from "@mui/lab";

const Category_ = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setrows] = React.useState([]);
  const [categorytype, setcategorytype] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // products
  const [isNew, setisNew] = useState(false);
  const Nav_newProduct = () => {
    setisNew(false);
  };
  const Nav_allProduct = () => {
    setisNew(true);
  };
  useEffect(() => {
    getalldata();
  }, []);
  const getalldata = async () => {
    var store_id = sessionStorage.getItem("store_id");

    var allcategory = await Allcategory();
    var store_category = allcategory.data.filter((data) => {
      return data.store == store_id;
    });
    var categorytype = await Allcategorytype();
    setcategorytype(categorytype.data);
    setrows(store_category);
  };
  const [isloading, setisloading] = useState(false);
  const savebtn = async () => {
    setisloading(true);
    var categoryname = document.getElementById("categoryname").value;
    var categoryimg = document.getElementById("categoryimg").files;
    // var categorygender = document.getElementById("categorygender").value;
    // if (categorygender.length === "Select Gender") {
    //   toast.error("Gender Required..", {
    //     autoClose: 5000,
    //     transition: Slide,
    //   });
    // } else
    if (categoryname.length === 0) {
      setisloading(false);
      toast.error("Category Name Required..", {
        autoClose: 5000,
        transition: Slide,
      });
    } else if (categoryimg.length === 0) {
      setisloading(false);
      toast.error("Please Upload Category Image..", {
        autoClose: 5000,
        transition: Slide,
      });
    } else {
      if (categoryimg[0].size / 1024 / 1024 > 2) {
        toast.info("Image size is too large!.. Image must be within 2 MB", {
          autoClose: 5000,
          transition: Slide,
        });
      } else {
        setisloading(false);
        var store_id = sessionStorage.getItem("store_id");
        toast.info("Please Wait..", {
          autoClose: 5000,
          transition: Slide,
        });
        let file13 = new Promise((resolve, reject) => {
          var storageRef = firebase
            .storage()
            .ref("product_thumbnail/" + categoryimg[0].name);
          storageRef.put(categoryimg[0]).then(function (snapshot) {
            storageRef.getDownloadURL().then(function (url) {
              //img download link ah ketakiradhu
              setTimeout(() => resolve(url), 1000);
            });
          });
        });
        var imgurl1 = await file13;
        var data = {
          category_name: categoryname,
          category_image: imgurl1,
          // categorygender: categorygender,
          store: store_id,
          slug: slugify(categoryname, "_"),
        };
        var createcategory = await Creatcategory(data);
        if (createcategory.message === "SUCCESS") {
          setisloading(false);

          toast.success("Category Added Successfully..", {
            autoClose: 5000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
    }
    setisloading(false);
  };
  const deltebtn = async (e) => {
    var data = await Deltecategory({ id: e.target.id });
    if (data.message === "Deleted Successfully") {
      toast.success("Category Deleted Successfully..", {
        autoClose: 5000,
        transition: Slide,
      });
      getalldata();
    }
  };
  const submitbtn = async () => {
    var searchcategory = document.getElementById("searchcategory").value;
    if (searchcategory.length !== 0) {
      var filterproduct = [];
      for (var i = 0; i < rows.length; i++) {
        if (
          rows[i].category_name
            .toLocaleLowerCase()
            .includes(searchcategory.toLocaleLowerCase())
        ) {
          filterproduct.push(rows[i]);
        }
      }
      setrows(filterproduct);
    }
  };
  const resetbtn = () => {
    getalldata();
    document.getElementById("searchcategory").value = "";
  };
  return (
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
              All Category
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
                  About Your Category
                </h1>
                {/* <select
                  className="border w-full mb-2 p-3 rounded"
                  id="categorygender"
                >
                  <option>Select Category Gender</option>
                  {categorytype.length !== 0
                    ? categorytype.map((data, index) => (
                        <option key={index} value={data.name}>
                          {data.name}
                        </option>
                      ))
                    : null}
                </select> */}
                <input
                  className="border w-full mb-2 p-3 rounded"
                  placeholder="What’s your Category name?"
                  id="categoryname"
                />
                <label>Category Image</label>
                <input
                  className="border w-full mb-2 p-3 rounded"
                  type="file"
                  id="categoryimg"
                />
                {!isloading && (
                  <button
                    className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
                    onClick={savebtn}
                  >
                    Save
                  </button>
                )}
                {isloading && (
                  <LoadingButton
                    className="rounded bg-white-400	text-white-1000 w-full p-3 mt-4"
                    loading
                  >
                    Submit
                  </LoadingButton>
                )}
              </div>
            )}

            {!isNew && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <input
                      className="border p-2"
                      placeholder="Search For Category"
                      id="searchcategory"
                    />
                    <button
                      className="border p-2 ml-4 hover:bg-white-400"
                      onClick={submitbtn}
                    >
                      Submit
                    </button>
                    <button
                      className="border p-2 ml-4 hover:bg-white-400"
                      onClick={resetbtn}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 640 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-md text-black-800 font-bold">
                            Category Image
                          </TableCell>
                          {/* <TableCell className="text-md text-black-800 font-bold">
                            Category Gender
                          </TableCell> */}
                          <TableCell className="text-md text-black-800 font-bold">
                            Category Name
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
                                key={row.code}
                              >
                                <TableCell>
                                  <img
                                    src={row.category_image}
                                    alt="Logo"
                                    width={80}
                                    height={80}
                                  />
                                </TableCell>
                                {/* <TableCell>{row.categorygender}</TableCell> */}
                                <TableCell>{row.category_name}</TableCell>
                                <TableCell>
                                  {" "}
                                  <button
                                    id={row.id}
                                    onClick={deltebtn}
                                    className="bg-red-500 text-white-1000 p-2"
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

      <ToastContainer />
    </div>
  );
};

export default Category_;
