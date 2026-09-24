import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Users,
    Smartphone,
    Check,
    UserPlus,
    MessageCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAdminTestingSprint,
    getAdminTesters,
    getSprintTesters,
    assignTestersToSprint,
} from "../../services/AppService";
import AdminDailyStandupModal from "../../components/daily-standup/AdminDailyStandupModal";
import SprintChatModal from "../../components/SprintChatModal";

function ManageTestingSprint() {

    const navigate = useNavigate();
    const { sprintId } = useParams();

    const [sprint, setSprint] = useState(null);
    const [testers, setTesters] = useState([]);
    const [assignedTesters, setAssignedTesters] = useState([]);
    const [isDailyActivityOpen, setIsDailyActivityOpen] =
        useState(false);
    const [selectedSprintTesterId, setSelectedSprintTesterId] =
        useState(null);
    const [selectedTesters, setSelectedTesters] =
        useState([]);
    const [chatOpen, setChatOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!sprintId) {
                setError(
                    "Testing Sprint ID is missing."
                );
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const [
                    sprintData,
                    testerData,
                    assignedTesterData,
                ] = await Promise.all([
                    getAdminTestingSprint(sprintId),
                    getAdminTesters(sprintId),
                    getSprintTesters(sprintId),
                ]);
                setSprint(sprintData);
                setTesters(testerData);
                setAssignedTesters(assignedTesterData);
            } catch (err) {
                console.error(
                    "Failed to load Manage Sprint:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load Testing Sprint."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [sprintId]);

    const toggleTester = (testerId) => {
        setSelectedTesters((previous) => {
            if (
                previous.includes(testerId)
            ) {
                return previous.filter(
                    (id) => id !== testerId
                );
            }

            return [
                ...previous,
                testerId,
            ];
        });
    };

    const selectAll = () => {
        const max =
            Number(
                sprint?.testerRequired || 0
            );

        const activeTesters = testers.filter(
            (tester) =>
                tester.status !== "inactive"
        );

        setSelectedTesters(
            activeTesters
                .slice(0, max)
                .map(
                    (tester) =>
                        tester.testerId
                )
        );
    };

    const clearSelection = () => {
        setSelectedTesters([]);
    };

    const handleAssignTesters = async () => {
        if (selectedTesters.length === 0) {
            alert("Please select at least one tester.");
            return;
        }

        try {
            setIsAssigning(true);

            const result =
                await assignTestersToSprint({
                    sprintId,
                    testerIds: selectedTesters,
                });

            alert(
                `${result.assignedCount} tester(s) assigned successfully.`
            );

            // Clear current selection
            setSelectedTesters([]);

            // Reload available testers
            const updatedTesters =
                await getAdminTesters(sprintId);

            setTesters(updatedTesters);

            // Reload assigned testers
            const updatedAssignedTesters =
                await getSprintTesters(sprintId);

            setAssignedTesters(
                updatedAssignedTesters
            );

        } catch (error) {
            console.error(
                "Assign testers error:",
                error
            );

            alert(
                error?.message ||
                "Unable to assign testers."
            );
        } finally {
            setIsAssigning(false);
        }
    };

    const handleOpenDailyActivity = (tester) => {
        setSelectedSprintTesterId(
            tester.sprintTesterId
        );

        setIsDailyActivityOpen(true);
    };

    if (loading) {
        return (
            <div className="admin-manage-page">
                <div className="admin-empty-card">
                    Loading Testing Sprint...
                </div>
            </div>
        );
    }

    if (error || !sprint) {
        return (
            <div className="admin-manage-page">

                <button
                    type="button"
                    className="admin-back-button"
                    onClick={() =>
                        navigate(
                            "/admin/testing-sprints"
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Testing Sprints
                </button>

                <div className="admin-error-card">
                    {error ||
                        "Testing Sprint not found."}
                </div>

            </div>
        );
    }

    return (
        <div className="admin-manage-page">

            {/* Header */}

            <div className="admin-manage-header">

                <div>

                    <button
                        type="button"
                        className="admin-back-button"
                        onClick={() =>
                            navigate(
                                "/admin/testing-sprints"
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Testing Sprints
                    </button>

                    <h1>
                        Manage Testing Sprint
                    </h1>

                    <p>
                        Assign testers to this
                        Testing Sprint.
                    </p>

                </div>

                <span className="admin-sprint-status active">
                    {sprint.status
                        ? sprint.status
                            .charAt(0)
                            .toUpperCase() +
                        sprint.status.slice(1)
                        : "Active"}
                </span>

            </div>


            {/* Sprint Information */}

            <div className="admin-manage-card">

                <div className="admin-manage-app">

                    <div className="admin-manage-app-icon">

                        {sprint.app?.iconUrl ? (
                            <img
                                src={
                                    sprint.app.iconUrl
                                }
                                alt=""
                            />
                        ) : (
                            <Smartphone
                                size={30}
                            />
                        )}

                    </div>

                    <div>

                        <h2>
                            {sprint.app?.appName ||
                                "Android App"}
                        </h2>

                        <p>
                            {sprint.app
                                ?.packageName ||
                                ""}
                        </p>

                        <small>
                            Developer:{" "}
                            {sprint.developer
                                ?.name ||
                                "Unknown"}
                        </small>

                    </div>
                    <button
                        type="button"
                        className="tester-chat-button"
                        onClick={() => setChatOpen(true)}
                    >
                        <MessageCircle size={18} />
                        Chat
                    </button>
                </div>


                <div className="admin-manage-summary">

                    <div>
                        <CalendarDays size={18} />

                        <span>
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
                        <Users size={18} />

                        <span>
                            Testers Required
                        </span>

                        <strong>
                            {
                                sprint.testerRequired
                            }
                        </strong>
                    </div>

                    <div>
                        <Smartphone size={18} />

                        <span>
                            Platform
                        </span>

                        <strong>
                            Android
                        </strong>
                    </div>

                </div>

            </div>


            {/* Tester Assignment */}

            <div className="admin-manage-card">

                <div className="admin-tester-header">

                    <div>

                        <h2>
                            Assign Testers
                        </h2>

                        <p>
                            Select testers who
                            should participate
                            in this Testing Sprint.
                        </p>

                    </div>

                    <div className="admin-selection-count">

                        {selectedTesters.length}
                        {" / "}
                        {sprint.testerRequired}
                        {" selected"}

                    </div>

                </div>


                {/* Toolbar */}

                <div className="admin-tester-toolbar">

                    <button
                        type="button"
                        className="admin-select-button"
                        onClick={selectAll}
                    >
                        Select up to{" "}
                        {sprint.testerRequired}
                    </button>

                    <button
                        type="button"
                        className="admin-clear-button"
                        onClick={
                            clearSelection
                        }
                    >
                        Clear
                    </button>

                </div>


                {/* Testers */}

                {testers.length === 0 ? (

                    <div className="admin-no-testers">

                        <Users size={36} />

                        <strong>
                            No testers available
                        </strong>

                        <p>
                            Tester accounts will
                            appear here when they
                            register.
                        </p>

                    </div>

                ) : (

                    <div className="admin-tester-list">

                        {testers.map((tester) => {

                            const isSelected =
                                selectedTesters.includes(
                                    tester.testerId
                                );

                            const maxReached =
                                selectedTesters.length >=
                                Number(
                                    sprint.testerRequired
                                );

                            const isInactive =
                                tester.status === "inactive";

                            const isDisabled =
                                isInactive ||
                                (!isSelected && maxReached);

                            return (
                                <div
                                    key={tester.testerId}
                                    className={`admin-tester-row ${isSelected
                                        ? "selected"
                                        : ""
                                        } ${isInactive
                                            ? "inactive"
                                            : ""
                                        }`}
                                    onClick={() => {

                                        if (isInactive) {
                                            return;
                                        }

                                        if (
                                            !isSelected &&
                                            maxReached
                                        ) {
                                            return;
                                        }

                                        toggleTester(
                                            tester.testerId
                                        );
                                    }}
                                    style={{
                                        cursor: isDisabled
                                            ? "not-allowed"
                                            : "pointer",
                                        opacity: isInactive
                                            ? 0.6
                                            : 1,
                                    }}
                                >

                                    {/* Checkbox */}
                                    <div
                                        className="admin-tester-check"
                                    >
                                        {isSelected && (
                                            <Check
                                                size={16}
                                            />
                                        )}
                                    </div>


                                    {/* Avatar */}
                                    <div className="admin-tester-avatar">
                                        {(
                                            tester.name ||
                                            "T"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>


                                    {/* Tester Information */}
                                    <div className="admin-tester-info">

                                        <strong>
                                            {tester.name ||
                                                "Tester"}
                                        </strong>

                                        <span>
                                            {tester.email}
                                        </span>

                                    </div>


                                    {/* Status */}
                                    <div className="admin-tester-assignment-status">

                                        <span
                                            className={
                                                isInactive
                                                    ? "inactive"
                                                    : "active"
                                            }
                                        >
                                            {isInactive
                                                ? "Inactive"
                                                : "Active"}
                                        </span>

                                    </div>


                                    {/* Tested Apps */}
                                    <div className="admin-tester-assignment-stat">

                                        <span>
                                            Tested Apps
                                        </span>

                                        <strong>
                                            {tester.testedApps ||
                                                0}
                                        </strong>

                                    </div>


                                    {/* Incomplete Apps */}
                                    <div className="admin-tester-assignment-stat">

                                        <span>
                                            Incomplete Apps
                                        </span>

                                        <strong>
                                            {tester.testIncompleteApps ||
                                                0}
                                        </strong>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}


                {/* Assignment Action */}

                <div className="admin-assignment-footer">

                    <div>

                        <UserPlus size={18} />

                        <span>
                            Selected testers will
                            be assigned to this
                            Testing Sprint.
                        </span>

                    </div>

                    <button
                        type="button"
                        className="admin-assign-button"
                        onClick={handleAssignTesters}
                        disabled={
                            selectedTesters.length === 0 ||
                            isAssigning
                        }
                    >
                        <UserPlus size={17} />

                        {isAssigning
                            ? "Assigning..."
                            : "Assign Selected Testers"}
                    </button>

                </div>

            </div>
            {/* Assigned Testers */}

            <div className="admin-manage-card">

                <div className="admin-tester-header">

                    <div>
                        <h2>
                            Assigned Testers
                        </h2>

                        <p>
                            Testers currently assigned to this
                            Testing Sprint.
                        </p>
                    </div>

                    <div className="admin-selection-count">
                        {assignedTesters.length} assigned
                    </div>

                </div>

                {assignedTesters.length === 0 ? (

                    <div className="admin-no-testers">

                        <Users size={36} />

                        <strong>
                            No testers assigned
                        </strong>

                        <p>
                            Assign testers to this Testing Sprint
                            to see them here.
                        </p>

                    </div>

                ) : (

                    <div className="admin-tester-list">

                        {assignedTesters.map((tester) => (

                            <div
                                key={tester.sprintTesterId}
                                className="admin-tester-row"
                                style={{
                                    cursor: "default",
                                }}
                            >

                                <div className="admin-tester-avatar">
                                    {(
                                        tester.testerName ||
                                        "T"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="admin-tester-info">

                                    <strong>
                                        {tester.testerName ||
                                            "Tester"}
                                    </strong>

                                    <span>
                                        {tester.testerEmail || ""}
                                    </span>

                                </div>

                                <button
                                    type="button"
                                    className="admin-select-button"
                                    onClick={() =>
                                        handleOpenDailyActivity(
                                            tester
                                        )
                                    }
                                >
                                    Daily Activity
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </div>
            <AdminDailyStandupModal
                isOpen={isDailyActivityOpen}
                onClose={() => {
                    setIsDailyActivityOpen(false);
                    setSelectedSprintTesterId(null);
                }}
                sprintTesterId={selectedSprintTesterId}
            />
            <SprintChatModal
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                sprintId={sprintId}
                sprintName={sprint.app?.appName || "Testing Sprint"}
            />
        </div>
    );
}

export default ManageTestingSprint;