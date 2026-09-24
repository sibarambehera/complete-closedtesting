import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
} from "firebase/firestore";

import { db } from "../firebaseconfig";

/**
 * Listen to chat messages for a Testing Sprint.
 *
 * Returns an unsubscribe function.
 */
export function subscribeToSprintChat(sprintId, onMessages) {
    if (!sprintId) {
        throw new Error("Sprint ID is required.");
    }

    const chatRef = collection(
        db,
        "TestingSprints",
        sprintId,
        "ChatMessages"
    );

    const chatQuery = query(
        chatRef,
        orderBy("createdAt", "asc")
    );

    return onSnapshot(
        chatQuery,
        (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            onMessages(messages);
        },
        (error) => {
            console.error(
                "Error listening to sprint chat:",
                error
            );
        }
    );
}


/**
 * Send a message to a Testing Sprint chat.
 */
export async function sendSprintChatMessage({
    sprintId,
    senderUid,
    senderName,
    senderRole,
    message
}) {
    if (!sprintId) {
        throw new Error("Sprint ID is required.");
    }

    if (!senderUid) {
        throw new Error("Sender UID is required.");
    }

    if (!message || !message.trim()) {
        throw new Error("Message cannot be empty.");
    }

    const chatRef = collection(
        db,
        "TestingSprints",
        sprintId,
        "ChatMessages"
    );

    const messageRef = await addDoc(chatRef, {
        senderUid,
        senderName: senderName || "User",
        senderRole: senderRole || "User",
        message: message.trim(),
        createdAt: serverTimestamp()
    });

    return messageRef.id;
}