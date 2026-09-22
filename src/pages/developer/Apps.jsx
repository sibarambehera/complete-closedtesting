import { useEffect, useState } from "react";
import {
  Plus,
  Smartphone,
  MoreVertical,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getDeveloperApps } from "../../services/AppService";

function Apps() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApps = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await getDeveloperApps(user.uid);

        setApps(result);
      } catch (err) {
        console.error(
          "Failed to load apps:",
          err
        );

        setError(
          "Failed to load your apps. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [user?.uid]);

  // Developer can have only one active app
  const hasActiveApp = apps.some(
    (app) =>
      (app.status || "")
        .toLowerCase() === "active"
  );
  
  return (
    <div className="dashboard-page">

      <div className="page-header">

        <div>
          <h1>My Apps</h1>

          <p>
            Manage your Android applications and Testing Sprints.
          </p>
        </div>

        <button
          type="button"
          className={`primary-button ${hasActiveApp
            ? "button-disabled"
            : ""
            }`}
          onClick={() =>
            navigate("/developer/apps/add")
          }
          disabled={hasActiveApp}
          title={
            hasActiveApp
              ? "You already have an active app."
              : "Add Android App"
          }
        >
          <Plus size={18} />
          Add Android App
        </button>

      </div>


      {/* Loading */}

      {loading && (
        <div className="form-card">
          Loading your apps...
        </div>
      )}


      {/* Error */}

      {!loading && error && (
        <div className="form-card">
          <p className="form-error">
            {error}
          </p>
        </div>
      )}


      {/* No Apps */}

      {!loading &&
        !error &&
        apps.length === 0 && (
          <div className="form-card">

            <div className="form-section-title">

              <Smartphone size={20} />

              <div>
                <h2>No apps yet</h2>

                <p>
                  Add your first Android application to create a Testing Sprint.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  "/developer/apps/add"
                )
              }
            >
              <Plus size={18} />
              Add Android App
            </button>

          </div>
        )}


      {/* Apps */}

      {!loading &&
        !error &&
        apps.length > 0 && (
          <div className="apps-grid">

            {apps.map((app) => (
              <div
                className="app-card"
                key={app.appId}
              >

                <div className="app-card-header">

                  <div className="app-icon">

                    {app.iconUrl ? (
                      <img
                        src={app.iconUrl}
                        alt={`${app.appName} icon`}
                        className="app-icon-image"
                      />
                    ) : (
                      <Smartphone
                        size={28}
                      />
                    )}

                  </div>

                  <button
                    type="button"
                    className="more-button"
                  >
                    <MoreVertical
                      size={20}
                    />
                  </button>

                </div>

                <h3>
                  {app.appName}
                </h3>

                <p className="package-name">
                  {app.packageName}
                </p>

                <div className="app-stats">

                  <div>
                    <span>
                      Testing Sprints
                    </span>

                    <strong>
                      0
                    </strong>
                  </div>

                  <div>
                    <span>
                      Status
                    </span>

                    <strong
                      className={
                        app.status ===
                          "active"
                          ? "status-active"
                          : "status-completed"
                      }
                    >
                      {app.status
                        ? app.status
                          .charAt(0)
                          .toUpperCase() +
                        app.status.slice(1)
                        : "Active"}
                    </strong>
                  </div>

                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    navigate(
                      `/developer/apps/${app.appId}`
                    )
                  }
                >
                  <Eye size={17} />
                  View App
                </button>

              </div>
            ))}

          </div>
        )}

    </div>
  );
}

export default Apps;