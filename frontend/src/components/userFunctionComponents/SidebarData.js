import React from "react";
import { MdDashboard } from "react-icons/md";
import { GiPiggyBank } from "react-icons/gi";
import { HiMiniBanknotes } from "react-icons/hi2";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaUserLock } from "react-icons/fa";
import { FaListAlt } from "react-icons/fa";
import { GrHistory } from "react-icons/gr";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/home/dashboard",
    icon: <MdDashboard />,
  },
  {
    title: "Deposit",
    path: "/home/deposit",
    icon: <GiPiggyBank />,
  },
  {
    title: "Withdraw",
    path: "/home/withdraw",
    icon: <HiMiniBanknotes />,
  },
  {
    title: "Fund Transfar",
    path: "/home/fund-transfar",
    icon: <FaMoneyBillTransfer />,
  },
  {
    title: "Account Pin",
    path: "/home/account-pin",
    icon: <FaUserLock />,
  },
  {
    title: "Account Details",
    path: "/home/account-details",
    icon: <FaListAlt />,
  },
  {
    title: "Transection History",
    path: "/home/transection-history",
    icon: <GrHistory />,
  },
];
