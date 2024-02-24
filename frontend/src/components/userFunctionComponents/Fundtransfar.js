import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPinButton } from "../../reduxSlices/dashboardSlice";

export const Fundtransfar = () => {
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");
  const accountNumber = Cookies.get("accountNumber");
  const [pinInfo, setPinInfo] = useState([]);
  const [transferData, setTransferData] = useState({
    amount: "",
    pin: "",
    targetAccountNumber: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  // New state for the error message
  const [amountError, setAmountError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [pinError, setPinError] = useState("");
  const dispatch = useDispatch();
  const valIsSidebar =
    useSelector((state) => state.navbarSlice.isSidebarOpen) === "true";
  const [valIsSidebarOpen, setalIsSidebarOpen] = useState(valIsSidebar);

  useEffect(() => {
    setalIsSidebarOpen(valIsSidebar);
  }, [valIsSidebar]);

  // Function to update the error message based on the amount
  const updateAmountError = (amount) => {
    if (parseFloat(amount) <= 0) {
      setAmountError("Invalid amount entered! Please enter a positive amount.");
      setTransferData({ amount: "", pin: "", targetAccountNumber: "" });
    } else {
      setAmountError("");
    }
  };

  // Function to update the error message based on the AccountNumber
  const updateAccountNumberError = (accNum) => {
    const accountNumberRegex = /^[a-zA-Z0-9]{6}$/;
    if (!accountNumberRegex.test(accNum) && accNum?.length >= 1) {
      setAccountNumberError(
        "Invalid target account number! Please enter a valid 6-character alphanumeric account number."
      );
      return;
    }
    if (accNum === accountNumber) {
      setAccountNumberError("You Can't Transfar To Your Own Account!!");
      setTransferData({ targetAccountNumber: "" });
    } else {
      setAccountNumberError("");
    }
  };

  // Function to update the error message based on the Pin
  const updatePinError = (accPin) => {
    if (accPin?.length === 1 || accPin?.length === 2 || accPin?.length === 3) {
      setPinError("Enter valid 4-Digit Pin to Transfar!");
    } else {
      setPinError("");
    }
  };

  // UseEffect to monitor changes in the amount and update the error message
  useEffect(() => {
    updateAmountError(transferData.amount);
  }, [transferData.amount]);

  // UseEffect to monitor changes in the AccountNumber and update the error message
  useEffect(() => {
    updateAccountNumberError(transferData.targetAccountNumber);
  }, [transferData.targetAccountNumber]);

  // UseEffect to monitor changes in the pin and update the error message
  useEffect(() => {
    updatePinError(transferData.pin);
  }, [transferData.pin]);

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const showAlert = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
  };

  const fetchPinInfo = async () => {
    try {
      if (!authToken) {
        navigate("/login");
      }
      const response = await axios.get(
        "http://localhost:8180/api/account/pin/check",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setPinInfo(response.data.hasPIN);
    } catch (error) {
      // console.error("Error fetching pin info:", error);
      showAlert("Error fetching pin info:");
    }
  };

  const handleFundTransfer = async () => {
    // Check if the amount is there or not
    if (isNaN(parseFloat(transferData.amount))) {
      setAmountError(
        "Amount not entered...please enter a positive amount to transfar!"
      );
      return;
    }
    // Check if the account number is there or not
    if (transferData.targetAccountNumber?.length !== 6) {
      setAccountNumberError(
        "Target account number not valid...please enter valid 6-digit of account number to transfar!"
      );
      return;
    }
    // Check if the pin there or not
    if (transferData.pin?.length !== 4) {
      setPinError(
        "Pin not entered...please enter valid 4-digit pin to transfar!"
      );
      return;
    }
    // Check if pin not contain alphabatic value
    const PinRegex = /^[0-9]{4}$/;
    if (!PinRegex.test(transferData.pin) && transferData.pin?.length >= 1) {
      setPinError("Alphabets entered...Only Numbers Allowed!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8180/api/account/fund-transfer",
        {
          amount: parseFloat(transferData.amount),
          pin: transferData.pin,
          targetAccountNumber: transferData.targetAccountNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Handle success - show success alert or message
      toast.success(
        `${transferData.amount} Rs. Transfared to - ${transferData.targetAccountNumber}`
      );

      // Clear the form
      setTransferData({
        amount: "",
        pin: "",
        targetAccountNumber: "",
      });
    } catch (error) {
      // Handle error - show error alert or message
      showAlert(`Transection Failed : ${error.response.data}`);
      // alert("Error transferring fund. Please try again.");
      // Clear the form
      setTransferData({
        amount: "",
        pin: "",
        targetAccountNumber: "",
      });
    }
  };

  // Fetch pin info on component mount
  useEffect(() => {
    fetchPinInfo();
    dispatch(setPinButton(false));
  }, [authToken]);

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
              <h1>Fund Transfer</h1>
              {pinInfo ? (
                <>
                  <hr />
                  <br />

                  <p>
                    <label>Transfer amount:</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="00.00"
                      value={transferData.amount}
                      onChange={(e) => {
                        setTransferData({
                          ...transferData,
                          amount: e.target.value,
                        });
                        // Update the error message when the amount changes
                        updateAmountError(e.target.value);
                      }}
                    />
                    {/* Display the error message in red */}
                    <span style={{ color: "red" }}>
                      <p>{amountError}</p>
                    </span>
                  </p>

                  <br />

                  <p>
                    <label>Target Account Number:</label>
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="e65d1"
                      value={transferData.targetAccountNumber}
                      onChange={(e) => {
                        setTransferData({
                          ...transferData,
                          targetAccountNumber: e.target.value,
                        });
                        // Update the error message when the Account Number changes
                        updateAccountNumberError(e.target.value);
                      }}
                    />
                    {/* Display the error message in red */}
                    <span style={{ color: "red" }}>
                      <p>{accountNumberError}</p>
                    </span>
                  </p>

                  <br />

                  <p>
                    <label>Your Account PIN:</label>
                    <input
                      type="password"
                      maxLength="4"
                      placeholder="****"
                      value={transferData.pin}
                      onChange={(e) => {
                        setTransferData({
                          ...transferData,
                          pin: e.target.value,
                        });
                        // Update the error message when the Pin changes
                        updatePinError(e.target.value);
                      }}
                    />
                    {/* Display the error message in red */}
                    <span style={{ color: "red" }}>
                      <p>{pinError}</p>
                    </span>
                  </p>

                  <br />
                  <p>
                    <button
                      style={{ marginLeft: "4%" }}
                      className="btn btn-success"
                      onClick={handleFundTransfer}
                    >
                      Transfer Fund
                    </button>
                    <button
                      style={{ marginLeft: "4%" }}
                      className="btn btn-danger"
                      onClick={() => {
                        // Clear the form
                        setTransferData({
                          amount: "",
                          pin: "",
                          targetAccountNumber: "",
                        });
                      }}
                    >
                      Clear
                    </button>
                  </p>
                </>
              ) : (
                <div style={{ color: "red" }}>
                  <h5 style={{ color: "red", fontWeight: "bolder" }}>
                    Account PIN not created!!
                  </h5>
                  <h5 style={{ color: "red", fontWeight: "bolder" }}>
                    Create PIN to activate the fund transfer section.
                  </h5>
                </div>
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
    </>
  );
};
