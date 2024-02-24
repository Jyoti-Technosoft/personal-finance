import React, { useState } from "react";
import axios from "axios";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import Cookies from "js-cookie";
import { useEffect } from "react";
import "./style/styles.css";
import { isDataThereLoading } from "./ValidationFunctions";

export const Home = () => {
  const authToken = Cookies.get("authToken");
  const accountNumber = Cookies.get("accountNumber");
  const [userData, setUserData] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [pinData, setPinData] = useState([]);
  const [transectionData, setTransectionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOfUserData = await axios.get(
          "http://localhost:8180/api/dashboard/user",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserData(responseOfUserData.data);

        const responseOfAccountData = await axios.get(
          "http://localhost:8180/api/dashboard/account",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setAccountData(responseOfAccountData.data);

        const responseOfPinData = await axios.get(
          "http://localhost:8180/api/account/pin/check",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setPinData(responseOfPinData.data);

        const responseOfTransectionData = await axios.get(
          "http://localhost:8180/api/account/transactions",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setTransectionData(responseOfTransectionData.data);
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

  // Function to set tbody content based on transactionData
  function transectionSetter(transectionData) {
    return transectionData.map((transaction) => (
      <tr key={transaction.id}>
        <td>{transaction.id}</td>
        <td>{transaction.amount}</td>
        <td>{formatDate(transaction.transaction_date)}</td>
        <td>{formatTime(transaction.transaction_date)}</td>
        <td>{transaction.transaction_type}</td>
        <td>{transaction.targetAccountNumber}</td>
      </tr>
    ));
  }

  // Function to format date as DD/MM/YYYY
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Function to format time as HH:MM:SS AM/PM
  function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  // Function to format balance with 2 digits precision after the decimal point
  function formatBalance(balance) {
    return parseFloat(balance).toFixed(2);
  }

  return (
    <>
      <Header />
      <Sidebar />
      <div>
        <div id="wrapper" className="toggled">
          <div id="page-content-wrapper">
            <div className="container-fluid">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">{`Hi, ${userData.name}`}</h3>

                  <hr />
                  <h5>Account Number</h5>
                  <h6>{accountNumber}</h6>

                  <hr />
                  <h5>Phone Number</h5>
                  <h6>{userData.phone_number}</h6>

                  <hr />
                  <h5>Email</h5>
                  <h6>{userData.email}</h6>

                  <hr />
                  <h5>Address</h5>
                  <h6>{userData.address}</h6>

                  <hr />
                  <h5>Balance</h5>
                  <h6>{formatBalance(accountData.balance)} INR</h6>

                  <hr />
                  <h5>Pin Status</h5>
                  <h6>{pinData.msg}</h6>
                </div>
              </div>

              <br />
              <hr />
              <br />

              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Transactions</h3>
                  <hr />
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Type</th>
                        <th scope="col">Target Account Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transectionData && transectionSetter(transectionData)}
                    </tbody>
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
