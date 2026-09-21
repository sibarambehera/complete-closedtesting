import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  User,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { registerUser } from "../services/AuthService";

function Register() {
  const [role, setRole] = useState("developer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const result = await registerUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: role,
    });

    console.log("Registration successful:", result);

    alert("Account created successfully!");

  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email address.");
    } else if (error.code === "auth/weak-password") {
      alert("Password should be at least 6 characters.");
    } else {
      alert("Registration failed. Please try again.");
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

            <h2>Create Account</h2>

            <p>
              Get started with Complete ClosedTesting.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* ROLE */}

            <div className="form-group">

              <label>
                I want to...
              </label>

              <div className="role-selection">

                <button
                  type="button"
                  className={
                    role === "developer"
                      ? "role-card selected"
                      : "role-card"
                  }
                  onClick={() => setRole("developer")}
                >

                  <div className="role-icon">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <strong>Publish Apps</strong>
                    <span>I'm a developer</span>
                  </div>

                  {role === "developer" && (
                    <CheckCircle2
                      className="role-check"
                      size={19}
                    />
                  )}

                </button>


                <button
                  type="button"
                  className={
                    role === "tester"
                      ? "role-card selected"
                      : "role-card"
                  }
                  onClick={() => setRole("tester")}
                >

                  <div className="role-icon">
                    <User size={22} />
                  </div>

                  <div>
                    <strong>Test Apps & Earn</strong>
                    <span>I'm a tester</span>
                  </div>

                  {role === "tester" && (
                    <CheckCircle2
                      className="role-check"
                      size={19}
                    />
                  )}

                </button>

              </div>

            </div>


            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="input-wrapper">

                <User size={18} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Sibaram Behera"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


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


            {/* PHONE */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="input-wrapper">

                <Phone size={18} />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <LockKeyhole size={18} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
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


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="input-wrapper">

                <LockKeyhole size={18} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* TERMS */}

            <label className="terms-check">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the{" "}
                <a href="/">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/">
                  Privacy Policy
                </a>
                .
              </span>

            </label>


            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit"
            >
              Create Account
            </button>

          </form>


          {/* LOGIN */}

          <div className="login-link">

            Already have an account?

            <a href="/login">
              Sign In
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;