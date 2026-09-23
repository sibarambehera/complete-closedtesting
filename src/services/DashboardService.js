import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where
} from "firebase/firestore";

import { db } from "../firebaseconfig";


export async function getDeveloperDashboardData(
    developerUid
) {
    if (!developerUid) {
        throw new Error("Developer UID is required.");
    }

    // ==========================================
    // 1. Developer Apps
    // ==========================================

    const appsSnapshot =
        await getDocs(
            query(
                collection(db, "DeveloperApps"),
                where(
                    "developerUid",
                    "==",
                    developerUid
                )
            )
        );

    const apps =
        appsSnapshot.docs.map(
            (appDoc) => ({
                appId: appDoc.id,
                ...appDoc.data()
            })
        );


    // ==========================================
    // 2. Testing Sprints
    // ==========================================

    const sprintsSnapshot =
        await getDocs(
            query(
                collection(db, "TestingSprints"),
                where(
                    "developerUid",
                    "==",
                    developerUid
                )
            )
        );

    const sprints =
        sprintsSnapshot.docs.map(
            (sprintDoc) => ({
                sprintId: sprintDoc.id,
                ...sprintDoc.data()
            })
        );


    // ==========================================
    // 3. Sprint Testers
    // ==========================================

    const sprintTestersSnapshot =
        await getDocs(
            query(
                collection(db, "SprintTesters"),
                where(
                    "developerUid",
                    "==",
                    developerUid
                )
            )
        );

    const sprintTesters =
        sprintTestersSnapshot.docs.map(
            (testerDoc) => ({
                sprintTesterId: testerDoc.id,
                ...testerDoc.data()
            })
        );


    // ==========================================
    // 4. Total Paid
    // ==========================================

    let totalPaidPaise = 0;

    for (
        const sprintTester
        of sprintTesters
    ) {
        const standupRef =
            doc(
                db,
                "DailyStandup",
                sprintTester.sprintTesterId
            );

        const standupSnapshot =
            await getDoc(standupRef);

        if (!standupSnapshot.exists()) {
            continue;
        }

        const standupData =
            standupSnapshot.data();

        const activities =
            standupData.activities || {};


        Object.values(activities).forEach(
            (activity) => {

                if (
                    activity?.paymentStatus ===
                    "paid"
                ) {
                    totalPaidPaise +=
                        Number(
                            activity.payoutAmountPaise ||
                            0
                        );
                }
            }
        );
    }


    // ==========================================
    // 5. Summary
    // ==========================================

    const activeSprints =
        sprints.filter(
            (sprint) =>
                (
                    sprint.status || ""
                ).toLowerCase() ===
                "active"
        );


    return {
        totalApps: apps.length,

        activeSprints:
            activeSprints.length,

        totalTesters:
            sprintTesters.length,

        totalPaidPaise,

        apps,

        sprints,

        sprintTesters
    };
}