import { useEffect, useState } from "react";
import {
    CalendarDays,
    Smartphone,
    Users,
    Eye,
    CheckCircle,
    AlertCircle,
    Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
    getTesterAssignedSprints,
} from "../../services/AppService";

function CompletedTests() {
    const { user } = useAuth();
    const navigate = useNavigate();

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

                const result =
                    await getTesterAssignedSprints(
                        user.employeeId
                    );

                setAssignments(result);

            } catch (err) {

                console.error(
                    "Failed to load Testing Sprints:",
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

        loadAssignments();

    }, [user?.employeeId]);


    /*
     * Completed
     *
     * Sprint finished and all required
     * testing activities were completed.
     */
    const completedAssignments =
        assignments.filter(
            (assignment) =>
                assignment.tested === true
        );


    /*
     * Incomplete
     *
     * Sprint finished but one or more
     * required testing activities were not completed.
     */
    const incompleteAssignments =
        assignments.filter(
            (assignment) =>
                assignment.testIncomplete === true
        );


    /*
     * In Progress
     *
     * Sprint is still ongoing.
     *
     * It is neither completed nor marked
     * as incomplete.
     */
    const inProgressAssignments =
        assignments.filter(
            (assignment) =>
                assignment.tested !== true &&
                assignment.testIncomplete !== true
        );


    const renderSprintCard = (
        assignment,
        type
    ) => {

        const sprint =
            assignment.sprint;

        const app =
            assignment.app;

        if (!sprint) {
            return null;
        }

        const isCompleted =
            type === "completed";

        const isIncomplete =
            type === "incomplete";

        return (
            <div
                key={
                    assignment.sprintTesterId
                }
                className="tester-history-card"
            >

                {/* App */}

                <div className="tester-history-app">

                    <div className="tester-history-icon">

                        {app?.iconUrl ? (

                            <img
                                src={
                                    app.iconUrl
                                }
                                alt={
                                    app.appName ||
                                    "App"
                                }
                            />

                        ) : (

                            <Smartphone
                                size={26}
                            />

                        )}

                    </div>

                    <div className="tester-history-app-info">

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

                <div className="tester-history-details">

                    <div className="tester-history-detail">

                        <span>
                            <CalendarDays
                                size={14}
                            />
                            Duration
                        </span>

                        <strong>
                            {
                                sprint.durationDays
                            } Days
                        </strong>

                    </div>


                    <div className="tester-history-detail">

                        <span>
                            <Users
                                size={14}
                            />
                            Testers
                        </span>

                        <strong>
                            {
                                sprint.testerRequired
                            }
                        </strong>

                    </div>


                    <div className="tester-history-detail">

                        <span>
                            <Smartphone
                                size={14}
                            />
                            Platform
                        </span>

                        <strong>
                            Android
                        </strong>

                    </div>

                </div>


                {/* Status */}

                <div className="tester-history-status">

                    {isCompleted ? (

                        <span className="tester-history-badge completed">

                            <CheckCircle
                                size={14}
                            />

                            Completed

                        </span>

                    ) : isIncomplete ? (

                        <span className="tester-history-badge incomplete">

                            <AlertCircle
                                size={14}
                            />

                            Incomplete

                        </span>

                    ) : (

                        <span className="tester-history-badge progress">

                            <Clock3
                                size={14}
                            />

                            In Progress

                        </span>

                    )}

                </div>


                {/* Action */}

                <div className="tester-history-action">

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                `/tester/testing-sprints/${assignment.sprintTesterId}`
                            )
                        }
                    >

                        <Eye
                            size={16}
                        />

                        View Testing Sprint

                    </button>

                </div>

            </div>
        );
    };


    if (loading) {

        return (
            <div className="dashboard-page">

                <div className="form-card">
                    Loading Tests...
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

            


            {/* ================================================= */}
            {/* COMPLETED */}
            {/* ================================================= */}

            <div className="form-card">

                <div className="page-section-header">

                    <div>

                        <h2>
                            Completed Testing Sprints
                        </h2>

                        <p>
                            Testing Sprints that you
                            completed successfully.
                        </p>

                    </div>

                    <span className="tester-section-count">
                        {completedAssignments.length}
                    </span>

                </div>


                {completedAssignments.length === 0 ? (

                    <div className="tester-empty-state">

                        <CheckCircle
                            size={42}
                        />

                        <h3>
                            No Completed Testing Sprints
                        </h3>

                        <p>
                            You don't have any completed
                            Testing Sprints yet.
                        </p>

                    </div>

                ) : (

                    <div className="tester-history-list">

                        {completedAssignments.map(
                            (assignment) =>
                                renderSprintCard(
                                    assignment,
                                    "completed"
                                )
                        )}

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* INCOMPLETE */}
            {/* ================================================= */}

            <div
                className="form-card"
                style={{
                    marginTop: "24px"
                }}
            >

                <div className="page-section-header">

                    <div>

                        <h2>
                            Incomplete Testing Sprints
                        </h2>

                        <p>
                            Testing Sprints that were not
                            fully completed.
                        </p>

                    </div>

                    <span className="tester-section-count">
                        {incompleteAssignments.length}
                    </span>

                </div>


                {incompleteAssignments.length === 0 ? (

                    <div className="tester-empty-state">

                        <AlertCircle
                            size={42}
                        />

                        <h3>
                            No Incomplete Testing Sprints
                        </h3>

                        <p>
                            You don't have any incomplete
                            Testing Sprints.
                        </p>

                    </div>

                ) : (

                    <div className="tester-history-list">

                        {incompleteAssignments.map(
                            (assignment) =>
                                renderSprintCard(
                                    assignment,
                                    "incomplete"
                                )
                        )}

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* IN PROGRESS */}
            {/* ================================================= */}

            <div
                className="form-card"
                style={{
                    marginTop: "24px"
                }}
            >

                <div className="page-section-header">

                    <div>

                        <h2>
                            In Progress Testing Sprints
                        </h2>

                        <p>
                            Testing Sprints that are
                            currently in progress.
                        </p>

                    </div>

                    <span className="tester-section-count">
                        {inProgressAssignments.length}
                    </span>

                </div>


                {inProgressAssignments.length === 0 ? (

                    <div className="tester-empty-state">

                        <Clock3
                            size={42}
                        />

                        <h3>
                            No In Progress Testing Sprints
                        </h3>

                        <p>
                            You don't have any Testing
                            Sprints in progress.
                        </p>

                    </div>

                ) : (

                    <div className="tester-history-list">

                        {inProgressAssignments.map(
                            (assignment) =>
                                renderSprintCard(
                                    assignment,
                                    "in-progress"
                                )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default CompletedTests;