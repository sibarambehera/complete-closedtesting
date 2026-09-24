import { useEffect, useRef, useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";

import {
    subscribeToSprintChat,
    sendSprintChatMessage
} from "../services/SprintChatService";

import { useAuth } from "../context/AuthContext";

function SprintChatModal({
    isOpen,
    onClose,
    sprintId,
    sprintName
}) {
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null);

    /*
     * Subscribe to real-time chat messages
     */
    useEffect(() => {
        if (!isOpen || !sprintId) {
            return;
        }

        setLoading(true);
        setMessages([]);

        const unsubscribe = subscribeToSprintChat(
            sprintId,
            (chatMessages) => {
                setMessages(chatMessages);
                setLoading(false);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [isOpen, sprintId]);

    /*
     * Automatically scroll to latest message
     */
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth"
            });
        }
    }, [messages]);

    /*
     * Send message
     */
    const handleSendMessage = async () => {
        const trimmedMessage = messageText.trim();

        if (!trimmedMessage || sending) {
            return;
        }

        if (!user?.uid) {
            alert("User information not available.");
            return;
        }

        try {
            setSending(true);

            await sendSprintChatMessage({
                sprintId,
                senderUid: user.uid,
                senderName: user.name || "User",
                senderRole: user.role || "User",
                message: trimmedMessage
            });

            setMessageText("");
        } catch (error) {
            console.error(
                "Error sending chat message:",
                error
            );

            alert(
                error.message ||
                "Failed to send message."
            );
        } finally {
            setSending(false);
        }
    };

    /*
     * Send message with Enter key
     */
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="sprint-chat-overlay"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="sprint-chat-modal">

                {/* Header */}
                <div className="sprint-chat-header">
                    <div className="sprint-chat-header-left">
                        <div className="sprint-chat-icon">
                            <MessageCircle size={20} />
                        </div>

                        <div>
                            <h3>Sprint Chat</h3>

                            <span>
                                {sprintName ||
                                    "Testing Sprint"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="sprint-chat-close"
                        onClick={onClose}
                        aria-label="Close chat"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="sprint-chat-messages">

                    {loading ? (
                        <div className="sprint-chat-empty">
                            Loading messages...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="sprint-chat-empty">
                            <MessageCircle
                                size={34}
                            />

                            <strong>
                                No messages yet
                            </strong>

                            <span>
                                Start a conversation
                                about this testing
                                sprint.
                            </span>
                        </div>
                    ) : (
                        messages.map((chatMessage) => {
                            const isMine =
                                chatMessage.senderUid ===
                                user?.uid;

                            return (
                                <div
                                    key={
                                        chatMessage.id
                                    }
                                    className={`sprint-chat-message-row ${
                                        isMine
                                            ? "mine"
                                            : "other"
                                    }`}
                                >
                                    <div
                                        className={`sprint-chat-message ${
                                            isMine
                                                ? "mine"
                                                : "other"
                                        }`}
                                    >
                                        {!isMine && (
                                            <div className="sprint-chat-sender">
                                                <strong>
                                                    {
                                                        chatMessage.senderName
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        chatMessage.senderRole
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        <div className="sprint-chat-message-text">
                                            {
                                                chatMessage.message
                                            }
                                        </div>

                                        <div className="sprint-chat-time">
                                            {formatChatTime(
                                                chatMessage.createdAt
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    <div
                        ref={messagesEndRef}
                    />
                </div>

                {/* Input */}
                <div className="sprint-chat-input-area">
                    <textarea
                        value={messageText}
                        onChange={(event) =>
                            setMessageText(
                                event.target.value
                            )
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        rows={2}
                        disabled={sending}
                    />

                    <button
                        type="button"
                        className="sprint-chat-send"
                        onClick={handleSendMessage}
                        disabled={
                            sending ||
                            !messageText.trim()
                        }
                        title="Send message"
                    >
                        <Send size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}


/*
 * Format Firestore timestamp
 */
function formatChatTime(timestamp) {
    if (!timestamp) {
        return "";
    }

    try {
        const date =
            timestamp.toDate
                ? timestamp.toDate()
                : new Date(timestamp);

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch (error) {
        return "";
    }
}

export default SprintChatModal;