import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

import { uploadDailyProof } from "../../services/StorageService";
import {
    getDailyStandups,
    submitDailyProof,
} from "../../services/DailyStandupService";

function TesterDailyStandupModal({
    isOpen,
    onClose,
    dailyActivities,
    sprintTesterId,
    canUpload = true,
}) {
    const [uploadingDay, setUploadingDay] = useState(null);
    const [uploadError, setUploadError] = useState("");
    const [activities, setActivities] = useState([]);
    const [loadingStandup, setLoadingStandup] = useState(false);

    /*
     * Load the latest DailyStandup document whenever
     * the modal is opened.
     */
    useEffect(() => {
        if (!isOpen || !sprintTesterId) {
            return;
        }

        let cancelled = false;

        const loadDailyStandup = async () => {
            try {
                setLoadingStandup(true);
                setUploadError("");

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
                    setUploadError(
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

    /*
     * Upload daily proof
     */
    const handleProofUpload = async (event, daily) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setUploadError("");
            setUploadingDay(daily.dayNumber);

            const uploadResult = await uploadDailyProof(
                file,
                sprintTesterId,
                daily.dayNumber
            );

            await submitDailyProof({
                sprintTesterId,
                dayNumber: daily.dayNumber,
                proofUrl: uploadResult.downloadUrl,
            });

            setActivities((currentActivities) =>
                currentActivities.map((activity) =>
                    activity.dayNumber === daily.dayNumber
                        ? {
                            ...activity,
                            proofUrl:
                                uploadResult.downloadUrl,
                            proofSubmittedAt:
                                new Date(),
                        }
                        : activity
                )
            );

            alert(
                `Day ${daily.dayNumber} proof uploaded successfully.`
            );

        } catch (error) {
            console.error(
                "Daily proof upload failed:",
                error
            );

            setUploadError(
                error.message ||
                "Failed to upload proof."
            );
        } finally {
            setUploadingDay(null);

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
                        <h2>Daily Testing Activity</h2>

                        <p>
                            {canUpload
                                ? "Complete your daily testing activities and submit proof."
                                : "Review tester daily testing activities and submitted proof."
                            }
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

                                    {/* Payout */}
                                    <div>
                                        <strong>
                                            ₹
                                            {(
                                                daily.payoutAmountPaise / 100
                                            ).toFixed(2)}
                                        </strong>

                                        {daily.paymentStatus === "paid" ? (

                                            <span className="tester-payment-status-paid">
                                                ✓ Paid
                                            </span>

                                        ) : (

                                            <span className="tester-payment-status-pending">
                                                Payment Pending
                                            </span>

                                        )}
                                    </div>

                                    {/* Proof / Testing */}
                                    <div className="tester-daily-proof-section">

                                        {daily.proofUrl ? (

                                            <a
                                                href={daily.proofUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="tester-proof-link"
                                            >
                                                View Testing Proof
                                            </a>

                                        ) : canUpload ? (

                                            <>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id={`proof-upload-${daily.dayNumber}`}
                                                    className="tester-proof-input"
                                                    onChange={(event) =>
                                                        handleProofUpload(
                                                            event,
                                                            daily
                                                        )
                                                    }
                                                    disabled={
                                                        uploadingDay ===
                                                        daily.dayNumber
                                                    }
                                                />

                                                <label
                                                    htmlFor={`proof-upload-${daily.dayNumber}`}
                                                    className="tester-proof-upload-button"
                                                >
                                                    <Upload size={15} />

                                                    {uploadingDay ===
                                                        daily.dayNumber
                                                        ? "Uploading..."
                                                        : "Upload Proof"}
                                                </label>
                                            </>

                                        ) : (

                                            <span className="tester-proof-not-submitted">
                                                Proof Not Submitted
                                            </span>

                                        )}

                                        {/* Daily testing status */}
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
                                        {daily.paymentStatus === "paid" &&
                                            daily.paymentProofUrl && (

                                                <a
                                                    href={daily.paymentProofUrl}
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

                    {uploadError && (

                        <div className="daily-standup-error">
                            {uploadError}
                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default TesterDailyStandupModal;