import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Users,
    Target,
    FileText,
    Smartphone,
    TrendingUp,
    Eye,
    Check,
    X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
    getTestingSprint,
    getDeveloperApp,
    getSprintTesters,
    markTesterDownloaded,
    markTesterTested,
} from "../../services/AppService";
import DeveloperDailyStandupModal from "../../components/daily-standup/DeveloperDailyStandupModal";


function SprintDetails() {
    const navigate = useNavigate();
    const { sprintId } = useParams();
    const { user } = useAuth();

    const [sprint, setSprint] = useState(null);
    const [app, setApp] = useState(null);
    const [testers, setTesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDailyStandupOpen, setIsDailyStandupOpen] = useState(false);
    const [selectedSprintTesterId, setSelectedSprintTesterId] = useState(null);

    const downloadedCount = testers.filter(
        (tester) => tester.downloaded === true
    ).length;

    const testerCount = testers.length;

    const handleOpenDailyActivity = (tester) => {
        setSelectedSprintTesterId(tester.sprintTesterId);
        setIsDailyStandupOpen(true);
    };

    useEffect(() => {
        const loadSprint = async () => {
            if (!user?.uid || !sprintId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const sprintData = await getTestingSprint(
                    sprintId,
                    user.uid
                );

                setSprint(sprintData);

                const appData = await getDeveloperApp(
                    sprintData.appId,
                    user.uid
                );

                setApp(appData);

                const testerData =
                    await getSprintTesters(sprintId);

                setTesters(testerData);

                console.log(
                    "Assigned Sprint Testers:",
                    testerData
                );

            } catch (err) {
                console.error(
                    "Failed to load Testing Sprint:",
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

        loadSprint();
    }, [sprintId, user?.uid]);

    // -------------------------------------------------
    // DAYS LEFT
    // -------------------------------------------------

    const getDaysLeft = () => {
        if (!sprint?.createdAt || !sprint?.durationDays) {
            return sprint?.durationDays || 0;
        }

        try {
            const createdDate = sprint.createdAt.toDate();

            const endDate = new Date(createdDate);

            endDate.setDate(
                endDate.getDate() +
                Number(sprint.durationDays)
            );

            const now = new Date();

            const difference =
                endDate.getTime() - now.getTime();

            const daysLeft = Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

            return Math.max(0, daysLeft);
        } catch (error) {
            console.error(
                "Error calculating days left:",
                error
            );

            return sprint.durationDays;
        }
    };

    // -------------------------------------------------
    // TESTER COUNTS
    // -------------------------------------------------

    const testersRequired =
        Number(sprint?.testerRequired || 0);

    const assignedTesters = testers.length;



    const testedCount =
        testers.filter(
            (tester) => tester.tested
        ).length;

    const progress =
        testersRequired > 0
            ? Math.round(
                (testedCount / testersRequired) *
                100
            )
            : 0;

    // -------------------------------------------------
    // VIEW PROOF
    // -------------------------------------------------

    const handleViewProof = (tester) => {
        alert(
            `Proof for ${tester.name}\n\n` +
            `Email: ${tester.email}\n\n` +
            `This is a dummy proof preview for now.\n\n` +
            `Later, the actual tester proof will be displayed here.`
        );
    };

    // -------------------------------------------------
    // MARK DOWNLOADED
    // -------------------------------------------------

    const handleMarkDownloaded = async (tester) => {
        try {
            await markTesterDownloaded(
                tester.sprintTesterId
            );

            setTesters((previous) =>
                previous.map((item) =>
                    item.sprintTesterId ===
                        tester.sprintTesterId
                        ? {
                            ...item,
                            downloaded: true,
                            downloadedAt: new Date(),
                        }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark tester as downloaded:",
                error
            );

            alert(
                error?.message ||
                "Unable to update tester status."
            );
        }
    };

    // -------------------------------------------------
    // MARK TESTED
    // -------------------------------------------------

    const handleMarkTested = async (tester) => {
        try {
            await markTesterTested(
                tester.sprintTesterId
            );

            setTesters((previous) =>
                previous.map((item) =>
                    item.sprintTesterId ===
                        tester.sprintTesterId
                        ? {
                            ...item,
                            tested: true,
                            testedAt: new Date(),
                        }
                        : item
                )
            );

        } catch (error) {
            console.error(
                "Failed to mark tester as tested:",
                error
            );

            alert(
                error?.message ||
                "Unable to update tester status."
            );
        }
    };

    // -------------------------------------------------
    // LOADING
    // -------------------------------------------------

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="form-card">
                    Loading Testing Sprint...
                </div>
            </div>
        );
    }

    // -------------------------------------------------
    // ERROR
    // -------------------------------------------------

    if (error || !sprint) {
        return (
            <div className="dashboard-page">

                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate("/developer/apps")
                    }
                >
                    <ArrowLeft size={18} />
                    Back to My Apps
                </button>

                <div className="form-card">
                    <p className="form-error">
                        {error ||
                            "Testing Sprint not found."}
                    </p>
                </div>

            </div>
        );
    }

    // -------------------------------------------------
    // PAGE
    // -------------------------------------------------

    return (
        <div className="dashboard-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="page-header sprint-details-page-header">

                <div>

                    <button
                        type="button"
                        className="back-button"
                        onClick={() =>
                            navigate(
                                `/developer/apps/${sprint.appId}`
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to App
                    </button>

                    <h1>
                        Testing Sprint Details
                    </h1>

                    <p>
                        Your Testing Sprint is active
                        and available for testing.
                    </p>

                </div>

                <div className="sprint-status-badge active">
                    {sprint.status
                        ? sprint.status
                            .charAt(0)
                            .toUpperCase() +
                        sprint.status.slice(1)
                        : "Active"}
                </div>

            </div>


            {/* =========================================
                MAIN TWO COLUMN LAYOUT
            ========================================= */}

            <div className="sprint-details-content">

                {/* =====================================
                    LEFT SIDE
                ===================================== */}

                <div className="form-card sprint-details-card">

                    {/* App Information */}

                    <div className="sprint-app-header">

                        <div className="sprint-app-icon">

                            {app?.iconUrl ? (
                                <img
                                    src={app.iconUrl}
                                    alt={`${app.appName} icon`}
                                />
                            ) : (
                                <Smartphone size={32} />
                            )}

                        </div>

                        <div className="sprint-app-info">

                            <h2>
                                {app?.appName ||
                                    "Android App"}
                            </h2>

                            <p className="package-name">
                                {app?.packageName || ""}
                            </p>

                        </div>

                    </div>


                    {/* =================================
                        Sprint Summary
                    ================================= */}

                    <div className="sprint-summary-cards">

                        {/* Testers */}

                        <div className="sprint-summary-card">

                            <div className="sprint-summary-icon">
                                <Users size={20} />
                            </div>

                            <div>

                                <span>
                                    Testers
                                </span>

                                <strong>
                                    {assignedTesters} /{" "}
                                    {testersRequired}
                                </strong>

                            </div>

                        </div>


                        {/* Days Left */}

                        <div className="sprint-summary-card">

                            <div className="sprint-summary-icon">
                                <CalendarDays size={20} />
                            </div>

                            <div>

                                <span>
                                    Days Left
                                </span>

                                <strong>
                                    {getDaysLeft()}
                                </strong>

                            </div>

                        </div>


                        {/* Platform */}

                        <div className="sprint-summary-card">

                            <div className="sprint-summary-icon">
                                <Smartphone size={20} />
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


                        {/* Progress */}

                        <div className="sprint-summary-card">

                            <div className="sprint-summary-icon">
                                <TrendingUp size={20} />
                            </div>

                            <div>

                                <span>
                                    Progress
                                </span>

                                <strong>
                                    {progress}%
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        Sprint Overview
                    ================================= */}

                    <div className="app-details-section">

                        <h3>
                            Sprint Overview
                        </h3>

                        <div className="details-grid">

                            <div>

                                <span>
                                    <CalendarDays size={15} />
                                    Duration
                                </span>

                                <strong>
                                    {sprint.durationDays} Days
                                </strong>

                            </div>


                            <div>

                                <span>
                                    <Users size={15} />
                                    Testers Required
                                </span>

                                <strong>
                                    {testersRequired}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    <Smartphone size={15} />
                                    Platform
                                </span>

                                <strong>
                                    Android
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Status
                                </span>

                                <strong className="status-text-active">
                                    {sprint.status
                                        ? sprint.status
                                            .charAt(0)
                                            .toUpperCase() +
                                        sprint.status.slice(1)
                                        : "Active"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        Sprint Progress
                    ================================= */}

                    <div className="app-details-section">

                        <h3>
                            <TrendingUp size={19} />
                            Sprint Progress
                        </h3>

                        <div className="sprint-progress-box">

                            <div className="sprint-progress-header">

                                <span>
                                    Overall Progress
                                </span>

                                <strong>
                                    {progress}%
                                </strong>

                            </div>


                            <div className="sprint-progress-track">

                                <div
                                    className="sprint-progress-fill"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />

                            </div>


                            <div className="sprint-progress-stats">

                                <div>

                                    <span>
                                        Assigned
                                    </span>

                                    <strong>
                                        {assignedTesters} /{" "}
                                        {testersRequired}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Downloaded
                                    </span>

                                    <strong>
                                        {downloadedCount} /{" "}
                                        {assignedTesters}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Tested
                                    </span>

                                    <strong>
                                        {testedCount} /{" "}
                                        {assignedTesters}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        Testing Goal
                    ================================= */}

                    <div className="app-details-section">

                        <h3>
                            <Target size={19} />
                            Testing Goal
                        </h3>

                        <div className="sprint-text-box">

                            {sprint.testingGoal ||
                                "No testing goal provided."}

                        </div>

                    </div>


                    {/* =================================
                        Tester Instructions
                    ================================= */}

                    <div className="app-details-section">

                        <h3>
                            <FileText size={19} />
                            Tester Instructions
                        </h3>

                        <div className="sprint-text-box">

                            {sprint.instructions ||
                                "No specific instructions provided."}

                        </div>

                    </div>


                    {/* =================================
                        Existing Assigned Testers
                    ================================= */}

                    {/* Assigned Testers */}

                    <div className="assigned-testers-section">

                        <div className="assigned-testers-header">

                            <div>
                                <h3>
                                    <Users size={19} />
                                    Assigned Testers
                                </h3>

                                <p>
                                    Copy these tester email addresses
                                    and add them to Google Play Console.
                                </p>
                            </div>

                            <span className="assigned-testers-count">
                                {testers.length} / {sprint.testerRequired}
                            </span>

                        </div>


                        <div className="assigned-testers-toolbar">

                            <span>
                                Tester email addresses
                            </span>

                            <button
                                type="button"
                                className="copy-testers-button"
                                onClick={async () => {

                                    const emails = testers
                                        .map(
                                            (tester) =>
                                                tester.testerEmail
                                        )
                                        .filter(Boolean)
                                        .join("\n");

                                    if (!emails) {
                                        alert(
                                            "No tester email addresses available."
                                        );
                                        return;
                                    }

                                    try {

                                        await navigator.clipboard.writeText(
                                            emails
                                        );

                                        alert(
                                            "Tester email addresses copied."
                                        );

                                    } catch (error) {

                                        console.error(
                                            "Copy testers error:",
                                            error
                                        );

                                        alert(
                                            "Unable to copy tester email addresses."
                                        );
                                    }
                                }}
                            >
                                Copy Tester Emails
                            </button>

                        </div>


                        <textarea
                            className="assigned-testers-textarea"
                            readOnly
                            value={
                                testers
                                    .map(
                                        (tester) =>
                                            tester.testerEmail
                                    )
                                    .filter(Boolean)
                                    .join("\n")
                            }
                            placeholder="Assigned tester email addresses will appear here..."
                        />

                    </div>


                    {/* =================================
                        Actions
                    ================================= */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate(
                                    `/developer/apps/${sprint.appId}`
                                )
                            }
                        >
                            Back
                        </button>

                    </div>

                </div>


                {/* =====================================
                    RIGHT SIDE - JOINED TESTERS
                ===================================== */}

                {/* Joined Testers */}

                <div className="joined-testers-panel">

                    <div className="joined-testers-header">

                        <div>
                            <h2>
                                Joined Testers ({testerCount})
                            </h2>

                            <p>
                                {downloadedCount} of {testerCount}{" "}
                                downloaded & verified
                            </p>
                        </div>

                        <Users size={22} />

                    </div>

                    {testers.length === 0 ? (

                        <div className="joined-testers-empty">
                            <Users size={30} />

                            <p>
                                No testers have been assigned
                                to this Testing Sprint yet.
                            </p>
                        </div>

                    ) : (

                        <div className="joined-testers-list">

                            {testers.map((tester) => {

                                const initial =
                                    (
                                        tester.testerName ||
                                        "T"
                                    )
                                        .charAt(0)
                                        .toUpperCase();

                                return (
                                    <div
                                        key={
                                            tester.sprintTesterId
                                        }
                                        className="joined-tester-row"
                                    >

                                        {/* Tester information */}

                                        <div className="joined-tester-info">

                                            <div className="joined-tester-avatar">
                                                {initial}
                                            </div>

                                            <div>
                                                <strong>
                                                    {
                                                        tester.testerName ||
                                                        "Tester"
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        tester.testerEmail ||
                                                        ""
                                                    }
                                                </span>
                                            </div>

                                        </div>


                                        {/* Tester status */}

                                        <div className="joined-tester-status">

                                            {tester.tested ? (

                                                <span className="tester-status tested">
                                                    ✓ Tested
                                                </span>

                                            ) : tester.downloaded ? (

                                                <span className="tester-status downloaded">
                                                    Downloaded ✓
                                                </span>

                                            ) : (

                                                <span className="tester-status assigned">
                                                    Assigned
                                                </span>

                                            )}

                                        </div>


                                        {/* Actions */}

                                        <div className="joined-tester-actions">

                                            
                                            {/* Daily Activity */}
                                            <button
                                                type="button"
                                                className="developer-daily-activity-button"
                                                onClick={() => handleOpenDailyActivity(tester)}
                                            >
                                                Daily Activity
                                            </button>
                                            {tester.tested ? (

                                                <span className="tester-status tested">
                                                    ✓ Tested
                                                </span>

                                            ) : tester.downloaded ? (

                                                <span className="tester-status downloaded">
                                                    Downloaded ✓
                                                </span>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="tester-action-button"
                                                    onClick={() => handleMarkDownloaded(tester)}
                                                >
                                                    ✓ Mark Downloaded
                                                </button>

                                            )}

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    )}

                </div>

            </div>
            <DeveloperDailyStandupModal
                isOpen={isDailyStandupOpen}
                onClose={() => {
                    setIsDailyStandupOpen(false);
                    setSelectedSprintTesterId(null);
                }}
                sprintTesterId={selectedSprintTesterId}
                developerUid={user.uid}
            />
        </div>
    );
}

export default SprintDetails;