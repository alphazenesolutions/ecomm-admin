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
import { useFormik } from "formik";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Avatar } from "@mui/material";
import { firebase } from "../database/firebase";
import { CreateProduct, Allproduct, Updateproduct } from "../Api/Product";
import { Allcategory } from "../Api/Category";
import { CreateVariation } from "../Api/Variation";
import { CreateGallery } from "../Api/Gallery";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import slugify from "slugify";
import Nav_ from "./Nav_";
import LoadingButton from "@mui/lab/LoadingButton";

const Products_ = () => {
  const [isPorduct, setisPorduct] = useState(true);
  const [isproduct_loading, setisproduct_loading] = useState(false);
  const [isvarient_loading, setisvarient_loading] = useState(false);
  const [isGalleryLoading, setisGalleryLoading] = useState(false);
  const [productimg, setproductimg] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [productid, setproductid] = React.useState(null);
  const [allcategorydata, setallcategorydata] = React.useState([]);
  const [rows, setrows] = React.useState([]);

  useEffect(() => {
    getalldata();
  }, []);

  const getalldata = async () => {
    var store_id = sessionStorage.getItem("store_id");

    var allcategory = await Allcategory();
    var mycat = await allcategory.data.filter((data) => {
      return data.store === store_id;
    });
    setallcategorydata(mycat);
    var allproduct = await Allproduct();
    var store_product = allproduct.data.filter((data) => {
      return data.store == store_id;
    });

    setrows(store_product);
  };

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
    setisEdit(false);
  };
  const Nav_allProduct = () => {
    setisNew(true);
    setisEdit(false);
  };

  //   isVarient
  const [isVarient, setisVarient] = useState(false);
  const VariationsSaveHandler = () => {
    setisvarient_loading(true);
    var facilitystyle1 = document.getElementsByClassName("valueclass");
    var checkedValue1 = [];
    for (var i = 0; facilitystyle1[i]; ++i) {
      checkedValue1.push(facilitystyle1[i].value);
    }
    var facilitystyle2 = document.getElementsByClassName("priceclass");
    var checkedValue2 = [];
    for (var i = 0; facilitystyle2[i]; ++i) {
      checkedValue2.push(facilitystyle2[i].value);
    }
    var facilitystyle3 = document.getElementsByClassName("typeclass");
    var checkedValue3 = [];
    for (var i = 0; facilitystyle3[i]; ++i) {
      checkedValue3.push(facilitystyle3[i].value);
    }

    var facilitystyle4 = document.getElementsByClassName("stockclass");
    var checkedValue4 = [];
    for (var i = 0; facilitystyle4[i]; ++i) {
      checkedValue4.push(facilitystyle4[i].value);
    }

    for (var i = 0; i < checkedValue1.length; i++) {
      var data = {
        productID: productid,
        value: checkedValue1[i],
        type: checkedValue3[i],
        price: checkedValue2[i],
        stock: checkedValue4[i],
      };
      CreateVariation(data);
    }
    setisVarient(false);
    setisPorduct(false);
    setisGallery(true);
    setisvarient_loading(false);

    toast.success("Variation Added Successfully..", {
      autoClose: 5000,
      transition: Slide,
    });
    setTimeout(() => {
      setisGallery(true);
    }, 3000);
  };
  //   isGallery
  const [isGallery, setisGallery] = useState(false);
  const [slugvalue, setslugvalue] = useState(null);
  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name Required";
    }
    if (!values.description) {
      errors.description = "Description Required";
    }
    // if (!values.slug) {
    //   errors.slug = "Slug Required";
    // }
    if (!values.price) {
      errors.price = "Price Required";
    }
    if (!values.sale_price) {
      errors.sale_price = "Sale price Required";
    }
    if (!values.stock) {
      errors.stock = "Stock Required";
    }
    if (!values.category) {
      errors.category = "Category Required";
    }
    var slugvalue = slugify(values.name, "_");
    document.getElementById("slugdata").value = slugvalue;
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      // slug: "",
      thumbnail: "",
      original: "",
      price: "",
      sale_price: "",
      category: "",
      stock: "",
    },
    validate,
    onSubmit: async (values) => {
      setisproduct_loading(true);
      setisVarient(true);
      setisPorduct(false);
      setisGallery(false);
      if (productimg === null) {
        setisproduct_loading(false);

        toast.error("Please Upload Product Image", {
          autoClose: 5000,
          transition: Slide,
        });
      } else {
        setisproduct_loading(false);

        var store_id = sessionStorage.getItem("store_id");
        values["original"] = productimg;
        values["store"] = store_id;
        values["slug"] = slugify(values.name, "_");
        var creteproduct = await CreateProduct(values);
        if (creteproduct.message === "SUCCESS") {
          setisproduct_loading(false);

          toast.success("Product Added Successfully..", {
            autoClose: 5000,
            transition: Slide,
          });
          setisVarient(true);
          setproductid(creteproduct.data.id);
        }
      }
    },
  });

  const productimage = async (e) => {
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
        var storageRef = firebase
          .storage()
          .ref("product_original/" + file[0].name);
        storageRef.put(file[0]).then(function (snapshot) {
          storageRef.getDownloadURL().then(function (url) {
            //img download link ah ketakiradhu
            setTimeout(() => resolve(url), 1000);
          });
        });
      });
      var imgurl1 = await file13;
      setproductimg(imgurl1);
    }
  };
  // add_new_varient
  const [count, setcount] = useState(1);
  const [row, setrow] = useState([undefined]);

  const addcount = () => {
    var finalcount = Number(count) + Number(1);
    setcount(finalcount);
    var data = [];
    var countnew = finalcount;
    for (var i = 0; i < countnew; i++) {
      data.push(countnew[i]);
    }
    setrow(data);
  };
  const deleterow = () => {
    var finalcount = Number(count) - Number(1);
    setcount(finalcount);
    var data = [];
    var countnew = finalcount;
    for (var i = 0; i < countnew; i++) {
      data.push(countnew[i]);
    }
    setrow(data);
  };
  const savegallery = async () => {
    setisGalleryLoading(true);
    var galleryimg = document.getElementById("galleryimg").files;
    var galleryimgarray = [];
    if (galleryimg.length !== 0) {
      setisGalleryLoading(false);

      toast.info("Please Wait.....", {
        autoClose: 5000,
        transition: Slide,
      });
      for (var i = 0; i < galleryimg.length; i++) {
        if (galleryimg[i].size / 1024 / 1024 > 2) {
          toast.info("Image size is too large!.. Image must be within 2 MB", {
            autoClose: 5000,
            transition: Slide,
          });
        } else {
          let file13 = new Promise((resolve, reject) => {
            var storageRef = firebase
              .storage()
              .ref("product_thumbnail/" + galleryimg[i].name);
            storageRef.put(galleryimg[i]).then(function (snapshot) {
              storageRef.getDownloadURL().then(function (url) {
                //img download link ah ketakiradhu
                setTimeout(() => resolve(url), 1000);
              });
            });
          });
          var imgurl1 = await file13;
          galleryimgarray.push(imgurl1);
        }
      }
    }
    if (galleryimgarray.length !== 0) {
      setisGalleryLoading(false);

      for (var i = 0; i < galleryimgarray.length; i++) {
        var data = {
          original: galleryimgarray[i],
          productID: productid,
        };
        CreateGallery(data);
      }

      toast.success("Gallery Uploaded Successfully.....", {
        autoClose: 5000,
        transition: Slide,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setisGalleryLoading(false);

      toast.error("Please Upload Images...", {
        autoClose: 5000,
        transition: Slide,
      });
    }
  };
  // isEdit
  const [isEdit, setisEdit] = useState(false);

  const editHandler = () => {
    setisEdit(true);
    setisNew(false);
  };
  // featured
  const [isFeatured, setisFeatured] = useState(false);

  const AddFeature = async (e) => {
    var data = {
      id: e.target.id,
      featured: "true",
    };
    var update = await Updateproduct(data);
    if (update.message === "Updated Successfully") {
      getalldata();
    }
  };
  const RemoveFeature = async (e) => {
    var data = {
      id: e.target.id,
      featured: null,
    };
    var update = await Updateproduct(data);
    if (update.message === "Updated Successfully") {
      getalldata();
    }
  };
  const submitbtn = async () => {
    var searchproduct = document.getElementById("searchproduct").value;
    if (searchproduct.length !== 0) {
      var filterproduct = [];
      for (var i = 0; i < rows.length; i++) {
        if (
          rows[i].name
            .toLocaleLowerCase()
            .includes(searchproduct.toLocaleLowerCase())
        ) {
          filterproduct.push(rows[i]);
        }
      }
      setrows(filterproduct);
    }
  };
  const resetbtn = () => {
    getalldata();
    document.getElementById("searchproduct").value = "";
  };
  const getfeatured = async () => {
    setisFeatured(!isFeatured);
    if (isFeatured === false) {
      var checkproduct = await rows.filter((data) => {
        return data.featured === "true";
      });
      setrows(checkproduct);
    } else {
      getalldata();
    }
  };
  const getcategory = async (e) => {
    var checkproduct = await rows.filter((data) => {
      return data.category === e.target.value;
    });
    setrows(checkproduct);
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
              All Products
            </button>
            <button
              onClick={Nav_allProduct}
              className="border-solid border-2 p-3 mr-4 mb-4 hover:bg-white-400"
            >
              Add New
            </button>
          </div>
          <div>
            {isNew && !isEdit && (
              <>
                {isPorduct && !isVarient && !isGallery && (
                  <div className="shadow-lg p-8">
                    <h1 className="font-bold	mb-4 font-serif">
                      About Your Product
                    </h1>
                    <form onSubmit={formik.handleSubmit}>
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="What’s your product name?"
                        type="text"
                        name="name"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.name}
                      />
                      {formik.errors.name ? (
                        <div className="text-red-500">{formik.errors.name}</div>
                      ) : null}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Product Description "
                        type="text"
                        name="description"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.description}
                      />
                      {formik.errors.description ? (
                        <div className="text-red-500">
                          {formik.errors.description}
                        </div>
                      ) : null}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Slug"
                        type="text"
                        id="slugdata"
                        disabled
                        // name="slug"
                        // onChange={formik.handleChange}
                        // defaultValue={formik.values.slug}
                      />
                      {/* {formik.errors.slug ? (
                    <div className="text-red-500">{formik.errors.slug}</div>
                  ) : null} */}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Price"
                        type="text"
                        name="price"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.price}
                      />
                      {formik.errors.price ? (
                        <div className="text-red-500">
                          {formik.errors.price}
                        </div>
                      ) : null}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Sale Price"
                        type="text"
                        name="sale_price"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.sale_price}
                      />
                      {formik.errors.sale_price ? (
                        <div className="text-red-500">
                          {formik.errors.sale_price}
                        </div>
                      ) : null}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Stock"
                        type="text"
                        name="stock"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.stock}
                      />
                      {formik.errors.stock ? (
                        <div className="text-red-500">
                          {formik.errors.stock}
                        </div>
                      ) : null}
                      <select
                        className="border w-full mb-2 p-3 rounded"
                        name="category"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.category}
                      >
                        <option>Select category</option>
                        {allcategorydata.length !== 0
                          ? allcategorydata.map((data, index) => (
                              <option key={index} value={data.category_name}>
                                {data.category_name}
                              </option>
                            ))
                          : null}
                      </select>
                      {formik.errors.category ? (
                        <div className="text-red-500">
                          {formik.errors.category}
                        </div>
                      ) : null}

                      <label>Product Image</label>

                      <input
                        className="border w-full mb-2 p-3 rounded"
                        type="file"
                        onChange={productimage}
                      />
                      {!isproduct_loading && (
                        <button className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4">
                          Save
                        </button>
                      )}
                      {isproduct_loading && (
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
                {isVarient && !isPorduct && !isGallery && (
                  <div className="shadow-lg p-8">
                    <h1 className="font-bold	mb-4 font-serif">
                      Select Variations
                    </h1>
                    {row.map((data) => {
                      return (
                        <div className="grid grid-cols-4 gap-4">
                          <select className="border w-full mb-2 p-3 rounded typeclass">
                            <option value="null">Select Type</option>
                            <option value="Size">Size</option>
                            <option value="Color">Color</option>
                            {/* <option value="Ram">Ram</option>
                            <option value="Storage">Storage</option>
                            <option value="Display Size">Display Size</option> */}
                          </select>
                          <select className="border w-full mb-2 p-3 rounded valueclass">
                            <option value="null">Select Value</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="X">X</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>

                            <option value="Red">Red</option>
                            <option value="Blue">Blue</option>
                            <option value="White">White</option>
                            <option value="Pink">Pink</option>
                            <option value="Orange">Orange</option>
                            <option value="Yellow">Yellow</option>
                            <option value="Green">Green</option>
                          </select>
                          <input
                            className="border w-full mb-2 p-3 rounded priceclass"
                            placeholder="Price"
                          />
                          <input
                            className="border w-full mb-2 p-3 rounded stockclass"
                            placeholder="Stock"
                          />

                          <div className="flex">
                            <Avatar
                              className="bg-black-1000 mr-4"
                              onClick={deleterow}
                            >
                              -
                            </Avatar>
                            <Avatar
                              className="bg-black-1000 "
                              onClick={addcount}
                            >
                              +
                            </Avatar>
                          </div>
                        </div>
                      );
                    })}

                    {!isvarient_loading && (
                      <button
                        onClick={VariationsSaveHandler}
                        className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
                      >
                        Save
                      </button>
                    )}
                    {isvarient_loading && (
                      <LoadingButton
                        className="rounded bg-white-400	text-white-1000 w-full p-3 mt-4"
                        loading
                      >
                        Submit
                      </LoadingButton>
                    )}
                  </div>
                )}
                {isGallery && !isVarient && !isPorduct && (
                  <div className="shadow-lg p-8">
                    <h1 className="font-bold	mb-4 font-serif">Gallery</h1>
                    <label>Product Image</label>
                    <input
                      className="border w-full mb-2 p-3 rounded"
                      type="file"
                      id="galleryimg"
                      multiple
                    />
                    {!isGalleryLoading && (
                      <button
                        className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
                        onClick={savegallery}
                      >
                        Save
                      </button>
                    )}
                    {isGalleryLoading && (
                      <LoadingButton
                        className="rounded bg-white-400	text-white-1000 w-full p-3 mt-4"
                        loading
                      >
                        Submit
                      </LoadingButton>
                    )}
                  </div>
                )}
              </>
            )}

            {!isNew && !isEdit && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <input
                      className="border p-2"
                      placeholder="Search For Product"
                      id="searchproduct"
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
                  <div className="flex items-center ">
                    <select
                      className="mr-4 border p-3"
                      name="category"
                      onChange={getcategory}
                    >
                      <option>Select category</option>
                      {allcategorydata.length !== 0
                        ? allcategorydata.map((data, index) => (
                            <option key={index} value={data.category_name}>
                              {data.category_name}
                            </option>
                          ))
                        : null}
                    </select>
                    <div>
                      {isFeatured === true ? (
                        <input type="checkbox" onChange={getfeatured} checked />
                      ) : (
                        <input type="checkbox" onChange={getfeatured} />
                      )}

                      <label className="ml-2">Featured Products</label>
                    </div>
                  </div>
                </div>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 640 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-md text-black-800 font-bold">
                            Product Name
                          </TableCell>
                          <TableCell className="text-md text-black-800 font-bold">
                            Product Description
                          </TableCell>
                          <TableCell className="text-md text-black-800 font-bold">
                            Product Slug
                          </TableCell>
                          <TableCell className="text-md text-black-800 font-bold">
                            Price
                          </TableCell>
                          <TableCell className="text-md text-black-800 font-bold">
                            Sale Price
                          </TableCell>
                          <TableCell className="text-md text-black-800 font-bold">
                            Featured
                          </TableCell>
                          <TableCell className="text-md text-black-800 font-bold">
                            Actions
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
                                  {" "}
                                  <div className="flex items-center">
                                    <Avatar src={row.original} />

                                    <p className="ml-2">{row.name}</p>
                                  </div>
                                </TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.slug}</TableCell>
                                <TableCell>{row.price}</TableCell>
                                <TableCell>{row.sale_price}</TableCell>
                                <TableCell>
                                  {row.featured !== "true" ? (
                                    <span id={row.id} onClick={AddFeature}>
                                      <FavoriteBorderIcon
                                        id={row.id}
                                        onClick={AddFeature}
                                      />
                                    </span>
                                  ) : (
                                    <span id={row.id} onClick={RemoveFeature}>
                                      {" "}
                                      <FavoriteIcon
                                        id={row.id}
                                        onClick={RemoveFeature}
                                      />
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <button
                                    onClick={editHandler}
                                    className="border px-5 py-2 hover:bg-white-400"
                                  >
                                    Edit
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
            {isEdit && !isNew && (
              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="">
                  <div className="flex flex-col items-start">
                    <h1 className="mb-3 tracking-wider font-thin text-sm">
                      PRODUCT IMAGE
                    </h1>
                    <img
                      className="Edit_image"
                      src="https://images.pexels.com/photos/12737613/pexels-photo-12737613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    />
                    <h1 className="mt-8 mb-3 tracking-wider font-thin text-sm">
                      THUMBNAIL IMAGE
                    </h1>
                    <img
                      className="Edit_image_thumbnail"
                      src="https://images.pexels.com/photos/12737613/pexels-photo-12737613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    />
                  </div>
                </div>
                <div className="col-span-2 ">
                  <>
                    <div className="shadow-lg p-8">
                      <h1 className="font-bold	mb-4 font-serif">
                        About Your Product
                      </h1>
                      <form>
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="What’s your product name?"
                          type="text"
                          name="name"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.name}
                        />
                        {formik.errors.name ? (
                          <div className="text-red-500">
                            {formik.errors.name}
                          </div>
                        ) : null}
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Product Description "
                          type="text"
                          name="description"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.description}
                        />
                        {formik.errors.description ? (
                          <div className="text-red-500">
                            {formik.errors.description}
                          </div>
                        ) : null}
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Slug"
                          type="text"
                          name="slug"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.slug}
                        />
                        {formik.errors.slug ? (
                          <div className="text-red-500">
                            {formik.errors.slug}
                          </div>
                        ) : null}
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Price"
                          type="text"
                          name="price"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.price}
                        />
                        {formik.errors.price ? (
                          <div className="text-red-500">
                            {formik.errors.price}
                          </div>
                        ) : null}
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Sale Price"
                          type="text"
                          name="sale_price"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.sale_price}
                        />
                        {formik.errors.sale_price ? (
                          <div className="text-red-500">
                            {formik.errors.sale_price}
                          </div>
                        ) : null}
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Stock"
                          type="text"
                          name="stock"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.stock}
                        />
                        {formik.errors.stock ? (
                          <div className="text-red-500">
                            {formik.errors.stock}
                          </div>
                        ) : null}
                        <select
                          className="border w-full mb-2 p-3 rounded"
                          name="category"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.category}
                        >
                          <option>Select category</option>
                          {allcategorydata.length !== 0
                            ? allcategorydata.map((data, index) => (
                                <option key={index} value={data.id}>
                                  {data.category_name}
                                </option>
                              ))
                            : null}
                        </select>
                        {formik.errors.category ? (
                          <div className="text-red-500">
                            {formik.errors.category}
                          </div>
                        ) : null}

                        <label>Product Image</label>

                        <input
                          className="border w-full mb-2 p-3 rounded"
                          type="file"
                          onChange={productimage}
                        />
                        <div>
                          <h1>Variations</h1>
                          <div className="grid grid-cols-5 gap-8 ">
                            <div className="flex border justify-between px-4 py-2 rounded-lg items-center">
                              <p> Free </p>
                              <Avatar
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  padding: "8px",
                                  backgroundColor: "red",
                                }}
                              >
                                <p>x</p>
                              </Avatar>
                            </div>
                            <div className="flex border justify-between px-4 py-2 rounded-lg items-center">
                              <p> xxxl </p>
                              <Avatar
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  padding: "8px",
                                  backgroundColor: "red",
                                }}
                              >
                                <p>x</p>
                              </Avatar>
                            </div>
                            <div className="flex border justify-between px-4 py-2 rounded-lg items-center">
                              <p> xxl </p>
                              <Avatar
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  padding: "8px",
                                  backgroundColor: "red",
                                }}
                              >
                                <p>x</p>
                              </Avatar>
                            </div>
                            <div className="flex border justify-between px-4 py-2 rounded-lg items-center">
                              <p> xl </p>
                              <Avatar
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  padding: "8px",
                                  backgroundColor: "red",
                                }}
                              >
                                <p>x</p>
                              </Avatar>
                            </div>
                          </div>
                        </div>

                        <button className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4">
                          Save
                        </button>
                      </form>
                    </div>
                  </>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Products_;
