import { useEffect, useState } from "react";
import {
    CalendarDays,
    Users,
    Smartphone,
    Eye,
    Search,
    RefreshCw,
    ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAdminTestingSprints } from "../../services/AppService";

function TestingSprints() {
    const navigate = useNavigate();

    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const loadSprints = async () => {
        try {
            setLoading(true);
            setError("");

            const result =
                await getAdminTestingSprints();

            setSprints(result);
        } catch (err) {
            console.error(
                "Failed to load Admin Testing Sprints:",
                err
            );

            setError(
                err?.message ||
                "Unable to load Testing Sprints."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSprints();
    }, []);

    const filteredSprints = sprints.filter(
        (sprint) => {
            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            if (!search) {
                return true;
            }

            const appName =
                sprint.app?.appName || "";

            const packageName =
                sprint.app?.packageName || "";

            const developerName =
                sprint.developer?.name || "";

            const developerEmail =
                sprint.developer?.email || "";

            return (
                appName
                    .toLowerCase()
                    .includes(search) ||
                packageName
                    .toLowerCase()
                    .includes(search) ||
                developerName
                    .toLowerCase()
                    .includes(search) ||
                developerEmail
                    .toLowerCase()
                    .includes(search)
            );
        }
    );

    const formatDate = (timestamp) => {
        if (!timestamp) {
            return "-";
        }

        try {
            const date = timestamp.toDate();

            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }
            );
        } catch {
            return "-";
        }
    };

    const getStatusClass = (status) => {
        if (status === "active") {
            return "admin-sprint-status active";
        }

        if (status === "completed") {
            return "admin-sprint-status completed";
        }

        return "admin-sprint-status draft";
    };

    return (
        <div className="admin-sprints-page">

            {/* =================================
                PAGE HEADER
            ================================= */}

            <div className="admin-page-header">

                <div>

                    <h1>
                        Testing Sprints
                    </h1>

                    <p>
                        View and manage Testing
                        Sprints across the platform.
                    </p>

                </div>

                <button
                    type="button"
                    className="admin-refresh-button"
                    onClick={loadSprints}
                    disabled={loading}
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "admin-spin"
                                : ""
                        }
                    />

                    Refresh
                </button>

            </div>


            {/* =================================
                SEARCH
            ================================= */}

            <div className="admin-sprints-toolbar">

                <div className="admin-search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search app, developer or package..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="admin-sprint-count">

                    {filteredSprints.length}{" "}
                    Sprint
                    {filteredSprints.length !== 1
                        ? "s"
                        : ""}

                </div>

            </div>


            {/* =================================
                LOADING
            ================================= */}

            {loading && (

                <div className="admin-empty-card">

                    <ClipboardList size={32} />

                    <strong>
                        Loading Testing Sprints...
                    </strong>

                </div>

            )}


            {/* =================================
                ERROR
            ================================= */}

            {!loading && error && (

                <div className="admin-error-card">

                    {error}

                    <button
                        type="button"
                        onClick={loadSprints}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* =================================
                EMPTY
            ================================= */}

            {!loading &&
                !error &&
                filteredSprints.length === 0 && (

                    <div className="admin-empty-card">

                        <ClipboardList size={36} />

                        <strong>
                            No Testing Sprints found
                        </strong>

                        <p>
                            Testing Sprints created
                            by developers will
                            appear here.
                        </p>

                    </div>
                )}


            {/* =================================
                SPRINT LIST
            ================================= */}

            {!loading &&
                !error &&
                filteredSprints.length > 0 && (

                    <div className="admin-sprint-list">

                        {filteredSprints.map(
                            (sprint) => {

                                const app =
                                    sprint.app;

                                const developer =
                                    sprint.developer;

                                return (
                                    <div
                                        className="admin-sprint-card"
                                        key={
                                            sprint.sprintId
                                        }
                                    >

                                        {/* Top */}

                                        <div className="admin-sprint-card-top">

                                            <div className="admin-sprint-app">

                                                <div className="admin-sprint-app-icon">

                                                    {app?.iconUrl ? (
                                                        <img
                                                            src={
                                                                app.iconUrl
                                                            }
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <Smartphone
                                                            size={
                                                                28
                                                            }
                                                        />
                                                    )}

                                                </div>

                                                <div>

                                                    <h2>
                                                        {app?.appName ||
                                                            "Android App"}
                                                    </h2>

                                                    <p>
                                                        {app?.packageName ||
                                                            "Package not available"}
                                                    </p>

                                                </div>

                                            </div>


                                            <span
                                                className={getStatusClass(
                                                    sprint.status
                                                )}
                                            >
                                                {sprint.status
                                                    ? sprint.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    sprint.status.slice(
                                                        1
                                                    )
                                                    : "Draft"}
                                            </span>

                                        </div>


                                        {/* Details */}

                                        <div className="admin-sprint-details">

                                            <div>

                                                <span>
                                                    Developer
                                                </span>

                                                <strong>
                                                    {developer?.name ||
                                                        "Unknown"}
                                                </strong>

                                                <small>
                                                    {developer?.email ||
                                                        ""}
                                                </small>

                                            </div>


                                            <div>

                                                <span>
                                                    <CalendarDays
                                                        size={15}
                                                    />
                                                    Duration
                                                </span>

                                                <strong>
                                                    {
                                                        sprint.durationDays
                                                    }{" "}
                                                    Days
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    <Users
                                                        size={15}
                                                    />
                                                    Testers
                                                </span>

                                                <strong>
                                                    0 /{" "}
                                                    {
                                                        sprint.testerRequired
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    <Smartphone
                                                        size={15}
                                                    />
                                                    Platform
                                                </span>

                                                <strong>
                                                    Android
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Created
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        sprint.createdAt
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* Bottom */}

                                        <div className="admin-sprint-card-bottom">

                                            <div className="admin-sprint-goal">

                                                <span>
                                                    Testing Goal
                                                </span>

                                                <p>
                                                    {sprint.testingGoal ||
                                                        "No testing goal provided."}
                                                </p>

                                            </div>


                                            <button
                                                type="button"
                                                className="admin-manage-sprint-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/testing-sprints/${sprint.sprintId}`
                                                    )
                                                }
                                            >
                                                <Eye
                                                    size={17}
                                                />

                                                Manage Sprint
                                            </button>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

        </div>
    );
}

export default TestingSprints;