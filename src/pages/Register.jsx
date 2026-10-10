
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
    department: "",
    year: "",
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
      department: role === "STUDENT" ? formData.department : "",
      year: role === "STUDENT" ? formData.year : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      setError("API URL is not configured. Check your frontend .env file.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "STUDENT") {
        payload.department = formData.department;
        payload.year = formData.year;
      }

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Registration failed");
      }

      setMessage(
        formData.role === "CLUB"
          ? "Club account created successfully! Your account is waiting for admin approval."
          : "Account created successfully!"
      );

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message || "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">
            <Building2 size={21} />
          </div>
          <span>EventHub</span>
        </div>

        <div className="auth-heading">
          <h1>Create your account</h1>
          <p>Join your campus community</p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <label>Register As</label>
          <div className="role-selection">
            <button
              type="button"
              className={`role-card ${
                formData.role === "STUDENT" ? "selected" : ""
              }`}
              onClick={() => handleRoleChange("STUDENT")}
            >
              <div className="role-icon">
                <GraduationCap size={22} />
              </div>
              <div className="role-content">
                <strong>Student</strong>
                <span>Join events and clubs</span>
              </div>
            </button>

            <button
              type="button"
              className={`role-card ${
                formData.role === "CLUB" ? "selected" : ""
              }`}
              onClick={() => handleRoleChange("CLUB")}
            >
              <div className="role-icon">
                <Building2 size={22} />
              </div>
              <div className="role-content">
                <strong>Club</strong>
                <span>Manage events and members</span>
              </div>
            </button>
          </div>

          {formData.role === "STUDENT" && (
            <>
              <label>Department</label>
              <div className="input-wrapper">
                <GraduationCap size={18} />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your department</option>
                  <option value="CSE">CSE</option>
                  <option value="CSE (AI & ML)">CSE (AI &amp; ML)</option>
                  <option value="CSE (Data Science)">CSE (Data Science)</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <label>Academic Year</label>
              <div className="input-wrapper">
                <GraduationCap size={18} />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </>
          )}

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
