import React, { useEffect, useState } from "react";
import Sidebar_ from "./Sidebar_";
import TodayIcon from "@mui/icons-material/Today";
import Nav_ from "./Nav_.js";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { Avatar } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DoneIcon from "@mui/icons-material/Done";
import ReactEcharts from "echarts-for-react";
import { AllOrders } from "../Api/Orders";
import moment from "moment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Myorder_store } from "../Api/User";
import { Singleproduct } from "../Api/Product";
// import ApexCharts from "apexcharts";
import Chart from "chart.js";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const Dashboard_ = () => {
  const [validuserlist, setvaliduserlist] = useState(10);
  const [invaliduserlist, setinvaliduserlist] = useState(20);
  const [latestorder, setlatestorder] = useState([]);
  const [thismonthearn, setthismonthearn] = useState(0);
  const [thistodayeran, setthistodayeran] = useState(0);
  const [thistotalearn, setthistotalearn] = useState(0);
  const [totalorder, settotalorder] = useState(0);
  const [pendingorder, setpendingorder] = useState(0);
  const [processingorder, setprocessingorder] = useState(0);
  const [completedorder, setcompletedorder] = useState(0);
  const [chartdate, setchartdate] = useState([]);
  const [chartdata, setchartdata] = useState([]);
  const [chartorder, setchartorder] = useState([]);
  const [bestproduct, setbestproduct] = useState([]);

  const getOption = () => ({
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    series: [
      {
        name: "Data",
        type: "pie",
        radius: "55%",
        center: ["50%", "50%"],
        animationDuration: 5000,
        data: bestproduct,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
  useEffect(() => {
    getalldata();
    getallnewdata();
  }, []);
  const getalldata = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var allorder_ = await AllOrders();
    var allorder = allorder_.data.filter((data) => {
      return data.store == store_id;
    });
    if (allorder.length !== 0) {
      settotalorder(allorder.length);
      var monthearn = [],
        todayearn = [],
        totaleran = [],
        pendingorder = [],
        processingorder = [],
        completedorder = [];
      var month = moment().format("MM");
      var today = moment().format("DD-MM-YYYY");
      for (var i = 0; i < allorder.length; i++) {
        if (moment(allorder[i].createdAt).format("MM") === month) {
          monthearn.push(Number(allorder[i].price));
        }
        if (moment(allorder[i].createdAt).format("DD-MM-YYYY") === today) {
          todayearn.push(Number(allorder[i].price));
        }
        totaleran.push(Number(allorder[i].price));
        if (allorder[i].status === "Booked") {
          pendingorder.push(allorder[i]);
        }
        if (allorder[i].status === "Processing") {
          processingorder.push(allorder[i]);
        }
        if (allorder[i].status === "Completed") {
          completedorder.push(allorder[i]);
        }
      }
      setcompletedorder(completedorder.length);
      setprocessingorder(processingorder.length);
      setpendingorder(pendingorder.length);
      const monthearntotal = monthearn.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
      const todayearntotal = todayearn.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
      const totalerantotal = totaleran.reduce(
        (partialSum, a) => partialSum + a,
        0
      );

      setthismonthearn(monthearntotal);
      setthistodayeran(todayearntotal);
      setthistotalearn(totalerantotal);
      var myorderdata = await Myorder_store({ id: store_id });
      if (myorderdata.length !== 0) {
        const sortedDates = myorderdata.sort(
          (A, B) => new Date(B.order.createdAt) - new Date(A.order.createdAt)
        );
        setrows(sortedDates);
      }
    }
  };
  const getallnewdata = async () => {
    var store_id = sessionStorage.getItem("store_id");
    var allorder_ = await AllOrders();
    var allorder = allorder_.data.filter((data) => {
      return data.store == store_id;
    });
    const sortedDates = allorder.filter((data) => {
      return (
        data.status == "Cancel" &&
        moment(data.createdAt).format("DD-MM-YYYY") ===
          moment().format("DD-MM-YYYY")
      );
    });
    var finaldatanew = [];
    for (var i = 0; i < sortedDates.length; i++) {
      // eslint-disable-next-line no-loop-func
      var singleusernew = await alluser.data.filter((data) => {
        return data.userid === sortedDates[i].userid;
      });
      finaldatanew.push({
        order: sortedDates[i],
        info: singleusernew[0],
      });
    }
    setlatestorder(finaldatanew);
    const farmatdates = [...Array(7).keys()].map((index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      return date;
    });
    const sortedDatesnew = farmatdates.sort(
      (A, B) => new Date(A) - new Date(B)
    );
    var dateformat = [],
      earnings = [],
      ordercount = [];
    for (var a = 0; a < sortedDatesnew.length; a++) {
      var dateone = moment(sortedDatesnew[a]).format("DD-MM-YYYY");
      // eslint-disable-next-line no-loop-func
      var singleorder = await allorder.filter((data) => {
        return moment(data.createdAt).format("DD-MM-YYYY") === dateone;
      });
      ordercount.push(singleorder.length);
      earnings.push(singleorder);
      dateformat.push(moment(sortedDatesnew[a]).format("DD-MM-YYYY"));
    }
    var productorderlist = [];
    for (var b = 0; b < allorder.length; b++) {
      productorderlist.push(allorder[b].product_id);
    }
    var finalarray = [];
    const data = productorderlist;
    const result = data.reduce(
      (a, c) => a.set(c, (a.get(c) || 0) + 1),
      new Map()
    );
    finalarray.push(...result);
    if (finalarray.length !== 0) {
      var finalproductfilter = [];
      for (var j = 0; j < finalarray.length; j++) {
        var singleproduct = await Singleproduct({ id: finalarray[j][0] });
        finalproductfilter.push({
          value: finalarray[j][1],
          name: singleproduct.data[0].name,
        });
      }
      setbestproduct(finalproductfilter);
    }

    var alllist = [];
    for (var b = 0; b < earnings.length; b++) {
      if (earnings[b].length !== 0) {
        var allpricenew = [];
        for (var c = 0; c < earnings[b].length; c++) {
          allpricenew.push(Number(earnings[b][c].price));
        }
        const todaysum = allpricenew.reduce(
          (partialSum, a) => partialSum + a,
          0
        );
        alllist.push(todaysum);
      } else {
        alllist.push(0);
      }
    }
    setchartdate(dateformat);
    setchartdata(alllist);
    setchartorder(ordercount);
  };
  // Recent orders
  const [rows, setrows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // charts
  const [series, setseries] = useState([
    {
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
  ]);
  const [options, setoptions] = useState({
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Product Trends by Month",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  });
  // chart - 2
  React.useEffect(() => {
    var config = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: "#3182ce",
            borderColor: "#3182ce",
            data: [65, 78, 66, 44, 56, 67, 75],
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Sales Charts",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
                fontColor: "white",
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
                fontColor: "white",
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    var ctx = document.getElementById("line-chart").getContext("2d");
    window.myLine = new Chart(ctx, config);
  }, []);

  return (
    <div className="flex ">
      <Sidebar_ />
      <div className="w-full">
        <Nav_ />
        <div className="w-full p-8 Dashboard">
          <h1>Dashboard Overview</h1>
          <div className="grid grid-cols-3 items-center gap-4 mt-2 mb-2">
            <div
              style={{ backgroundColor: "#0795A2" }}
              className="flex flex-col rounded-lg DashboardCard	 w-full items-center justify-between py-6 px-2"
            >
              <TodayIcon className="Dashboard_head_icons" />
              <p className="text-white-1000 my-4">Today's Income</p>
              <p className="text-white-1000 text-2xl">
                {" "}
                ₹ {thistodayeran.toLocaleString()} /-
              </p>
            </div>
            <div
              style={{ backgroundColor: "#3F81F8" }}
              className="flex flex-col rounded-lg DashboardCard	 w-full items-center justify-between py-6 px-2"
            >
              <ShoppingCartOutlinedIcon className="Dashboard_head_icons" />
              <p className="text-white-1000 my-4">This Month</p>
              <p className="text-white-1000 text-2xl">
                ₹ {thismonthearn.toLocaleString()} /-
              </p>
            </div>
            <div
              style={{ backgroundColor: "#0A9E6E" }}
              className="flex flex-col rounded-lg DashboardCard	 w-full items-center justify-between py-6 px-2"
            >
              <CalendarMonthOutlinedIcon className="Dashboard_head_icons" />
              <p className="text-white-1000 my-4">Total Income</p>
              <p className="text-white-1000 text-2xl">
                ₹ {thistotalearn.toLocaleString()} /-
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center  mt-2 mb-2">
            <div className="flex border rounded-lg DashboardCard	shadow-lg w-full items-center justify-evenly  p-4">
              <Avatar className="Dashboard_subhead_Avatar">
                <ShoppingCartOutlinedIcon />
              </Avatar>
              <div>
                <p className="text-black-1000 ">Total Orders</p>
                <p className="text-black-1000 ">
                  {" "}
                  {totalorder.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex border rounded-lg DashboardCard	shadow-lg w-full items-center justify-evenly  p-4">
              <Avatar className="Dashboard_subhead_Avatar">
                <AutorenewIcon />
              </Avatar>
              <div>
                <p className="text-black-1000 ">Orders Pending</p>
                <p className="text-black-1000 ">
                  {" "}
                  {pendingorder.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex border rounded-lg DashboardCard	shadow-lg w-full items-center justify-evenly  p-4">
              <Avatar className="Dashboard_subhead_Avatar">
                <LocalShippingIcon />
              </Avatar>
              <div>
                <p className="text-black-1000 ">Orders Processing</p>
                <p className="text-black-1000 ">
                  {" "}
                  {processingorder.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex border rounded-lg DashboardCard	shadow-lg w-full items-center justify-evenly  p-4">
              <Avatar className="Dashboard_subhead_Avatar">
                <DoneIcon />
              </Avatar>
              <div>
                <p className="text-black-1000 ">Orders delivered</p>
                <p className="text-black-1000 ">
                  {" "}
                  {completedorder.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div
            style={{ height: "300px" }}
            className="grid grid-cols-2 items-start gap-4"
          >
            <div className=" h-full">
              <h1>Weekly Status</h1>
              {/* <ApexCharts
                options={options}
                series={series}
                type="line"
                height={350}
              /> */}
              <div
                style={{ backgroundColor: "#333" }}
                className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
              >
                <div className="p-4 flex-auto">
                  {/* Chart */}
                  <div style={{ height: "300px" }} className="relative h-full">
                    <canvas id="line-chart"></canvas>
                  </div>
                </div>
              </div>
            </div>
            <div className=" h-fullshadow-lg p-2 border">
              <h1>Best Selling Products</h1>
              <>{/* <ReactEcharts option={getOption()} /> */}</>
              {/* <Chart
                options={{
                  labels: ["A", "B", "C"],
                }}
                series={[23, 32, 43]}
                type="pie"
                width={500}
                height={320}
              /> */}
            </div>
          </div>
          {/* <div className="mt-2 mb-2">
            <h1>Recent Orders</h1>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 640 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-md text-black-800 font-bold">
                        Product Name
                      </TableCell>
                      <TableCell className="text-md text-black-800 font-bold">
                        User Name
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
                            <TableCell>
                              {" "}
                              <div className="flex items-center">
                                <Avatar src={row.product.original} />

                                <p className="ml-2">{row.product.name}</p>
                              </div>
                            </TableCell>
                            <TableCell>{row.user.name}</TableCell>
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard_;
