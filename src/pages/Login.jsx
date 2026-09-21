import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";
import { loginUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", result);

      // Store logged-in employee
      login(result);

      // Redirect based on role
      if (result.role === "developer") {
        navigate("/developer/dashboard");
      } else if (result.role === "tester") {
        navigate("/tester/dashboard");
      } else if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        alert("Invalid user role. Please contact administrator.");
      }

    } catch (error) {
      console.error("Login error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        alert("Invalid email or password.");
      } else if (error.code === "auth/too-many-requests") {
        alert(
          "Too many login attempts. Please try again later."
        );
      } else if (
        error.message === "Employee profile not found."
      ) {
        alert(
          "Employee profile not found. Please contact administrator."
        );
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}

      <div className="register-left">

        <div className="register-left-content">

          <div className="register-eyebrow">
            <ShieldCheck size={18} />
            COMPLETE CLOSEDTESTING
          </div>

          <h1>
            Test smarter.
            <br />
            Build better apps.
          </h1>

          <p className="register-intro">
            Connect Android developers with real testers
            through structured Testing Sprints.
          </p>

          <div className="register-benefits">

            <div className="register-benefit">
              <div className="benefit-icon">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <strong>Real Android testers</strong>
                <p>
                  Connect with testers using real Android devices.
                </p>
              </div>
            </div>

            <div className="register-benefit">
              <div className="benefit-icon">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <strong>Structured Testing Sprints</strong>
                <p>
                  Organize testing with clear duration,
                  requirements and progress.
                </p>
              </div>
            </div>

            <div className="register-benefit">
              <div className="benefit-icon">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <strong>Transparent rewards</strong>
                <p>
                  Testers know what they can earn before
                  joining a Sprint.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="register-right">

        <div className="register-form-container">

          {/* BRAND */}

          <a href="/" className="register-brand">

            <div className="register-brand-icon">
              <CheckCircle2 size={22} />
            </div>

            <span>Complete ClosedTesting</span>

          </a>


          {/* TITLE */}

          <div className="register-heading">

            <h2>Welcome Back</h2>

            <p>
              Sign in to continue to Complete ClosedTesting.
            </p>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Password reset will be added next."
                    )
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#1976f3",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="input-wrapper">

                <LockKeyhole size={18} />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit"
            >
              Sign In
            </button>

          </form>


          {/* REGISTER */}

          <div className="login-link">

            Don't have an account?

            <a href="/register">
              Create an account
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;