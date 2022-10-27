import React, { useEffect, useState } from "react";
import Image from "next/image";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import ClassIcon from "@mui/icons-material/Class";
import GradeIcon from "@mui/icons-material/Grade";
import StoreIcon from "@mui/icons-material/Store";
import ArticleIcon from "@mui/icons-material/Article";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { SingleStore } from "../Api/Store";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
const Sidebar_ = () => {
  const Nav_dashboard = () => {
    window.location.replace("/dashboard");
  };
  const Nav_products = () => {
    window.location.replace("/products");
  };
  const Nav_Category = () => {
    window.location.replace("/Category");
  };
  const Nav_users = () => {
    window.location.replace("/users");
  };
  const logout = () => {
    window.location.replace("/");
  };
  const nav_sales = () => {
    window.location.replace("/Mysale");
  };
  const Nav_Featured = () => {
    window.location.replace("/Featured");
  };
  const Nav_journal = () => {
    window.location.replace("/journal");
  };
  const nav_store = () => {
    window.location.replace("/MyStore");
  };
  const nav_menu = () => {
    window.location.replace("/Menu");
  };
  const logoutbtn = async () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/");
  };
  useEffect(() => {
    getuserdata();
  }, []);
  const [storename, setstorename] = useState("null");
  const [logo, setlogo] = useState("null");
  const getuserdata = async () => {
    var user_id = sessionStorage.getItem("user_id");
    if (user_id !== null) {
      var mystore = await SingleStore({ id: user_id });
      if (mystore.data.length !== 0) {
        setlogo(mystore.data[0].logo);
        setstorename(mystore.data[0].storename);
      }
    } else {
      setstorename(null);
    }
  };
  return (
    <div
      className=" h-full   h-screen flex items-center flex-col  	"
      style={{
        backgroundColor: "#000000",
        minWidth: "15vw",
      }}
    >
      <div className="Sidebar_logo">
        <img src="/2.png" alt="Logo" />
      </div>
      <div className="w-full text-white-1000  Sidebar_Page">
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        >
          <TreeItem
            className="my-6"
            onClick={Nav_dashboard}
            nodeId="1"
            label="Dashboard"
          ></TreeItem>
          <TreeItem
            className="my-6"
            onClick={Nav_Category}
            nodeId="100"
            label="Category"
          ></TreeItem>
          <TreeItem
            className="my-6"
            onClick={nav_menu}
            nodeId="101"
            label="Menu"
          ></TreeItem>
          <TreeItem
            className="my-6"
            onClick={Nav_products}
            nodeId="101"
            label="Products"
          ></TreeItem>
          <TreeItem className="my-6" nodeId="2" label="Analytics & Predicition">
            <TreeItem className="my-6" nodeId="3" label="Analytics" />
            <TreeItem nodeId="4" label="Predicition"></TreeItem>
          </TreeItem>
          <TreeItem className="my-6" nodeId="5" label="Order Management">
            <TreeItem
              className="mt-6"
              nodeId="6"
              onClick={nav_sales}
              label="Orders"
            />
          </TreeItem>
          <TreeItem className="my-6" nodeId="7" label="Customer Management">
            <TreeItem className="mt-6" nodeId="8" label="Customer" />
          </TreeItem>
          <TreeItem className="my-6" nodeId="9" label="Store Settings">
            <TreeItem className="my-6" nodeId="10" label="Domain Settings" />
            <TreeItem
              className="my-6"
              nodeId="11"
              onClick={nav_store}
              label="Theme Settings"
            />
            <TreeItem className="my-6" nodeId="12" label="Store Information" />
            <TreeItem
              className="my-6"
              nodeId="13"
              label="Contact Information"
            />
            <TreeItem nodeId="14" label="Payment Information" />
          </TreeItem>
          <TreeItem className="my-6" nodeId="105" label="Extensions"></TreeItem>
          <TreeItem
            className="my-6"
            nodeId="107"
            onClick={Nav_journal}
            label="Journals"
          ></TreeItem>
          <TreeItem className="my-6" nodeId="15" label="E-mail Notifications">
            <TreeItem className="mt-6" nodeId="16" label="Email " />
          </TreeItem>
          <TreeItem
            className="my-6"
            nodeId="107"
            onClick={logoutbtn}
            label="Logout"
          ></TreeItem>
        </TreeView>
        {/* <ul>
          <li>
            <div
              onClick={Nav_dashboard}
              className="flex  hover:bg-black-1000 transition-all p-2 mb-2"
            >
              <p className="text-white-1000 mt-1  ml-4">Dashboard</p>
            </div>
          </li>
          <li>
            <div className="flex">
              <ArrowRightIcon />
              <p>Store Settings</p>
            </div>
            <ul className="ml-8 store_setting_ul">
              <li>Domain Settings</li>
              <li>Theme Settings</li>
              <li>Store Information</li>
              <li>Contact Information</li>
              <li>Payment Information</li>
            </ul>
          </li>
        </ul> */}

        {/* <div
          onClick={nav_store}
          className="flex  hover:bg-black-1000 transition-all p-2 mb-2"
        >
          <StoreIcon className="text-white-400" />
          <p className="text-xs text-white-400 mt-1 font-bold ml-2">My Store</p>
        </div> */}

        {/* <div
          onClick={Nav_Category}
          className="flex  hover:bg-black-1000 transition-all p-2 mb-2"
        >
          <ClassIcon className="text-white-400" />
          <p className="text-xs text-white-400 mt-1 font-bold ml-2">
            My Category
          </p>
        </div>
        <div
          onClick={nav_menu}
          className="flex  hover:bg-black-1000 transition-all p-2 mb-2"
        >
          <MenuOpenIcon className="text-white-400" />
          <p
            className="text-xs text-white-400 mt-1 font-bold ml-2"
            onClick={nav_menu}
          >
            Menu
          </p>
        </div>
        <div
          onClick={Nav_products}
          className="flex  hover:bg-black-1000 transition-all p-2 mb-2"
        >
          <CategoryIcon className="text-white-400" />
          <p className="text-xs text-white-400 mt-1 font-bold ml-2">
            My Products
          </p>
        </div>

        <div
          onClick={nav_sales}
          className="flex  hover:bg-black-1000 transition-all p-2 mb-2"
        >
          <LoyaltyIcon className="text-white-400" />
          <p
            className="text-xs text-white-400 mt-1 font-bold ml-2"
            onClick={nav_sales}
          >
            My Sale
          </p>
        </div>
        <div
          onClick={Nav_journal}
          className="flex  hover:bg-black-1000 transition-all p-2 mb-2"
        >
          <ArticleIcon className="text-white-400" />
          <p className="text-xs text-white-400 mt-1 font-bold ml-2">Journals</p>
        </div>
        <div
          onClick={logout}
          className="flex  hover:bg-black-1000 transition-all p-2 mb-2"
        >
          <LogoutIcon className="text-white-400" />
          <p
            className="text-xs text-white-400 mt-1 font-bold ml-2"
            onClick={logoutbtn}
          >
            Log out
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar_;
