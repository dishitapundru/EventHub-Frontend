import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Mail,
  Sparkles,
  Clock3,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingClub, setPendingClub] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const responseText = await response.text();

      let data = null;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = responseText;
      }

      if (!response.ok) {
        setError(
          "Incorrect email or password. Please check your credentials and try again."
        );

        setLoading(false);
        return;
      }

      console.log("Logged in user:", data);

      // ==========================================
      // PENDING CLUB
      // ==========================================

      if (
        data.role === "CLUB" &&
        data.status === "PENDING"
      ) {
        setPendingClub(true);
        setLoading(false);
        return;
      }

      // ==========================================
      // APPROVED LOGIN
      // ==========================================

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data));

      setMessage("Login successful!");
      setLoading(false);

      setTimeout(() => {
        if (data.role === "ADMIN") {
          navigate("/admin");
        } else if (data.role === "CLUB") {
          navigate("/club");
        } else {
          navigate("/dashboard");
        }
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again later."
      );

      setLoading(false);
    }
  };

  // ==========================================
  // CLUB WAITING FOR APPROVAL SCREEN
  // ==========================================

  if (pendingClub) {
    return (
      <div className="auth-page">

        <button
          className="back-button"
          onClick={() => setPendingClub(false)}
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <div className="auth-card">

          <div className="auth-brand">
            <div className="brand-icon">
              <Sparkles size={22} />
            </div>

            <span>EventHub</span>
          </div>

          <div className="auth-heading">

            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 20px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(139, 92, 246, 0.14)",
                color: "#a78bfa",
              }}
            >
              <Clock3 size={32} />
            </div>

            <h1>Approval Pending</h1>

            <p>
              Your Club account has been created successfully.
            </p>

            <p style={{ marginTop: "10px" }}>
              Your account is currently waiting for approval
              from an EventHub administrator.
            </p>

          </div>

          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(139, 92, 246, 0.08)",
              border: "1px solid rgba(139, 92, 246, 0.18)",
              textAlign: "center",
              color: "#c4b5fd",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            You will be able to access the Club Dashboard
            once an administrator approves your account.
          </div>

          <button
            type="button"
            className="auth-submit"
            style={{
              marginTop: "24px",
            }}
            onClick={() => setPendingClub(false)}
          >
            Back to Login
          </button>

          <p className="auth-switch">
            Need help? Contact your EventHub administrator.
          </p>

        </div>
      </div>
    );
  }

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

        <div className="auth-brand">
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>

          <span>EventHub</span>
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to EventHub.</p>
        </div>

        <form onSubmit={handleLogin}>

          <label>Email address</label>

          <div className="input-wrapper">
            <Mail size={18} />

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-wrapper">
            <Lock size={18} />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">

            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="forgot"
            >
              Forgot password?
            </button>

          </div>

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

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;