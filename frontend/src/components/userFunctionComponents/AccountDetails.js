import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  isDataThereLoading,
  isValidEmail,
  validatePhoneNumber,
} from "../ValidationFunctions";
import { useDispatch, useSelector } from "react-redux";
import { setPinButton } from "../../reduxSlices/dashboardSlice";

export const AccountDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = Cookies.get("authToken");
  // const accountNumber = Cookies.get("accountNumber");
  const [userData, setUserData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [validationError, setValidationError] = useState([]);
  const [emailError, setEmailError] = useState([]);
  const [editValue, setEditValue] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    phone_number: "",
    email: "",
    address: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const dashboardUserData = useSelector(
    (state) => state.dashboardSlice.dashboardUserData
  );
  const valIsSidebar =
    useSelector((state) => state.navbarSlice.isSidebarOpen) === "true";
  const [valIsSidebarOpen, setalIsSidebarOpen] = useState(valIsSidebar);

  useEffect(() => {
    setalIsSidebarOpen(valIsSidebar);
  }, [valIsSidebar]);

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const showAlert = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
  };

  useEffect(() => {
    dispatch(setPinButton(false));
    const fetchData = async () => {
      if (!authToken) {
        navigate("/login");
      }
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
        setEditedData(responseOfUserData.data); // Initialize editedData with user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [authToken, editValue, editMode]); // Include authToken in the dependency array

  isDataThereLoading(userData);

  const handleEdit = () => {
    setEditMode(!editMode);
    setValidationError([]); // Reset validation error on entering edit mode
    setEmailError([]); // Reset email error on switching to edit mode
    setEditValue(false);
  };

  const handleUpdate = async () => {
    try {
      // Validate phone number before saving
      if (!validatePhoneNumber(editedData.phone_number)) {
        setValidationError(
          "Invalid phone number. Please enter a 10-digit numeric value that does not start with 0."
        );
        return;
      }
      // Validate email format before saving
      if (editedData.email && !isValidEmail(editedData.email)) {
        setEmailError("Please enter a valid email address.");
        return;
      }

      // Send API request to update user details
      const response = await axios.post(
        "http://localhost:8180/api/users/update",
        editedData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Set updated user data after successful API call
      setUserData(response.data);

      // Switch back to view mode
      setEditMode(false);
      setValidationError([]); // Reset validation error on successful save
      setEditValue(true);
    } catch (error) {
      showAlert(
        "Error updating user data...\nYour PhoneNumber Or Email Already Exist!"
      );
      // console.error("Error updating user data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Reset email error when user starts typing in the email field
    if (name === "email") {
      setEmailError([]);
    }
  };

  const handleClosePopup = () => {
    setEditMode(false);
  };

  return (
    <>
      {/* <Header /> */}
      {/* <Sidebar /> */}
      <Navbar />
      <div>
        <div
          id="wrapper"
          className="toggled"
          style={valIsSidebarOpen ? {} : { display: "math" }}
        >
          <div id="page-content-wrapper">
            <div className="container-fluid">
              <h1>Account Details</h1>

              {/* <div>
                <div id="wrapper" className="toggled">
                  <div id="page-content-wrapper">
                    <div className="container-fluid"> */}
              <div className="card">
                <div className="card-body">
                  {editMode ? (
                    <>
                      <h5>Account Number</h5>
                      <h6>{userData.accountNumber}</h6>
                      <hr />
                      <h5>
                        {" "}
                        <label htmlFor="name">Account Holder Name: </label>{" "}
                      </h5>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editedData.name}
                        onChange={handleInputChange}
                        style={{ width: "-webkit-fill-available" }}
                      />

                      <hr />
                      <h5>
                        {" "}
                        <label htmlFor="phone_number">
                          Phone Number:{" "}
                        </label>{" "}
                      </h5>
                      <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={editedData.phone_number}
                        onChange={handleInputChange}
                        style={{ width: "-webkit-fill-available" }}
                      />
                      {validationError && (
                        <p style={{ color: "red" }}>{validationError}</p>
                      )}

                      <hr />
                      <h5>
                        {" "}
                        <label htmlFor="email">Email: </label>{" "}
                      </h5>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={editedData.email}
                        onChange={handleInputChange}
                        style={{ width: "-webkit-fill-available" }}
                      />
                      {emailError && (
                        <p style={{ color: "red" }}>{emailError}</p>
                      )}

                      <hr />
                      <h5>
                        {" "}
                        <label htmlFor="address">Address: </label>{" "}
                      </h5>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editedData.address}
                        onChange={handleInputChange}
                        style={{ width: "-webkit-fill-available" }}
                      />
                    </>
                  ) : (
                    <>
                      <h5>Account Number</h5>
                      <h6>{userData.accountNumber}</h6>

                      <hr />
                      <h5>Account Holder Name</h5>
                      <h6>{userData.name}</h6>

                      <hr />
                      <h5>Phone Number</h5>
                      <h6>{userData.phone_number}</h6>

                      <hr />
                      <h5>Email</h5>
                      <h6>{userData.email}</h6>

                      <hr />
                      <h5>Address</h5>
                      <h6>{userData.address}</h6>
                    </>
                  )}

                  <div className="edit-buttons">
                    {!editMode ? (
                      <button
                        className="btn btn-secondary"
                        onClick={handleEdit}
                        style={{ marginTop: "20px" }}
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={handleUpdate}
                          style={{
                            marginTop: "20px",
                            marginLeft: "1%",
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={handleClosePopup}
                          style={{
                            marginTop: "20px",
                            marginLeft: "2%",
                          }}
                        >
                          Cancel
                        </button>
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
          </div>
        </div>
      </div>
      {/* </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
