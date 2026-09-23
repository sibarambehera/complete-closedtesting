import { useEffect, useState } from "react";

import DeveloperLayout from "../../layouts/DeveloperLayout";
import { useAuth } from "../../context/AuthContext";

import {
  getDeveloperDashboardData
} from "../../services/DashboardService";


function DeveloperDashboard() {

  const { user } = useAuth();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // Load Dashboard
  // ==========================================

  useEffect(() => {

    if (!user?.uid) {
      return;
    }

    loadDashboard();

  }, [user?.uid]);


  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getDeveloperDashboardData(
          user.uid
        );

      setDashboard(data);

    } catch (error) {

      console.error(
        "Developer dashboard error:",
        error
      );

      setError(
        error?.message ||
        "Failed to load dashboard."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (
      <DeveloperLayout>

        <div className="dashboard-page">

          <h1>
            Welcome back 👋
          </h1>

          <p>
            Loading your dashboard...
          </p>

        </div>

      </DeveloperLayout>
    );

  }


  // ==========================================
  // Error
  // ==========================================

  if (error) {

    return (
      <DeveloperLayout>

        <div className="dashboard-page">

          <h1>
            Welcome back 👋
          </h1>

          <div className="dashboard-error">
            {error}
          </div>

        </div>

      </DeveloperLayout>
    );

  }


  // ==========================================
  // Total Paid
  // ==========================================

  const totalPaid =
    (
      Number(
        dashboard?.totalPaidPaise || 0
      ) / 100
    ).toFixed(2);


  // ==========================================
  // Dashboard
  // ==========================================

  return (

    <DeveloperLayout>

      <div className="dashboard-page">

        {/* ==================================
                    Welcome
                ================================== */}

        <div className="dashboard-welcome">

          <h1>
            Welcome back 👋
          </h1>

          <p>
            Manage your apps and Testing
            Sprints from here.
          </p>

        </div>


        {/* ==================================
                    Summary Cards
                ================================== */}

        <div className="dashboard-summary-grid">


          {/* Total Apps */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-label">
              Total Apps
            </div>

            <div className="dashboard-stat-value">
              {dashboard?.totalApps || 0}
            </div>

            <div className="dashboard-stat-description">
              Apps added by you
            </div>

          </div>


          {/* Active Testing Sprints */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-label">
              Active Testing Sprints
            </div>

            <div className="dashboard-stat-value">
              {dashboard?.activeSprints || 0}
            </div>

            <div className="dashboard-stat-description">
              Currently running
            </div>

          </div>


          {/* Total Testers */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-label">
              Total Testers
            </div>

            <div className="dashboard-stat-value">
              {dashboard?.totalTesters || 0}
            </div>

            <div className="dashboard-stat-description">
              Assigned to your sprints
            </div>

          </div>


          {/* Total Paid */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-label">
              Total Paid
            </div>

            <div className="dashboard-stat-value">
              ₹{totalPaid}
            </div>

            <div className="dashboard-stat-description">
              Tester payments made
            </div>

          </div>


        </div>

      </div>

    </DeveloperLayout>

  );
}


export default DeveloperDashboard;