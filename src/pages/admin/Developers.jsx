import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";

import {
    getAllAdminDevelopers,
    updateDeveloperStatus
} from "../../services/AppService";

function Developers() {
    const [developers, setDevelopers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingDeveloperId, setUpdatingDeveloperId] =
        useState(null);

    useEffect(() => {
        const loadDevelopers = async () => {
            try {
                setLoading(true);
                setError("");

                const developerData =
                    await getAllAdminDevelopers();

                setDevelopers(developerData);
            } catch (err) {
                console.error(
                    "Failed to load Admin Developers:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load developers."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDevelopers();
    }, []);

    const handleStatusChange = async (
        developer,
        status
    ) => {
        try {
            setUpdatingDeveloperId(
                developer.developerId
            );

            await updateDeveloperStatus(
                developer.developerId,
                status
            );

            setDevelopers(
                (currentDevelopers) =>
                    currentDevelopers.map(
                        (item) =>
                            item.developerId ===
                            developer.developerId
                                ? {
                                    ...item,
                                    status,
                                }
                                : item
                    )
            );
        } catch (err) {
            console.error(
                "Failed to update developer status:",
                err
            );

            alert(
                err?.message ||
                "Unable to update developer status."
            );
        } finally {
            setUpdatingDeveloperId(null);
        }
    };

    const filteredDevelopers =
        developers.filter((developer) => {
            const search =
                searchText
                    .trim()
                    .toLowerCase();

            if (!search) {
                return true;
            }

            return (
                (developer.name || "")
                    .toLowerCase()
                    .includes(search) ||
                (developer.email || "")
                    .toLowerCase()
                    .includes(search) ||
                (developer.phone || "")
                    .toLowerCase()
                    .includes(search)
            );
        });

    if (loading) {
        return (
            <div className="admin-manage-page">
                <div className="admin-empty-card">
                    Loading Developers...
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
                    <h1>Developers</h1>

                    <p>
                        View and manage registered developers.
                    </p>
                </div>

                <span className="admin-selection-count">
                    {developers.length} developer
                    {developers.length !== 1
                        ? "s"
                        : ""}
                </span>

            </div>

            <div className="admin-manage-card">

                {/* Search */}
                <div className="admin-testers-toolbar">

                    <div className="admin-testers-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search developer by name, email or phone..."
                            value={searchText}
                            onChange={(event) =>
                                setSearchText(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>

                {developers.length === 0 ? (

                    <div className="admin-no-testers">

                        <Users size={36} />

                        <strong>
                            No developers found
                        </strong>

                        <p>
                            Registered developers will
                            appear here.
                        </p>

                    </div>

                ) : filteredDevelopers.length === 0 ? (

                    <div className="admin-no-testers">

                        <Search size={36} />

                        <strong>
                            No matching developers
                        </strong>

                        <p>
                            Try a different search.
                        </p>

                    </div>

                ) : (

                    <div className="admin-testers-table-wrapper">

                        <table className="admin-testers-table">

                            <thead>
                                <tr>
                                    <th>Developer</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredDevelopers.map(
                                    (developer) => (

                                        <tr
                                            key={
                                                developer.developerId
                                            }
                                        >

                                            {/* Developer */}
                                            <td>

                                                <div className="admin-tester-name-cell">

                                                    <div className="admin-tester-avatar">
                                                        <Users
                                                            size={18}
                                                        />
                                                    </div>

                                                    <strong>
                                                        {developer.name ||
                                                            "Unnamed Developer"}
                                                    </strong>

                                                </div>

                                            </td>

                                            {/* Email */}
                                            <td>
                                                {developer.email ||
                                                    "Email not available"}
                                            </td>

                                            {/* Phone */}
                                            <td>
                                                {developer.phone ||
                                                    "Phone not available"}
                                            </td>

                                            {/* Status */}
                                            <td>

                                                <select
                                                    className="admin-tester-status-select"
                                                    value={
                                                        developer.status ||
                                                        "inactive"
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleStatusChange(
                                                            developer,
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    disabled={
                                                        updatingDeveloperId ===
                                                        developer.developerId
                                                    }
                                                >

                                                    <option value="active">
                                                        Active
                                                    </option>

                                                    <option value="inactive">
                                                        Inactive
                                                    </option>

                                                </select>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Developers;