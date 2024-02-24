import React from "react";
import { Link } from "react-router-dom";
import "./style/home-sidebar-style.css";

export const Sidebar = () => {
  return (
    <>
      <div>
        <div id="wrapper" className="toggled">
          <div id="sidebar-wrapper">
            <ul className="sidebar-nav">
              <li>
                <Link to="/home/dashboard" className="link-opacity-75">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/home/deposit" className="link-opacity-75">
                  Deposit
                </Link>
              </li>
              <li>
                <Link to="/home/withdraw" className="link-opacity-75">
                  Withdraw
                </Link>
              </li>
              <li>
                <Link to="/home/fund-transfar" className="link-opacity-75">
                  Fund Transfar
                </Link>
              </li>
              <li>
                <Link to="/home/account-pin" className="link-opacity-75">
                  Account Pin
                </Link>
              </li>
              <li>
                <Link to="/home/account-details" className="link-opacity-75">
                  Account Details
                </Link>
              </li>
              <li>
                <Link to="/home/transection-history" className="link-opacity-75">
                  Transection History
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
