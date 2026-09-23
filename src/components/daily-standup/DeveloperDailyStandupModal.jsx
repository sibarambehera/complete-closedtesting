import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { uploadPaymentProof } from "../../services/StorageService";

import {
    getDailyStandups,
    getTesterUpiQr,
    markDailyActivityTested,
    markDailyActivityPaid,
    finalizeSprintTesterStatus,
} from "../../services/DailyStandupService";


function DeveloperDailyStandupModal({
    isOpen,
    onClose,
    sprintTesterId,
    developerUid,
}) {

    const [activities, setActivities] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [testingDay, setTestingDay] =
        useState(null);

    const [payingDay, setPayingDay] =
        useState(null);

    const [error, setError] =
        useState("");

    const [testerQr, setTesterQr] =
        useState(null);

    const paymentFileInputRef =
        useRef(null);


    // ==========================================
    // Load Daily Standup + Tester QR
    // ==========================================

    useEffect(() => {

        if (!isOpen || !sprintTesterId) {
            return;
        }

        let cancelled = false;


        const loadDailyStandup = async () => {

            try {

                setLoading(true);
                setError("");
                setTesterQr(null);


                // ------------------------------------------
                // Load Daily Activity
                // ------------------------------------------

                const data =
                    await getDailyStandups(
                        sprintTesterId
                    );


                if (cancelled) {
                    return;
                }


                const loadedActivities =
                    Object.values(
                        data?.activities || {}
                    ).sort(
                        (a, b) =>
                            a.dayNumber -
                            b.dayNumber
                    );


                setActivities(
                    loadedActivities
                );


                // ------------------------------------------
                // Load Tester UPI QR
                // ------------------------------------------

                try {

                    const qrData =
                        await getTesterUpiQr(
                            sprintTesterId
                        );


                    if (!cancelled) {
                        setTesterQr(qrData);
                    }

                } catch (qrError) {

                    console.error(
                        "Failed to load tester UPI QR:",
                        qrError
                    );

                    // Do not block Daily Activity
                    // if QR is not available.

                    if (!cancelled) {
                        setTesterQr(null);
                    }

                }

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

    }, [
        isOpen,
        sprintTesterId
    ]);


    // ==========================================
    // Mark Tested
    // ==========================================

    const handleMarkTested =
        async (daily) => {

            try {

                setError("");

                setTestingDay(
                    daily.dayNumber
                );


                await markDailyActivityTested({
                    sprintTesterId,
                    dayNumber:
                        daily.dayNumber,
                    developerUid,
                });


                await finalizeSprintTesterStatus(
                    sprintTesterId
                );


                setActivities(
                    (currentActivities) =>
                        currentActivities.map(
                            (activity) =>
                                activity.dayNumber ===
                                daily.dayNumber
                                    ? {
                                        ...activity,
                                        tested: true,
                                        testedAt:
                                            new Date(),
                                        testedBy:
                                            developerUid,
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


    // ==========================================
    // Mark Paid
    // ==========================================

    const handleMarkPaid =
        async (event, daily) => {

            const file =
                event.target.files?.[0];


            if (!file) {
                return;
            }


            try {

                setError("");

                setPayingDay(
                    daily.dayNumber
                );


                const uploadResult =
                    await uploadPaymentProof(
                        file,
                        sprintTesterId,
                        daily.dayNumber
                    );


                await markDailyActivityPaid({
                    sprintTesterId,
                    dayNumber:
                        daily.dayNumber,
                    developerUid,
                    paymentProofUrl:
                        uploadResult.downloadUrl,
                });


                setActivities(
                    (currentActivities) =>
                        currentActivities.map(
                            (activity) =>
                                activity.dayNumber ===
                                daily.dayNumber
                                    ? {
                                        ...activity,
                                        paymentStatus:
                                            "paid",
                                        paidAt:
                                            new Date(),
                                        paidBy:
                                            developerUid,
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


    // ==========================================
    // Close
    // ==========================================

    if (!isOpen) {
        return null;
    }


    return (

        <div className="daily-standup-modal-overlay">

            <div className="daily-standup-modal">


                {/* ==================================
                    Header
                ================================== */}

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


                    {/* ==================================
                        Tester UPI QR
                    ================================== */}

                    {testerQr?.upiQrCodeUrl && (

                        <div className="developer-tester-qr-header">

                            <div className="developer-tester-qr-info">

                                <strong>
                                    UPI Payment QR
                                </strong>

                                <span>
                                    Scan to pay tester
                                </span>

                            </div>


                            <a
                                href={
                                    testerQr.upiQrCodeUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open UPI QR"
                                className="developer-tester-qr-link"
                            >

                                <img
                                    src={
                                        testerQr.upiQrCodeUrl
                                    }
                                    alt="Tester UPI QR"
                                    className="developer-tester-qr-image"
                                />

                            </a>

                        </div>

                    )}


                    {/* Close */}

                    <button
                        type="button"
                        className="daily-standup-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* ==================================
                    Body
                ================================== */}

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

                            {activities.map(
                                (daily) => (

                                    <div
                                        key={
                                            daily.dayNumber
                                        }
                                        className="tester-daily-item"
                                    >

                                        {/* Day / Date */}

                                        <div>

                                            <strong>
                                                Day{" "}
                                                {
                                                    daily.dayNumber
                                                }
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

                                            <span
                                                className={
                                                    daily.paymentStatus ===
                                                    "paid"
                                                        ? "daily-payment-status-paid"
                                                        : "daily-payment-status-pending"
                                                }
                                            >
                                                {
                                                    daily.paymentStatus ===
                                                    "paid"
                                                        ? "Paid"
                                                        : "Payment Pending"
                                                }
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
                                                    View Testing Proof
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
                                                            handleMarkTested(
                                                                daily
                                                            )
                                                        }
                                                        disabled={
                                                            testingDay ===
                                                            daily.dayNumber
                                                        }
                                                    >
                                                        {
                                                            testingDay ===
                                                            daily.dayNumber
                                                                ? "Testing..."
                                                                : "✓ Mark Tested"
                                                        }
                                                    </button>

                                                ) : (

                                                    <span>
                                                        Not Tested
                                                    </span>

                                                )}


                                                {/* Payment */}

                                                {daily.tested &&
                                                    daily.paymentStatus !==
                                                        "paid" && (

                                                        <div>

                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id={`payment-proof-${daily.dayNumber}`}
                                                                style={{
                                                                    display:
                                                                        "none"
                                                                }}
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleMarkPaid(
                                                                        event,
                                                                        daily
                                                                    )
                                                                }
                                                            />

                                                            <label
                                                                htmlFor={`payment-proof-${daily.dayNumber}`}
                                                                className="developer-daily-paid-button"
                                                            >
                                                                {
                                                                    payingDay ===
                                                                    daily.dayNumber
                                                                        ? "Uploading..."
                                                                        : "✓ Mark Paid"
                                                                }
                                                            </label>

                                                        </div>

                                                    )}


                                                {daily.paymentStatus ===
                                                    "paid" && (

                                                    <>

                                                        <span className="daily-status-paid">
                                                            ✓ Paid
                                                        </span>


                                                        {daily.paymentProofUrl && (

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

                                                    </>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}


export default DeveloperDailyStandupModal;