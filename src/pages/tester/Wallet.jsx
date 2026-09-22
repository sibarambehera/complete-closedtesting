import { useEffect, useState } from "react";
import {
    Wallet as WalletIcon,
    Smartphone,
    CheckCircle,
    Clock3,
    IndianRupee,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
    getTesterAssignedSprints,
} from "../../services/AppService";

import {
    getDailyStandups,
} from "../../services/DailyStandupService";


function Wallet() {

    const { user } = useAuth();

    const [walletData, setWalletData] =
        useState({
            totalAssigned: 0,
            paid: 0,
            pending: 0,
            assignments: [],
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadWallet = async () => {

            if (!user?.employeeId) {
                setLoading(false);
                return;
            }

            try {

                setLoading(true);
                setError("");

                /*
                 * Get all Testing Sprint assignments
                 * for this tester.
                 */
                const assignments =
                    await getTesterAssignedSprints(
                        user.employeeId
                    );


                /*
                 * Calculate payment information
                 * for every assigned Sprint.
                 */
                const paymentHistory =
                    await Promise.all(

                        assignments.map(
                            async (assignment) => {

                                let paidAmount =
                                    0;

                                try {

                                    const standup =
                                        await getDailyStandups(
                                            assignment.sprintTesterId
                                        );


                                    const activities =
                                        Object.values(
                                            standup?.activities ||
                                            {}
                                        );


                                    /*
                                     * Sum only paid daily
                                     * activities.
                                     */
                                    paidAmount =
                                        activities.reduce(
                                            (
                                                total,
                                                activity
                                            ) => {

                                                if (
                                                    activity.paymentStatus ===
                                                    "paid"
                                                ) {

                                                    return (
                                                        total +
                                                        Number(
                                                            activity.payoutAmountPaise ||
                                                            0
                                                        )
                                                    );

                                                }

                                                return total;

                                            },
                                            0
                                        );

                                } catch (standupError) {

                                    console.error(
                                        "Failed to load DailyStandup:",
                                        assignment.sprintTesterId,
                                        standupError
                                    );

                                }


                                return {
                                    ...assignment,
                                    paidAmountPaise:
                                        paidAmount,
                                };

                            }
                        )
                    );


                /*
                 * Every assigned Testing Sprint
                 * has a maximum tester payout of ₹100.
                 */
                const totalAssignedPaise =
                    paymentHistory.length * 10000;


                const paidPaise =
                    paymentHistory.reduce(
                        (
                            total,
                            assignment
                        ) =>
                            total +
                            assignment.paidAmountPaise,
                        0
                    );


                const pendingPaise =
                    Math.max(
                        0,
                        totalAssignedPaise -
                        paidPaise
                    );


                setWalletData({
                    totalAssigned:
                        totalAssignedPaise,

                    paid:
                        paidPaise,

                    pending:
                        pendingPaise,

                    assignments:
                        paymentHistory,
                });


            } catch (err) {

                console.error(
                    "Failed to load Wallet:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load wallet."
                );

            } finally {

                setLoading(false);

            }
        };


        loadWallet();

    }, [user?.employeeId]);


    const formatRupees = (
        paise
    ) => {

        return `₹${(
            Number(paise || 0) /
            100
        ).toFixed(2)}`;

    };


    const getPaymentStatus = (
        assignment
    ) => {

        const paid =
            Number(
                assignment.paidAmountPaise ||
                0
            );

        const total =
            10000;


        if (paid >= total) {

            return {
                label: "Paid",
                className: "paid",
            };

        }


        if (paid > 0) {

            return {
                label: "Partially Paid",
                className: "partial",
            };

        }


        return {
            label: "Pending",
            className: "pending",
        };

    };


    if (loading) {

        return (
            <div className="dashboard-page">

                <div className="form-card">
                    Loading Wallet...
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
                        Wallet
                    </h1>

                    <p>
                        Track your Testing Sprint
                        earnings and payment history.
                    </p>

                </div>

            </div>


            {/* Summary */}

            <div className="wallet-summary-grid">

                {/* Total Assigned */}

                <div className="wallet-summary-card">

                    <div className="wallet-summary-icon">

                        <WalletIcon
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Assigned
                        </span>

                        <strong>
                            {formatRupees(
                                walletData.totalAssigned
                            )}
                        </strong>

                        <small>
                            {
                                walletData.assignments
                                    .length
                            } Testing Sprint
                            {walletData.assignments
                                .length !== 1
                                ? "s"
                                : ""}
                        </small>

                    </div>

                </div>


                {/* Paid */}

                <div className="wallet-summary-card">

                    <div className="wallet-summary-icon paid">

                        <CheckCircle
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Paid
                        </span>

                        <strong>
                            {formatRupees(
                                walletData.paid
                            )}
                        </strong>

                    </div>

                </div>


                {/* Pending */}

                <div className="wallet-summary-card">

                    <div className="wallet-summary-icon pending">

                        <Clock3
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {formatRupees(
                                walletData.pending
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            {/* Payment History */}

            <div
                className="form-card"
                style={{
                    marginTop: "24px",
                }}
            >

                <div className="wallet-history-header">

                    <div>

                        <h2>
                            Payment History
                        </h2>

                        <p>
                            Payment summary for each
                            Testing Sprint.
                        </p>

                    </div>

                </div>


                {walletData.assignments.length === 0 ? (

                    <div className="tester-empty-state">

                        <WalletIcon
                            size={42}
                        />

                        <h3>
                            No Payment History
                        </h3>

                        <p>
                            You don't have any assigned
                            Testing Sprints yet.
                        </p>

                    </div>

                ) : (

                    <div className="wallet-history-list">

                        {walletData.assignments.map(
                            (
                                assignment,
                                index
                            ) => {

                                const status =
                                    getPaymentStatus(
                                        assignment
                                    );

                                const app =
                                    assignment.app;

                                const sprint =
                                    assignment.sprint;


                                return (

                                    <div
                                        key={
                                            assignment.sprintTesterId
                                        }
                                        className="wallet-history-item"
                                    >

                                        {/* Number */}

                                        <div className="wallet-history-number">

                                            {index + 1}

                                        </div>


                                        {/* App */}

                                        <div className="wallet-history-app">

                                            <div className="wallet-history-icon">

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
                                                        size={24}
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
                                                        sprint?.durationDays ||
                                                        0
                                                    } Days
                                                </p>

                                            </div>

                                        </div>


                                        {/* Amount */}

                                        <div className="wallet-history-amount">

                                            <span>
                                                Total Paid
                                            </span>

                                            <strong>
                                                {formatRupees(
                                                    assignment.paidAmountPaise
                                                )}
                                            </strong>

                                        </div>


                                        {/* Status */}

                                        <div>

                                            <span
                                                className={`wallet-payment-badge ${status.className}`}
                                            >

                                                {status.className ===
                                                "paid" ? (

                                                    <CheckCircle
                                                        size={14}
                                                    />

                                                ) : status.className ===
                                                  "partial" ? (

                                                    <IndianRupee
                                                        size={14}
                                                    />

                                                ) : (

                                                    <Clock3
                                                        size={14}
                                                    />

                                                )}

                                                {status.label}

                                            </span>

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

export default Wallet;