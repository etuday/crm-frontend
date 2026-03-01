import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="sidebar">
        <h2>CRM Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li>Tickets</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </div>

      <div className="main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;