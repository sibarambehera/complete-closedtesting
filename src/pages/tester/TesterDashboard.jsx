import { useEffect, useState } from "react";
import {
    CheckCircle,
    Clock,
    Smartphone,
    Users,
    Wallet,
    Eye,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
    getTesterAssignedSprints,
} from "../../services/AppService";

function TesterDashboard() {
    const { user } = useAuth();

    const [assignments, setAssignments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadAssignments = async () => {
            if (!user?.employeeId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data =
                    await getTesterAssignedSprints(
                        user.employeeId
                    );

                console.log(
                    "Tester Assigned Sprints:",
                    data
                );

                setAssignments(data);

            } catch (err) {
                console.error(
                    "Failed to load tester assignments:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load your Testing Sprints."
                );

            } finally {
                setLoading(false);
            }
        };

        loadAssignments();

    }, [user?.employeeId]);


    const activeAssignments =
        assignments.filter(
            (item) =>
                item.sprint?.status === "active" &&
                !item.tested
        );


    const completedAssignments =
        assignments.filter(
            (item) =>
                item.tested === true
        );


    const totalEarnings =
        completedAssignments.reduce(
            (total, item) =>
                total +
                Number(
                    item.sprint
                        ?.testerPayoutPerTester ||
                    100
                ),
            0
        );


    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="form-card">
                    Loading Tester Dashboard...
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="dashboard-page">
                <div className="form-card">
                    <p className="form-error">
                        {error}
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="dashboard-page">

            {/* Header */}

            <div className="page-header">

                <div>
                  
                    <p>
                        - Track your assigned Testing
                        Sprints and testing progress.
                    </p>
                </div>

            </div>


            {/* Summary Cards */}

            <div className="tester-summary-grid">

                {/* Earnings */}

                <div className="tester-summary-card">

                    <div className="tester-summary-icon">
                        <Wallet size={22} />
                    </div>

                    <div>
                        <span>
                            Total Earnings
                        </span>

                        <strong>
                            ₹{totalEarnings}
                        </strong>
                    </div>

                </div>


                {/* Active Tests */}

                <div className="tester-summary-card">

                    <div className="tester-summary-icon">
                        <Clock size={22} />
                    </div>

                    <div>
                        <span>
                            Active Tests
                        </span>

                        <strong>
                            {activeAssignments.length}
                        </strong>
                    </div>

                </div>


                {/* Completed */}

                <div className="tester-summary-card">

                    <div className="tester-summary-icon">
                        <CheckCircle size={22} />
                    </div>

                    <div>
                        <span>
                            Completed
                        </span>

                        <strong>
                            {completedAssignments.length}
                        </strong>
                    </div>

                </div>

            </div>


            {/* Active Testing Sprints */}

            <div className="form-card tester-assignments-card">

                <div className="tester-section-header">

                    <div>
                        <h2>
                            Active Testing Sprints
                        </h2>

                        <p>
                            Testing Sprints assigned
                            to you by the administrator.
                        </p>
                    </div>

                    <Users size={22} />

                </div>


                {activeAssignments.length === 0 ? (

                    <div className="tester-empty-state">

                        <Smartphone size={38} />

                        <h3>
                            No active Testing Sprints
                        </h3>

                        <p>
                            You don't have any active
                            Testing Sprints assigned
                            right now.
                        </p>

                    </div>

                ) : (

                    <div className="tester-sprint-list">

                        {activeAssignments.map(
                            (assignment) => {

                                const app =
                                    assignment.app;

                                const sprint =
                                    assignment.sprint;

                                return (
                                    <div
                                        key={
                                            assignment
                                                .sprintTesterId
                                        }
                                        className="tester-sprint-card"
                                    >

                                        {/* App */}

                                        <div className="tester-sprint-app">

                                            <div className="tester-sprint-icon">

                                                {app?.iconUrl ? (

                                                    <img
                                                        src={
                                                            app.iconUrl
                                                        }
                                                        alt={
                                                            app.appName
                                                        }
                                                    />

                                                ) : (

                                                    <Smartphone
                                                        size={28}
                                                    />

                                                )}

                                            </div>


                                            <div>

                                                <h3>
                                                    {
                                                        app?.appName ||
                                                        "Android App"
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        app?.packageName ||
                                                        ""
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        {/* Details */}

                                        <div className="tester-sprint-details">

                                            <div>
                                                <span>
                                                    Duration
                                                </span>

                                                <strong>
                                                    {
                                                        sprint?.durationDays ||
                                                        14
                                                    }{" "}
                                                    Days
                                                </strong>
                                            </div>


                                            <div>
                                                <span>
                                                    Tester Payout
                                                </span>

                                                <strong>
                                                    ₹
                                                    {
                                                        sprint?.testerPayoutPerTester ||
                                                        100
                                                    }
                                                </strong>
                                            </div>


                                            <div>
                                                <span>
                                                    Platform
                                                </span>

                                                <strong>
                                                    Android
                                                </strong>
                                            </div>

                                        </div>


                                        {/* Status / Action */}

                                        <div className="tester-sprint-action">

                                            <span className="tester-active-badge">
                                                Active
                                            </span>

                                            <button
                                                type="button"
                                                className="primary-button"
                                            >
                                                <Eye
                                                    size={17}
                                                />
                                                Open Testing Sprint
                                            </button>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default TesterDashboard;