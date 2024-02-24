import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
// import "./style/component-style.css";
import { Modal, Button } from "react-bootstrap"; // Add import for Modal and Button
// import { toast } from "react-toastify";
import "./style/style-Login.css";
import { useEffect } from "react";
// import 

export const Login = () => {
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  // const [authToken, setAuthToken] = useState("");
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

  const LoginAction = async (e) => {
    e.preventDefault();
    if (!accountNumber || !password) {
      showAlert("AccountNumber or Password cannot be blank");
    }
    console.log("AccountNumber:", accountNumber, "\nPassword:", password);

    if (accountNumber === "JTBANKadmin" && password === "987654321") {
      Cookies.set("password", password, {
        expires: 0.5,
        sameSite: "lax", // or 'none' if using HTTPS
        secure: true, // set to true if using HTTPS
      });
      Cookies.set("accountNumber", accountNumber, {
        expires: 0.5,
        sameSite: "lax", // or 'none' if using HTTPS
        secure: true, // set to true if using HTTPS
      });

      navigate("/admin/jtBankAdmin", {
        state: { accountNumber: accountNumber },
      });
      setPassword("");
      setAccountNumber("");
    }



    try {
      let loginData = {
        accountNumber: accountNumber,
        password: password,
      };

      let loginUser = await axios.post(
        "http://localhost:8180/api/users/login",
        loginData
      );
      showAlert("User Login Successfully!!");
      // console.log(loginUser.data);
      // console.log("Token:", loginUser.data.token);

      const userAuthToken = loginUser.data.token;

      // console.log(userAuthToken);

      // setAuthToken(userAuthToken);

      if (userAuthToken) {
        Cookies.set("authToken", userAuthToken, {
          expires: 0.5,
          sameSite: "lax", // or 'none' if using HTTPS
          secure: true, // set to true if using HTTPS
        });
      }
      if (accountNumber) {
        Cookies.set("accountNumber", accountNumber, {
          expires: 0.5,
          sameSite: "lax", // or 'none' if using HTTPS
          secure: true, // set to true if using HTTPS
        });

        navigate("/home/dashboard", {
          state: { accountNumber: accountNumber },
        });
        // alert("Login Successful");
        setPassword("");
        setAccountNumber("");
      } else {
        console.log("Token not generated. Redirect to login page.");
        showAlert("Login failed...please check your credentials");
        setPassword("");
        setAccountNumber("");
      }
    } catch (err) {
      console.log("Enter Valid Details..!");
      if (accountNumber || password) {
        showAlert("Invalid AccountNumber or Password Entered..!");
        setPassword("");
        setAccountNumber("");
      }
    }

    // Clear the fields after successful login
    // setAccountNumber("");
    // setPassword("");
  };

  return (
    <div className="login">
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={LoginAction}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Log In</h3>
            <div className="form-group mt-3">
              <label>Account Number</label>
              <input
                placeholder="Account Number"
                type="text"
                value={accountNumber}
                className="form-control"
                id="accountNumber"
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                placeholder="Password"
                type="password"
                value={password}
                className="form-control my-1"
                id="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <br />
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <br />
            <p className="forgot-password text-right mt-2">
              Don't have an account?{" "}
              <Link to="/create-account">Create One</Link>
            </p>
          </div>
        </form>
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
  );
};
