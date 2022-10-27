import React, { useEffect, useState } from "react";
import Sidebar_ from "./Sidebar_";
import Nav_ from "./Nav_";
import dynamic from "next/dynamic";

import { DragDropContext } from "react-beautiful-dnd";
import { Allcategory } from "../Api/Category";
import { Allcategorytype } from "../Api/CategoryType";
import { Allproduct } from "../Api/Product";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  createNavbar,
  SingleNav,
  updateNavbar,
  deletenavbar,
} from "../Api/Navbar";

const Column = dynamic(() => import("../components/src1/Column"), {
  ssr: false,
});

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  };

  return newColumn;
};
const data = () => {
  // Total Category

  return {
    tasks: {
      1: { id: 1, content: "Configure Next.js application" },
      2: { id: 2, content: "Configure Next.js and tailwind " },
      3: { id: 3, content: "Create sidebar navigation menu" },
      4: { id: 4, content: "Create page footer" },
      5: { id: 5, content: "Create page navigation menu" },
      6: { id: 6, content: "Create page layout" },
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: "Available Sections",
        taskIds: [1, 2, 3, 4, 5, 6],
      },
      "column-2": {
        id: "column-2",
        title: "Selected Sections",
        taskIds: [],
      },
    },
    columnOrder: ["column-1", "column-2"],
  };
};

const Menu_ = () => {
  var dataa = data();
  const [state, setState] = useState(dataa);
  const [checkcatid, setcheckcatid] = useState(null);
  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      var orderlist = [];
      for (var i = 0; i < newColumn.taskIds.length; i++) {
        for (var j = 0; j < state.task.length; j++) {
          if (Number(newColumn.taskIds[i]) === Number(j)) {
            orderlist.push(state.task[j]);
          }
        }
      }
      setState(newState);
      if (orderlist.toString().length !== 0) {
        var data = {
          id: checkcatid,
          categories: orderlist.toString(),
        };
        await updateNavbar(data);
      } else {
        var data = {
          id: checkcatid,
          categories: null,
        };
        await updateNavbar(data);
      }

      return;
    }

    // If the user moves from one column to another
    const startTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };
    var Selectedlistorder = Object.entries(newState.columns)[1][1].taskIds;
    var orderlist = [];
    for (var i = 0; i < Selectedlistorder.length; i++) {
      for (var j = 0; j < state.task.length; j++) {
        if (Number(Selectedlistorder[i]) === Number(j)) {
          orderlist.push(state.task[j]);
        }
      }
    }
    setState(newState);
    if (orderlist.toString().length !== 0) {
      var data = {
        id: checkcatid,
        categories: orderlist.toString(),
      };
      await updateNavbar(data);
    } else {
      var data = {
        id: checkcatid,
        categories: null,
      };
      await updateNavbar(data);
    }
  };
  const [categorytype, setcategorytype] = React.useState([]);
  const [category, setcategory] = React.useState([]);
  const [product, setproduct] = React.useState([]);
  const [categoryName, setcategoryName] = React.useState([]);

  useEffect(() => {
    getalldata();
  }, []);
  const getalldata = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var allcategory = await Allcategory();
    var categorytype = await Allcategorytype();
    var allproduct = await Allproduct();
    var category_names = [];
    categorytype.data.map((data) => {
      category_names.push(data.name);
    });
    setcategoryName(category_names);
    setcategorytype(categorytype.data);
    setproduct(allproduct.data);
    setcategory(allcategory.data);
    var mynavlist = await SingleNav({ id: store_id });
    if (mynavlist.data.length !== 0) {
      setrows(mynavlist.data);
    }
  };

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

  const [navid, setnavid] = React.useState(null);
  const [singlenavdata, setsinglenavdata] = React.useState([]);
  const addnav = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var name = document.getElementById("categoryname").value;
    if (name.length !== 0) {
      var data = {
        name: name,
        store: store_id,
      };
      await createNavbar(data);
      getalldata();
      document.getElementById("categoryname").value = "";
    } else {
      toast.error("Menu Name Required...", {
        autoClose: 5000,
        transition: Slide,
      });
    }
  };
  const editbtn = async (e) => {
    var checknav = await rows.filter((data) => {
      return data.id === Number(e.target.id);
    });
    if (checknav.length !== 0) {
      document.getElementById("categoryname").value = checknav[0].name;
      setnavid(checknav[0].id);
    }
  };
  const updatebtn = async () => {
    var name = document.getElementById("categoryname").value;
    if (name.length !== 0) {
      var data = {
        name: name,
        id: navid,
      };
      await updateNavbar(data);
      getalldata();
      setnavid(null);
      document.getElementById("categoryname").value = "";
    } else {
      toast.error("Menu Name Required...", {
        autoClose: 5000,
        transition: Slide,
      });
    }
  };

  const deltebtnvalue = async (e) => {
    await deletenavbar({ id: e.target.id });
    getalldata();
  };
  const [isnav, setisnav] = useState(true);
  const Navigate_nav = () => {
    setisnav(true);
    setiscategory(false);
    window.location.reload();
  };
  const [iscategory, setiscategory] = useState(false);
  const Navigate_category = () => {
    setisnav(false);
    setiscategory(true);
  };
  const viewcate = async (e) => {
    var store_id = sessionStorage.getItem("store_id");
    var allcategory = await Allcategory();
    var mycat = await allcategory.data.filter((data) => {
      return data.store === store_id;
    });
    var checknav = await rows.filter((data) => {
      return data.id === Number(e.target.id);
    });
    if (checknav.length !== 0) {
      if (
        checknav[0].categories === null ||
        checknav[0].categories.length === 0
      ) {
        setcheckcatid(checknav[0].id);
        setsinglenavdata(checknav);
        setisnav(false);
        setiscategory(true);
        var catelist = [],
          idlist = [],
          namelist = [];
        for (var i = 0; i < mycat.length; i++) {
          catelist.push({
            id: i + 1,
            content: mycat[i].category_name,
          });
          idlist.push(i);
          namelist.push(mycat[i].category_name);
        }
        const initialData = {
          tasks: catelist,
          columns: {
            "column-1": {
              id: "column-1",
              title: "Available Sections",
              taskIds: idlist,
            },
            "column-2": {
              id: "column-2",
              title: checknav[0].name,
              taskIds: [],
            },
          },
          // Facilitate reordering of the columns
          columnOrder: ["column-1", "column-2"],
          task: namelist,
        };
        setState(initialData);
      } else {
        var checkdata = checknav[0].categories.split(",");
        setcheckcatid(checknav[0].id);
        setsinglenavdata(checknav);
        setisnav(false);
        setiscategory(true);
        var catelist = [],
          idlist = [],
          namelist = [];
        for (var i = 0; i < mycat.length; i++) {
          catelist.push({
            id: i + 1,
            content: mycat[i].category_name,
          });
          idlist.push(i);
          namelist.push(mycat[i].category_name);
        }
        var result = namelist.filter((val) => !checkdata.includes(val));
        var availablelistnew = [],
          bookedlistnew = [];
        for (var a = 0; a < namelist.length; a++) {
          for (var b = 0; b < result.length; b++) {
            if (namelist[a] === result[b]) {
              availablelistnew.push(a);
            }
          }
        }
        for (var a = 0; a < namelist.length; a++) {
          for (var b = 0; b < checkdata.length; b++) {
            if (namelist[a] === checkdata[b]) {
              bookedlistnew.push(a);
            }
          }
        }
        const initialData = {
          tasks: catelist,
          columns: {
            "column-1": {
              id: "column-1",
              title: "Available Sections",
              taskIds: availablelistnew,
            },
            "column-2": {
              id: "column-2",
              title: checknav[0].name,
              taskIds: bookedlistnew,
            },
          },
          // Facilitate reordering of the columns
          columnOrder: ["column-1", "column-2"],
          task: namelist,
        };
        setState(initialData);
      }
    }
  };
  return (
    <div className="flex ">
      <Sidebar_ />
      <div>
        <Nav_ />
        <div className="p-8 Products">
          <div className="flex mb-8">
            <h1
              onClick={Navigate_nav}
              className="font-bold text-1xl mr-4 border px-4 py-2"
            >
              Navbar Sections
            </h1>
            {/* <h1
              onClick={Navigate_category}
              className="font-bold text-1xl mr-4 border px-4 py-2"
            >
              Navbar Category
            </h1> */}
          </div>
          <div>
            {isnav && !iscategory && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="shadow-lg p-8">
                    <h1 className="font-bold	mb-4">About Your Navbar</h1>

                    <input
                      className="border w-full mb-2 p-3 rounded"
                      placeholder="What’s your Section name?"
                      id="categoryname"
                    />
                    {navid === null ? (
                      <button
                        className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
                        onClick={addnav}
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        className="rounded bg-black-500	text-white-1000 w-full p-3 mt-4"
                        onClick={updatebtn}
                      >
                        Update
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between"></div>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                      <TableContainer sx={{ maxHeight: 640 }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell className="text-md text-black-800 font-bold">
                                Navbar Section
                              </TableCell>
                              <TableCell
                                align="center"
                                className="text-md text-black-800 font-bold"
                              >
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
                                    {/* <TableCell>{row.categorygender}</TableCell> */}
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell align="center">
                                      {" "}
                                      <div className="flex justify-center">
                                        <button
                                          className="bg-green-500 w-16 text-white-1000 p-2 mr-2"
                                          id={row.id}
                                          onClick={editbtn}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          className="bg-red-500 w-16 text-white-1000 ml-2 p-2"
                                          id={row.id}
                                          onClick={deltebtnvalue}
                                        >
                                          Delete
                                        </button>
                                        <button
                                          className="bg-red-500 w-16 text-white-1000 ml-2 p-2"
                                          id={row.id}
                                          onClick={viewcate}
                                        >
                                          Category
                                        </button>
                                      </div>
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
            )}
            {!isnav && iscategory && (
              <DragDropContext onDragEnd={onDragEnd}>
                <div>
                  <div>
                    <p>Drag and Drop as per your Category</p>
                  </div>

                  <div
                    className="flex  gap-4	mt-12 justify-center
                "
                  >
                    {state.columnOrder.map((columnId) => {
                      const column = state.columns[columnId];
                      const tasks = column.taskIds.map(
                        (taskId) => state.tasks[taskId]
                      );

                      return (
                        <Column key={column.id} column={column} tasks={tasks} />
                      );
                    })}
                  </div>
                </div>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu_;
