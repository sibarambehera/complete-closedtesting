import { useEffect, useState } from "react";
import { Users, Mail, Phone } from "lucide-react";

import { getAllAdminTesters } from "../../services/AppService";

function Testers() {
    const [testers, setTesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTesters = async () => {
            try {
                setLoading(true);
                setError("");

                const testerData = await getAllAdminTesters();
                setTesters(testerData);
            } catch (err) {
                console.error("Failed to load Admin Testers:", err);
                setError(err?.message || "Unable to load testers.");
            } finally {
                setLoading(false);
            }
        };

        loadTesters();
    }, []);

    if (loading) {
        return (
            <div className="admin-manage-page">
                <div className="admin-empty-card">
                    Loading Testers...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-manage-page">
                <div className="admin-error-card">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-manage-page">
            <div className="admin-manage-header">
                <div>
                    <h1>Testers</h1>
                    <p>
                        View registered testers on the platform.
                    </p>
                </div>

                <span className="admin-selection-count">
                    {testers.length} tester
                    {testers.length !== 1 ? "s" : ""}
                </span>
            </div>

            <div className="admin-manage-card">
                {testers.length === 0 ? (
                    <div className="admin-no-testers">
                        <Users size={36} />

                        <strong>No testers found</strong>

                        <p>
                            Registered testers will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="admin-tester-list">
                        {testers.map((tester) => (
                            <div
                                key={tester.testerId}
                                className="admin-tester-row"
                                style={{ cursor: "default" }}
                            >
                                <div className="admin-tester-avatar">
                                    <Users size={20} />
                                </div>

                                <div className="admin-tester-info">
                                    <strong>
                                        {tester.name || "Unnamed Tester"}
                                    </strong>

                                    <span>
                                        <Mail size={14} />
                                        {tester.email || "Email not available"}
                                    </span>

                                    <span>
                                        <Phone size={14} />
                                        {tester.phone || "Phone not available"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Testers;