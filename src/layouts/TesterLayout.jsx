import { useState } from "react";

import {
    LayoutDashboard,
    ClipboardList,
    CheckSquare,
    Wallet,
    User,
    LogOut,
    Menu,
    X,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TesterLayout({ children }) {

    const { user, logout } = useAuth();

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);


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


    const closeMobileSidebar = () => {
        setMobileSidebarOpen(false);
    };


    return (

        <div
            className={`tester-layout ${
                sidebarCollapsed
                    ? "tester-sidebar-collapsed"
                    : ""
            } ${
                mobileSidebarOpen
                    ? "tester-mobile-sidebar-open"
                    : ""
            }`}
        >

            {/* MOBILE OVERLAY */}

            <div
                className="tester-sidebar-overlay"
                onClick={closeMobileSidebar}
            />


            {/* SIDEBAR */}

            <aside className="tester-sidebar">

                {/* LOGO */}

                <div className="tester-sidebar-logo">

                    <div className="tester-logo-box">
                        CT
                    </div>

                    <span>
                        Complete Testing
                    </span>

                    {/* DESKTOP COLLAPSE */}

                    <button
                        type="button"
                        className="tester-sidebar-collapse-button"
                        onClick={() =>
                            setSidebarCollapsed(
                                !sidebarCollapsed
                            )
                        }
                        title={
                            sidebarCollapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        {sidebarCollapsed ? (
                            <PanelLeftOpen size={18} />
                        ) : (
                            <PanelLeftClose size={18} />
                        )}
                    </button>


                    {/* MOBILE CLOSE */}

                    <button
                        type="button"
                        className="tester-mobile-close-button"
                        onClick={closeMobileSidebar}
                        aria-label="Close menu"
                    >
                        <X size={21} />
                    </button>

                </div>


                {/* NAVIGATION */}

                <nav className="tester-sidebar-nav">

                    {navItems.map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={
                                    closeMobileSidebar
                                }
                                className={({ isActive }) =>
                                    `tester-nav-item ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                                title={
                                    sidebarCollapsed
                                        ? item.label
                                        : ""
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


                {/* BOTTOM */}

                <div className="tester-sidebar-bottom">

                    <div className="tester-profile">

                        <div className="tester-profile-icon">

                            {user?.name
                                ? user.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "T"}

                        </div>


                        <div className="tester-profile-info">

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
                        title={
                            sidebarCollapsed
                                ? "Logout"
                                : ""
                        }
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

                {/* TOPBAR */}

                <header className="tester-topbar">

                    {/* MOBILE MENU */}

                    <button
                        type="button"
                        className="tester-mobile-menu-button"
                        onClick={() =>
                            setMobileSidebarOpen(true)
                        }
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </button>


                    <div>

                        <h2>
                            Tester Dashboard
                        </h2>

                    </div>


                    <div className="tester-topbar-profile">

                        <div className="tester-topbar-icon">

                            {user?.name
                                ? user.name
                                    .charAt(0)
                                    .toUpperCase()
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


                {/* CONTENT */}

                <main className="tester-content">

                    {children}

                </main>

            </div>

        </div>

    );
}

export default TesterLayout;