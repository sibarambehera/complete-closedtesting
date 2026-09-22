import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle,
    Smartphone,
    Users,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
    getTesterAssignedSprints,
} from "../../services/AppService";

import {
    getDailyStandups,
    initializeDailyStandups,
} from "../../services/DailyStandupService";
import TesterDailyStandupModal from "../../components/daily-standup/TesterDailyStandupModal";


function TesterSprintDetails() {

    const {
        sprintTesterId,
    } = useParams();

    const navigate =
        useNavigate();

    const {
        user,
    } = useAuth();


    const [
        assignment,
        setAssignment,
    ] = useState(null);


    const [
        dailyStandup,
        setDailyStandup,
    ] = useState(null);


    const [
        dailyActivities,
        setDailyActivities,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");

    const [isDailyStandupOpen, setIsDailyStandupOpen] = useState(false);
    // =====================================================
    // Load Sprint Details
    // =====================================================

    useEffect(() => {

        loadSprintDetails();

    }, [
        sprintTesterId,
        user?.employeeId,
    ]);


    const loadSprintDetails =
        async () => {

            try {

                setLoading(true);

                setError("");


                // -----------------------------------------
                // Validate tester
                // -----------------------------------------

                if (!user?.employeeId) {

                    throw new Error(
                        "Tester profile not found."
                    );

                }


                // -----------------------------------------
                // Validate assignment
                // -----------------------------------------

                if (!sprintTesterId) {

                    throw new Error(
                        "Testing Sprint assignment not found."
                    );

                }


                // -----------------------------------------
                // Get tester assignments
                // -----------------------------------------

                const assignments =
                    await getTesterAssignedSprints(
                        user.employeeId
                    );


                const currentAssignment =
                    assignments.find(
                        (item) =>
                            item.sprintTesterId ===
                            sprintTesterId
                    );


                if (!currentAssignment) {

                    throw new Error(
                        "You are not assigned to this Testing Sprint."
                    );

                }


                // -----------------------------------------
                // Validate sprint
                // -----------------------------------------

                if (
                    !currentAssignment.sprint
                ) {

                    throw new Error(
                        "Testing Sprint details not found."
                    );

                }


                // -----------------------------------------
                // Validate app
                // -----------------------------------------

                if (
                    !currentAssignment.app
                ) {

                    throw new Error(
                        "Application details not found."
                    );

                }


                setAssignment(
                    currentAssignment
                );


                const sprint =
                    currentAssignment.sprint;


                // =========================================
                // Get DailyStandup
                // =========================================

                let dailyData =
                    await getDailyStandups(
                        sprintTesterId
                    );


                // =========================================
                // Create DailyStandup if it doesn't exist
                // =========================================

                if (!dailyData) {

                    let startDate =
                        sprint.createdAt;


                    if (
                        startDate?.toDate
                    ) {

                        startDate =
                            startDate.toDate();

                    }


                    if (!startDate) {

                        startDate =
                            new Date();

                    }


                    dailyData =
                        await initializeDailyStandups(
                            {
                                sprintId:
                                    sprint.sprintId,

                                sprintTesterId,

                                testerEmployeeId:
                                    user.employeeId,

                                durationDays:
                                    sprint.durationDays,

                                startDate,
                            }
                        );

                }


                // =========================================
                // Store DailyStandup document
                // =========================================

                setDailyStandup(
                    dailyData
                );


                // =========================================
                // Convert activities Map → Array
                //
                // This makes rendering easier.
                // =========================================

                const activities =
                    Object.values(
                        dailyData?.activities ||
                        {}
                    ).sort(
                        (a, b) =>
                            Number(
                                a.dayNumber
                            ) -
                            Number(
                                b.dayNumber
                            )
                    );


                setDailyActivities(
                    activities
                );


            } catch (err) {

                console.error(
                    "Failed to load Tester Sprint Details:",
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


    // =====================================================
    // Loading
    // =====================================================

    if (loading) {

        return (
            <div className="tester-page-loading">

                Loading Testing Sprint...

            </div>
        );

    }


    // =====================================================
    // Error
    // =====================================================

    if (error) {

        return (
            <div className="tester-page-error">

                <p>
                    {error}
                </p>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/tester/testing-sprints"
                        )
                    }
                >
                    Back to Testing Sprints
                </button>

            </div>
        );

    }


    if (!assignment) {

        return null;

    }


    const sprint =
        assignment.sprint;


    const app =
        assignment.app;


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="tester-sprint-details">





            <div className="tester-sprint-content">
                {/* =================================================
                Header
            ================================================= */}

                <div className="tester-sprint-details-header">

                    <button
                        type="button"
                        className="tester-back-button"
                        onClick={() =>
                            navigate(
                                "/tester/testing-sprints"
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div>
                        <h1>
                            Testing Sprint
                        </h1>

                        <p>
                            Complete your daily testing
                            activities and submit proof.
                        </p>
                    </div>

                </div>
                {/* App / Sprint Information */}
                <div className="tester-sprint-info-card">

                    <div className="tester-sprint-info-app">

                        <div className="tester-sprint-info-icon">

                            {app.iconUrl ? (
                                <img
                                    src={app.iconUrl}
                                    alt={app.appName}
                                />
                            ) : (
                                <Smartphone size={28} />
                            )}

                        </div>

                        <div>

                            <h2>
                                {app.appName}
                            </h2>

                            <p>
                                {app.packageName}
                            </p>

                        </div>

                    </div>


                    <div className="tester-sprint-info-items">

                        <div>
                            <CalendarDays size={18} />

                            <span>
                                {sprint.durationDays} Days
                            </span>
                        </div>

                        <div>
                            <Users size={18} />

                            <span>
                                {sprint.testerRequired} Testers
                            </span>
                        </div>

                        <div>
                            <CheckCircle size={18} />

                            <span>
                                ₹100 Total
                            </span>
                        </div>

                    </div>

                </div>


                {/* Daily Testing Activity */}
                <div className="tester-daily-standup-card">

                    <div className="tester-section-header">

                        <div>

                            <h2>
                                Daily Testing Activity
                            </h2>

                            <p>
                                Submit your proof every day.
                            </p>

                        </div>

                        <span>
                            {sprint.durationDays} Days
                        </span>
                        <button
                            type="button"
                            className="tester-daily-standup-button"
                            onClick={() => setIsDailyStandupOpen(true)}
                        >
                            View Daily Activity
                        </button>
                    </div>


                  

                </div>

            </div>
            <TesterDailyStandupModal
                isOpen={isDailyStandupOpen}
                onClose={() => setIsDailyStandupOpen(false)}
                dailyActivities={dailyActivities}
                sprintTesterId={sprintTesterId}
            />
        </div>
    );
}


export default TesterSprintDetails;