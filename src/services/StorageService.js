import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../firebaseconfig";

export async function uploadAppIcon(file, developerUid) {
  if (!file) {
    throw new Error("App icon file is required.");
  }

  if (!developerUid) {
    throw new Error("Developer UID is required.");
  }

  const fileExtension =
    file.name.split(".").pop()?.toLowerCase() || "png";

  const fileName = `app-icon-${Date.now()}.${fileExtension}`;

  const storagePath = `app-icons/${developerUid}/${fileName}`;

  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);

  const downloadUrl = await getDownloadURL(storageRef);

  return {
    downloadUrl,
    storagePath,
    fileName,
  };
}

export async function uploadDailyProof(file, sprintTesterId, dayNumber) {
    if (!file) {
        throw new Error("Proof file is required.");
    }

    if (!sprintTesterId) {
        throw new Error("Sprint Tester ID is required.");
    }

    if (!dayNumber) {
        throw new Error("Day number is required.");
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed.");
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
        throw new Error("Proof image must be 5 MB or smaller.");
    }

    const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "png";

    const fileName = `proof-${Date.now()}.${fileExtension}`;

    const storagePath =
        `daily-standup/${sprintTesterId}/day${dayNumber}/${fileName}`;

    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);

    const downloadUrl = await getDownloadURL(storageRef);

    return {
        downloadUrl,
        storagePath,
        fileName,
    };
}