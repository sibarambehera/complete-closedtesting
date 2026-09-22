import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { getDailyStandups } from "../../services/DailyStandupService";

function AdminDailyStandupModal({
    isOpen,
    onClose,
    sprintTesterId,
}) {
    const [activities, setActivities] = useState([]);
    const [loadingStandup, setLoadingStandup] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen || !sprintTesterId) {
            return;
        }

        let cancelled = false;

        const loadDailyStandup = async () => {
            try {
                setLoadingStandup(true);
                setError("");

                const data = await getDailyStandups(
                    sprintTesterId
                );

                if (cancelled) {
                    return;
                }

                if (data?.activities) {
                    const loadedActivities = Object.values(
                        data.activities
                    ).sort(
                        (a, b) =>
                            a.dayNumber - b.dayNumber
                    );

                    setActivities(loadedActivities);
                } else {
                    setActivities([]);
                }
            } catch (error) {
                console.error(
                    "Failed to load DailyStandup:",
                    error
                );

                if (!cancelled) {
                    setError(
                        error.message ||
                        "Failed to load daily activity."
                    );

                    setActivities([]);
                }
            } finally {
                if (!cancelled) {
                    setLoadingStandup(false);
                }
            }
        };

        loadDailyStandup();

        return () => {
            cancelled = true;
        };
    }, [isOpen, sprintTesterId]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="daily-standup-modal-overlay">
            <div className="daily-standup-modal">

                {/* Header */}
                <div className="daily-standup-modal-header">
                    <div>
                        <h2>Daily Testing Activity</h2>

                        <p>
                            Review tester daily testing
                            activities, proof and payment status.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="daily-standup-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="daily-standup-modal-body">

                    {loadingStandup ? (
                        <div className="daily-standup-modal-loading">
                            Loading daily activity...
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="daily-standup-modal-loading">
                            No daily activity found.
                        </div>
                    ) : (
                        <div className="tester-daily-list">

                            {activities.map((daily) => (
                                <div
                                    key={daily.dayNumber}
                                    className="tester-daily-item"
                                >

                                    {/* Day / Date */}
                                    <div>
                                        <strong>
                                            Day {daily.dayNumber}
                                        </strong>

                                        <span>
                                            {daily.activityDate}
                                        </span>
                                    </div>

                                    {/* Payout / Payment */}
                                    <div>
                                        <strong>
                                            ₹
                                            {(
                                                daily.payoutAmountPaise /
                                                100
                                            ).toFixed(2)}
                                        </strong>

                                        {daily.paymentStatus ===
                                        "paid" ? (
                                            <span className="tester-payment-status-paid">
                                                ✓ Paid
                                            </span>
                                        ) : (
                                            <span className="tester-payment-status-pending">
                                                Payment Pending
                                            </span>
                                        )}
                                    </div>

                                    {/* Proof / Testing Status */}
                                    <div className="tester-daily-proof-section">

                                        {daily.proofUrl ? (
                                            <a
                                                href={
                                                    daily.proofUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="tester-proof-link"
                                            >
                                                View Testing Proof
                                            </a>
                                        ) : (
                                            <span className="tester-proof-not-submitted">
                                                Proof Not Submitted
                                            </span>
                                        )}

                                        {/* Testing Status */}
                                        <div>
                                            {daily.tested ? (
                                                <span className="daily-status-tested">
                                                    ✓ Tested
                                                </span>
                                            ) : (
                                                <span>
                                                    Not Tested
                                                </span>
                                            )}
                                        </div>

                                        {/* Payment Proof */}
                                        {daily.paymentStatus ===
                                            "paid" &&
                                            daily.paymentProofUrl && (
                                                <a
                                                    href={
                                                        daily.paymentProofUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="tester-proof-link"
                                                >
                                                    View Payment Proof
                                                </a>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="daily-standup-error">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDailyStandupModal;