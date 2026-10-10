
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  Mail,
  ShieldCheck,
  LogOut,
  CalendarDays,
  Users,
  Bookmark,
  Bell,
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";

import "./Profile.css";
import "../dashboards/StudentDashboard.css";

function Profile() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");

  if (!userData) {
    navigate("/login");
    return null;
  }

  const user = JSON.parse(userData);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="student-dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="student-sidebar">

        {/* Brand */}

        <div className="student-brand">

          <div className="student-brand-icon">
            <LayoutDashboard size={21} />
          </div>

          <span>EventHub</span>

        </div>

        {/* Navigation */}

        <nav className="student-nav">

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/events")
            }
          >
            <CalendarDays size={19} />
            Browse Events
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/my-registrations")
            }
          >
            <Bookmark size={19} />
            My Registrations
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/my-clubs")
            }
          >
            <Users size={19} />
            My Clubs
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/notifications")
            }
          >
            <Bell size={19} />
            Notifications
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/attendance")
            }
          >
            <ClipboardCheck size={19} />
            Attendance
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/feedback")
            }
          >
            <MessageSquare size={19} />
            Feedback
          </button>

          <button
            className="student-nav-item active"
            onClick={() =>
              navigate("/profile")
            }
          >
            <UserCircle size={19} />
            My Profile
          </button>

        </nav>

        {/* Logout */}

        <button
          className="student-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          Logout
        </button>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="student-main">

        <div className="profile-page">

          <div className="profile-container">

            {/* Header */}

            <div className="profile-header">

              <div className="profile-header-left">

                <div className="profile-header-icon">
                  <UserCircle size={26} />
                </div>

                <div>

                  <h1>
                    My Profile
                  </h1>

                  <p>
                    Manage your EventHub
                    account information.
                  </p>

                </div>

              </div>

            </div>

            {/* Profile Card */}

            <section className="profile-main-card">

              {/* Profile Top */}

              <div className="profile-user-section">

                <div className="profile-avatar">

                  {user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "S"}

                </div>

                <div className="profile-user-info">

                  <h2>
                    {user.name || "Student"}
                  </h2>

                  <p>
                    {user.email ||
                      "No email available"}
                  </p>

                  <span className="profile-role">

                    <ShieldCheck size={15} />

                    {user.role || "STUDENT"}

                  </span>

                </div>

              </div>

              {/* Account Information */}

              <div className="profile-section">

                <div className="profile-section-title">

                  <UserCircle size={20} />

                  <h2>
                    Account Information
                  </h2>

                </div>

                <div className="profile-details-grid">

                  {/* Name */}

                  <div className="profile-detail">

                    <span>
                      Full Name
                    </span>

                    <strong>
                      {user.name ||
                        "Not available"}
                    </strong>

                  </div>

                  {/* Email */}

                  <div className="profile-detail">

                    <span>
                      Email Address
                    </span>

                    <strong>
                      {user.email ||
                        "Not available"}
                    </strong>

                  </div>

                  {/* Role */}

                  <div className="profile-detail">

                    <span>
                      Account Type
                    </span>

                    <strong>
                      {user.role ||
                        "STUDENT"}
                    </strong>

                  </div>

                  {/* User ID */}

                  <div className="profile-detail">

                    <span>
                      User ID
                    </span>

                    <strong>
                      #{user.id || "N/A"}
                    </strong>

                  </div>

                </div>

              </div>

              {/* Account Status */}

              <div className="profile-section">

                <div className="profile-section-title">

                  <ShieldCheck size={20} />

                  <h2>
                    Account Status
                  </h2>

                </div>

                <div className="profile-status-card">

                  <div className="profile-status-icon">
                    <ShieldCheck size={22} />
                  </div>

                  <div>

                    <strong>
                      Account Active
                    </strong>

                    <p>
                      Your EventHub student
                      account is active and
                      ready to use.
                    </p>

                  </div>

                </div>

              </div>

              {/* Quick Links */}

              <div className="profile-section">

                <div className="profile-section-title">

                  <CalendarDays size={20} />

                  <h2>
                    Quick Access
                  </h2>

                </div>

                <div className="profile-quick-actions">

                  {/* Registrations */}

                  <button
                    onClick={() =>
                      navigate(
                        "/my-registrations"
                      )
                    }
                  >
                    <CalendarDays size={20} />

                    <div>

                      <strong>
                        My Registrations
                      </strong>

                      <span>
                        View your registered
                        events
                      </span>

                    </div>

                  </button>

                  {/* Clubs */}

                  <button
                    onClick={() =>
                      navigate(
                        "/my-clubs"
                      )
                    }
                  >
                    <Users size={20} />

                    <div>

                      <strong>
                        My Clubs
                      </strong>

                      <span>
                        View your joined
                        clubs
                      </span>

                    </div>

                  </button>

                </div>

              </div>

              {/* Logout */}

              <div className="profile-footer">

                <button
                  className="profile-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Profile;
