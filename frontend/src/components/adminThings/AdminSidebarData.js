import React from "react";
import { MdNoAccounts } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";


export const AdminSidebarData = [
  {
    title: "Get All Users",
    path: "/admin/get-all-user",
    icon: <TbListDetails />,
  },
  {
    title: "Delete Account",
    path: "/admin/delete-account",
    icon: <MdNoAccounts />,
  },
  ];
