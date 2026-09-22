import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { uploadPaymentProof } from "../../services/StorageService";

import {
    getDailyStandups,
    markDailyActivityTested,
    markDailyActivityPaid,
} from "../../services/DailyStandupService";

function DeveloperDailyStandupModal({
    isOpen,
    onClose,
    sprintTesterId,
    developerUid,
}) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [testingDay, setTestingDay] = useState(null);
    const [payingDay, setPayingDay] = useState(null);
    const [error, setError] = useState("");
    const paymentFileInputRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !sprintTesterId) {
            return;
        }

        let cancelled = false;

        const loadDailyStandup = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDailyStandups(
                    sprintTesterId
                );

                if (cancelled) {
                    return;
                }

                const loadedActivities = Object.values(
                    data?.activities || {}
                ).sort(
                    (a, b) =>
                        a.dayNumber - b.dayNumber
                );

                setActivities(loadedActivities);

            } catch (err) {
                console.error(
                    "Failed to load DailyStandup:",
                    err
                );

                if (!cancelled) {
                    setError(
                        err.message ||
                        "Failed to load daily activity."
                    );

                    setActivities([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadDailyStandup();

        return () => {
            cancelled = true;
        };
    }, [isOpen, sprintTesterId]);

    const handleMarkTested = async (daily) => {
        try {
            setError("");
            setTestingDay(daily.dayNumber);

            await markDailyActivityTested({
                sprintTesterId,
                dayNumber: daily.dayNumber,
                developerUid,
            });

            setActivities((currentActivities) =>
                currentActivities.map((activity) =>
                    activity.dayNumber ===
                        daily.dayNumber
                        ? {
                            ...activity,
                            tested: true,
                            testedAt: new Date(),
                            testedBy: developerUid,
                        }
                        : activity
                )
            );

        } catch (err) {
            console.error(
                "Failed to mark daily activity as tested:",
                err
            );

            setError(
                err.message ||
                "Failed to mark daily activity as tested."
            );
        } finally {
            setTestingDay(null);
        }
    };

    const handleMarkPaid = async (event, daily) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setError("");
            setPayingDay(daily.dayNumber);

            const uploadResult = await uploadPaymentProof(
                file,
                sprintTesterId,
                daily.dayNumber
            );

            await markDailyActivityPaid({
                sprintTesterId,
                dayNumber: daily.dayNumber,
                developerUid,
                paymentProofUrl:
                    uploadResult.downloadUrl,
            });

            setActivities((currentActivities) =>
                currentActivities.map((activity) =>
                    activity.dayNumber === daily.dayNumber
                        ? {
                            ...activity,
                            paymentStatus: "paid",
                            paidAt: new Date(),
                            paidBy: developerUid,
                            paymentProofUrl:
                                uploadResult.downloadUrl,
                        }
                        : activity
                )
            );

            alert(
                "Payment proof uploaded successfully."
            );

        } catch (err) {
            console.error(
                "Failed to mark daily activity as paid:",
                err
            );

            setError(
                err.message ||
                "Failed to upload payment proof."
            );
        } finally {
            setPayingDay(null);

            event.target.value = "";
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="daily-standup-modal-overlay">

            <div className="daily-standup-modal">

                {/* Header */}

                <div className="daily-standup-modal-header">

                    <div>
                        <h2>
                            Daily Testing Activity
                        </h2>

                        <p>
                            Review tester daily
                            testing activities and
                            submitted proof.
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

                    {loading ? (

                        <div className="daily-standup-modal-loading">
                            Loading daily activity...
                        </div>

                    ) : error ? (

                        <div className="daily-standup-error">
                            {error}
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
                                            Day{" "}
                                            {daily.dayNumber}
                                        </strong>

                                        <span>
                                            {
                                                daily.activityDate
                                            }
                                        </span>
                                    </div>

                                    {/* Payout */}

                                    <div>
                                        <strong>
                                            ₹
                                            {(
                                                daily.payoutAmountPaise /
                                                100
                                            ).toFixed(2)}
                                        </strong>

                                        <span className={
                                            daily.paymentStatus === "paid"
                                                ? "daily-payment-status-paid"
                                                : "daily-payment-status-pending"
                                        }>
                                            {daily.paymentStatus === "paid"
                                                ? "Paid"
                                                : "Payment Pending"}
                                        </span>
                                    </div>

                                    {/* Proof */}

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
                                                View Proof
                                            </a>

                                        ) : (

                                            <span className="tester-proof-not-submitted">
                                                Proof Not Submitted
                                            </span>

                                        )}

                                        {/* Daily Testing Status */}

                                        <div className="daily-testing-status">

                                            {daily.tested ? (

                                                <span className="daily-status-tested">
                                                    ✓ Tested
                                                </span>

                                            ) : daily.proofUrl ? (

                                                <button
                                                    type="button"
                                                    className="developer-daily-test-button"
                                                    onClick={() =>
                                                        handleMarkTested(daily)
                                                    }
                                                    disabled={
                                                        testingDay ===
                                                        daily.dayNumber
                                                    }
                                                >
                                                    {testingDay ===
                                                        daily.dayNumber
                                                        ? "Testing..."
                                                        : "✓ Mark Tested"}
                                                </button>

                                            ) : (

                                                <span>
                                                    Not Tested
                                                </span>

                                            )}

                                            {/* Payment */}

                                            {daily.tested && daily.paymentStatus !== "paid" && (

                                                <div>

                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`payment-proof-${daily.dayNumber}`}
                                                        style={{ display: "none" }}
                                                        onChange={(event) =>
                                                            handleMarkPaid(event, daily)
                                                        }
                                                    />

                                                    <label
                                                        htmlFor={`payment-proof-${daily.dayNumber}`}
                                                        className="developer-daily-paid-button"
                                                    >
                                                        {payingDay === daily.dayNumber
                                                            ? "Uploading..."
                                                            : "✓ Mark Paid"}
                                                    </label>

                                                </div>

                                            )}

                                            {daily.paymentStatus === "paid" && (
                                                <>
                                                    <span className="daily-status-paid">
                                                        ✓ Paid
                                                    </span>

                                                    {daily.paymentProofUrl && (
                                                        <a
                                                            href={daily.paymentProofUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="tester-proof-link"
                                                        >
                                                            View Payment Proof
                                                        </a>
                                                    )}
                                                </>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default DeveloperDailyStandupModal;