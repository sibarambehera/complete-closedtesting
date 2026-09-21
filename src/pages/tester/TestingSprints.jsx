import { useEffect, useState } from "react";
import {
    CalendarDays,
    Smartphone,
    Users,
    Eye,
    CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
    getTesterAssignedSprints,
} from "../../services/AppService";

function TestingSprints() {
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
                    "Failed to load assigned Testing Sprints:",
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


    if (loading) {

        return (
            <div className="dashboard-page">

                <div className="form-card">
                    Loading Testing Sprints...
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

                    <h1>
                        My Testing Sprints
                    </h1>

                    <p>
                        Testing Sprints assigned to you
                        by the administrator.
                    </p>

                </div>

            </div>


            {/* Empty State */}

            {assignments.length === 0 ? (

                <div className="form-card">

                    <div className="tester-empty-state">

                        <Smartphone size={42} />

                        <h3>
                            No Testing Sprints Assigned
                        </h3>

                        <p>
                            You don't have any Testing
                            Sprints assigned right now.
                        </p>

                    </div>

                </div>

            ) : (

                <div className="tester-sprint-list">

                    {assignments.map(
                        (assignment) => {

                            const sprint =
                                assignment.sprint;

                            const app =
                                assignment.app;

                            if (!sprint) {
                                return null;
                            }

                            return (

                                <div
                                    key={
                                        assignment.sprintTesterId
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
                                                        app.appName ||
                                                        "App"
                                                    }
                                                />

                                            ) : (

                                                <Smartphone
                                                    size={30}
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


                                        <div>

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


                                        <div>

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


                                    {/* Status / Action */}

                                    <div className="tester-sprint-action">

                                        <span className="tester-active-badge">
                                            <CheckCircle
                                                size={14}
                                            />

                                            Assigned
                                        </span>


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
                        }
                    )}

                </div>

            )}

        </div>
    );
}

export default TestingSprints;