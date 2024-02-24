import React from "react";
import { useNavigate } from "react-router-dom";
// import Logo1 from "./assets/logo-1.png";
// import Logo2 from "./assets/logo-2.png";
import mainLogo from "./assets/main-logo.png";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const RegistrationDetailShow = ({
  accountNumber,
  accountHolderName,
  accountHolderPhoneNumber,
  accountHolderEmail,
  accountHolderAddress,
}) => {
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");

  function navigateToLogin() {
    navigate("/Login");
  }

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

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/Login">
            <img src={mainLogo} height="50" alt="JT Logo" loading="lazy" />
            {/* <img src={Logo1} height="50" alt="JT Logo" loading="lazy" /> */}
          </a>
        </div>
      </nav>

      <div className="login">
        <form className="Auth-detail-container" onClick={navigateToLogin}>
          <div className="Auth-form">
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Registration Successful!</h3>
              <h5 className="Auth-form-subtitle">Account Holder's Details</h5>
              <div className="form-group mt-3">
                <label>Account Number:-</label>
                <span style={{ fontWeight: "bold" }}>{accountNumber}</span>
              </div>
              <div className="form-group mt-3">
                <label>Name:-</label>
                <span style={{ fontWeight: "bold" }}>{accountHolderName}</span>
              </div>
              <div className="form-group mt-3">
                <label>PhoneNumber:-</label>
                <span style={{ fontWeight: "bold" }}>
                  {accountHolderPhoneNumber}
                </span>
              </div>
              <div className="form-group mt-3">
                <label>Email:-</label>
                <span style={{ fontWeight: "bold" }}>{accountHolderEmail}</span>
              </div>
              <div className="form-group mt-3">
                <label>Address:-</label>
                <span style={{ fontWeight: "bold" }}>
                  {accountHolderAddress}
                </span>
              </div>
              <br />
              <div className="d-grid gap-2 mt-1.5">
                <button type="submit" className="btn btn-primary">
                  Continue To Login...
                </button>
              </div>
              <div
                style={{
                  fontStyle: "oblique",
                  fontWeight: "bold",
                  color: "red",
                  marginTop: "4%",
                  textDecorationLine: "underline",
                }}
              >
                Note: Remember Your Account Number.
              </div>
              <br />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
