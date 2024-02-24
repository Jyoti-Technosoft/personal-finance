import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import mainLogo from "../assets/main-logo.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setIsSidebarOpen } from "../../reduxSlices/navbarSlice";

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "-100%" : "0")};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

export const Navbar = () => {
  const dispatch = useDispatch();
  const valIsSidebarOpen = useSelector(
    (state) => state.navbarSlice.isSidebarOpen
  );
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    // console.log("im here");
    if (valIsSidebarOpen === "true") {
      dispatch(setIsSidebarOpen("false"));
      // console.log(valIsSidebarOpen);
    } else {
      dispatch(setIsSidebarOpen("true"));
      // console.log(valIsSidebarOpen);
    }
    setSidebar(!sidebar);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("accountNumber");
    navigate("/login");
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav style={{ justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <NavIcon to="#">
              <FaIcons.FaBars onClick={showSidebar} />
            </NavIcon>
          </div>
          <div
            style={{
              flexGrow: 1,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <a
              className="nav-title"
              href="/home/dashboard"
              style={{ justifyContent: "center" }}
            >
              <img src={mainLogo} height="50" alt="JT Logo" loading="lazy" />
            </a>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleLogout}
              style={{ whiteSpace: "nowrap", marginRight: "15px" }}
            >
              Log Out
            </button>
          </div>
        </Nav>

        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to="#">
              <AiIcons.AiOutlineClose onClick={showSidebar} />
            </NavIcon>
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};
