import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebaseconfig";

/**
 * TEMPORARY MOCK PAYMENT
 *
 * This is only for development/testing.
 * Later this will be replaced with Razorpay payment creation.
 */

export async function createMockPayment({
  developerUid,
  appId,
  amount = 200,
}) {
  if (!developerUid) {
    throw new Error("Developer UID is required.");
  }

  if (!appId) {
    throw new Error("App ID is required.");
  }

  const paymentRef = await addDoc(
    collection(db, "Payments"),
    {
      developerUid,
      appId,

      sprintId: null,

      amount: Number(amount),
      currency: "INR",

      paymentType: "platform_charge",

      status: "pending",

      razorpayOrderId: null,
      razorpayPaymentId: null,
      razorpaySignature: null,

      createdAt: serverTimestamp(),
      paidAt: null,
    }
  );

  console.log("Mock payment created:", paymentRef.id);

  return {
    paymentId: paymentRef.id,

    // TEMPORARY
    // Simulates successful payment.
    success: true,

    amount: Number(amount),
  };
}


/**
 * TEMPORARY
 *
 * Marks the mock payment as successful after
 * the Testing Sprint has been created.
 *
 * Later Razorpay verification will replace this.
 */
export async function markMockPaymentSuccess({
  paymentId,
  sprintId,
}) {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  if (!sprintId) {
    throw new Error("Sprint ID is required.");
  }

  const paymentRef = doc(
    db,
    "Payments",
    paymentId
  );

  await updateDoc(paymentRef, {
    sprintId,

    status: "paid",

    paidAt: serverTimestamp(),
  });

  console.log(
    "Mock payment marked as paid:",
    paymentId
  );

  return {
    paymentId,
    sprintId,
    status: "paid",
  };
}