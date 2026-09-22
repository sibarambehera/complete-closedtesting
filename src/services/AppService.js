import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../firebaseconfig";

export async function createDeveloperApp({
  developerUid,
  appName,
  packageName,
  playStoreUrl,
  description,
  iconUrl,
  iconStoragePath,
}) {
  if (!developerUid) {
    throw new Error("Developer UID is required.");
  }

  const appRef = await addDoc(
    collection(db, "DeveloperApps"),
    {
      developerUid,
      appName: appName.trim(),
      packageName: packageName.trim(),
      playStoreUrl: playStoreUrl.trim(),
      description: description.trim(),
      iconUrl: iconUrl || "",
      iconStoragePath: iconStoragePath || "",
      status: "active",
      createdAt: serverTimestamp(),
    }
  );

  return {
    appId: appRef.id,
  };
}

export async function getDeveloperApps(developerUid) {
  if (!developerUid) {
    throw new Error("Developer UID is required.");
  }

  const appsQuery = query(
    collection(db, "DeveloperApps"),
    where("developerUid", "==", developerUid)
  );

  const snapshot = await getDocs(appsQuery);

  return snapshot.docs.map((doc) => ({
    appId: doc.id,
    ...doc.data(),
  }));
}

export async function getAdminApps() {
    const appsQuery = query(
        collection(db, "DeveloperApps")
    );

    const snapshot = await getDocs(appsQuery);

    return snapshot.docs.map((appDoc) => ({
        appId: appDoc.id,
        ...appDoc.data(),
    }));
}

export async function getDeveloperApp(
  appId,
  developerUid
) {
  if (!appId) {
    throw new Error("App ID is required.");
  }

  if (!developerUid) {
    throw new Error("Developer UID is required.");
  }

  const appRef = doc(
    db,
    "DeveloperApps",
    appId
  );

  const appSnapshot = await getDoc(appRef);

  if (!appSnapshot.exists()) {
    throw new Error("App not found.");
  }

  const appData = appSnapshot.data();

  // Important: verify ownership
  if (appData.developerUid !== developerUid) {
    throw new Error(
      "You do not have permission to view this app."
    );
  }

  return {
    appId: appSnapshot.id,
    ...appData,
  };
}

export async function createTestingSprint({
  developerUid,
  appId,
  durationDays,
  testerRequired,
  testingGoal,
  instructions,
  paymentId,
}) {
  if (!developerUid) {
    throw new Error("Developer UID is required.");
  }

  if (!appId) {
    throw new Error("App ID is required.");
  }

  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const sprintRef = await addDoc(
    collection(db, "TestingSprints"),
    {
      developerUid,
      appId,

      durationDays: Number(durationDays),
      testerRequired: Number(testerRequired),

      testerPayoutPerTester: 100,
      platformCharge: 200,

      platformPaymentStatus: "paid",

      testingGoal: testingGoal.trim(),
      instructions: instructions.trim(),

      status: "active",

      paymentId,

      createdAt: serverTimestamp(),
    }
  );

  return {
    sprintId: sprintRef.id,
  };
}

export async function getTestingSprint(
  sprintId,
  developerUid
) {
  if (!sprintId) {
    throw new Error("Sprint ID is required.");
  }

  if (!developerUid) {
    throw new Error("Developer UID is required.");
  }

  const sprintRef = doc(
    db,
    "TestingSprints",
    sprintId
  );

  const sprintSnapshot = await getDoc(sprintRef);

  if (!sprintSnapshot.exists()) {
    throw new Error("Testing Sprint not found.");
  }

  const sprintData = sprintSnapshot.data();

  // Verify ownership
  if (sprintData.developerUid !== developerUid) {
    throw new Error(
      "You do not have permission to view this Testing Sprint."
    );
  }

  return {
    sprintId: sprintSnapshot.id,
    ...sprintData,
  };
}

export async function getDeveloperTestingSprints(
  developerUid
) {
  if (!developerUid) {
    throw new Error("Developer UID is required.");
  }

  const sprintsQuery = query(
    collection(db, "TestingSprints"),
    where("developerUid", "==", developerUid)
  );

  const snapshot = await getDocs(sprintsQuery);

  return snapshot.docs.map((sprintDoc) => ({
    sprintId: sprintDoc.id,
    ...sprintDoc.data(),
  }));
}

export async function getAdminTestingSprints() {
  const [
    sprintSnapshot,
    appSnapshot,
    employeeSnapshot,
  ] = await Promise.all([
    getDocs(collection(db, "TestingSprints")),
    getDocs(collection(db, "DeveloperApps")),
    getDocs(collection(db, "Employee")),
  ]);

  const apps = {};

  appSnapshot.docs.forEach((appDoc) => {
    apps[appDoc.id] = {
      appId: appDoc.id,
      ...appDoc.data(),
    };
  });

  const employees = {};

  employeeSnapshot.docs.forEach((employeeDoc) => {
    const employee = employeeDoc.data();

    if (employee.uid) {
      employees[employee.uid] = {
        employeeId: employeeDoc.id,
        ...employee,
      };
    }
  });

  return sprintSnapshot.docs.map((sprintDoc) => {
    const sprint = sprintDoc.data();

    const app = apps[sprint.appId] || null;

    const developer =
      employees[sprint.developerUid] || null;

    return {
      sprintId: sprintDoc.id,
      ...sprint,

      app,
      developer,
    };
  });
}

export async function getAdminTestingSprint(sprintId) {
  if (!sprintId) {
    throw new Error("Testing Sprint ID is required.");
  }

  const sprintRef = doc(
    db,
    "TestingSprints",
    sprintId
  );

  const snapshot = await getDoc(sprintRef);

  if (!snapshot.exists()) {
    throw new Error(
      "Testing Sprint not found."
    );
  }

  const sprint = {
    sprintId: snapshot.id,
    ...snapshot.data(),
  };

  // Get App
  let app = null;

  if (sprint.appId) {
    const appRef = doc(
      db,
      "DeveloperApps",
      sprint.appId
    );

    const appSnapshot =
      await getDoc(appRef);

    if (appSnapshot.exists()) {
      app = {
        appId: appSnapshot.id,
        ...appSnapshot.data(),
      };
    }
  }

  // Get Developer
  let developer = null;

  if (sprint.developerUid) {
    const employeeQuery = query(
      collection(db, "Employee"),
      where(
        "uid",
        "==",
        sprint.developerUid
      )
    );

    const employeeSnapshot =
      await getDocs(employeeQuery);

    if (!employeeSnapshot.empty) {
      const employeeDoc =
        employeeSnapshot.docs[0];

      developer = {
        employeeId: employeeDoc.id,
        ...employeeDoc.data(),
      };
    }
  }

  return {
    ...sprint,
    app,
    developer,
  };
}

export async function getAdminTesters(
  sprintId
) {
  if (!sprintId) {
    throw new Error(
      "Testing Sprint ID is required."
    );
  }

  // Get all testers
  const testersQuery = query(
    collection(db, "Employee"),
    where("role", "==", "tester")
  );

  const testerSnapshot =
    await getDocs(testersQuery);

  // Get testers already assigned to this Sprint
  const assignedQuery = query(
    collection(db, "SprintTesters"),
    where(
      "sprintId",
      "==",
      sprintId
    )
  );

  const assignedSnapshot =
    await getDocs(assignedQuery);

  const assignedTesterUids =
    new Set(
      assignedSnapshot.docs.map(
        (testerDoc) =>
          testerDoc.data().testerUid
      )
    );

  // Return only testers who are NOT already assigned
  return testerSnapshot.docs
    .map((testerDoc) => ({
      testerId: testerDoc.id,
      ...testerDoc.data(),
    }))
    .filter(
      (tester) =>
        !assignedTesterUids.has(
          tester.uid
        )
    );
}

export async function assignTestersToSprint({
    sprintId,
    testerIds,
}) {
    if (!sprintId) {
        throw new Error(
            "Testing Sprint ID is required."
        );
    }

    if (
        !testerIds ||
        testerIds.length === 0
    ) {
        throw new Error(
            "Please select at least one tester."
        );
    }

    // Get Sprint
    const sprintRef = doc(
        db,
        "TestingSprints",
        sprintId
    );

    const sprintSnapshot =
        await getDoc(sprintRef);

    if (!sprintSnapshot.exists()) {
        throw new Error(
            "Testing Sprint not found."
        );
    }

    const sprint =
        sprintSnapshot.data();

    // Get already assigned testers
    const assignedQuery = query(
        collection(db, "SprintTesters"),
        where(
            "sprintId",
            "==",
            sprintId
        )
    );

    const assignedSnapshot =
        await getDocs(assignedQuery);

    const assignedTesterUids =
        new Set(
            assignedSnapshot.docs.map(
                (testerDoc) =>
                    testerDoc.data().testerUid
            )
        );

    // Get selected Employee documents
    const testerDocuments =
        await Promise.all(
            testerIds.map(async (testerId) => {

                const testerRef = doc(
                    db,
                    "Employee",
                    testerId
                );

                const testerSnapshot =
                    await getDoc(
                        testerRef
                    );

                if (
                    !testerSnapshot.exists()
                ) {
                    throw new Error(
                        `Tester ${testerId} was not found.`
                    );
                }

                return {
                    testerId,
                    ...testerSnapshot.data(),
                };
            })
        );

    // Remove testers that are already assigned
    const newTesters =
        testerDocuments.filter(
            (tester) =>
                tester.uid &&
                !assignedTesterUids.has(
                    tester.uid
                )
        );

    if (newTesters.length === 0) {
        throw new Error(
            "All selected testers are already assigned to this Testing Sprint."
        );
    }

    // Check Sprint capacity
    const currentAssignedCount =
        assignedSnapshot.size;

    const testerRequired =
        Number(
            sprint.testerRequired || 0
        );

    if (
        currentAssignedCount +
            newTesters.length >
        testerRequired
    ) {
        throw new Error(
            `You can assign only ${
                testerRequired -
                currentAssignedCount
            } more tester(s) to this Sprint.`
        );
    }

    // Create all assignments together
    const batch = writeBatch(db);

    newTesters.forEach((tester) => {

        const sprintTesterRef =
            doc(
                collection(
                    db,
                    "SprintTesters"
                )
            );

        batch.set(
            sprintTesterRef,
            {
                sprintId,

                testerUid:
                    tester.uid,

                testerEmployeeId:
                    tester.testerId,

                testerName:
                    tester.name || "",

                testerEmail:
                    tester.email || "",

                developerUid:
                    sprint.developerUid,

                appId:
                    sprint.appId,

                status: "assigned",

                downloaded: false,

                downloadedAt: null,

                tested: false,

                testedAt: null,

                proofUrl: null,

                proofSubmittedAt: null,

                assignedAt:
                    serverTimestamp(),
            }
        );
    });

    await batch.commit();

    return {
        assignedCount:
            newTesters.length,

        totalAssigned:
            currentAssignedCount +
            newTesters.length,
    };
}

export async function getSprintTesters(
    sprintId
) {
    if (!sprintId) {
        throw new Error(
            "Testing Sprint ID is required."
        );
    }

    const testersQuery = query(
        collection(db, "SprintTesters"),
        where(
            "sprintId",
            "==",
            sprintId
        )
    );

    const snapshot =
        await getDocs(testersQuery);

    return snapshot.docs.map(
        (testerDoc) => ({
            sprintTesterId:
                testerDoc.id,

            ...testerDoc.data(),
        })
    );
}

export async function markTesterDownloaded(
    sprintTesterId
) {
    if (!sprintTesterId) {
        throw new Error(
            "Sprint Tester ID is required."
        );
    }

    const testerRef = doc(
        db,
        "SprintTesters",
        sprintTesterId
    );

    await updateDoc(testerRef, {
        downloaded: true,
        downloadedAt: serverTimestamp(),
    });

    return {
        success: true,
        sprintTesterId,
    };
}

export async function markTesterTested(
    sprintTesterId
) {
    if (!sprintTesterId) {
        throw new Error(
            "Sprint Tester ID is required."
        );
    }

    const testerRef = doc(
        db,
        "SprintTesters",
        sprintTesterId
    );

    await updateDoc(testerRef, {
        tested: true,
        testedAt: serverTimestamp(),
    });

    return {
        success: true,
        sprintTesterId,
    };
}



export async function getTesterAssignedSprints(
    testerEmployeeId
) {
    if (!testerEmployeeId) {
        throw new Error(
            "Tester Employee ID is required."
        );
    }

    const testersQuery = query(
        collection(db, "SprintTesters"),
        where(
            "testerEmployeeId",
            "==",
            testerEmployeeId
        )
    );

    const snapshot = await getDocs(testersQuery);

    const assignments = await Promise.all(
        snapshot.docs.map(async (testerDoc) => {
            const testerData = testerDoc.data();

            let sprintData = null;
            let appData = null;

            // Get Testing Sprint
            if (testerData.sprintId) {
                const sprintRef = doc(
                    db,
                    "TestingSprints",
                    testerData.sprintId
                );

                const sprintSnapshot =
                    await getDoc(sprintRef);

                if (sprintSnapshot.exists()) {
                    sprintData = {
                        sprintId:
                            sprintSnapshot.id,
                        ...sprintSnapshot.data(),
                    };
                }
            }

            // Get Developer App
            if (sprintData?.appId) {
                const appRef = doc(
                    db,
                    "DeveloperApps",
                    sprintData.appId
                );

                const appSnapshot =
                    await getDoc(appRef);

                if (appSnapshot.exists()) {
                    appData = {
                        appId:
                            appSnapshot.id,
                        ...appSnapshot.data(),
                    };
                }
            }

            return {
                sprintTesterId: testerDoc.id,

                ...testerData,

                sprint: sprintData,

                app: appData,
            };
        })
    );

    return assignments;
}
