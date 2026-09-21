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