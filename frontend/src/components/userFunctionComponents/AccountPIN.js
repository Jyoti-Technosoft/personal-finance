import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import Cookies from "js-cookie";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPinButton } from "../../reduxSlices/dashboardSlice";

export const AccountPIN = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = Cookies.get("authToken");
  const [pinInfo, setPinInfo] = useState([]);
  const [createPinPopup, setCreatePinPopup] = useState(false);
  const [resetPinPopup, setResetPinPopup] = useState(false);
  const [pinData, setPinData] = useState({
    pin: "",
    confirmPin: "",
    oldPin: "",
    newPin: "",
    confirmNewPin: "",
    password: "",
  });
  // const [pinValidationError, setPinValidationError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [oldPinError, setOldPinError] = useState("");
  const [pinError, setPinError] = useState("");
  const [confirmPinError, setConfirmPinError] = useState("");
  const [accountPasswordError, setAccountPasswordError] = useState("");
  const dashboardPinbutton = useSelector(
    (state) => state.dashboardSlice.pinButton
  );
  const valIsSidebar =
    useSelector((state) => state.navbarSlice.isSidebarOpen) === "true";
  const [valIsSidebarOpen, setalIsSidebarOpen] = useState(valIsSidebar);

  useEffect(() => {
    setalIsSidebarOpen(valIsSidebar);
  }, [valIsSidebar]);

  // Function to update the error message based on the OldPin
  const updateOldPinError = (accPin) => {
    if (accPin?.length >= 1 && accPin?.length <= 3) {
      setOldPinError("Enter valid 4-Digit OldPin to Reset Pin!");
    } else {
      setOldPinError("");
    }
  };
  // Function to update the error message based on the Pin
  const updatePinError = (accPin) => {
    if (accPin?.length >= 1 && accPin?.length <= 3) {
      setPinError("Enter valid 4-Digit Pin to Transfar!");
    } else {
      setPinError("");
    }
  };
  // Function to update the error message based on the Pin
  const updateConfirmPinError = (accPin) => {
    if (accPin?.length >= 1 && accPin?.length <= 3) {
      setConfirmPinError("Enter valid 4-Digit Pin to Transfar!");
    } else {
      setConfirmPinError("");
    }
  };
  // Function to update the error message based on the AccountPassword
  const updateAccountPasswordError = (accPass) => {
    if (pinData.password?.length < 0) {
      setAccountPasswordError("Enter Account Password");
    } else {
      setAccountPasswordError("");
    }
  };

  // UseEffect to monitor changes in the Oldpin and update the error message
  useEffect(() => {
    updateOldPinError(pinData.oldPin);
  }, [pinData.oldPin]);
  // UseEffect to monitor changes in the pin and update the error message
  useEffect(() => {
    updatePinError(pinData.pin);
  }, [pinData.pin]);
  // UseEffect to monitor changes in the confirmPin and update the error message
  useEffect(() => {
    updateConfirmPinError(pinData.confirmPin);
  }, [pinData.confirmPin]);
  // UseEffect to monitor changes in the AccountPassword and update the error message
  useEffect(() => {
    updateAccountPasswordError(pinData.password);
  }, [pinData.password]);

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const showAlert = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
  };

  useEffect(() => {
    dispatch(setPinButton(false));
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
        if (response.data.hasPIN && dashboardPinbutton) {
          setShowResetPinButton(false);
          setResetPinPopup(true);
        }
        if (!response.data.hasPIN && dashboardPinbutton) {
          setShowCreatePinButton(false);
          setCreatePinPopup(true);
        }
      } catch (error) {
        showAlert("Error fetching pin info:");
      }
    };

    fetchPinInfo();
  }, [authToken, createPinPopup, resetPinPopup]);

  const handleCreatePin = async () => {
    // Check if the pin there or not
    if (pinData.pin?.length !== 4) {
      setPinError(
        "Pin not entered...please enter valid 4-digit pin to ResetPin!"
      );
      return;
    }
    if (pinData.confirmPin?.length !== 4) {
      setConfirmPinError(
        "Confirm Pin not entered...please enter valid 4-digit pin to ResetPin!"
      );
      return;
    }
    if (pinData.password?.length === 0) {
      setAccountPasswordError("Password Not Entered!!");
      return;
    }
    // Check if pin not contain alphabatic value
    const PinRegex = /^[0-9]{4}$/;
    if (!PinRegex.test(pinData.pin) && pinData.pin?.length >= 1) {
      setPinError("Alphabets entered...Only Numbers Allowed!");
      return;
    }
    if (!PinRegex.test(pinData.confirmPin) && pinData.confirmPin?.length >= 1) {
      setConfirmPinError("Alphabets entered...Only Numbers Allowed!");
      return;
    }
    // Check pin and confirmPin does match
    if (pinData.pin !== pinData.confirmPin) {
      setConfirmPinError("Pin Not Match!!");
      return;
    } else {
      setConfirmPinError("");
    }

    try {
      await axios.post(
        "http://localhost:8180/api/account/pin/create",
        {
          pin: pinData.pin,
          password: pinData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("Pin Set Successfully..");
      setCreatePinPopup(false);
      setPinData({
        pin: "",
        confirmPin: "",
        oldPin: "",
        newPin: "",
        confirmNewPin: "",
        password: "",
      });
      // Handle success - show success popup or message
    } catch (error) {
      showAlert("Wrong Password Entered..Unable To Set Pin!");
      setPinData({
        pin: "",
        confirmPin: "",
        oldPin: "",
        newPin: "",
        confirmNewPin: "",
        password: "",
      });
    }
  };

  const handleResetPin = async () => {
    // Check if the pin there or not
    if (pinData.oldPin?.length !== 4) {
      setOldPinError(
        "Old Pin not entered...please enter valid 4-digit OldPin to ResetPin!"
      );
      return;
    }
    if (pinData.newPin?.length !== 4) {
      setPinError(
        "New Pin not entered...please enter valid 4-digit NewPin to ResetPin!"
      );
      return;
    }
    if (pinData.confirmNewPin?.length !== 4) {
      setConfirmPinError(
        "Confirm New Pin not entered...please enter valid 4-digit ConfirmNewPin to ResetPin!"
      );
      return;
    }
    if (pinData.password?.length === 0) {
      setAccountPasswordError("Password Not Entered!!");
      return;
    }
    // Check if pin not contain alphabatic value
    const PinRegex = /^[0-9]{4}$/;
    if (!PinRegex.test(pinData.oldPin) && pinData.oldPin?.length >= 1) {
      setOldPinError("Alphabets entered...Only Numbers Allowed!");
      return;
    }
    if (!PinRegex.test(pinData.newPin) && pinData.newPin?.length >= 1) {
      setPinError("Alphabets entered...Only Numbers Allowed!");
      return;
    }
    if (
      !PinRegex.test(pinData.confirmNewPin) &&
      pinData.confirmNewPin?.length >= 1
    ) {
      setConfirmPinError("Alphabets entered...Only Numbers Allowed!");
      return;
    }
    // Check pin and confirmPin does match
    if (pinData.newPin !== pinData.confirmNewPin) {
      setConfirmPinError("Pin Not Match!!");
      return;
    } else {
      setConfirmPinError("");
    }

    try {
      await axios.post(
        "http://localhost:8180/api/account/pin/update",
        {
          oldPin: pinData.oldPin,
          newPin: pinData.newPin,
          password: pinData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("Pin Reset successfully..");
      setResetPinPopup(false);
      setShowResetPinButton(true);
      setPinData({
        pin: "",
        confirmPin: "",
        oldPin: "",
        newPin: "",
        confirmNewPin: "",
        password: "",
      });
      // Handle success - show success popup or message
    } catch (error) {
      showAlert("Wrong Password or Pin Entered..Unable To Reset Pin!");
      setPinData({
        pin: "",
        confirmPin: "",
        oldPin: "",
        newPin: "",
        confirmNewPin: "",
        password: "",
      });
    }
  };

  const [showCreatePinButton, setShowCreatePinButton] = useState(true);
  const handleCreatePinPopup = () => {
    setShowCreatePinButton(false);
    setCreatePinPopup(true);
    // setPinValidationError(null);
  };

  const [showResetPinButton, setShowResetPinButton] = useState(true);
  const handleResetPinPopup = () => {
    setShowResetPinButton(false);
    setResetPinPopup(true);
    // setPinValidationError(null);
  };

  const handleClosePopup = () => {
    setShowCreatePinButton(true);
    setShowResetPinButton(true);
    setCreatePinPopup(false);
    setResetPinPopup(false);
    setPinData({
      pin: "",
      confirmPin: "",
      oldPin: "",
      newPin: "",
      confirmNewPin: "",
      password: "",
    });
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
              {showResetPinButton ? (
                <>
                  {pinInfo ? (
                    <>
                      <h1>Account PIN</h1>
                      {/* <br/> */}
                      <h5 style={{ color: "#04AA6D", fontWeight: "bolder" }}>
                        Account PIN is created.
                      </h5>
                      {/* <br/> */}
                      <button
                        className="btn btn-primary"
                        onClick={handleResetPinPopup}
                      >
                        Reset PIN
                      </button>
                    </>
                  ) : showCreatePinButton ? (
                    <>
                      <h1>Account PIN</h1>
                      <h5 style={{ color: "red", fontWeight: "bolder" }}>
                        Account PIN not created!!
                      </h5>
                      <p style={{ color: "#04AA6D", fontWeight: "bolder" }}>
                        Create Account PIN Here To Active Other
                        Functionalities..
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={handleCreatePinPopup}
                      >
                        Create PIN
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}

              {/* Create PIN Popup */}
              {createPinPopup && (
                <div className="popup">
                  {/* <h1>Account PIN</h1> */}
                  <h2>Create New Account PIN</h2>

                  <br />

                  <label> PIN: </label>
                  <input
                    style={{ marginLeft: "1%" }}
                    type="password"
                    maxLength="4"
                    placeholder="****"
                    value={pinData.pin}
                    name="pin"
                    onChange={(e) => {
                      setPinData({
                        ...pinData,
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

                  <label> Confirm PIN: </label>
                  <input
                    style={{ marginLeft: "1%" }}
                    placeholder="****"
                    type="password"
                    name="confirmPin"
                    value={pinData.confirmPin}
                    maxLength="4"
                    onChange={(e) => {
                      setPinData({
                        ...pinData,
                        confirmPin: e.target.value,
                      });
                      // Update the error message when the confirmPin changes
                      updateConfirmPinError(e.target.value);
                    }}
                  />
                  {/* Display the error message in red */}
                  <span style={{ color: "red" }}>
                    <p>{confirmPinError}</p>
                  </span>

                  <label> Account Password: </label>
                  <input
                    style={{ marginLeft: "1%" }}
                    placeholder="xxxxxxx"
                    type="password"
                    name="password"
                    value={pinData.password}
                    onChange={(e) => {
                      setPinData({
                        ...pinData,
                        password: e.target.value,
                      });
                      // Update the error message when the AccountPassword changes
                      updateAccountPasswordError(e.target.value);
                    }}
                  />
                  {/* Display the error message in red */}
                  <span style={{ color: "red" }}>
                    <p>{accountPasswordError}</p>
                  </span>

                  <button
                    style={{ marginLeft: "3%" }}
                    className="btn btn-success"
                    onClick={() => handleCreatePin()}
                  >
                    Create PIN
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: "3%" }}
                    onClick={handleClosePopup}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Reset PIN Popup */}
              {resetPinPopup && (
                <div className="popup">
                  <h2>Reset Account PIN</h2>

                  <br />

                  <label>Old PIN:</label>
                  <input
                    style={{ marginLeft: "1%" }}
                    placeholder="****"
                    type="password"
                    name="oldPin"
                    value={pinData.oldPin}
                    maxLength="4"
                    onChange={(e) => {
                      setPinData({
                        ...pinData,
                        oldPin: e.target.value,
                      });
                      // Update the error message when the Pin changes
                      updateOldPinError(e.target.value);
                    }}
                  />
                  {/* Display the error message in red */}
                  <span style={{ color: "red" }}>
                    <p>{oldPinError}</p>
                  </span>

                  <label>New PIN:</label>
                  <input
                    style={{ marginLeft: "1%" }}
                    placeholder="****"
                    type="password"
                    name="newPin"
                    value={pinData.newPin}
                    onChange={(e) => {
                      setPinData({
                        ...pinData,
                        newPin: e.target.value,
                      });
                      // Update the error message when the NewPin changes
                      updatePinError(e.target.value);
                    }}
                    maxLength="4"
                  />
                  {/* Display the error message in red */}
                  <span style={{ color: "red" }}>
                    <p>{pinError}</p>
                  </span>

                  <label>Confirm New PIN:</label>
                  <input
                    style={{ marginLeft: "1%" }}
                    placeholder="****"
                    type="password"
                    name="confirmNewPin"
                    value={pinData.confirmNewPin}
                    onChange={(e) => {
                      setPinData({
                        ...pinData,
                        confirmNewPin: e.target.value,
                      });
                      // Update the error message when the ConfirmNewPin changes
                      updateConfirmPinError(e.target.value);
                    }}
                    maxLength="4"
                  />
                  {/* Display the error message in red */}
                  <span style={{ color: "red" }}>
                    <p>{confirmPinError}</p>
                  </span>

                  <label>Account Password:</label>
                  <input
                    style={{ marginLeft: "1%" }}
                    placeholder="xxxxxxx"
                    type="password"
                    name="password"
                    value={pinData.password}
                    onChange={(e) => {
                      setPinData({
                        ...pinData,
                        password: e.target.value,
                      });
                      // Update the error message when the AccountPassword changes
                      updateAccountPasswordError(e.target.value);
                    }}
                  />
                  {/* Display the error message in red */}
                  <span style={{ color: "red" }}>
                    <p>{accountPasswordError}</p>
                  </span>

                  <button
                    className="btn btn-success"
                    style={{ marginLeft: "1%" }}
                    onClick={() =>
                      // handleResetPinValidation() &&
                      handleResetPin()
                    }
                  >
                    Reset PIN Now
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: "2%" }}
                    onClick={handleClosePopup}
                  >
                    Cancel
                  </button>
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
