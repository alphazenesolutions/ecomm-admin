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
import { Allusers } from "../Api/User";

const Users_ = () => {
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
    var alluser = await Allusers();
    if (alluser.data.length !== 0) {
      var storeuser = await alluser.data.filter((data) => {
        return data.store == store_id && data.type == "customer";
      });
      setrows(storeuser);
    }
  };
  const vieworder = (e) => {
    sessionStorage.setItem("viewuser", e.target.id);
    window.location.replace("/Userorder");
  };
  return (
    <div className="flex ">
      <Sidebar_ />
      <div className="col-span-2 p-8 Products">
        <div className="flex ">
          <h1 className=" p-3 mr-4 mb-4 ">All Users</h1>
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
                      Email
                    </TableCell>
                    <TableCell className="text-md text-black-800 font-bold">
                      Phone
                    </TableCell>
                    <TableCell className="text-md text-black-800 font-bold">
                      Phone
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.phone}</TableCell>
                          <TableCell>
                            <button
                              className="rounded bg-black-500 text-white-1000 p-3 m-2"
                              id={row.user_id}
                              onClick={vieworder}
                            >
                              View Order
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
      </div>
    </div>
  );
};

export default Users_;
