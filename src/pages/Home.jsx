import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Smartphone,
  Users,
  Wallet,
  FileCheck2,
  Rocket,
  MessageSquareText,
  Search,
  Star,
  BadgeCheck,
  Camera,
  LockKeyhole,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const apps = [
    {
      initial: "C",
      name: "CRM Stock & Sale",
      category: "Shop Billing Report",
      reward: "₹100/tester",
      days: "14 days",
      testers: "8/12 joined",
      spots: "4 spots left",
      status: "Recruiting",
    },
    {
      initial: "M",
      name: "MI Attendance",
      category: "HR",
      reward: "₹90/tester",
      days: "14 days",
      testers: "10/12 joined",
      spots: "2 spots left",
      status: "Recruiting",
    },
    {
      initial: "G",
      name: "Ghar Ka Khana",
      category: "Food",
      reward: "₹110/tester",
      days: "14 days",
      testers: "12 testers",
      spots: "Testing active",
      status: "Active",
    },
    {
      initial: "M",
      name: "MR Barcode",
      category: "Shopping",
      reward: "₹100/tester",
      days: "14 days",
      testers: "5/12 joined",
      spots: "7 spots left",
      status: "Recruiting",
    },
  ];

  const testers = [
    {
      initial: "A",
      name: "Anjarul",
      devices: "Android",
      activity: "Daily active",
    },
    {
      initial: "R",
      name: "Ranjan",
      devices: "Android",
      activity: "Daily active",
    },
    {
      initial: "A",
      name: "Ajita",
      devices: "Android",
      activity: "Daily active",
    },
    {
      initial: "J",
      name: "Jhili",
      devices: "Android",
      activity: "Daily active",
    },
  ];

  return (
    <div className="home-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="home-header">

        <div className="home-container header-inner">

          <a href="/" className="brand">
            <div className="brand-icon">
              <CheckCircle2 size={25} />
            </div>

            <span>Complete ClosedTesting</span>
          </a>

          <nav className="main-nav">

            <a href="#apps">Browse Apps</a>
            <a href="#daily">Daily Standup</a>
            <a href="#testers">Testers</a>

            <a href="#features">Features</a>

            <a href="#how-it-works">How It Works</a>



          </nav>

          <div className="header-actions">

            <button
              className="header-signin"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

            <button
              className="header-primary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="hero-section">

        <div className="home-container hero-content">

          <div className="hero-badge">
            <ShieldCheck size={17} />
            Real people. Real Android devices.
          </div>

          <h1>
            <span className="hero-line">Google Play Task:</span>
            <span className="hero-line blue">Complete ClosedTesting</span>
            <span className="hero-line">With 14-day Testing Sprint</span>
          </h1>
          <p className="hero-description">
            Launch structured 14-day Testing Sprints, connect with
            real testers, track participation and pay testers directly
            for completed testing work.
          </p>

          <div className="hero-buttons">

            <button
              className="hero-primary-button"
              onClick={() => navigate("/register")}
            >
              Find Testers
              <ArrowRight size={19} />
            </button>

            <button
              className="hero-secondary-button"
              onClick={() => navigate("/register")}
            >
              Become a Tester
            </button>

          </div>

          <div className="hero-note">
            <CheckCircle2 size={17} />
            Transparent Testing Sprints • Clear rewards • Real testers
          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ====================================================== */}

      <section id="daily" className="stats-section">

        <div className="home-container stats-grid">

          <div className="stat-item">
            <strong>Real</strong>
            <span>Human testers</span>
          </div>

          <div className="stat-item">
            <strong>14</strong>
            <span>Day Testing Sprints</span>
          </div>

          <div className="stat-item">
            <strong>100%</strong>
            <span>Transparent rewards</span>
          </div>

          <div className="stat-item">
            <strong>Secure</strong>
            <span>Protected payments</span>
          </div>

        </div>

      </section>

      <div className="daily-standup-modal-body" style={{
        width: "1100px",
        maxWidth: "100%",
        margin: "0 auto",
        boxSizing: "border-box"
      }}>

        <div className="home-container">

          <div className="section-heading-row">

            <div>

              <h2>
                Daily Standup Activity
              </h2>
            </div>
          </div>
        </div>
        <div className="tester-daily-list"><div className="tester-daily-item"><div><strong>Day 1</strong><span>2026-09-20</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-paid">✓ Paid</span></div><div className="tester-daily-proof-section"><a href="#daily" rel="noopener noreferrer" className="tester-proof-link">View Testing Proof</a><div><span className="daily-status-tested">✓ Tested</span></div><a href="#daily" rel="noopener noreferrer" className="tester-proof-link">View Payment Proof</a></div></div><div className="tester-daily-item"><div><strong>Day 2</strong><span>2026-09-21</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-paid">✓ Paid</span></div><div className="tester-daily-proof-section"><a href="#daily" rel="noopener noreferrer" className="tester-proof-link">View Testing Proof</a><div><span className="daily-status-tested">✓ Tested</span></div><a href="#daily" rel="noopener noreferrer" className="tester-proof-link">View Payment Proof</a></div></div><div className="tester-daily-item"><div><strong>Day 3</strong><span>2026-09-22</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-paid">✓ Paid</span></div><div className="tester-daily-proof-section"><a href="#daily" rel="noopener noreferrer" className="tester-proof-link">View Testing Proof</a><div><span className="daily-status-tested">✓ Tested</span></div><a href="#daily" rel="noopener noreferrer" className="tester-proof-link">View Payment Proof</a></div></div><div className="tester-daily-item"><div><strong>Day 4</strong><span>2026-09-23</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 5</strong><span>2026-09-24</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 6</strong><span>2026-09-25</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 7</strong><span>2026-09-26</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 8</strong><span>2026-09-27</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 9</strong><span>2026-09-28</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 10</strong><span>2026-09-29</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 11</strong><span>2026-09-30</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 12</strong><span>2026-10-01</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 13</strong><span>2026-10-02</span></div><div><strong>₹7.14</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div><div className="tester-daily-item"><div><strong>Day 14</strong><span>2026-10-03</span></div><div><strong>₹7.18</strong><span className="tester-payment-status-pending">Payment Pending</span></div><div className="tester-daily-proof-section"><span className="tester-proof-not-submitted">Proof Not Submitted</span><div><span>Not Tested</span></div></div></div></div></div>

      {/* =====================================================
          APPS LOOKING FOR TESTERS
      ====================================================== */}

      <section
        id="apps"
        className="home-section apps-section"
      >

        <div className="home-container">

          <div className="section-heading-row">

            <div>
              <span className="section-eyebrow">
                FOR TESTERS
              </span>

              <h2>
                Apps looking for testers
              </h2>

              <p>
                Discover active Testing Sprints and earn by
                completing genuine testing tasks.
              </p>
            </div>

            <button className="outline-button">
              Browse all apps
              <ArrowRight size={17} />
            </button>

          </div>


          <div className="apps-grid-home">

            {apps.map((app) => (

              <div
                className="public-app-card"
                key={app.name}
              >

                <div className="public-card-top">

                  <div className="app-letter">
                    {app.initial}
                  </div>

                  <span
                    className={
                      app.status === "Active"
                        ? "badge-active"
                        : "badge-recruiting"
                    }
                  >
                    {app.status}
                  </span>

                </div>

                <h3>{app.name}</h3>

                <p className="card-category">
                  {app.category}
                </p>

                <div className="card-tags">

                  <span>
                    <Wallet size={14} />
                    {app.reward}
                  </span>

                  <span>
                    <Clock3 size={14} />
                    {app.days}
                  </span>

                </div>

                <div className="tester-progress">

                  <div className="progress-info">

                    <span>
                      {app.testers}
                    </span>

                    <strong>
                      {app.spots}
                    </strong>

                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-value"
                      style={{
                        width:
                          app.status === "Active"
                            ? "100%"
                            : "68%",
                      }}
                    />
                  </div>

                </div>

                <button className="card-primary-button">
                  Start testing
                </button>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          TESTERS
      ====================================================== */}

      <section
        id="testers"
        className="home-section testers-section"
      >

        <div className="home-container">

          <div className="section-heading-row">

            <div>

              <span className="section-eyebrow">
                FOR DEVELOPERS
              </span>

              <h2>
                Real testers, ready to help
              </h2>

              <p>
                Find testers with real Android devices and
                clear testing requirements.
              </p>

            </div>

            <button className="outline-button">
              Browse testers
              <ArrowRight size={17} />
            </button>

          </div>


          <div className="testers-grid">

            {testers.map((tester) => (

              <div
                className="public-tester-card"
                key={tester.name}
              >

                <div className="tester-header">

                  <div className="tester-avatar">
                    {tester.initial}
                  </div>

                  <div>

                    <div className="tester-name">

                      {tester.name}

                      <BadgeCheck
                        size={16}
                        className="verified-icon"
                      />

                    </div>

                    <span className="tester-label">
                      Verified tester
                    </span>

                  </div>

                  <span className="online-dot" />

                </div>


                <p className="tester-description">
                  Real Android tester available for
                  structured app Testing Sprints.
                </p>


                <div className="tester-tags">

                  <span>
                    <Smartphone size={14} />
                    Android
                  </span>

                  <span>
                    <CheckCircle2 size={14} />
                    {tester.activity}
                  </span>

                </div>


                <div className="tester-ready">
                  <CheckCircle2 size={16} />
                  Ready for testing
                </div>


                <button className="outline-full-button">
                  Hire {tester.name}
                </button>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="blue-cta">

        <div className="home-container blue-cta-content">

          <Rocket size={42} />

          <h2>
            Ready to start your Testing Sprint?
          </h2>

          <p>
            Create a Testing Sprint, set your tester rewards and
            start recruiting real Android testers.
          </p>

          <button
            className="white-cta-button"
            onClick={() => navigate("/register")}
          >
            Start a Testing Sprint
            <ArrowRight size={18} />
          </button>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section
        id="how-it-works"
        className="home-section how-section"
      >

        <div className="home-container">

          <div className="center-heading">

            <span className="section-eyebrow">
              SIMPLE PROCESS
            </span>

            <h2>
              How it works
            </h2>

            <p>
              Three simple steps. We connect developers
              and testers so everyone knows what to do.
            </p>

          </div>


          <div className="steps-grid">

            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                <Rocket size={25} />
              </div>

              <h3>
                Create a Testing Sprint
              </h3>

              <p>
                Add your Android app, define the testing
                period, requirements and tester reward.
              </p>

            </div>


            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                <Users size={25} />
              </div>

              <h3>
                Testers join
              </h3>

              <p>
                Suitable testers discover your Testing Sprint,
                join the test and follow your requirements.
              </p>

            </div>


            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                <FileCheck2 size={25} />
              </div>

              <h3>
                Verify completion
              </h3>

              <p>
                Track Testing Sprint progress, collect feedback
                and release the tester reward after completion.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section
        id="features"
        className="home-section features-section"
      >

        <div className="home-container">

          <div className="center-heading">

            <span className="section-eyebrow">
              WHY Complete ClosedTesting
            </span>

            <h2>
              Everything in one place
            </h2>

            <p>
              A transparent marketplace for developers and
              testers.
            </p>

          </div>


          <div className="features-grid">

            <div className="feature-card">

              <div className="feature-icon">
                <Smartphone size={25} />
              </div>

              <h3>
                Real Android devices
              </h3>

              <p>
                Testers participate using their own Android
                devices instead of simulated environments.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <Camera size={25} />
              </div>

              <h3>
                Testing evidence
              </h3>

              <p>
                Testing Sprints can collect screenshots, feedback
                and completion evidence from testers.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <ShieldCheck size={25} />
              </div>

              <h3>
                Verified testers
              </h3>

              <p>
                Build tester profiles with device information,
                participation history and verification status.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <Clock3 size={25} />
              </div>

              <h3>
                Testing Sprint tracking
              </h3>

              <p>
                Monitor Testing Sprint progress and see which
                testers have joined or completed tasks.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <Wallet size={25} />
              </div>

              <h3>
                Transparent rewards
              </h3>

              <p>
                Developers define tester rewards and the
                platform clearly shows the payment breakdown.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <LockKeyhole size={25} />
              </div>

              <h3>
                Secure payments
              </h3>

              <p>
                Keep Testing Sprint payments and tester payouts
                organized through the platform.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PRICING
      ====================================================== */}

      <section
        id="pricing"
        className="home-section pricing-section"
      >

        <div className="home-container">

          <div className="center-heading">

            <span className="section-eyebrow">
              PRICING
            </span>

            <h2>
              Simple, transparent pricing
            </h2>

            <p>
              Developers will pay to tester directly.
              We show the complete cost before payment.
            </p>

          </div>


          <div className="pricing-grid">

            <div className="pricing-card pricing-featured">

              <span className="popular-label">
                PLATFORM
              </span>

              <h3>
                Platform fee : Rs 200 /- only
              </h3>

              <p className="pricing-description">
                Manage Testing Sprints, testers, payments and
                feedback from one place.
              </p>

              <div className="pricing-example">
                Transparent
                <span> pricing</span>
              </div>

              <ul>

                <li>
                  <CheckCircle2 size={17} />
                  No hidden tester charges
                </li>

                <li>
                  <CheckCircle2 size={17} />
                  Clear platform fee
                </li>

                <li>
                  <CheckCircle2 size={17} />
                  Tester payment tracking
                </li>

                <li>
                  <CheckCircle2 size={17} />
                  Testing Sprint history
                </li>

              </ul>

              <button
                className="pricing-button"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>

            </div>

            <div className="pricing-card">

              <span className="pricing-label">
                TESTER REWARD
              </span>

              <h3>
                Daily bacis
              </h3>

              <p className="pricing-description">
                (100/ 14 = ₹7.14 per day)
                completing your Testing Sprint.
              </p>

              <div className="pricing-example">
                ₹100
                <span>/ tester for 14 days</span>
              </div>

              <ul>



                <li>
                  <CheckCircle2 size={17} />
                  Choose number of testers
                </li>

                <li>
                  <CheckCircle2 size={17} />
                  Define testing duration
                </li>

                <li>
                  <CheckCircle2 size={17} />
                  View total before payment
                </li>

              </ul>

              <button
                className="pricing-button"
                onClick={() => navigate("/register")}
              >
                Create Testing Sprint
              </button>

            </div>



          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="final-cta">

        <div className="home-container final-cta-content">

          <h2>
            Build better apps with real testers.
          </h2>

          <p>
            Create your first testing Testing Sprint or join the
            tester community today.
          </p>

          <div className="final-cta-buttons">

            <button
              className="final-primary"
              onClick={() => navigate("/register")}
            >
              Get Started
              <ArrowRight size={18} />
            </button>

            <button
              className="final-secondary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="home-footer">

        <div className="home-container footer-grid">

          <div className="footer-brand">

            <a href="/" className="brand footer-brand-link">

              <div className="brand-icon">
                <CheckCircle2 size={24} />
              </div>

              <span>Complete ClosedTesting</span>

            </a>

            <p>
              A transparent testing marketplace connecting
              Android developers with real testers.
            </p>

            <div className="footer-email">
              <MessageSquareText size={17} />
              info@mr-barcode.com , +91 7887587725
            </div>

          </div>


          <div className="footer-column">

            <h4>Platform</h4>

            <a href="#apps">Browse Apps</a>
            <a href="#daily">Daily Standup</a>

            <a href="#testers">Find Testers</a>

            <a href="#features">Features</a>



          </div>


          <div className="footer-column">

            <h4>Resources</h4>

            <a href="#how-it-works">How It Works</a>

            <a href="#features">Why Complete ClosedTesting</a>



          </div>


          <div className="footer-column">

            <h4>Account</h4>

            <a href="/login">Sign In</a>

            <a href="/register">Create Account</a>

            <a href="/register">Become a Tester</a>

            <a href="/register">Launch Testing Sprint</a>

          </div>

        </div>


        <div className="home-container footer-bottom">

          <span>
            © 2026 Complete ClosedTesting. All rights reserved.
            A product by MR BARCODE INFOTECH.
          </span>

          <div>

            <a href="/privacy-policy">
              Privacy Policy
            </a>

            <a href="/terms-of-service">
              Terms of Service
            </a>
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;