import {
    LayoutDashboard,
    ClipboardList,
    CheckSquare,
    Wallet,
    User,
    LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TesterLayout({ children }) {
    const { user, logout } = useAuth();

    const navItems = [
        {
            label: "Dashboard",
            path: "/tester/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "My Testing Sprints",
            path: "/tester/testing-sprints",
            icon: ClipboardList,
        },
        {
            label: "Completed Tests",
            path: "/tester/completed-tests",
            icon: CheckSquare,
        },
        {
            label: "Wallet",
            path: "/tester/wallet",
            icon: Wallet,
        },
        {
            label: "Profile",
            path: "/tester/profile",
            icon: User,
        },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(
                "Tester logout error:",
                error
            );
        }
    };

    return (
        <div className="tester-layout">

            {/* SIDEBAR */}

            <aside className="tester-sidebar">

                <div className="tester-sidebar-logo">

                    <div className="tester-logo-box">
                        CT
                    </div>

                    <span>
                        Complete Testing
                    </span>

                </div>


                <nav className="tester-sidebar-nav">

                    {navItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `tester-nav-item ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >
                                <Icon size={20} />

                                <span>
                                    {item.label}
                                </span>

                            </NavLink>
                        );

                    })}

                </nav>


                <div className="tester-sidebar-bottom">

                    <div className="tester-profile">

                        <div className="tester-profile-icon">
                            {user?.name
                                ? user.name.charAt(0).toUpperCase()
                                : "T"}
                        </div>

                        <div>
                            <strong>
                                {user?.name || "Tester"}
                            </strong>

                            <span>
                                Tester
                            </span>
                        </div>

                    </div>


                    <button
                        type="button"
                        className="tester-logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={19} />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </aside>


            {/* MAIN */}

            <div className="tester-main">

                <header className="tester-topbar">

                    <div>
                        <h2>
                            Tester Dashboard
                        </h2>
                    </div>


                    <div className="tester-topbar-profile">

                        <div className="tester-topbar-icon">
                            {user?.name
                                ? user.name.charAt(0).toUpperCase()
                                : "T"}
                        </div>

                        <div>
                            <strong>
                                {user?.name || "Tester"}
                            </strong>

                            <span>
                                Tester Account
                            </span>
                        </div>

                    </div>

                </header>


                <main className="tester-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default TesterLayout;