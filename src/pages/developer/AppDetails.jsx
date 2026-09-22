import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Smartphone,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getDeveloperApp, getDeveloperTestingSprints } from "../../services/AppService";

function AppDetails() {
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useAuth();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasActiveSprint, setHasActiveSprint] =
    useState(false);

  useEffect(() => {
    const loadApp = async () => {
      if (!user?.uid || !appId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getDeveloperApp(
          appId,
          user.uid
        );

        setApp(result);
        const sprintData =
          await getDeveloperTestingSprints(
            user.uid
          );

        const activeSprintExists =
          sprintData.some(
            (sprint) =>
              sprint.appId === appId &&
              (sprint.status || "")
                .toLowerCase() === "active"
          );

        setHasActiveSprint(
          activeSprintExists
        );
      } catch (err) {
        console.error("Failed to load app:", err);

        setError(
          "Unable to load this app. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApp();
  }, [appId, user?.uid]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="form-card">
          Loading app details...
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="dashboard-page">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/developer/apps")}
        >
          <ArrowLeft size={18} />
          Back to My Apps
        </button>

        <div className="form-card">
          <p className="form-error">
            {error || "App not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <div className="page-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/developer/apps")}
          >
            <ArrowLeft size={18} />
            Back to My Apps
          </button>

          <h1>App Details</h1>

          <p>
            View and manage your Android application.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              `/developer/apps/${app.appId}/testing-sprint/create`
            )
          }
          disabled={hasActiveSprint}
          title={
            hasActiveSprint
              ? "You already have an active Testing Sprint for this app."
              : "Create Testing Sprint"
          }
        >
          <Plus size={18} />
          Create Testing Sprint
        </button>
      </div>

      <div className="form-card">

        <div className="app-details-header">

          <div className="app-details-icon">
            {app.iconUrl ? (
              <img
                src={app.iconUrl}
                alt={`${app.appName} icon`}
              />
            ) : (
              <Smartphone size={40} />
            )}
          </div>

          <div>
            <h2>{app.appName}</h2>

            <p className="package-name">
              {app.packageName}
            </p>

            <strong className="status-active">
              {app.status
                ? app.status.charAt(0).toUpperCase() +
                app.status.slice(1)
                : "Active"}
            </strong>
          </div>

        </div>

        <div className="app-details-section">

          <h3>Application Information</h3>

          <div className="details-grid">

            <div>
              <span>App Name</span>
              <strong>{app.appName}</strong>
            </div>

            <div>
              <span>Package Name</span>
              <strong>{app.packageName}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{app.status || "Active"}</strong>
            </div>

            <div>
              <span>Testing Sprints</span>
              <strong>0</strong>
            </div>

          </div>

        </div>

        <div className="app-details-section">

          <h3>Description</h3>

          <p>
            {app.description || "No description provided."}
          </p>

        </div>

        <div className="app-details-section">

          <h3>Google Play</h3>

          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="play-store-link"
          >
            Open Google Play App
            <ExternalLink size={16} />
          </a>

        </div>

      </div>

    </div>
  );
}

export default AppDetails;