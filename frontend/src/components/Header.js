// import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React from "react";
import "../components/style/style-Navbar.css";
// import { Link } from "react-router-dom";
import mainLogo from "./assets/main-logo.png";


export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("accountNumber");
    navigate("/login");
  };

  return (
    <div className="header-section" id="sticky">
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ flexWrap: "nowrap" }}
      >
        <div className="container-fluid">
          <a className="nav-title" href="/home/dashboard">
            <img src={mainLogo} height="50" alt="JT Logo" loading="lazy" />
          </a>
          <div className="logout-button-container">
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleLogout}
              style={{ textWrap: "nowrap" }}
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
