import Sidebar from "./Sidebar";
import { Outlet } from "react-router";
import { useState } from "react";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
