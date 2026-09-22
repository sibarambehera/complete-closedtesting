import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebaseconfig";


// =========================================================
// Get DailyStandup for one assigned tester
//
// One document = one tester + one Testing Sprint
//
// DailyStandup/{sprintTesterId}
// =========================================================

export async function getDailyStandups(
    sprintTesterId
) {
    if (!sprintTesterId) {
        throw new Error(
            "Sprint Tester ID is required."
        );
    }

    const dailyStandupRef = doc(
        db,
        "DailyStandup",
        sprintTesterId
    );

    const snapshot =
        await getDoc(dailyStandupRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        dailyStandupId:
            snapshot.id,

        ...snapshot.data(),
    };
}


// =========================================================
// Initialize DailyStandup
//
// Creates ONE document containing all daily activities.
//
// Example:
//
// DailyStandup
//    └── sprintTesterId
//          ├── sprintId
//          ├── testerEmployeeId
//          ├── durationDays
//          └── activities
//                ├── day1
//                ├── day2
//                └── dayN
// =========================================================

export async function initializeDailyStandups({
    sprintId,
    sprintTesterId,
    testerEmployeeId,
    durationDays,
    startDate,
}) {
    if (!sprintId) {
        throw new Error(
            "Sprint ID is required."
        );
    }

    if (!sprintTesterId) {
        throw new Error(
            "Sprint Tester ID is required."
        );
    }

    if (!testerEmployeeId) {
        throw new Error(
            "Tester Employee ID is required."
        );
    }

    if (!durationDays) {
        throw new Error(
            "Duration days is required."
        );
    }

    if (!startDate) {
        throw new Error(
            "Start date is required."
        );
    }


    // =====================================================
    // Validate duration
    // =====================================================

    const totalDays =
        Number(durationDays);

    if (
        !Number.isInteger(totalDays) ||
        totalDays <= 0
    ) {
        throw new Error(
            "Duration days must be a positive number."
        );
    }


    // =====================================================
    // DailyStandup document reference
    // =====================================================

    const dailyStandupRef = doc(
        db,
        "DailyStandup",
        sprintTesterId
    );


    // =====================================================
    // Check if DailyStandup already exists
    // =====================================================

    const existingSnapshot =
        await getDoc(
            dailyStandupRef
        );


    if (existingSnapshot.exists()) {
        return {
            dailyStandupId:
                existingSnapshot.id,

            ...existingSnapshot.data(),
        };
    }


    // =====================================================
    // Start date
    // =====================================================

    const start =
        new Date(startDate);


    // =====================================================
    // Total tester payout
    //
    // ₹100 = 10,000 paise
    // =====================================================

    const totalPayoutPaise =
        10000;


    // Base payout per day

    const basePayoutPaise =
        Math.floor(
            totalPayoutPaise /
            totalDays
        );


    // Remaining paise

    const remainderPaise =
        totalPayoutPaise -
        (
            basePayoutPaise *
            totalDays
        );


    // =====================================================
    // Build activities
    // =====================================================

    const activities = {};


    for (
        let dayNumber = 1;
        dayNumber <= totalDays;
        dayNumber++
    ) {

        // -----------------------------------------------
        // Activity date
        // -----------------------------------------------

        const activityDate =
            new Date(start);

        activityDate.setDate(
            start.getDate() +
            dayNumber -
            1
        );


        // -----------------------------------------------
        // Daily payout
        // -----------------------------------------------

        const payoutAmountPaise =
            dayNumber === totalDays
                ? basePayoutPaise +
                  remainderPaise
                : basePayoutPaise;


        // -----------------------------------------------
        // Create day activity
        // -----------------------------------------------

        activities[
            `day${dayNumber}`
        ] = {
            dayNumber,

            activityDate:
                `${activityDate.getFullYear()}-${String(
                    activityDate.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    activityDate.getDate()
                ).padStart(2, "0")}`,

            // Tester proof
            proofUrl: null,

            proofSubmittedAt:
                null,


            // Developer testing result
            tested: false,

            testedAt: null,

            testedBy: null,


            // Daily tester payout
            payoutAmountPaise,


            // unpaid → pending → paid
            paymentStatus:
                "unpaid",


            // Direct tester payment
            paidAt: null,

            paidBy: null,

            paymentReference:
                null,
        };
    }


    // =====================================================
    // Create ONE DailyStandup document
    // =====================================================

    await setDoc(
        dailyStandupRef,
        {
            sprintId,

            sprintTesterId,

            testerEmployeeId,

            durationDays:
                totalDays,

            activities,

            createdAt:
                serverTimestamp(),
        }
    );


    // =====================================================
    // Return created document
    // =====================================================

    return {
        dailyStandupId:
            sprintTesterId,

        sprintId,

        sprintTesterId,

        testerEmployeeId,

        durationDays:
            totalDays,

        activities,
    };
}

export async function submitDailyProof({
    sprintTesterId,
    dayNumber,
    proofUrl,
}) {
    if (!sprintTesterId) {
        throw new Error("Sprint Tester ID is required.");
    }

    if (!dayNumber) {
        throw new Error("Day number is required.");
    }

    if (!proofUrl) {
        throw new Error("Proof URL is required.");
    }

    const dailyStandupRef = doc(
        db,
        "DailyStandup",
        sprintTesterId
    );

    const activityKey = `activities.day${dayNumber}`;

    await updateDoc(dailyStandupRef, {
        [`${activityKey}.proofUrl`]: proofUrl,
        [`${activityKey}.proofSubmittedAt`]: serverTimestamp(),
    });

    return {
        dayNumber,
        proofUrl,
    };
}

export async function markDailyActivityTested({
    sprintTesterId,
    dayNumber,
    developerUid,
}) {
    if (!sprintTesterId) {
        throw new Error("Sprint Tester ID is required.");
    }

    if (!dayNumber) {
        throw new Error("Day number is required.");
    }

    if (!developerUid) {
        throw new Error("Developer UID is required.");
    }

    const dailyStandupRef = doc(
        db,
        "DailyStandup",
        sprintTesterId
    );

    const snapshot = await getDoc(dailyStandupRef);

    if (!snapshot.exists()) {
        throw new Error("DailyStandup record not found.");
    }

    const data = snapshot.data();
    const activity = data.activities?.[`day${dayNumber}`];

    if (!activity) {
        throw new Error(
            `Day ${dayNumber} activity not found.`
        );
    }

    if (!activity.proofUrl) {
        throw new Error(
            "Tester has not submitted proof for this day."
        );
    }

    if (activity.tested) {
        return;
    }

    await updateDoc(dailyStandupRef, {
        [`activities.day${dayNumber}.tested`]: true,
        [`activities.day${dayNumber}.testedAt`]:
            serverTimestamp(),
        [`activities.day${dayNumber}.testedBy`]:
            developerUid,
    });
}

export async function markDailyActivityPaid({
    sprintTesterId,
    dayNumber,
    developerUid,
    paymentProofUrl,
}) {
    if (!sprintTesterId) {
        throw new Error("Sprint Tester ID is required.");
    }

    if (!dayNumber) {
        throw new Error("Day number is required.");
    }

    if (!developerUid) {
        throw new Error("Developer UID is required.");
    }

    if (!paymentProofUrl) {
        throw new Error(
            "Payment proof URL is required."
        );
    }

    const dailyStandupRef = doc(
        db,
        "DailyStandup",
        sprintTesterId
    );

    const snapshot = await getDoc(
        dailyStandupRef
    );

    if (!snapshot.exists()) {
        throw new Error(
            "DailyStandup record not found."
        );
    }

    const data = snapshot.data();

    const activity =
        data.activities?.[`day${dayNumber}`];

    if (!activity) {
        throw new Error(
            `Day ${dayNumber} activity not found.`
        );
    }

    if (!activity.tested) {
        throw new Error(
            "This day must be tested before payment."
        );
    }

    if (activity.paymentStatus === "paid") {
        throw new Error(
            "This day has already been paid."
        );
    }

    await updateDoc(dailyStandupRef, {
        [`activities.day${dayNumber}.paymentStatus`]:
            "paid",

        [`activities.day${dayNumber}.paidAt`]:
            serverTimestamp(),

        [`activities.day${dayNumber}.paidBy`]:
            developerUid,

        [`activities.day${dayNumber}.paymentProofUrl`]:
            paymentProofUrl,
    });
}
export async function finalizeSprintTesterStatus(sprintTesterId) {
    if (!sprintTesterId) {
        throw new Error("Sprint Tester ID is required.");
    }

    const dailyStandupRef = doc(
        db,
        "DailyStandup",
        sprintTesterId
    );

    const dailyStandupSnapshot = await getDoc(dailyStandupRef);

    if (!dailyStandupSnapshot.exists()) {
        throw new Error("DailyStandup record not found.");
    }

    const dailyStandup = dailyStandupSnapshot.data();

    const activities = dailyStandup.activities || {};

    const activityList = Object.values(activities);

    if (activityList.length === 0) {
        return;
    }

    const allDaysTested = activityList.every(
        (activity) => activity.tested === true
    );

    /*
     * If every required testing day has been completed,
     * mark the overall SprintTester as tested.
     */
    if (allDaysTested) {
        const sprintTesterRef = doc(
            db,
            "SprintTesters",
            sprintTesterId
        );

        await updateDoc(sprintTesterRef, {
            tested: true,
            testedAt: serverTimestamp(),
            testIncomplete: false,
        });

        return;
    }

    /*
     * Find the final testing day.
     */
    const finalActivity = activityList.reduce(
        (latest, activity) => {
            if (!latest) return activity;

            return activity.activityDate > latest.activityDate
                ? activity
                : latest;
        },
        null
    );

    if (!finalActivity?.activityDate) {
        return;
    }

    /*
     * Use date-only comparison.
     * This avoids time-zone/time-of-day problems.
     */
    const today = new Date();

    const todayDate =
        `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}-${String(
            today.getDate()
        ).padStart(2, "0")}`;

    /*
     * Sprint is incomplete only after the final
     * testing date has passed.
     */
    if (todayDate > finalActivity.activityDate) {
        const sprintTesterRef = doc(
            db,
            "SprintTesters",
            sprintTesterId
        );

        await updateDoc(sprintTesterRef, {
            tested: false,
            testIncomplete: true,
        });
    }
}
