import React, { useEffect, useState } from "react";
import Sidebar_ from "./Sidebar_";
import dynamic from "next/dynamic";
import { DragDropContext } from "react-beautiful-dnd";
import Nav_ from "./Nav_";
import { allTheme } from "../Api/Theme";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { firebase } from "../database/firebase";
import DeleteIcon from "@mui/icons-material/Delete";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";
import { Avatar } from "@mui/material";

import { CreateCoverimg, allCoverimg, DeleteCoverimg } from "../Api/Coverimg";
import {
  createNavbar,
  SingleNav,
  updateNavbar,
  deletenavbar,
} from "../Api/Navbar";
import {
  UpdateUserelements,
  ViewElements,
  CreateUserelements,
} from "../Api/Userelements";
import { SingleStore, UpdateStore } from "../Api/Store";

const Column = dynamic(() => import("../components/src/Column"), {
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
const MyStore_ = () => {
  const [state, setState] = useState(initialData);
  const [userid, setuserid] = useState(null);
  const [userelementslist, setuserelementslist] = useState([]);

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
      setState(newState);
      var orderlistresult = [];
      var Selectedlistorder = Object.entries(newState.columns)[1][1].taskIds;
      for (var i = 0; i < Selectedlistorder.length; i++) {
        for (var j = 0; j < state.list.length; j++) {
          if (state.list[j].id === Selectedlistorder[i]) {
            orderlistresult.push(state.list[j].content);
          }
        }
      }
      if (userelementslist.length !== 0) {
        var data = {
          user_id: userid,
          element_list: orderlistresult.toString(),
          id: userelementslist[0].id,
        };
        await UpdateUserelements(data);
      } else {
        var data = {
          user_id: userid,
          element_list: orderlistresult.toString(),
        };
        await CreateUserelements(data);
        // getalldata();
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
    var orderlistresult = [];
    var Selectedlistorder = Object.entries(newState.columns)[1][1].taskIds;
    for (var i = 0; i < Selectedlistorder.length; i++) {
      for (var j = 0; j < state.list.length; j++) {
        if (state.list[j].id === Selectedlistorder[i]) {
          orderlistresult.push(state.list[j].content);
        }
      }
    }
    setState(newState);
    if (userelementslist.length !== 0) {
      var data = {
        user_id: userid,
        element_list: orderlistresult.toString(),
        id: userelementslist[0].id,
      };
      await UpdateUserelements(data);
    } else {
      var data = {
        user_id: userid,
        element_list: orderlistresult.toString(),
      };
      await CreateUserelements(data);
      // getalldata();
    }
  };
  //
  const [isHomeSection, setisHomeSection] = useState(false);
  const sectionNavigate = () => {
    setisHomeSection(true);
    sethomecover(false);
    setisNavBarSection(false);
    setisAbout(false);
  };
  const [homecover, sethomecover] = useState(true);
  const [isUpload, setisUpload] = useState(false);
  const coverNavigate = () => {
    setisHomeSection(false);
    sethomecover(true);
    setisNavBarSection(false);
    setisAbout(false);
  };

  // Nav bar Sections
  const [isNavBarSection, setisNavBarSection] = useState(false);
  const NavBarHandler = () => {
    setisHomeSection(false);
    sethomecover(false);
    setisNavBarSection(true);
    setisAbout(false);
  };

  const [rows, setrows] = React.useState([]);
  const [coverimg, setcoverimg] = React.useState([]);

  useEffect(() => {
    getalldata();
    getThemedata();
    getuserdata();
  }, []);
  const getalldata = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var userid = sessionStorage.getItem("user_id");
    setuserid(userid);
    var allimg = await allCoverimg();
    if (allimg.length !== 0) {
      var checkcover = await allimg.filter((data) => {
        return data.store == store_id;
      });
      setcoverimg(checkcover);
    }
    var myelement = await ViewElements({ id: userid });
    if (myelement.data.length !== 0) {
      setuserelementslist(myelement.data);
      var orderlist = myelement.data[0].element_list.split(",");
      var availablelist = [];
      for (var i = 0; i < orderlist.length; i++) {
        for (var j = 0; j < state.list.length; j++) {
          if (state.list[j].content === orderlist[i]) {
            availablelist.push(state.list[j].id);
          }
        }
      }
      var result = [1, 2, 3, 4].filter((val) => !availablelist.includes(val));

      const initialData = {
        tasks: {
          1: { id: 1, content: "Latest Product" },
          2: { id: 2, content: "Featured Products" },
          3: { id: 3, content: "Journal" },
          4: { id: 4, content: "Review" },
        },
        columns: {
          "column-1": {
            id: "column-1",
            title: "",
            taskIds: result,
          },
          "column-2": {
            id: "column-2",
            title: "",
            taskIds: availablelist,
          },
        },
        // Facilitate reordering of the columns
        columnOrder: ["column-1", "column-2"],

        list: [
          { id: 1, content: "Latest" },
          { id: 2, content: "Featured_products" },
          { id: 3, content: "Journal" },
          { id: 4, content: "Review" },
        ],
      };
      setState(initialData);
    }
    var mynavlist = await SingleNav({ id: store_id });
    if (mynavlist.data.length !== 0) [setrows(mynavlist.data)];
  };
  const deltebtn = async (e) => {
    var deltebtn = await DeleteCoverimg({ id: e.target.id });
    if (deltebtn === "Deleted Successfully") {
      getalldata();
    }
  };

  const [storeid, setstoreid] = useState("null");
  const getuserdata = async () => {
    var user_id = sessionStorage.getItem("user_id");
    if (user_id !== null) {
      var mystore = await SingleStore({ id: user_id });
      if (mystore.data.length !== 0) {
        setstoreid(mystore.data[0].id);
      }
    } else {
      setstoreid(null);
    }
  };
  const [selectedtheme, setselectedtheme] = useState(null);

  const selecttheme = (e) => {
    setselectedtheme(e.target.id);
  };
  const [alltheme_data, setalltheme_data] = useState([]);

  const getThemedata = async () => {
    var all_Theme = await allTheme();
    setalltheme_data(all_Theme);
  };
  const themeHandler = async () => {
    const updatedStore_ = await UpdateStore({
      id: storeid,
      theme: selectedtheme,
    });
    if (updatedStore_.message == "Updated Successfully") {
      toast.success(updatedStore_.message, {
        autoClose: 2000,
        transition: Slide,
      });
    }
  };
  // isAbout
  const [isAbout, setisAbout] = useState(false);
  const navAbout = () => {
    setisAbout(true);
    setisHomeSection(false);
    sethomecover(false);
    setisNavBarSection(false);
  };
  // file upload
  const upload_handler = () => {
    document.getElementById("file_upload").click();
  };
  const savebtnnew = async () => {
    var images = document.getElementById("file_upload").files;
    var store_id = sessionStorage.getItem("store_id");
    if (images.length !== 0) {
      toast.info("Please Wait...", {
        autoClose: 5000,
        transition: Slide,
      });
      for (var i = 0; i < images.length; i++) {
        let file = images[i];
        if (file.size / 1024 / 1024 > 2) {
          toast.info("Image size is too large!.. Image must be within 2 MB", {
            autoClose: 5000,
            transition: Slide,
          });
        } else {
          let file13 = new Promise((resolve, reject) => {
            var storageRef = firebase.storage().ref("journal/" + file.name);
            storageRef.put(file).then(function (snapshot) {
              storageRef.getDownloadURL().then(function (url) {
                //img download link ah ketakiradhu
                setTimeout(() => resolve(url), 1000);
              });
            });
          });
          var imgurl1 = await file13;
          var data = {
            image: imgurl1,
            store: store_id,
          };
          var createimg = await CreateCoverimg(data);
          if (createimg.message === "SUCCESS") {
            getalldata();
          }
        }
      }
    } else {
      toast.error("Please Select Image...", {
        autoClose: 5000,
        transition: Slide,
      });
    }
  };
  return (
    <div>
      <div className="flex ">
        <Sidebar_ />
        <div className="MyStore__ mx-4 ">
          <Nav_ />
          <div className=" MyStore_container">
            <h1 className="text-2xl mb-4">Theme Settings</h1>
            <div className="Theme_setting">
              <div className="flex flex-col Theme_setting_nav">
                <h1
                  onClick={coverNavigate}
                  className="text-1xl mr-4 text-white-1000 mb-2 mt-2"
                >
                  Cover Settings
                </h1>
                <h1
                  onClick={NavBarHandler}
                  className="text-1xl mr-4 text-white-1000 mb-2 mt-2"
                >
                  Theme Settings
                </h1>
                <h1
                  onClick={sectionNavigate}
                  className="text-1xl mr-4 text-white-1000 mb-2 mt-2"
                >
                  Layout Settings
                </h1>
                <h1
                  onClick={navAbout}
                  className="text-1xl mr-4 text-white-1000 mb-2 mt-2"
                >
                  About Us
                </h1>
              </div>
              <div>
                {isHomeSection && !homecover && !isNavBarSection && !isAbout && (
                  <div className="Home_section_ mt-4 px-16 mt-10">
                    <h1 className="text-2xl mb-1">Homepage Layout Settings</h1>
                    <p className="mb-4 mt-1">
                      Drag and drop to enable and disable section you want
                    </p>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <div>
                        <div
                          className="grid grid-cols-2 gap-48	 
                "
                        >
                          {state.columnOrder.map((columnId, i) => {
                            const column = state.columns[columnId];
                            const tasks = column.taskIds.map(
                              (taskId) => state.tasks[taskId]
                            );
                            return (
                              <div className={i != 0 ? "Sections" : " "}>
                                {i != 0 && (
                                  <div>
                                    <center>
                                      <h1>Fields you can include</h1>
                                    </center>
                                  </div>
                                )}
                                <Column
                                  key={column.id}
                                  column={column}
                                  tasks={tasks}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </DragDropContext>
                  </div>
                )}
                {!isHomeSection && homecover && !isNavBarSection && !isAbout && (
                  <div className="mt-4 px-16 mt-10">
                    <h1 className="text-2xl mb-2">Cover Settings</h1>
                    <p>
                      Upload the cover image what you want to display in
                      homepage
                    </p>

                    <div className="home_cover_container">
                      <Swiper
                        spaceBetween={30}
                        pagination={{
                          clickable: true,
                        }}
                        autoplay={{
                          delay: 2500,
                          disableOnInteraction: false,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                      >
                        {coverimg.length !== 0 ? (
                          coverimg.map((data, index) => (
                            <SwiperSlide key={index}>
                              {" "}
                              <div className="CoverImg">
                                <Avatar className="HomeCoverDelete">
                                  <DeleteIcon
                                    style={{ fontSize: "17px" }}
                                    id={data.id}
                                    onClick={deltebtn}
                                  />
                                </Avatar>

                                <img src={data.image} />
                              </div>
                            </SwiperSlide>
                          ))
                        ) : (
                          <SwiperSlide>
                            {" "}
                            <div className="CoverImg_upload">
                              {/* {!isUpload && (
                                <button className="border py-2 px-4">
                                  Upload
                                </button>
                              )} */}
                              {!isUpload && (
                                <input
                                  type="file"
                                  className="border p-2"
                                  // onChange={geturl}
                                  id="file_upload"
                                  style={{ visibility: "hidden" }}
                                  multiple
                                />
                              )}
                              <div className="flex flex-col items-center justify-center CoverImg_upload_avatar_container">
                                <Avatar
                                  onClick={upload_handler}
                                  // onClick={uploadHandler}
                                  className="CoverImg_upload_avatar"
                                >
                                  <p className="text-bold">+</p>
                                </Avatar>
                                <p className="mt-2 text-black-1000 font-bold">
                                  Add New
                                </p>
                              </div>
                            </div>
                          </SwiperSlide>
                        )}
                      </Swiper>
                    </div>
                    {coverimg.length !== 0 && (
                      <>
                        <input
                          type="file"
                          className="border p-2"
                          // onChange={geturl}
                          id="file_upload"
                          style={{ visibility: "hidden" }}
                          multiple
                        />
                        <button
                          onClick={upload_handler}
                          className="float-left mt-8 bg-black-1000 w-32 text-white-1000 py-2 rounded"
                        >
                          Add New
                        </button>
                      </>
                    )}
                    <button
                      className="float-right mt-8 bg-black-1000 w-32 text-white-1000 py-2 rounded"
                      onClick={savebtnnew}
                    >
                      Save
                    </button>
                  </div>
                )}
                {!isHomeSection && !homecover && isNavBarSection && !isAbout && (
                  <div className="mt-4 px-16 mt-10">
                    <div className="Stepper_container_1 MyStore_Theme">
                      <h1 className="text-2xl"> Theme Settings </h1>
                      <p className="my-1">
                        Choose a the theme of your website.
                      </p>
                      <div className="theme_head">
                        <div className="Theme">
                          <div className="Themes MyStore_Images">
                            {alltheme_data.length != 0 && (
                              <>
                                {alltheme_data.map((data) => {
                                  return (
                                    <div>
                                      {selectedtheme == data.name && (
                                        <img
                                          className="active_img"
                                          src={data.thumbnail}
                                          alt=""
                                          id={data.name}
                                          onClick={selecttheme}
                                        />
                                      )}
                                      {selectedtheme != data.name && (
                                        <img
                                          src={data.thumbnail}
                                          alt=""
                                          id={data.name}
                                          onClick={selecttheme}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="float-right mt-2 bg-black-1000 w-32 text-white-1000 py-2 rounded"
                      onClick={themeHandler}
                    >
                      Save
                    </button>
                  </div>
                )}
                {!isHomeSection && !homecover && !isNavBarSection && isAbout && (
                  <div className="mt-4 px-16 mt-10">
                    <div className="Stepper_container_1 MyStore_Theme">
                      <h1 className="text-2xl">About Us</h1>
                      <p>Fill the details to be shown in your about section</p>
                      <div className="mt-4 flex flex-col items-start">
                        <div className="flex flex-col my-1 items-start">
                          <label>Who we are ?</label>
                          <textarea
                            className="border rounded"
                            cols={71}
                            rows={3}
                          />
                        </div>
                        <div className="flex flex-col my-1 items-start">
                          <label>Our Milestone</label>
                          <textarea
                            className="border rounded"
                            cols={71}
                            rows={3}
                          />
                        </div>
                        <div className="flex flex-col my-1 items-start">
                          <label>Our Vission</label>
                          <textarea
                            className="border rounded"
                            cols={71}
                            rows={3}
                          />
                        </div>
                        <div className="flex flex-col my-1 items-start">
                          <label>Why choose us </label>
                          <textarea
                            className="border rounded"
                            cols={71}
                            rows={3}
                          />
                        </div>
                        <div className="flex">
                          <div className=" mx-2 flex flex-col my-1 items-start">
                            <label>Our Instagram</label>
                            <input className=" border rounded w-full p-2" />
                          </div>
                          <div className=" mx-2 flex flex-col my-1 items-start">
                            <label>Our Facebook</label>
                            <input className=" border rounded w-full p-2" />
                          </div>
                          <div className=" mx-2 flex flex-col my-1 items-start">
                            <label>Our Twitter</label>
                            <input className=" border rounded w-full p-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="float-right mt-2 bg-black-1000 w-32 text-white-1000 py-2 rounded">
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyStore_;

const initialData = {
  tasks: {
    1: { id: 1, content: "Latest Product" },
    2: { id: 2, content: "Featured Products" },
    3: { id: 3, content: "Journal" },
    4: { id: 4, content: "Review" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Available Sections",
      taskIds: [1, 2, 3, 4],
    },
    "column-2": {
      id: "column-2",
      title: "Selected Sections",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2"],

  list: [
    { id: 1, content: "Latest" },
    { id: 2, content: "Featured_products" },
    { id: 3, content: "Journal" },
    { id: 4, content: "Review" },
  ],
};
