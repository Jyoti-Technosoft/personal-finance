import React, { useState } from "react";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import Pagination from "react-bootstrap/Pagination";
import { useNavigate } from "react-router-dom";
import { isDataThereLoading, transectionSetter } from "../ValidationFunctions";
import { useDispatch, useSelector } from "react-redux";
import { setPinButton } from "../../reduxSlices/dashboardSlice";

export const TransectionHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = Cookies.get("authToken");
  const accountNumber = Cookies.get("accountNumber");
  const [transectionData, setTransectionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
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
  }, [authToken]);

  isDataThereLoading(transectionData);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transectionData?.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
              <div className="card">
                <div className="card-body" style={{ overflowY: "scroll" }}>
                  <h3 className="card-title">Transactions</h3>
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
                        transectionSetter(currentTransactions, accountNumber)}
                    </tbody>
                  </table>
                  <Pagination style={{ paddingLeft: "2%" }}>
                    {Array.from({
                      length: Math.ceil(
                        transectionData?.length / transactionsPerPage
                      ),
                    }).map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
