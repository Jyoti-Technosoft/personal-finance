import React, { useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  isDataThereLoading,
  transectionSetter,
  formatBalance,
} from "../ValidationFunctions";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  setDashboardUserData,
  setDashboardAccountData,
  setDashboardPinData,
  setDashboardTransectionData,
  setPinButton,
} from "../../reduxSlices/dashboardSlice";

export const Dashboard = () => {
  const authToken = Cookies.get("authToken");
  const accountNumber = Cookies.get("accountNumber");
  const [userData, setUserData] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [pinData, setPinData] = useState([]);
  const [transectionData, setTransectionData] = useState([]);
  const navigate = useNavigate();
  const [showBal, setShowBal] = useState(false);
  const dispatch = useDispatch();
  const dashboardUserData = useSelector(
    (state) => state.dashboardSlice.dashboardUserData
  );
  const valIsSidebar =
    useSelector((state) => state.navbarSlice.isSidebarOpen) === "true";
  const [valIsSidebarOpen, setalIsSidebarOpen] = useState(valIsSidebar);

  useEffect(() => {
    setalIsSidebarOpen(valIsSidebar);
  }, [valIsSidebar]);

  useEffect(() => {
    dispatch(setPinButton(false));
    const fetchData = async () => {
      try {
        if (!authToken) {
          navigate("/login");
        }
        const responseOfUserData = await axios.get(
          "http://localhost:8180/api/dashboard/user",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserData(responseOfUserData.data);
        dispatch(setDashboardUserData(responseOfUserData.data));

        const responseOfAccountData = await axios.get(
          "http://localhost:8180/api/dashboard/account",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setAccountData(responseOfAccountData.data);
        dispatch(setDashboardAccountData(responseOfAccountData.data));

        const responseOfPinData = await axios.get(
          "http://localhost:8180/api/account/pin/check",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setPinData(responseOfPinData.data);
        dispatch(setDashboardPinData(responseOfPinData.data));

        const responseOfTransectionData = await axios.get(
          "http://localhost:8180/api/account/transactions",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setTransectionData(responseOfTransectionData.data);
        dispatch(setDashboardTransectionData(responseOfTransectionData.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [authToken]); // Include authToken in the dependency array

  isDataThereLoading(userData);
  isDataThereLoading(accountData);
  isDataThereLoading(pinData);
  isDataThereLoading(transectionData);
  // console.log(transectionData);

  // Button click handler to navigate to transaction history page
  const handleShowMoreClick = (transectionData) => {
    if (transectionData?.length >= 11) {
      return (
        <>
          <button
            style={{ marginTop: "7%", marginLeft: "11%" }}
            className="btn btn-primary"
            onClick={() => {
              navigate("/home/transection-history");
            }}
          >
            Show More...
          </button>
        </>
      );
    }
  };

  //Function to set Pin status data
  const pinMsg = (msg, hasPin) => {
    if (hasPin) {
      return (
        <div style={{ color: "green", fontWeight: "bold", fontSize: "larger" }}>
          {msg}
        </div>
      );
    } else {
      return (
        <div style={{ color: "red", fontWeight: "bold", fontSize: "larger" }}>
          {msg}
        </div>
      );
    }
  };

  //Button to set create pin or reset pin as per need
  const pinCreateResetButton = (hasPin) => {
    return (
      <Link to="/home/account-pin">
        <button
          onClick={({} = () => dispatch(setPinButton(true)))}
          type="button"
          className={
            !hasPin ? "btn btn-outline-success" : "btn btn-outline-primary"
          }
        >
          <div style={{ fontWeight: "bold", fontSize: "larger" }}>
            {!hasPin ? "Create Pin" : "Reset Pin"}
          </div>
        </button>
      </Link>
    );
  };

  return (
    <>
      <Navbar />
      <div>
        <div
          id="wrapper"
          className="toggled"
          style={valIsSidebarOpen ? {} : { display: "math" }}
        >
          <div id="page-content-wrapper">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">{`Hi, ${userData.name}`}</h3>

                      <hr />
                      <h5>Phone Number</h5>
                      <h6>{userData.phone_number}</h6>

                      <hr />
                      <h5>Email</h5>
                      <h6>{userData.email}</h6>

                      <hr />
                      <h5>Address</h5>
                      <h6>{userData.address}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h3>Account Number:- {accountNumber}</h3>

                      <hr />
                      <h5>Account Balance</h5>
                      <i className="bi bi-eye-slash" id="togglePassword"></i>
                      <h5>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          fill="currentColor"
                          className="bi bi-currency-rupee"
                          viewBox="0 0 16 16"
                          style={{ paddingBottom: "2px" }}
                        >
                          <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                        </svg>
                        <span>
                          {showBal
                            ? formatBalance(accountData.balance)
                            : "XX.XX"}
                        </span>
                        <span
                          onClick={() => setShowBal(!showBal)}
                          style={{ marginLeft: "2%" }}
                        >
                          {showBal ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </h5>

                      <hr />
                      <h5>Pin Status</h5>
                      <h6>{pinMsg(pinData.msg, pinData.hasPIN)}</h6>

                      <hr />
                      {pinCreateResetButton(pinData.hasPIN)}
                    </div>
                  </div>
                </div>
              </div>

              <br />
              <hr />
              <br />

              <div className="card">
                <div className="card-body" style={{ overflowY: "scroll" }}>
                  <h3 className="card-title">Recent Transactions</h3>
                  <hr />
                  <table className="table table-striped">
                    <thead>
                      <tr
                        style={{
                          textAlign: "center",
                          fontFamily: "ui-monospace",
                        }}
                      >
                        <th scope="col">Id</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Transaction Type</th>
                        <th scope="col">State</th>
                        <th scope="col">Target Account Number</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transectionData &&
                        transectionSetter(transectionData, accountNumber)}
                    </tbody>
                    {handleShowMoreClick(transectionData)}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
