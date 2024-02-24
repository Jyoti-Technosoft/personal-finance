import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "../style/styles.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPinButton } from "../../reduxSlices/dashboardSlice";

export const Withdraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = Cookies.get("authToken");
  const [pinInfo, setPinInfo] = useState([]);
  const [withdrawData, setWithdrawData] = useState({
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
      setWithdrawData({ amount: "", pin: "" });
    } else {
      setAmountError("");
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
    updateAmountError(withdrawData.amount);
  }, [withdrawData.amount]);

  // UseEffect to monitor changes in the pin and update the error message
  useEffect(() => {
    updatePinError(withdrawData.pin);
  }, [withdrawData.pin]);

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const showAlert = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
  };

  const fetchPinInfo = async () => {
    if (!authToken) {
      navigate("/login");
    }
    try {
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

  const handleWithdraw = async () => {
    // Check if the amount is there or not
    if (isNaN(parseFloat(withdrawData.amount))) {
      setAmountError(
        "Amount not entered...please enter a positive amount to transfar!"
      );
      return;
    }
    // Check if the pin there or not
    if (withdrawData.pin?.length !== 4) {
      setPinError(
        "Pin not entered...please enter valid 4-digit pin to transfar!"
      );
      return;
    }
    // Check if pin not contain alphabatic value
    const PinRegex = /^[0-9]{4}$/;
    if (!PinRegex.test(withdrawData.pin) && withdrawData.pin?.length >= 1) {
      setPinError("Alphabets entered...Only Numbers Allowed!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8180/api/account/withdraw",
        {
          amount: parseFloat(withdrawData.amount),
          pin: withdrawData.pin,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Handle success - show success alert or message
      toast.success(`Amount Withdrawal: ${withdrawData.amount} Rs.`);

      // Clear the form
      setWithdrawData({
        amount: "",
        pin: "",
      });
    } catch (error) {
      // Handle error - show error alert or message
      showAlert(`Withdrawal Fail : ${error.response.data}`);
      setWithdrawData({ amount: "", pin: "" });
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
              <h1>Withdraw</h1>
              {pinInfo ? (
                <>
                  <hr />
                  <br />

                  <p>
                    <label>Withdraw amount:</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="00.00"
                      value={withdrawData.amount}
                      onChange={(e) => {
                        setWithdrawData({
                          ...withdrawData,
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
                      value={withdrawData.pin}
                      onChange={(e) => {
                        setWithdrawData({
                          ...withdrawData,
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
                      onClick={handleWithdraw}
                    >
                      Withdraw
                    </button>
                    <button
                      style={{ marginLeft: "4%" }}
                      className="btn btn-danger"
                      onClick={() => {
                        // Clear the form
                        setWithdrawData({
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
                    Create PIN to activate the Withdraw section.
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
