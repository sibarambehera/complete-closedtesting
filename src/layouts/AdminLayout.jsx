import {
    LayoutDashboard,
    Smartphone,
    Users,
    UsersRound,
    ClipboardList,
    CreditCard,
    Settings,
    LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout({ children }) {
    const { logout } = useAuth();

    const navItems = [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Apps",
            path: "/admin/apps",
            icon: Smartphone,
        },
        {
            label: "Testers",
            path: "/admin/testers",
            icon: Users,
        },
        {
            label: "Developers",
            path: "/admin/developers",
            icon: UsersRound,
        },
        {
            label: "Testing Sprints",
            path: "/admin/testing-sprints",
            icon: ClipboardList,
        },
        {
            label: "Payments",
            path: "/admin/payments",
            icon: CreditCard,
        },
        {
            label: "Settings",
            path: "/admin/settings",
            icon: Settings,
        },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(
                "Admin logout error:",
                error
            );
        }
    };

    return (
        <div className="admin-layout">

            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside className="admin-sidebar">

                {/* Logo */}

                <div className="admin-sidebar-logo">

                    <div className="admin-logo-box">
                        CT
                    </div>

                    <span>
                        Complete Testing
                    </span>

                </div>


                {/* Navigation */}

                <nav className="admin-sidebar-nav">

                    {navItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `admin-nav-item ${isActive
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


                {/* Logout */}

                <div className="admin-sidebar-bottom">

                    <button
                        type="button"
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={19} />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </aside>


            {/* =====================================
                MAIN
            ===================================== */}

            <div className="admin-main">

                {/* Topbar */}

                <header className="admin-topbar">

                    <div>
                        <h2>
                            Admin Dashboard
                        </h2>
                    </div>

                    <div className="admin-profile">

                        <div className="admin-profile-icon">
                            A
                        </div>

                        <div>
                            <strong>
                                Administrator
                            </strong>

                            <span>
                                Admin Account
                            </span>
                        </div>

                    </div>

                </header>


                {/* Page Content */}

                <main className="admin-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;