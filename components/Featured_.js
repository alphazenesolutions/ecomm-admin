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
import classes from "../styles/Featured_products.module.css";
import { Avatar } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Allcategory, categoryproduct } from "../Api/Category";
import { Singleproduct } from '../Api/Product';

const Featured_ = () => {
  // dummy
  const [rows, setrows] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
  const [rows_1, setrows_1] = useState([1, 2, 3]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page_1, setPage_1] = React.useState(0);
  const [rowsPerPage_1, setRowsPerPage_1] = React.useState(10);
  const [maincategory, setmaincategory] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage_1 = (event, newPage) => {
    setPage_1(newPage);
  };

  const handleChangeRowsPerPage_1 = (event) => {
    setRowsPerPage_1(+event.target.value);
    setPage_1(0);
  };
  //   isNew
  const [isNew, setisNew] = useState(false);

  const AddFeaturedProduct = () => {
    setisNew(true);
  };
  // filter Options2
  const [checked2, setChecked2] = useState([]);
  const [checkedid2, setcheckedi2] = useState([]);
  const [selectedproductlist, setselectedproductlist] = useState([]);
  //   checkBox
  const handleCheck2 =async (event) => {
    var updatedList2 = [...checked2];
    var chechList2 = [...checkedid2];
    if (event.target.checked) {
      updatedList2 = [...checked2, event.target.value];
      chechList2 = [...checkedid2, event.target.id];
    } else {
      updatedList2.splice(checked2.indexOf(event.target.value), 1);
      chechList2.splice(checkedid2.indexOf(event.target.id), 1);
    }
    setcheckedi2(chechList2);
    if (updatedList2.length !== 0) {
      var checkedprouct=[]
      for (var i = 0; i < updatedList2.length; i++){
        var singleproduct = await Singleproduct({ id: updatedList2[i] })
        checkedprouct.push(singleproduct.data[0])
      }
      setselectedproductlist(checkedprouct);
    }
    setChecked2(updatedList2);
  };
  useEffect(() => {
    getalldata();
  }, []);
  const getalldata = async () => {
    var allcategorytype = await Allcategory();
    if (allcategorytype.data.length !== 0) {
      var filterproduct = [];
      for (var i = 0; i < allcategorytype.data.length; i++) {
        var cateproduct = await categoryproduct({
          id: allcategorytype.data[i].id,
        });
        filterproduct.push({
          category: allcategorytype.data[i],
          product: cateproduct.data,
        });
      }
      setmaincategory(filterproduct);
    }
  };
  const getcategory = (e) => {};
  return (
    <div className="flex w-full ">
      <Sidebar_ />
      <div className="col-span-2 p-8 Products">
        <div className="flex items-center justify-between mb-4">
          <h1 className="mb-4">Featured Products</h1>
          <button
            className="border hover:bg-white-400 p-2"
            onClick={AddFeaturedProduct}
          >
            Add New
          </button>
        </div>
        <div>
          {!isNew && (
            <Paper sx={{ width: "100%" }}>
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
                          <TableRow hover role="checkbox" tabIndex={-1}>
                            <TableCell>
                              {" "}
                              <div className="flex items-center">
                                <Avatar src="https://images.pexels.com/photos/8881954/pexels-photo-8881954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                                <p className="ml-4">Name</p>
                              </div>
                            </TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Sale Price</TableCell>
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
          )}
          {isNew && (
            <div className={classes.New_Featured}>
              <div className="">
                {maincategory.length !== 0
                  ? maincategory.map((data, index) => (
                      <Accordion key={index}>
                        <AccordionSummary
                          id={data.id}
                          onClick={getcategory}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          // id="panel1a-header"
                        >
                          <Typography>{data.category.category_name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div>
                            {data.product.length !== 0
                              ? data.product.map((datanew, index) => (
                                  <div className="flex items-center mb-2" key={index}>
                                    <input
                                      onChange={handleCheck2}
                                      type="checkbox"
                                      className="mr-4"
                                      value={datanew.id}
                                    />
                                    <label>{datanew.name}</label>
                                  </div>
                                ))
                              : null}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  : null}
              </div>
              <div>
                <button className="border hover:bg-white-400 py-1 px-3 mb-2 float-right">
                  Save
                </button>
                <Paper sx={{ width: "100%" }}>
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedproductlist
                          .slice(
                            page_1 * rowsPerPage_1,
                            page_1 * rowsPerPage_1 + rowsPerPage_1
                          )
                          .map((row, index) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1}>
                                <TableCell>
                                  {" "}
                                  <div className="flex items-center">
                                    <Avatar src={row.original} />
                                    <p className="ml-4">{row.name}</p>
                                  </div>
                                </TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.slug}</TableCell>
                                <TableCell>{row.price}</TableCell>
                                <TableCell>{row.sale_price}</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows_1.length}
                    rowsPerPage={rowsPerPage_1}
                    page={page_1}
                    onPageChange={handleChangePage_1}
                    onRowsPerPageChange={handleChangeRowsPerPage_1}
                  />
                </Paper>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Featured_;
