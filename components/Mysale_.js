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
import { AllOrders } from "../Api/Orders";
import { Myorder, Myorder_store } from "../Api/User";
import Nav_ from "./Nav_";

const Mysale_ = () => {
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
    var allorder_ = await AllOrders();
    var allorder = allorder_.data.filter((data) => {
      return data.store == store_id;
    });
    if (allorder.length !== 0) {
      for (var i = 0; i < allorder.length; i++) {
        var myorderdata = await Myorder_store({ id: store_id });
        setrows(myorderdata);
      }
    }
  };
  return (
    <div className="flex ">
      <Sidebar_ />
      <div>
        <Nav_ />
        <div className="col-span-2 p-8 Products">
          <div className="flex ">
            <h1 className=" p-3 mr-4 mb-4 ">All Orders</h1>
          </div>
          <div>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 640 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
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
                          >
                            <TableCell>{row.user.name}</TableCell>
                            <TableCell>{row.product.name}</TableCell>
                            <TableCell>{row.order.Quantity}</TableCell>
                            <TableCell>{row.order.price}</TableCell>
                            <TableCell>
                              {row.variation.type} - {row.variation.value}
                            </TableCell>
                            <TableCell>{row.order.status}</TableCell>
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
    </div>
  );
};

export default Mysale_;
