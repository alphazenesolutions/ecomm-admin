/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Lora", "serif"],
      },
      colors: {
        white: {
          1000: "#ffffff",
          400: "#d0cdcdf1",
        },
        black: {
          1000: "black",
          500: "#212527",
        },
      },
      yellow: {
        500: "#FFCC01",
      },
      blue_: {
        1000: "#1C1468",
      },
    },
  },
  plugins: [],
};

// import React, { useState } from "react";
// import Sidebar_ from "./Sidebar_";
// import dynamic from "next/dynamic";
// import { DragDropContext } from "react-beautiful-dnd";
// import PropTypes from "prop-types";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// const Column = dynamic(() => import("../components/src/Column"), {
//   ssr: false,
// });

// const reorderColumnList = (sourceCol, startIndex, endIndex) => {
//   const newTaskIds = Array.from(sourceCol.taskIds);
//   const [removed] = newTaskIds.splice(startIndex, 1);
//   newTaskIds.splice(endIndex, 0, removed);

//   const newColumn = {
//     ...sourceCol,
//     taskIds: newTaskIds,
//   };

//   return newColumn;
// };
// const MyStore_ = () => {
//   const [state, setState] = useState(initialData);

//   const onDragEnd = (result) => {
//     const { destination, source } = result;

//     // If user tries to drop in an unknown destination
//     if (!destination) return;

//     // if the user drags and drops back in the same position
//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     ) {
//       return;
//     }

//     // If the user drops within the same column but in a different positoin
//     const sourceCol = state.columns[source.droppableId];
//     const destinationCol = state.columns[destination.droppableId];

//     if (sourceCol.id === destinationCol.id) {
//       const newColumn = reorderColumnList(
//         sourceCol,
//         source.index,
//         destination.index
//       );

//       const newState = {
//         ...state,
//         columns: {
//           ...state.columns,
//           [newColumn.id]: newColumn,
//         },
//       };
//       setState(newState);
//       return;
//     }

//     // If the user moves from one column to another
//     const startTaskIds = Array.from(sourceCol.taskIds);
//     const [removed] = startTaskIds.splice(source.index, 1);
//     const newStartCol = {
//       ...sourceCol,
//       taskIds: startTaskIds,
//     };

//     const endTaskIds = Array.from(destinationCol.taskIds);
//     endTaskIds.splice(destination.index, 0, removed);
//     const newEndCol = {
//       ...destinationCol,
//       taskIds: endTaskIds,
//     };

//     const newState = {
//       ...state,
//       columns: {
//         ...state.columns,
//         [newStartCol.id]: newStartCol,
//         [newEndCol.id]: newEndCol,
//       },
//     };

//     setState(newState);
//   };
//   //
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <div>
//       <div className="flex ">
//         <Sidebar_ />
//         <Box sx={{ width: "100%", padding: "10px" }}>
//           <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//             <Tabs
//               value={value}
//               onChange={handleChange}
//               aria-label="basic tabs example"
//             >
//               <Tab
//                 label="Home Sections
// "
//                 {...a11yProps(0)}
//               />
//               <Tab label="Cover Image" {...a11yProps(1)} />
//               <Tab label="Item Three" {...a11yProps(2)} />
//             </Tabs>
//           </Box>
//           <TabPanel value={value} index={0}>
//             <div className=" MyStore_container">
//               <div>
//                 <DragDropContext onDragEnd={onDragEnd}>
//                   <div>
//                     <div>
//                       <h1 className="font-bold text-1xl	mb-4 ">
//                         Drag and Drop as per your order
//                       </h1>
//                       {/* <p>Drag and Drop as per your order</p> */}
//                     </div>

//                     <div
//                       className="flex justify-center gap-4
//                 "
//                     >
//                       {state.columnOrder.map((columnId) => {
//                         const column = state.columns[columnId];
//                         const tasks = column.taskIds.map(
//                           (taskId) => state.tasks[taskId]
//                         );

//                         return (
//                           <Column
//                             key={column.id}
//                             column={column}
//                             tasks={tasks}
//                           />
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </DragDropContext>
//                 <button
//                   className="float-right border py-2 px-8 mt-4 mr-8 "
//                   style={{ backgroundColor: "#1C1468", color: "white" }}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </TabPanel>
//           <TabPanel value={value} index={1}>
//             Item Two
//           </TabPanel>
//           <TabPanel value={value} index={2}>
//             Item Three
//           </TabPanel>
//         </Box>
//       </div>
//     </div>
//   );
// };

// export default MyStore_;

// const initialData = {
//   tasks: {
//     1: { id: 1, content: "Configure Next.js application" },
//     2: { id: 2, content: "Configure Next.js and tailwind " },
//     3: { id: 3, content: "Create sidebar navigation menu" },
//     4: { id: 4, content: "Create page footer" },
//     5: { id: 5, content: "Create page navigation menu" },
//     6: { id: 6, content: "Create page layout" },
//   },
//   columns: {
//     "column-1": {
//       id: "column-1",
//       title: "Available Sections",
//       taskIds: [1, 2, 3, 4, 5, 6],
//     },
//     "column-2": {
//       id: "column-2",
//       title: "Selected Sections",
//       taskIds: [],
//     },
//   },
//   // Facilitate reordering of the columns
//   columnOrder: ["column-1", "column-2"],
// };
