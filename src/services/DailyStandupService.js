import {
    doc,
    getDoc,
    setDoc,
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
