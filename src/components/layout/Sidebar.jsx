import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Smartphone,
  ClipboardList,
  Users,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">CT</div>
        <span>Complete Testing</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/developer/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/developer/apps"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Smartphone size={20} />
          <span>My Apps</span>
        </NavLink>

        <NavLink
          to="/developer/testing-sprints"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <ClipboardList size={20} />
          <span>Testing Sprints</span>
        </NavLink>

        <a href="#" className="sidebar-link">
          <Users size={20} />
          <span>Testers</span>
        </a>

        <a href="#" className="sidebar-link">
          <Wallet size={20} />
          <span>Payments</span>
        </a>

        <a href="#" className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </a>
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-link"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;