import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { RegistrationDetailShow } from "./RegistrationDetailShow";
import { Modal, Button } from "react-bootstrap";
import "./style/style-CreateAccount.css";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "./ValidationFunctions";


function CreateAccount() {
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderPhoneNumber, setAccountHolderPhoneNumber] = useState("");
  const [accountHolderEmail, setAccountHolderEmail] = useState("");
  const [accountHolderAddress, setAccountHolderAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authToken) {
          navigate("/home/dashboard");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [authToken]); // Include authToken in the dependency array

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const showAlert = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
  };

  const CreateAccountAction = async (e) => {
    e.preventDefault();

    if (!accountHolderName) {
      showAlert("Name cannot be blank!");
    } else if (!accountHolderPhoneNumber) {
      showAlert("PhoneNumber cannot be blank!");
    } else if (accountHolderPhoneNumber?.length !== 10) {
      showAlert("PhoneNumber is not valid");
    } else if (!accountHolderEmail) {
      showAlert("Email cannot be blank!");
    } else if (!isValidEmail(accountHolderEmail)) {
      showAlert("Email is not valid");
    } else if (!accountHolderAddress) {
      showAlert("Address cannot be blank!");
    } else if (!password) {
      showAlert("Password cannot be blank!");
    } else if (!confirmPassword) {
      showAlert("ConfirmPassword cannot be blank!");
    } else if (password === confirmPassword) {
      // Passwords match, you can proceed
      console.log(
        "Name:",
        accountHolderName,
        "\nPhoneNumber:",
        accountHolderPhoneNumber,
        "\nEmail:",
        accountHolderEmail,
        "\nAddress:",
        accountHolderAddress,
        "\nPassword:",
        password
      );
      try {
        let userData = {
          name: accountHolderName,
          phone_number: accountHolderPhoneNumber,
          email: accountHolderEmail,
          address: accountHolderAddress,
          password: password,
        };

        let regUser = await axios.post(
          "http://localhost:8180/api/users/register",
          userData
        );
        setShow(false);
        showAlert("User Registration Successfully!!");
        console.log(regUser.data);

        const accNum = regUser.data.accountNumber;
        setAccountNumber(accNum);

        const accHName = regUser.data.name;
        setAccountHolderName(accHName);

        const accHPhone = regUser.data.phone_number;
        setAccountHolderPhoneNumber(accHPhone);

        const accHEmail = regUser.data.email;
        setAccountHolderEmail(accHEmail);

        const accHAddress = regUser.data.address;
        setAccountHolderAddress(accHAddress);
      } catch (err) {
        showAlert("User Already Exist!");
        console.log(err);
        // Clear the fields after UNsuccessful Creation Of Account
        setAccountHolderName("");
        setAccountHolderPhoneNumber("");
        setAccountHolderEmail("");
        setAccountHolderAddress("");
        setPassword("");
        setConfirmPassword("");
      }
    } else {
      // Passwords do not match, show an alert or handle accordingly
      showAlert("Passwords do not match. Please try again.");
    }

    // // Clear the fields after successful Creation Of Account
    // setAccountHolderName("");
    // setAccountHolderPhoneNumber("");
    // setAccountHolderEmail("");
    // setAccountHolderAddress("");
    // setPassword("");
    // setConfirmPassword("");
  };

  const handlePhoneNumberChange = (e) => {
    // Ensure only numeric values are entered
    const inputValue = e.target.value.replace(/\D/g, "");

    // Limit the input to 10 digits
    const limitedInputValue = inputValue.slice(0, 10);

    // Ensure the number does not start with 0
    if (limitedInputValue?.length > 1 && limitedInputValue[0] === "0") {
      setAccountHolderPhoneNumber(limitedInputValue.slice(1));
    } else {
      setAccountHolderPhoneNumber(limitedInputValue);
    }
  };

  const handleAddressChange = (e) => {
    setAccountHolderAddress(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // const isValidEmail = (email) => {
  //   // Regular expression for a simple email validation
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  return (
    <div>
      {show ? (
        <div className="CreateAccount">
          <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={CreateAccountAction}>
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Create Account</h3>
                <div className="form-group mt-3">
                  <label>Name</label>
                  <input
                    placeholder="Name"
                    type="text"
                    id="name"
                    className="form-control mt-1"
                    value={accountHolderName}
                    onChange={(e) => {
                      setAccountHolderName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Phone Number</label>
                  <input
                    placeholder="Phone Number"
                    type="tel"
                    id="phone_number"
                    className="form-control mt-1"
                    value={accountHolderPhoneNumber}
                    onChange={handlePhoneNumberChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Email ID</label>
                  <input
                    placeholder="Email Address"
                    type="email"
                    id="email"
                    className="form-control mt-1"
                    value={accountHolderEmail}
                    onChange={(e) => {
                      setAccountHolderEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Address</label>
                  <textarea
                    placeholder="Address"
                    type="email"
                    id="address"
                    className="form-control mt-1 fixed-size-textarea"
                    value={accountHolderAddress}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Password</label>
                  <input
                    placeholder="Password"
                    type="password"
                    id="password"
                    className="form-control mt-1"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Confirm Password</label>
                  <input
                    placeholder="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    className="form-control mt-1"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                <br />
                <div className="d-grid gap-2 mt-3">
                  <button type="submit" className="btn btn-primary">
                    Create Account
                  </button>
                </div>
                <br />
                <p className="text-center mt-2">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <RegistrationDetailShow
            accountNumber={accountNumber}
            accountHolderName={accountHolderName}
            accountHolderPhoneNumber={accountHolderPhoneNumber}
            accountHolderEmail={accountHolderEmail}
            accountHolderAddress={accountHolderAddress}
          />
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
  );
}

export default CreateAccount;
