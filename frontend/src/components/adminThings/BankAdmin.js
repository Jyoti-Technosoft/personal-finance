import React, { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "./AdminNavbar";
import { useDispatch, useSelector } from "react-redux";

const BankAdmin = () => {
  const navigate = useNavigate();
  const accountNumber = Cookies.get("accountNumber");
  const password = Cookies.get("password");
  const valIsSidebar =
    useSelector((state) => state.navbarSlice.isSidebarOpen) === "true";
  const [valIsSidebarOpen, setalIsSidebarOpen] = useState(valIsSidebar);

  useEffect(() => {
    setalIsSidebarOpen(valIsSidebar);
  }, [valIsSidebar]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!password || !accountNumber) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [accountNumber, password]); // Include authToken in the dependency array

  return (
    <div>
      <AdminNavbar />
      <div
        id="wrapper"
        className="toggled"
        style={valIsSidebarOpen ? {} : { display: "math" }}
      >
        <div id="page-content-wrapper">
          <div className="container-fluid">
            <h1>Hello, Admin JtBank</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAdmin;
