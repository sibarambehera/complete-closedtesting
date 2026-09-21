import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { auth, db } from "../firebaseconfig";

export async function registerUser({
  name,
  email,
  phone,
  password,
  role
}) {
  // Create Firebase Authentication account
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  // Create Employee document
  // Firestore generates the document ID automatically
  const employeeRef = await addDoc(
    collection(db, "Employee"),
    {
      uid: user.uid,
      userid:user.uid,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: role,
      createdAt: serverTimestamp()
    }
  );

  return {
    uid: user.uid,
    employeeId: employeeRef.id
  };
}

export async function loginUser({
  email,
  password
}) {
  // Login with Firebase Authentication
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  const user = userCredential.user;

  // Find Employee document using Firebase Auth UID
  const employeeQuery = query(
    collection(db, "Employee"),
    where("uid", "==", user.uid)
  );

  const employeeSnapshot =
    await getDocs(employeeQuery);

  if (employeeSnapshot.empty) {
    throw new Error(
      "Employee profile not found."
    );
  }

  // Employee document has auto-generated Firestore ID
  const employeeDoc =
    employeeSnapshot.docs[0];

  return {
    uid: user.uid,
    employeeId: employeeDoc.id,
    ...employeeDoc.data()
  };
}