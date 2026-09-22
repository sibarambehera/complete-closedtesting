import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";

import {
    getAllAdminTesters,
    updateTesterStatus
} from "../../services/AppService";

function Testers() {
    const [testers, setTesters] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingTesterId, setUpdatingTesterId] = useState(null);

    useEffect(() => {
        const loadTesters = async () => {
            try {
                setLoading(true);
                setError("");

                const testerData =
                    await getAllAdminTesters();

                setTesters(testerData);
            } catch (err) {
                console.error(
                    "Failed to load Admin Testers:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load testers."
                );
            } finally {
                setLoading(false);
            }
        };

        loadTesters();
    }, []);

    const handleStatusChange = async (
        tester,
        status
    ) => {
        try {
            setUpdatingTesterId(
                tester.testerId
            );

            await updateTesterStatus(
                tester.testerId,
                status
            );

            setTesters(
                (currentTesters) =>
                    currentTesters.map(
                        (item) =>
                            item.testerId ===
                            tester.testerId
                                ? {
                                    ...item,
                                    status,
                                }
                                : item
                    )
            );
        } catch (err) {
            console.error(
                "Failed to update tester status:",
                err
            );

            alert(
                err?.message ||
                "Unable to update tester status."
            );
        } finally {
            setUpdatingTesterId(null);
        }
    };

    const filteredTesters =
        testers.filter((tester) => {
            const search =
                searchText
                    .trim()
                    .toLowerCase();

            if (!search) {
                return true;
            }

            return (
                (tester.name || "")
                    .toLowerCase()
                    .includes(search) ||

                (tester.email || "")
                    .toLowerCase()
                    .includes(search) ||

                (tester.phone || "")
                    .toLowerCase()
                    .includes(search)
            );
        });

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

            {/* Header */}
            <div className="admin-manage-header">
                <div>
                    <h1>Testers</h1>

                    <p>
                        View and manage registered testers.
                    </p>
                </div>

                <span className="admin-selection-count">
                    {testers.length} tester
                    {testers.length !== 1
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
                            placeholder="Search tester by name, email or phone..."
                            value={searchText}
                            onChange={(event) =>
                                setSearchText(
                                    event.target.value
                                )
                            }
                        />
                    </div>
                </div>

                {testers.length === 0 ? (
                    <div className="admin-no-testers">
                        <Users size={36} />

                        <strong>
                            No testers found
                        </strong>

                        <p>
                            Registered testers will
                            appear here.
                        </p>
                    </div>
                ) : filteredTesters.length === 0 ? (
                    <div className="admin-no-testers">
                        <Search size={36} />

                        <strong>
                            No matching testers
                        </strong>

                        <p>
                            Try a different search.
                        </p>
                    </div>
                ) : (

                    /* Table */
                    <div className="admin-testers-table-wrapper">
                        <table className="admin-testers-table">

                            <thead>
                                <tr>
                                    <th>Tester</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Tested Apps</th>
                                    <th>Test Incomplete Apps</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTesters.map(
                                    (tester) => (
                                        <tr
                                            key={
                                                tester.testerId
                                            }
                                        >
                                            {/* Tester */}
                                            <td>
                                                <div className="admin-tester-name-cell">
                                                    <div className="admin-tester-avatar">
                                                        <Users
                                                            size={18}
                                                        />
                                                    </div>

                                                    <strong>
                                                        {tester.name ||
                                                            "Unnamed Tester"}
                                                    </strong>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td>
                                                {tester.email ||
                                                    "Email not available"}
                                            </td>

                                            {/* Phone */}
                                            <td>
                                                {tester.phone ||
                                                    "Phone not available"}
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <select
                                                    className="admin-tester-status-select"
                                                    value={
                                                        tester.status ||
                                                        "active"
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleStatusChange(
                                                            tester,
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    disabled={
                                                        updatingTesterId ===
                                                        tester.testerId
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

                                            {/* Tested Apps */}
                                            <td>
                                                <span className="admin-tester-count">
                                                    {tester.testedApps ||
                                                        0}
                                                </span>
                                            </td>

                                            {/* Test Incomplete Apps */}
                                            <td>
                                                <span className="admin-tester-count incomplete">
                                                    {tester.testIncompleteApps ||
                                                        0}
                                                </span>
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

export default Testers;