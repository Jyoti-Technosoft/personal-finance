import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AdminNavbar } from "./AdminNavbar";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const accountNumber = Cookies.get("accountNumber");
  const password = Cookies.get("password");

  const [enteredAccountNumber, setEnteredAccountNumber] = useState("");
  const [accountDetails, setAccountDetails] = useState([]);
  const [showGetDetailsButton, setShowGetDetailsButton] = useState(true);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [enteredAccountNoError, setEnteredAccountNoError] = useState("");
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

  const enteredAccountNumberError = () => {
    if (enteredAccountNumber?.length !== 5) {
      setEnteredAccountNoError("Enter Valid Account Number!");
    } else {
      setEnteredAccountNoError("");
    }
  };

  const showAlert = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
  };
  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const handleGetDetails = async () => {
    if (enteredAccountNumber?.length !== 6) {
      showAlert("Please enter a 6-digit account number.");
      return;
    }

    try {
      const responseOfUsersData = await axios.get(
        "http://localhost:8180/api/admin/getUsers"
      );
      const account = responseOfUsersData.data.find(
        (user) => user.accountNumber === enteredAccountNumber
      );
      //   console.log(account);

      if (!account) {
        setEnteredAccountNumber("");
        showAlert("Account not found!");
        return;
      }

      setAccountDetails(account);
      setShowGetDetailsButton(false);
    } catch (error) {
      showAlert("Something went wrong while fetching user data.");
      console.log("Error fetching user data:", error);
    }
  };

  const handleDeleteConfirmation = () => {
    setShowConfirmationDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmationDialog(false);
    setShowPasswordDialog(true);
  };

  const handleConfirmPassword = async () => {
    if (adminPassword !== password) {
      setShowPasswordDialog(false);
      // Reset the state to the default view
      setEnteredAccountNumber("");
      setAccountDetails([]);
      setShowGetDetailsButton(true);
      showAlert("Admin password is incorrect.");
    } else {
      try {
        await axios.delete(
          `http://localhost:8180/api/admin/removeUser/${enteredAccountNumber}`
        );

        toast.success(
          `Account: ${accountDetails.accountNumber} deleted successfully.`
        );
      } catch (error) {
        console.log("Error deleting account:", error);
        showAlert("Something went wrong while deleting the account.");
      } finally {
        // Reset state and go back to the default view
        setEnteredAccountNumber("");
        setAccountDetails([]);
        setShowGetDetailsButton(true);
        setShowConfirmationDialog(false);
        setShowDialog(false);
        setDialogMessage("");
        setShowPasswordDialog(false);
        setAdminPassword("");
        setEnteredAccountNoError("");
      }
    }
  };

  const handleBack = () => {
    // Reset the state to the default view
    setEnteredAccountNumber("");
    setAccountDetails([]);
    setShowGetDetailsButton(true);
  };

  // Function to format balance with 2 digits precision after the decimal point
  function formatBalance(balance) {
    return parseFloat(balance).toFixed(2);
  }

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
            <h4>Delete Account Section....</h4>

            <br />

            {showGetDetailsButton ? (
              <>
                <label>Enter 6-Digit Account Number:</label>
                <input
                  style={{ marginLeft: "1%" }}
                  placeholder="Account Number"
                  type="text"
                  value={enteredAccountNumber}
                  onChange={(e) => {
                    {
                      setEnteredAccountNumber(e.target.value);
                    }
                    // Update the error message when the adminPassword changes
                    enteredAccountNumberError(e.target.value);
                  }}
                />
                {/* Display the error message in red */}
                <span style={{ color: "red" }}>
                  <p>{enteredAccountNoError}</p>
                </span>

                <button
                  style={{ marginLeft: "7%", marginTop: "1%" }}
                  className="btn btn-info"
                  onClick={() => handleGetDetails()}
                >
                  Get Deatils
                </button>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title">
                          {`Account No:- ${accountDetails.accountNumber}`}
                        </h3>
                        <hr />
                        {/* <hr /> */}
                        <h5>Account Balance:-</h5>
                        <h6>{formatBalance(accountDetails.balance)}</h6>
                        <hr />
                        <div className="text-center">
                          <button
                            className="btn btn-danger mr-3"
                            onClick={() => handleDeleteConfirmation()}
                            style={{ float: "inline-start" }}
                          >
                            Delete Account
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={handleBack}
                            style={{ float: "inline-end" }}
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h5>Account Holder's Name:-</h5>
                        <h6>{accountDetails.name}</h6>
                        <hr />
                        <h5>Account Holder's Phone Number:-</h5>
                        <h6>{accountDetails.phone_number}</h6>
                        <hr />
                        <h5>Account Holder's Email:-</h5>
                        <h6>{accountDetails.email}</h6>
                        <hr />
                        <h5>Account Holder's Address:-</h5>
                        <h6>{accountDetails.address}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Modal
        show={showConfirmationDialog}
        onHide={() => setShowConfirmationDialog(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the account number:{" "}
          {enteredAccountNumber}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmationDialog(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleConfirmDelete()}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Admin Password Dialog */}
      <Modal
        show={showPasswordDialog}
        onHide={() => setShowPasswordDialog(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Admin Password For Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Enter Admin Password:</label>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordDialog(false)}
          >
            Cancel
          </Button>
          <Button variant="success" onClick={() => handleConfirmPassword()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Dialog */}
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
  );
};

export default DeleteAccount;
