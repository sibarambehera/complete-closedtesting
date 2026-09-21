import { useEffect, useState } from "react";
import { Eye, CalendarDays, Users, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  getDeveloperTestingSprints,
  getDeveloperApp,
} from "../../services/AppService";

function TestingSprints() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sprints, setSprints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSprints();
  }, []);

  const loadSprints = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!user?.uid) {
        throw new Error("Developer information is missing.");
      }

      const sprintList =
        await getDeveloperTestingSprints(user.uid);

      const enrichedSprints = await Promise.all(
        sprintList.map(async (sprint) => {
          try {
            const app = await getDeveloperApp(
              sprint.appId,
              user.uid
            );

            return {
              ...sprint,
              app,
            };
          } catch (appError) {
            console.error(
              "Error loading app:",
              appError
            );

            return {
              ...sprint,
              app: null,
            };
          }
        })
      );

      setSprints(enrichedSprints);
    } catch (error) {
      console.error(
        "Error loading Testing Sprints:",
        error
      );

      setError(
        error?.message ||
          "Unable to load Testing Sprints."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "-";
    }

    if (timestamp.toDate) {
      return timestamp
        .toDate()
        .toLocaleDateString("en-IN");
    }

    return "-";
  };

  const getStatusClass = (status) => {
    if (status === "active") {
      return "sprint-status active";
    }

    if (status === "completed") {
      return "sprint-status completed";
    }

    return "sprint-status";
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>My Testing Sprints</h1>
            <p>
              View and manage your Testing Sprints.
            </p>
          </div>
        </div>

        <div className="empty-state">
          Loading Testing Sprints...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Testing Sprints</h1>
          <p>
            View and manage your Testing Sprints.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!error && sprints.length === 0 && (
        <div className="empty-state">
          <h3>No Testing Sprints yet</h3>

          <p>
            Create a Testing Sprint for one of your
            apps to get started.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/developer/apps")
            }
          >
            Go to My Apps
          </button>
        </div>
      )}

      {!error && sprints.length > 0 && (
        <div className="testing-sprints-list">
          {sprints.map((sprint) => (
            <div
              className="testing-sprint-card"
              key={sprint.sprintId}
            >
              <div className="testing-sprint-card-header">
                <div className="testing-sprint-app">
                  <div className="testing-sprint-icon">
                    {sprint.app?.iconUrl ? (
                      <img
                        src={sprint.app.iconUrl}
                        alt={
                          sprint.app?.appName ||
                          "App"
                        }
                      />
                    ) : (
                      <Smartphone size={28} />
                    )}
                  </div>

                  <div>
                    <h3>
                      {sprint.app?.appName ||
                        "App"}
                    </h3>

                    <p>
                      {sprint.app?.packageName ||
                        sprint.appId}
                    </p>
                  </div>
                </div>

                <span
                  className={getStatusClass(
                    sprint.status
                  )}
                >
                  {sprint.status || "unknown"}
                </span>
              </div>

              <div className="testing-sprint-info">
                <div>
                  <CalendarDays size={18} />

                  <div>
                    <span>Duration</span>
                    <strong>
                      {sprint.durationDays} Days
                    </strong>
                  </div>
                </div>

                <div>
                  <Users size={18} />

                  <div>
                    <span>Testers Required</span>
                    <strong>
                      {sprint.testerRequired}
                    </strong>
                  </div>
                </div>

                <div>
                  <Smartphone size={18} />

                  <div>
                    <span>Platform</span>
                    <strong>Android</strong>
                  </div>
                </div>

                <div>
                  <CalendarDays size={18} />

                  <div>
                    <span>Created</span>
                    <strong>
                      {formatDate(
                        sprint.createdAt
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="testing-sprint-card-footer">
                <div>
                  <span>Testing Goal</span>

                  <p>
                    {sprint.testingGoal ||
                      "No testing goal provided."}
                  </p>
                </div>

                <button
                  className="secondary-button"
                  onClick={() =>
                    navigate(
                      `/developer/testing-sprints/${sprint.sprintId}`
                    )
                  }
                >
                  <Eye size={17} />
                  View Sprint
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TestingSprints;