import { Bell, UserCircle } from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">
      <div>
        <h2>Developer Dashboard</h2>
      </div>

      <div className="topbar-actions">
        <button className="icon-button">
          <Bell size={21} />
        </button>

        <div className="user-info">
          <UserCircle size={32} />
          <div>
            <strong>Developer</strong>
            <small>Developer Account</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;