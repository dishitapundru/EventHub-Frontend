
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useState } from "react";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Registration failed");
      }

      if (formData.role === "CLUB") {
        setMessage(
          "Club account created successfully! Your account is waiting for admin approval."
        );
      } else {
        setMessage("Account created successfully!");
      }

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.message || "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      <div className="auth-card">

        {/* Brand */}

        <div className="auth-brand">

          <div className="brand-icon">
            <Building2 size={21} />
          </div>

          <span>EventHub</span>

        </div>

        {/* Heading */}

        <div className="auth-heading">

          <h1>Create your account</h1>

          <p>
            Join your campus community
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}

          <label>Full Name</label>

          <div className="input-wrapper">

            <User size={18} />

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* Email */}

          <label>Email Address</label>

          <div className="input-wrapper">

            <Mail size={18} />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Password */}

          <label>Password</label>

          <div className="input-wrapper">

            <Lock size={18} />

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          {/* Register As */}

          <label>Register As</label>

          <div className="role-selection">

            {/* Student */}

            <button
              type="button"
              className={`role-card ${
                formData.role === "STUDENT"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleRoleChange("STUDENT")
              }
            >

              <div className="role-icon">
                <GraduationCap size={22} />
              </div>

              <div className="role-content">

                <strong>
                  Student
                </strong>

                <span>
                  Join events and clubs
                </span>

              </div>

            </button>

            {/* Club */}

            <button
              type="button"
              className={`role-card ${
                formData.role === "CLUB"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleRoleChange("CLUB")
              }
            >

              <div className="role-icon">
                <Building2 size={22} />
              </div>

              <div className="role-content">

                <strong>
                  Club
                </strong>

                <span>
                  Manage events and members
                </span>

              </div>

            </button>

          </div>

          {/* Messages */}

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {message && (
            <p className="auth-success">
              {message}
            </p>
          )}

          {/* Submit */}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login */}

        <p className="auth-switch">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;
