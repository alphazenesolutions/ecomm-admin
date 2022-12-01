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
import { Cancelorder } from "../Api/User";
import Nav_ from "./Nav_";
import * as XLSX from "xlsx";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { Avatar } from "@mui/material";
import moment from "moment/moment";
const Cancelorder_ = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setrows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    getalldata();
  }, []);
  const getalldata = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var myorderdata = await Cancelorder({ id: store_id });
    setrows(myorderdata);
  };
  const exportoption = () => {
    var exportdata = [];
    for (var i = 0; i < rows.length; i++) {
      exportdata.push({
        S_no: i + 1,
        Product_Name: rows[i].product.name,
        User_name: `${rows[i].user.name} ${
          rows[i].user.lastname === null ? "" : rows[i].user.lastname
        }`,
        Email: rows[i].user.email,
        Phone: rows[i].user.phone,
        Product_Image: rows[i].product.original,
        Quantity: rows[i].order.Quantity,
        price: rows[i].order.price,
        Category: rows[i].product.category,
        type: rows[i].variation.type,
        value: rows[i].variation.value,
        status: rows[i].order.status,
      });
    }
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(exportdata);
    XLSX.utils.book_append_sheet(wb, ws, "Order List");
    XLSX.writeFile(wb, "cancelorder.xlsx");
  };
  // drawer
  const drawerWidth = 450;

  const [open, setOpen] = React.useState(false);

  const [singleorder, setsingleorder] = React.useState([]);

  const handleDrawerOpen = async (e) => {
    var checkorder = await rows.filter((data) => {
      return data.order.id == e.target.id;
    });
    setsingleorder(checkorder);
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <div className="flex ">
      <Sidebar_ />
      <div>
        <Nav_ />
        <div className="col-span-2 p-8 Products">
          <div className="flex ">
            <h1 className=" p-3 mr-4 mb-4 ">Cancel Orders</h1>
            {rows.length !== 0 ? (
              <button
                className="rounded bg-black-500 text-white-1000 p-3 m-2 float-right"
                onClick={exportoption}
              >
                Export
              </button>
            ) : (
              <button
                className="rounded bg-black-500 text-white-1000 p-3 m-2 float-right"
                disabled
              >
                Export
              </button>
            )}
          </div>
          <div>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 640 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-md text-black-800 font-bold">
                        S.No
                      </TableCell>
                      <TableCell className="text-md text-black-800 font-bold">
                        User Name
                      </TableCell>
                      <TableCell className="text-md text-black-800 font-bold">
                        Product Name
                      </TableCell>
                      <TableCell className="text-md text-black-800 font-bold">
                        Quantity
                      </TableCell>
                      <TableCell className="text-md text-black-800 font-bold">
                        Price
                      </TableCell>
                      <TableCell className="text-md text-black-800 font-bold">
                        Product Type
                      </TableCell>
                      <TableCell className="text-md text-black-800 font-bold">
                        Status
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
                            onClick={handleDrawerOpen}
                          >
                            <TableCell id={row.order.id}>{index + 1}</TableCell>
                            <TableCell id={row.order.id}>
                              {row.user.name}
                            </TableCell>
                            <TableCell id={row.order.id}>
                              {row.product.name}
                            </TableCell>
                            <TableCell id={row.order.id}>
                              {row.order.Quantity}
                            </TableCell>
                            <TableCell id={row.order.id}>
                              {row.order.price}
                            </TableCell>
                            <TableCell id={row.order.id}>
                              {row.variation.type} -
                              {row.variation.type == "Color" ? (
                                <span
                                  className="border "
                                  style={{
                                    backgroundColor: `${row.variation.value}`,
                                    padding: "2px 10px",
                                    width: "10px",
                                  }}
                                ></span>
                              ) : (
                                row.variation.value
                              )}
                            </TableCell>
                            <TableCell id={row.order.id}>
                              {row.order.status}
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
        </div>
      </div>
      <Drawer
        sx={{
          width: 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
        className="Drawer__"
      >
        <div>
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </div>
        {singleorder.length !== 0 ? (
          <div className="Drawer_">
            <div className="Drawer_Head">
              <h1>PRODUCT</h1>
              <div className="drawer_product">
                <img src={singleorder[0].product.original} />
                <h1>{singleorder[0].product.name}</h1>
                <p>{singleorder[0].product.description}</p>
              </div>
            </div>
            <hr />
            <div className="Drawer_content">
              <h4>
                <b>CUSTOMER DETAILS</b>
              </h4>
              <div className="Drawer_customer">
                <div className="Drawer_customer_info">
                  <h1>{singleorder[0].address.name}</h1>
                  <p>{singleorder[0].address.phone}</p>
                  <p>{singleorder[0].address.city}</p>
                </div>
              </div>
            </div>
            <div className="Drawer_content">
              <h4>
                <b>CUSTOMER ADDRESS</b>
              </h4>
              <div className="Drawer_customer">
                <div className="Drawer_customer_info">
                  <p>
                    {singleorder[0].address.address},{" "}
                    {singleorder[0].address.city},{singleorder[0].address.state}
                    , {singleorder[0].address.country},
                    {singleorder[0].address.pincode}
                    <br />
                    {singleorder[0].address.landmark}
                  </p>
                </div>
              </div>
            </div>
            <hr />
            <div className="Drawer_footer">
              <h1>DETAILS</h1>
              <div className="Drawer_footer_table">
                <div className="Drawer_footer_detail">
                  <h1>Qty</h1>
                  <h1>{singleorder[0].order.Quantity}</h1>
                </div>
                <div className="Drawer_footer_detail">
                  <h1>{singleorder[0].variation.type}</h1>
                  <h1>
                    {singleorder[0].variation.type == "Color" ? (
                      <p
                        className="border "
                        style={{
                          backgroundColor: `${singleorder[0].variation.value}`,
                          padding: "10px",
                        }}
                      ></p>
                    ) : (
                      singleorder[0].variation.value
                    )}
                  </h1>
                </div>
                <div className="Drawer_footer_detail">
                  <h1>Ordered on</h1>
                  <h1>
                    {moment(singleorder[0].order.createdAt).format("MMM Do YY")}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
};

export default Cancelorder_;
