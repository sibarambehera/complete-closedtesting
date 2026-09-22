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


           

        </div>
    );
}

export default TesterDashboard;