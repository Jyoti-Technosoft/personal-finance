import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPinButton } from "../../reduxSlices/dashboardSlice";

export const Deposit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = Cookies.get("authToken");
  const [pinInfo, setPinInfo] = useState(null);
  const [depositData, setDepositData] = useState({
    amount: "",
    pin: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  // New state for the error message
  const [amountError, setAmountError] = useState("");
  const [pinError, setPinError] = useState("");
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
      setDepositData({ amount: "", pin: "" });
    } else {
      setAmountError("");
    }
  };

  // Function to update the error message based on the Pin
  const updatePinError = (accPin) => {
    if (accPin.length === 1 || accPin.length === 2 || accPin.length === 3) {
      setPinError("Enter valid 4-Digit Pin to Transfar!");
    } else {
      setPinError("");
    }
  };

  // UseEffect to monitor changes in the amount and update the error message
  useEffect(() => {
    updateAmountError(depositData.amount);
  }, [depositData.amount]);

  // UseEffect to monitor changes in the pin and update the error message
  useEffect(() => {
    updatePinError(depositData.pin);
  }, [depositData.pin]);

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

  const handleDeposit = async () => {
    // Check if the amount is there or not
    if (isNaN(parseFloat(depositData.amount))) {
      setAmountError(
        "Amount not entered...please enter a positive amount to transfar!"
      );
      return;
    }
    // Check if the pin there or not
    if (depositData.pin.length !== 4) {
      setPinError(
        "Pin not entered...please enter valid 4-digit pin to transfar!"
      );
      return;
    }
    // Check if pin not contain alphabatic value
    const PinRegex = /^[0-9]{4}$/;
    if (!PinRegex.test(depositData.pin) && depositData.pin.length >= 1) {
      setPinError("Alphabets entered...Only Numbers Allowed!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8180/api/account/deposit",
        {
          amount: parseFloat(depositData.amount),
          pin: depositData.pin,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Handle success - show success alert or message
      toast.success(`Amount deposited: ${depositData.amount} Rs.`);

      // Clear the form
      setDepositData({
        amount: "",
        pin: "",
      });
    } catch (error) {
      // Handle error - show error alert or message
      showAlert(`Deposit Fail : ${error.response.data}`);
      setDepositData({ amount: "", pin: "" });
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
              <h1>Deposit</h1>
              {pinInfo ? (
                <>
                  <hr />
                  <br />

                  <p>
                    <label>Deposit amount:</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="00.00"
                      value={depositData.amount}
                      onChange={(e) => {
                        setDepositData({
                          ...depositData,
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
                    <label>Account PIN:</label>
                    <input
                      type="password"
                      maxLength="4"
                      placeholder="****"
                      value={depositData.pin}
                      onChange={(e) => {
                        setDepositData({ ...depositData, pin: e.target.value });
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
                      onClick={handleDeposit}
                    >
                      Deposit
                    </button>
                    <button
                      style={{ marginLeft: "4%" }}
                      className="btn btn-danger"
                      onClick={() => {
                        // Clear the form
                        setDepositData({
                          amount: "",
                          pin: "",
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
                    Create PIN to activate the deposit section.
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
