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
import {
  CreateVariation,
  viewVariation,
  destroyVariation,
} from "../Api/Variation";
import { CreateGallery, viewGallery, destroyGallery } from "../Api/Gallery";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import slugify from "slugify";
import Nav_ from "./Nav_";
import LoadingButton from "@mui/lab/LoadingButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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
  const [errorlist, seterrorlist] = useState(null);

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
    // setisvarient_loading(true);
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

    var facilitystyle4 = document.getElementsByClassName("stockclass");
    var checkedValue4 = [];
    for (var i = 0; facilitystyle4[i]; ++i) {
      checkedValue4.push(facilitystyle4[i].value);
    }
    for (var i = 0; i < checkedValue1.length; i++) {
      var data = {
        productID: productid,
        value: checkedValue1[i],
        type: isSize === true ? "Size" : "Color",
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
    var text = (Math.random() + 1).toString(36).substring(7);
    const errors = {};
    var slugvalue = slugify(values.name, "_").toLowerCase().concat("_",text);
    document.getElementById("slugdata").value = slugvalue.toLowerCase();
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
      const errors = {};
      if (!values.name) {
        errors.name = "Name Required";
      }
      if (!values.description) {
        errors.description = "Description Required";
      }
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
      seterrorlist(errors);
      if (Object.keys(errors).length === 0) {
        if (productimg === null) {
          setisproduct_loading(false);
          toast.error("Please Upload Product Image", {
            autoClose: 5000,
            transition: Slide,
          });
        } else {
          var text = (Math.random() + 1).toString(36).substring(7);
          setisproduct_loading(true);
          var store_id = sessionStorage.getItem("store_id");
          values["original"] = productimg;
          values["store"] = store_id;
          values["slug"] = slugify(values.name, "_").toLowerCase().concat("_",text);
          var creteproduct = await CreateProduct(values);
          if (creteproduct.message === "SUCCESS") {
            setisproduct_loading(false);
            toast.success("Product Added Successfully..", {
              autoClose: 5000,
              transition: Slide,
            });
            setisVarient(true);
            setisPorduct(false);
            setisGallery(false);
            setproductid(creteproduct.data.id);
          }
        }
      }
    },
  });

  const productimage = async (e) => {
    let file = e.target.files;
    if (file[0].size / 1024 / 1024 > 3) {
      toast.info("Image size is too large!.. Image must be within 3 MB", {
        autoClose: 5000,
        transition: Slide,
      });
    } else {
      toast.info("Please Wait Image is uploading...", {
        autoClose: 5000,
        transition: Slide,
      });
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
      var img = new Image();
      img.src = imgurl1;

      img.onload = async function () {
        let width = this.width;
        let height = this.height;
        if (
          width <= 4500 &&
          width >= 4000 &&
          height <= 6500 &&
          height >= 6000
        ) {
          setproductimg(imgurl1);
          toast.success("Image Uploaded...", {
            autoClose: 5000,
            transition: Slide,
          });
        } else {
          toast.error("Image height should be within 6500 px..", {
            autoClose: 2000,
            transition: Slide,
          });
          toast.error("Image Width should be within 4500 px..", {
            autoClose: 2000,
            transition: Slide,
          });
        }
      };
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
  // edit_new_varient
  const [count_1, setcount_1] = useState(1);
  const [row_1, setrow_1] = useState([undefined]);

  const addcount_1 = () => {
    var finalcount = Number(count_1) + Number(1);
    setcount_1(finalcount);
    var data = [];
    var countnew = finalcount;
    for (var i = 0; i < countnew; i++) {
      data.push(countnew[i]);
    }
    setrow_1(data);
  };
  const deleterow_1 = () => {
    var finalcount = Number(count_1) - Number(1);
    setcount_1(finalcount);
    var data = [];
    var countnew = finalcount;
    for (var i = 0; i < countnew; i++) {
      data.push(countnew[i]);
    }
    setrow_1(data);
  };
  const savegallery = async () => {
    var galleryimg = document.getElementById("galleryimg").files;
    var galleryimgarray = [];
    if (galleryimg.length !== 0) {
      setisGalleryLoading(true);
      toast.info("Please Wait Image is uploading...", {
        autoClose: 5000,
        transition: Slide,
      });
      for (var i = 0; i < galleryimg.length; i++) {
        if (galleryimg[i].size / 1024 / 1024 > 10) {
          toast.info("Image size is too large!.. Image must be within 3 MB", {
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
          var img = new Image();
          img.src = imgurl1;
          img.onload = async function () {
            let width = this.width;
            let height = this.height;
            if (
              width <= 4500 &&
              width >= 4000 &&
              height <= 6500 &&
              height >= 6000
            ) {
              galleryimgarray.push(imgurl1);
            } else {
              toast.error("Image height should be within 6500 px..", {
                autoClose: 2000,
                transition: Slide,
              });
              toast.error("Image Width should be within 4500 px..", {
                autoClose: 2000,
                transition: Slide,
              });
            }
          };
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
  const [editproductid, seteditproductid] = useState(null);
  const [productcate, setproductcate] = useState(null);
  const [productimgedit, setproductimgedit] = useState(null);
  const [editgallerydata, seteditgallerydata] = useState([]);

  const editHandler = async (e) => {
    var singleproduct = await rows.filter((data) => {
      return data.id === Number(e.target.id);
    });
    if (singleproduct.length !== 0) {
      seteditproductid(e.target.id);
      setisEdit(true);
      setisNew(false);
      setTimeout(() => {
        document.getElementById("editproduct").value = singleproduct[0].name;
        document.getElementById("editdescription").value =
          singleproduct[0].description;
        document.getElementById("editslug").value = singleproduct[0].slug;
        document.getElementById("editprice").value = singleproduct[0].price;
        document.getElementById("editsaleprice").value =
          singleproduct[0].sale_price;
        document.getElementById("editstock").value = singleproduct[0].stock;
        setproductcate(singleproduct[0].category);
        setproductimgedit(singleproduct[0].original);
      }, 2000);
      var myvariation = await viewVariation({ id: e.target.id });
      setrow_1(myvariation);
      setcount_1(myvariation.length);
      setTimeout(() => {
        if (myvariation.length !== 0) {
          for (var i = 0; i < myvariation.length; i++) {
            document.getElementById(`pricevariation${i}`).value =
              myvariation[i].price;
            document.getElementById(`stockvariation${i}`).value =
              myvariation[i].stock;
            document.getElementById(`typevariation${i}`).value =
              myvariation[i].type;
            document.getElementById(`valuevariation${i}`).value =
              myvariation[i].value;
          }
        }
      }, 2000);
      var mygallery = await viewGallery({ id: e.target.id });
      seteditgallerydata(mygallery);
    }
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
  // add gallery
  const upload_handler = () => {
    document.getElementById("file_upload").click();
    setTimeout(() => {
      getimageurl();
    }, 3000);
  };
  const getimageurl = async () => {
    var images = document.getElementById("file_upload").files;
    if (images.length !== 0) {
      for (var i = 0; i < images.length; i++) {
        let file = images[i];
        if (file.size / 1024 / 1024 > 3) {
          toast.info("Image size is too large!.. Image must be within 3 MB", {
            autoClose: 5000,
            transition: Slide,
          });
        } else {
          let file13 = new Promise((resolve, reject) => {
            var storageRef = firebase.storage().ref("gallery/" + file.name);
            storageRef.put(file).then(function (snapshot) {
              storageRef.getDownloadURL().then(function (url) {
                //img download link ah ketakiradhu
                setTimeout(() => resolve(url), 1000);
              });
            });
          });
          var imgurl1 = await file13;
          var img = new Image();
          img.src = imgurl1;
          img.onload = async function () {
            let width = this.width;
            let height = this.height;

            if (
              width <= 6500 &&
              width >= 6000 &&
              height <= 2300 &&
              height >= 1900
            ) {
              var data = {
                original: imgurl1,
                productID: editproductid,
              };
              CreateGallery(data);
              setTimeout(async () => {
                var mygallery = await viewGallery({ id: editproductid });
                seteditgallerydata(mygallery);
              }, 2000);
            } else {
              toast.error("Image height should be within 6500 px..", {
                autoClose: 2000,
                transition: Slide,
              });
              toast.error("Image Width should be within 2300 px..", {
                autoClose: 2000,
                transition: Slide,
              });
            }
          };
        }
      }
    }
  };
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
    setproductimgedit(imgurl1);
  };
  const updatebtn = async () => {
    var name = document.getElementById("editproduct").value;
    var description = document.getElementById("editdescription").value;
    var slug = document.getElementById("editslug").value;
    var price = document.getElementById("editprice").value;
    var salesprice = document.getElementById("editsaleprice").value;
    var stock = document.getElementById("editstock").value;
    var category = document.getElementById("editcategory").value;

    var newdata = {
      description: description,
      slug: slug,
      name: name,
      original: productimgedit,
      price: price,
      sale_price: salesprice,
      category: category,
      stock: stock,
      id: editproductid,
    };
    var updateproduct = await Updateproduct(newdata);
    var facilitystyle1 = document.getElementsByClassName("valueclassedit");
    var checkedValue1 = [];
    for (var i = 0; facilitystyle1[i]; ++i) {
      checkedValue1.push(facilitystyle1[i].value);
    }
    var facilitystyle2 = document.getElementsByClassName("priceclassedit");
    var checkedValue2 = [];
    for (var i = 0; facilitystyle2[i]; ++i) {
      checkedValue2.push(facilitystyle2[i].value);
    }
    var facilitystyle3 = document.getElementsByClassName("typeclassedit");
    var checkedValue3 = [];
    for (var i = 0; facilitystyle3[i]; ++i) {
      checkedValue3.push(facilitystyle3[i].value);
    }

    var facilitystyle4 = document.getElementsByClassName("stockclassedit");
    var checkedValue4 = [];
    for (var i = 0; facilitystyle4[i]; ++i) {
      checkedValue4.push(facilitystyle4[i].value);
    }
    var myvariation = await viewVariation({ id: editproductid });
    if (myvariation.length !== 0) {
      for (var i = 0; i < myvariation.length; i++) {
        destroyVariation({ id: myvariation[i].id });
      }
    }
    for (var i = 0; i < checkedValue1.length; i++) {
      var data = {
        productID: editproductid,
        value: checkedValue1[i],
        type: checkedValue3[i],
        price: checkedValue2[i],
        stock: checkedValue4[i],
      };
      CreateVariation(data);
      setTimeout(() => {
        getalldata();
        setisNew(false);
        setisEdit(false);
      }, 2000);
    }
  };
  const deltegallery = async (e) => {
    destroyGallery({ id: e.target.id });
    setTimeout(async () => {
      toast.success("Gallery Delected successfully...", {
        autoClose: 2000,
        transition: Slide,
      });
      var mygallery = await viewGallery({ id: editproductid });
      seteditgallerydata(mygallery);
    }, 2000);
  };
  // isSize && iscolor
  const [isSize, setisSize] = useState(false);
  const [isColor, setisColor] = useState(true);
  const Nav_Size = () => {
    setisSize(true);
    setisColor(false);
  };
  const Nav_color = () => {
    setisSize(false);
    setisColor(true);
  };
  // edit_new_varient
  const [count_2, setcount_2] = useState(1);
  const [row_2, setrow_2] = useState([undefined]);

  const addcount_2 = () => {
    var finalcount = Number(count_2) + Number(1);
    setcount_2(finalcount);
    var data = [];
    var countnew = finalcount;
    for (var i = 0; i < countnew; i++) {
      data.push(countnew[i]);
    }
    setrow_2(data);
  };
  const deleterow_2 = () => {
    var finalcount = Number(count_2) - Number(1);
    setcount_2(finalcount);
    var data = [];
    var countnew = finalcount;
    for (var i = 0; i < countnew; i++) {
      data.push(countnew[i]);
    }
    setrow_2(data);
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
                      {errorlist !== null ? (
                        <div className="text-red-500">{errorlist.name}</div>
                      ) : null}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Product Description "
                        type="text"
                        name="description"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.description}
                      />
                      {errorlist !== null ? (
                        <div className="text-red-500">
                          {errorlist.description}
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

                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Price"
                        type="text"
                        name="price"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.price}
                      />
                      {errorlist !== null ? (
                        <div className="text-red-500">{errorlist.price}</div>
                      ) : null}
                      <input
                        className="border w-full mb-2 p-3 rounded"
                        placeholder="Sale Price"
                        type="text"
                        name="sale_price"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.sale_price}
                      />
                      {errorlist !== null ? (
                        <div className="text-red-500">
                          {errorlist.sale_price}
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
                      {errorlist !== null ? (
                        <div className="text-red-500">{errorlist.stock}</div>
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
                      {errorlist !== null ? (
                        <div className="text-red-500">{errorlist.category}</div>
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
                    <div>
                      {isColor === true ? (
                        <button
                          onClick={Nav_color}
                          className="border mr-4 w-20 mb-2 bg-black-500 text-white-1000"
                        >
                          Colors
                        </button>
                      ) : (
                        <button
                          onClick={Nav_color}
                          className="border mr-4 w-20 mb-2"
                        >
                          Colors
                        </button>
                      )}
                      {isSize === true ? (
                        <button
                          onClick={Nav_Size}
                          className="border  w-20 mb-2 bg-black-500 text-white-1000"
                        >
                          Size
                        </button>
                      ) : (
                        <button
                          onClick={Nav_Size}
                          className="border  w-20 mb-2"
                        >
                          Size
                        </button>
                      )}
                    </div>
                    {isColor && (
                      <>
                        {row.map((data) => {
                          return (
                            <div className="grid grid-cols-4 gap-4">
                              {/* <select className="border w-full mb-2 p-3 rounded typeclass">
                            <option value="null">Select Type</option>
                            <option value="Size">Size</option>
                            <option value="Color">Color</option>
                          </select> */}

                              <input
                                type="color"
                                className="border w-full mb-2 p-3 h-12 rounded valueclass"
                              />

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
                      </>
                    )}
                    {isSize && (
                      <>
                        {row_2.map((data) => {
                          return (
                            <div className="grid grid-cols-4 gap-4">
                              {/* <select className="border w-full mb-2 p-3 rounded typeclass">
                            <option value="null">Select Type</option>
                            <option value="Size">Size</option>
                            <option value="Color">Color</option>
                          </select> */}

                              <select className="border w-full mb-2 p-3 rounded valueclass">
                                <option value="null">Select Value</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="X">X</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
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
                                  onClick={deleterow_2}
                                >
                                  -
                                </Avatar>
                                <Avatar
                                  className="bg-black-1000 "
                                  onClick={addcount_2}
                                >
                                  +
                                </Avatar>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}

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
                                    id={row.id}
                                    onClick={editHandler}
                                    className=" px-5 py-2"
                                  >
                                    <p id={row.id} onClick={editHandler}>
                                      <EditIcon
                                        id={row.id}
                                        onClick={editHandler}
                                      />
                                    </p>
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
                    <img className="Edit_image" src={productimgedit} />
                  </div>
                </div>
                <div className="col-span-2 ">
                  <>
                    <div className="shadow-lg p-8">
                      <h1 className="font-bold	mb-4 font-serif">
                        About Your Product
                      </h1>
                      <div>
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="What’s your product name edit?"
                          type="text"
                          id="editproduct"
                        />

                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Product Description "
                          type="text"
                          name="description"
                          id="editdescription"
                        />

                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Slug"
                          type="text"
                          name="slug"
                          id="editslug"
                        />

                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Price"
                          type="text"
                          name="price"
                          id="editprice"
                        />

                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Sale Price"
                          type="text"
                          name="sale_price"
                          id="editsaleprice"
                        />
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          placeholder="Stock"
                          type="text"
                          name="stock"
                          id="editstock"
                        />
                        <select
                          className="border w-full mb-2 p-3 rounded"
                          name="category"
                          id="editcategory"
                        >
                          <option>Select category</option>
                          {allcategorydata.length !== 0
                            ? allcategorydata.map((data, index) =>
                                productcate === data.category_name ? (
                                  <option
                                    key={index}
                                    value={data.category_name}
                                    selected
                                  >
                                    {data.category_name}
                                  </option>
                                ) : (
                                  <option
                                    key={index}
                                    value={data.category_name}
                                  >
                                    {data.category_name}
                                  </option>
                                )
                              )
                            : null}
                        </select>
                        <label>Product Image</label>
                        <input
                          className="border w-full mb-2 p-3 rounded"
                          type="file"
                          onChange={geturl}
                        />
                        <div>
                          <h1 className="font-bold	mb-4 font-serif">
                            Select Variations
                          </h1>
                          {row_1.map((data, index) => {
                            return (
                              <div className="grid grid-cols-5 gap-4">
                                <select
                                  className="border w-full mb-2 p-3 rounded typeclassedit"
                                  id={`typevariation${index}`}
                                >
                                  <option value="null">Select Type</option>
                                  <option value="Size">Size</option>
                                  <option value="Color">Color</option>
                                </select>
                                <select
                                  className="border w-full mb-2 p-3 rounded valueclassedit"
                                  id={`valuevariation${index}`}
                                >
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
                                  className="border w-full mb-2 p-3 rounded priceclassedit"
                                  placeholder="Price"
                                  id={`pricevariation${index}`}
                                />
                                <input
                                  className="border w-full mb-2 p-3 rounded stockclassedit"
                                  placeholder="Stock"
                                  id={`stockvariation${index}`}
                                />

                                <div className="flex">
                                  <Avatar
                                    className="bg-black-1000 mr-4"
                                    onClick={deleterow_1}
                                  >
                                    -
                                  </Avatar>
                                  <Avatar
                                    className="bg-black-1000 "
                                    onClick={addcount_1}
                                  >
                                    +
                                  </Avatar>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div>
                          <h1 className="font-bold	mb-4 font-serif">Gallery</h1>
                          <input
                            type="file"
                            className="border p-2"
                            id="file_upload"
                            style={{ visibility: "hidden" }}
                            multiple
                          />
                          <button
                            className="float-right mr-4"
                            onClick={upload_handler}
                          >
                            <AddCircleIcon />
                          </button>
                          <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            <TableContainer sx={{ maxHeight: 640 }}>
                              <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell className="text-md text-black-800 font-bold">
                                      S.No
                                    </TableCell>
                                    <TableCell className="text-md text-black-800 font-bold">
                                      Image
                                    </TableCell>
                                    <TableCell className="text-md text-black-800 font-bold">
                                      Action
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {editgallerydata.length !== 0
                                    ? editgallerydata.map((data, index) => (
                                        <TableRow
                                          hover
                                          role="checkbox"
                                          tabIndex={-1}
                                          key={index}
                                        >
                                          <TableCell>{index + 1}</TableCell>
                                          <TableCell>
                                            {" "}
                                            <div className="flex items-center">
                                              <img
                                                src={data.original}
                                                style={{
                                                  width: "50px",
                                                  height: "50px",
                                                }}
                                              />
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <button className="px-5 py-2">
                                              <p>
                                                <DeleteIcon
                                                  id={data.id}
                                                  onClick={deltegallery}
                                                />
                                              </p>
                                            </button>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    : null}
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
                        <button
                          className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
                          onClick={updatebtn}
                        >
                          Update
                        </button>
                      </div>
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
