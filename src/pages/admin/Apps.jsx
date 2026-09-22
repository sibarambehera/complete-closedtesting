import { useEffect, useState } from "react";
import { Smartphone, ExternalLink } from "lucide-react";

import { getAdminApps } from "../../services/AppService";

function Apps() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadApps = async () => {
            try {
                setLoading(true);
                setError("");

                const appData = await getAdminApps();

                setApps(appData);
            } catch (err) {
                console.error(
                    "Failed to load Admin Apps:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load apps."
                );
            } finally {
                setLoading(false);
            }
        };

        loadApps();
    }, []);

    if (loading) {
        return (
            <div className="admin-manage-page">
                <div className="admin-empty-card">
                    Loading Apps...
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

            {/* Header */}
            <div className="admin-manage-header">
                <div>
                    <h1>Apps</h1>

                    <p>
                        View applications submitted by
                        developers.
                    </p>
                </div>

                <span className="admin-selection-count">
                    {apps.length} app
                    {apps.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Apps */}
            <div className="admin-manage-card">

                {apps.length === 0 ? (

                    <div className="admin-no-testers">
                        <Smartphone size={36} />

                        <strong>
                            No apps found
                        </strong>

                        <p>
                            Developer applications will
                            appear here when they register.
                        </p>
                    </div>

                ) : (

                    <div className="admin-tester-list">

                        {apps.map((app) => (

                            <div
                                key={app.appId}
                                className="admin-tester-row"
                                style={{
                                    cursor: "default",
                                }}
                            >

                                {/* App Icon */}
                                <div className="admin-tester-avatar">
                                    {app.iconUrl ? (
                                        <img
                                            src={app.iconUrl}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    ) : (
                                        <Smartphone
                                            size={20}
                                        />
                                    )}
                                </div>

                                {/* App Information */}
                                <div className="admin-tester-info">

                                    <strong>
                                        {app.appName ||
                                            "Unnamed App"}
                                    </strong>

                                    <span>
                                        {app.packageName ||
                                            "Package name not available"}
                                    </span>

                                    <span>
                                        Status:{" "}
                                        {app.status
                                            ? app.status
                                                .charAt(0)
                                                .toUpperCase() +
                                              app.status.slice(1)
                                            : "Unknown"}
                                    </span>

                                </div>

                                {/* Play Store */}
                                {app.playStoreUrl && (
                                    <a
                                        href={
                                            app.playStoreUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="admin-select-button"
                                    >
                                        <ExternalLink
                                            size={15}
                                        />
                                        Play Store
                                    </a>
                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>
        </div>
    );
}

export default Apps;