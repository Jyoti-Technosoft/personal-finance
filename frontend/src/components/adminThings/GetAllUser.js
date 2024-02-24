import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "./AdminNavbar";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { isDataThereLoading } from "../ValidationFunctions";
import { useDispatch, useSelector } from "react-redux";

const GetAllUser = () => {
  const navigate = useNavigate();
  const accountNumber = Cookies.get("accountNumber");
  const password = Cookies.get("password");

  const [showGetAccountsButton, setShowGetAccountsButton] = useState(true);
  const [adminPasswordError, setAdminPasswordError] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage] = useState(5);
  const [adminData, setAdminData] = useState({
    password: "",
  });
  const valIsSidebar =
    useSelector((state) => state.navbarSlice.isSidebarOpen) === "true";
  const [valIsSidebarOpen, setalIsSidebarOpen] = useState(valIsSidebar);

  useEffect(() => {
    setalIsSidebarOpen(valIsSidebar);
  }, [valIsSidebar]);

  const showAlert = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
  };
  const handleDialogClose = () => {
    setShowDialog(false);
  };

  // Function to format balance with 2 digits precision after the decimal point
  function formatBalance(balance) {
    return parseFloat(balance).toFixed(2);
  }

  const updateAdminPasswordError = (accPass) => {
    if (adminData.password?.length < 0) {
      setAdminPasswordError("Enter Account Password");
    } else {
      setAdminPasswordError("");
    }
  };

  const handleGetUsers = async () => {
    if (adminData.password?.length === 0) {
      setAdminPasswordError("Password Not Entered!!");
      return;
    }
    if (adminData.password !== "987654321") {
      showAlert("Wrong Password Entered..Unable To Fatch Users Data");
      setAdminData({
        password: "",
      });
      return;
    }
    try {
      if (accountNumber !== "JTBANKadmin") {
        navigate("/login");
      }
      const responseOfUsersData = await axios.get(
        "http://localhost:8180/api/admin/getUsers"
      );
      setUsersData(responseOfUsersData.data);
      //   console.log(usersData);
      setShowGetAccountsButton(false);
      isDataThereLoading(usersData);
    } catch (error) {
      showAlert("Somthing Went Wrong!!!");
      setAdminData({
        password: "",
      });
      console.log("Error fetching user data:", error);
    }
    // console.log(usersData);
  };

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

  const userSetter = () => {
    const indexOfLastUser = currentPage * userPerPage;
    const indexOfFirstUser = indexOfLastUser - userPerPage;
    const currentUsers = usersData?.slice(indexOfFirstUser, indexOfLastUser);

    return currentUsers?.map((user, index) => {
      const serialNumber = index + 1 + (currentPage - 1) * userPerPage;

      return (
        <tr
          key={index}
          style={{ textAlign: "center", fontFamily: "ui-monospace" }}
        >
          <td>{serialNumber}</td>
          <td>{user.accountNumber}</td>
          <td>{user.name}</td>
          <td>{user.phone_number}</td>
          <td>{user.email}</td>
          <td>{user.address}</td>
          <td>{formatBalance(user.balance)}</td>
        </tr>
      );
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            <h4>Get All User Section....</h4>

            <br />

            {showGetAccountsButton ? (
              <>
                <label>Admin Password:</label>

                <input
                  style={{ marginLeft: "1%" }}
                  placeholder="*******"
                  type="password"
                  name="adminPass"
                  value={adminData.password}
                  onChange={(e) => {
                    setAdminData({
                      ...adminData,
                      password: e.target.value,
                    });
                    // Update the error message when the adminPassword changes
                    updateAdminPasswordError(e.target.value);
                  }}
                />
                {/* Display the error message in red */}
                <span style={{ color: "red" }}>
                  <p>{adminPasswordError}</p>
                </span>

                <button
                  style={{ marginLeft: "7%", marginTop: "1%" }}
                  className="btn btn-info"
                  onClick={() => handleGetUsers()}
                >
                  Get Users
                </button>
              </>
            ) : (
              <>
                <div className="card">
                  <div className="card-body" style={{ overflowY: "scroll" }}>
                    <h3 className="card-title">Users</h3>
                    <hr />
                    <table className="table table-striped">
                      <thead>
                        <tr
                          style={{
                            textAlign: "center",
                            fontFamily: "ui-monospace",
                          }}
                        >
                          <th scope="col">Sr.</th>
                          <th scope="col">Account Number</th>
                          <th scope="col">Name</th>
                          <th scope="col">Phone Number</th>
                          <th scope="col">Email</th>
                          <th scope="col">Address</th>
                          <th scope="col">Balance</th>
                        </tr>
                      </thead>
                      <tbody>{usersData && userSetter()}</tbody>
                    </table>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <nav aria-label="Page navigation example">
                        <ul className="pagination">
                          {Array.from({
                            length: Math.ceil(usersData?.length / userPerPage),
                          }).map((_, index) => (
                            <li
                              className={
                                index + 1 === currentPage
                                  ? "page-item active"
                                  : "page-item"
                              }
                              key={index + 1}
                            >
                              <button
                                className="page-link"
                                onClick={() => paginate(index + 1)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Modal show={showDialog} onHide={handleDialogClose}>
              <Modal.Header closeButton>
                <Modal.Title>JT Bank Say:</Modal.Title>
              </Modal.Header>
              <Modal.Body>{dialogMessage}</Modal.Body>
              <Modal.Footer>
                <Button
                  className="btn-danger"
                  variant="secondary"
                  onClick={handleDialogClose}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllUser;
