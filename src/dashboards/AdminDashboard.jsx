
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  Bell,
  UserCircle,
  LogOut,
  Plus,
  Settings,
  ArrowUpRight,
  Clock3,
  MapPin,
} from "lucide-react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // =====================================================
  // ADMIN DASHBOARD COUNTS
  // =====================================================

  const [eventCount, setEventCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // =====================================================
  // LOAD EVENTS + NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    const loadAdminStats = async () => {
      try {
        // =========================
        // TOTAL EVENTS
        // =========================

        const eventsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/events`
        );

        if (eventsResponse.ok) {
          const events = await eventsResponse.json();

          setEventCount(events.length);
        }

        // =========================
        // UNREAD NOTIFICATIONS
        // =========================

        if (user?.id) {
          const notificationResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/notifications/user/${user.id}`
          );

          if (notificationResponse.ok) {
            const notifications =
              await notificationResponse.json();

            const unreadCount = notifications.filter(
              (notification) =>
                notification.readStatus === false
            ).length;

            setNotificationCount(unreadCount);
          }
        }
      } catch (error) {
        console.error(
          "Admin dashboard stats error:",
          error
        );
      }
    };

    loadAdminStats();

    // Refresh counts when returning to dashboard
    const handleFocus = () => {
      loadAdminStats();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.id]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="admin-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            <SparklesIcon />
          </div>

          <div>
            <span>EventHub</span>
            <small>ADMIN PANEL</small>
          </div>

        </div>

        <div className="admin-menu-title">
          MAIN MENU
        </div>

        <nav className="admin-nav">

          <button
            className="admin-nav-item active"
            onClick={() => navigate("/admin")}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/events")}
          >
            <CalendarDays size={19} />
            <span>Manage Events</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/students")}
          >
            <Users size={19} />
            <span>Students</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/clubs")}
          >
            <Building2 size={19} />
            <span>Manage Clubs</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/notifications")
            }
          >
            <Bell size={19} />
            <span>Notifications</span>
          </button>

        </nav>

        <div className="admin-menu-title admin-secondary-title">
          ACCOUNT
        </div>

        <nav className="admin-nav">

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/profile")
            }
          >
            <UserCircle size={19} />
            <span>My Profile</span>
          </button>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-user">

            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="admin-user-info">

              <strong>
                {user?.name || "EventHub Admin"}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>

            <div className="admin-header-label">

              <span className="admin-live-dot"></span>

              ADMIN CONTROL CENTER

            </div>

            <h1>
              Welcome back, {user?.name || "Admin"} 👋
            </h1>

            <p>
              Manage your college events, students, clubs and
              notifications from one place.
            </p>

          </div>

          <div className="admin-header-actions">

            <button
              className="admin-icon-button"
              onClick={() =>
                navigate("/admin/notifications")
              }
              title="Notifications"
            >
              <Bell size={20} />

              {notificationCount > 0 && (
                <span className="notification-dot"></span>
              )}

            </button>

            <div className="admin-header-profile">

              <div className="admin-header-avatar">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>

              <div>

                <strong>
                  {user?.name || "EventHub Admin"}
                </strong>

                <span>
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="admin-stats">

          {/* TOTAL EVENTS */}

          <div className="admin-stat-card events-stat">

            <div className="admin-stat-top">

              <div className="admin-stat-icon">
                <CalendarDays size={22} />
              </div>

              <span className="admin-stat-growth">
                Active
              </span>

            </div>

            <div className="admin-stat-content">

              <span>
                Total Events
              </span>

              <strong>
                {eventCount}
              </strong>

            </div>

            <button
              onClick={() =>
                navigate("/admin/events")
              }
              className="admin-stat-link"
            >
              Manage events
              <ArrowUpRight size={15} />
            </button>

          </div>

          {/* STUDENTS */}

          <div className="admin-stat-card students-stat">

            <div className="admin-stat-top">

              <div className="admin-stat-icon">
                <Users size={22} />
              </div>

              <span className="admin-stat-growth">
                Students
              </span>

            </div>

            <div className="admin-stat-content">

              <span>
                Registered Students
              </span>

              <strong>
                1
              </strong>

            </div>

            <button
              onClick={() =>
                navigate("/admin/students")
              }
              className="admin-stat-link"
            >
              View students
              <ArrowUpRight size={15} />
            </button>

          </div>

          {/* CLUBS */}

          <div className="admin-stat-card clubs-stat">

            <div className="admin-stat-top">

              <div className="admin-stat-icon">
                <Building2 size={22} />
              </div>

              <span className="admin-stat-growth">
                Campus
              </span>

            </div>

            <div className="admin-stat-content">

              <span>
                Total Clubs
              </span>

              <strong>
                5
              </strong>

            </div>

            <button
              onClick={() =>
                navigate("/admin/clubs")
              }
              className="admin-stat-link"
            >
              Manage clubs
              <ArrowUpRight size={15} />
            </button>

          </div>

          {/* NOTIFICATIONS */}

          <div className="admin-stat-card notifications-stat">

            <div className="admin-stat-top">

              <div className="admin-stat-icon">
                <Bell size={22} />
              </div>

              <span className="admin-stat-growth">
                Updates
              </span>

            </div>

            <div className="admin-stat-content">

              <span>
                Notifications
              </span>

              <strong>
                {notificationCount}
              </strong>

            </div>

            <button
              onClick={() =>
                navigate("/admin/notifications")
              }
              className="admin-stat-link"
            >
              Send notification
              <ArrowUpRight size={15} />
            </button>

          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <span className="admin-section-kicker">
                MANAGEMENT
              </span>

              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used administration tools
              </p>

            </div>

          </div>

          <div className="admin-actions">

            <button
              className="admin-action-card"
              onClick={() =>
                navigate("/admin/events")
              }
            >

              <div className="admin-action-icon">
                <CalendarDays size={23} />
              </div>

              <div>

                <strong>
                  Manage Events
                </strong>

                <span>
                  Add, edit and manage campus events
                </span>

              </div>

              <ArrowUpRight size={18} />

            </button>

            <button
              className="admin-action-card"
              onClick={() =>
                navigate("/admin/students")
              }
            >

              <div className="admin-action-icon">
                <Users size={23} />
              </div>

              <div>

                <strong>
                  Manage Students
                </strong>

                <span>
                  View and manage registered students
                </span>

              </div>

              <ArrowUpRight size={18} />

            </button>

            <button
              className="admin-action-card"
              onClick={() =>
                navigate("/admin/clubs")
              }
            >

              <div className="admin-action-icon">
                <Building2 size={23} />
              </div>

              <div>

                <strong>
                  Manage Clubs
                </strong>

                <span>
                  Manage college clubs and memberships
                </span>

              </div>

              <ArrowUpRight size={18} />

            </button>

            <button
              className="admin-action-card"
              onClick={() =>
                navigate("/admin/notifications")
              }
            >

              <div className="admin-action-icon">
                <Bell size={23} />
              </div>

              <div>

                <strong>
                  Notifications
                </strong>

                <span>
                  Send announcements to students
                </span>

              </div>

              <ArrowUpRight size={18} />

            </button>

          </div>

        </section>

        {/* =================================================
            EVENTS + SYSTEM
        ================================================= */}

        <section className="admin-bottom-grid">

          {/* UPCOMING EVENTS */}

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <span className="admin-section-kicker">
                  EVENT SCHEDULE
                </span>

                <h2>
                  Upcoming Events
                </h2>

              </div>

              <button
                className="admin-view-all"
                onClick={() =>
                  navigate("/admin/events")
                }
              >
                View all
                <ArrowUpRight size={15} />
              </button>

            </div>

            <div className="admin-event-list">

              <div className="admin-event-row">

                <div className="admin-event-date">
                  <span>OCT</span>
                  <strong>18</strong>
                </div>

                <div className="admin-event-info">

                  <h3>
                    Tech Innovators Summit
                  </h3>

                  <p>
                    <MapPin size={14} />
                    Main Auditorium
                  </p>

                </div>

                <div className="admin-event-meta">

                  <span className="admin-event-status">
                    Upcoming
                  </span>

                  <span className="admin-event-time">
                    <Clock3 size={13} />
                    Oct 18
                  </span>

                </div>

              </div>

              <div className="admin-event-row">

                <div className="admin-event-date">
                  <span>OCT</span>
                  <strong>25</strong>
                </div>

                <div className="admin-event-info">

                  <h3>
                    CodeSprint Hackathon
                  </h3>

                  <p>
                    <MapPin size={14} />
                    Innovation Lab
                  </p>

                </div>

                <div className="admin-event-meta">

                  <span className="admin-event-status">
                    Upcoming
                  </span>

                  <span className="admin-event-time">
                    <Clock3 size={13} />
                    Oct 25
                  </span>

                </div>

              </div>

              <div className="admin-event-row">

                <div className="admin-event-date">
                  <span>NOV</span>
                  <strong>02</strong>
                </div>

                <div className="admin-event-info">

                  <h3>
                    AI & Machine Learning Workshop
                  </h3>

                  <p>
                    <MapPin size={14} />
                    Seminar Hall
                  </p>

                </div>

                <div className="admin-event-meta">

                  <span className="admin-event-status">
                    Upcoming
                  </span>

                  <span className="admin-event-time">
                    <Clock3 size={13} />
                    Nov 02
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* ADMIN TOOLS */}

          <div className="admin-panel admin-tools-panel">

            <div className="admin-panel-header">

              <div>

                <span className="admin-section-kicker">
                  PLATFORM
                </span>

                <h2>
                  Admin Tools
                </h2>

              </div>

              <Settings size={20} />

            </div>

            <div className="admin-tools">

              <button
                onClick={() =>
                  navigate("/admin/events")
                }
              >

                <div className="tool-icon">
                  <Plus size={19} />
                </div>

                <div>

                  <strong>
                    Create Event
                  </strong>

                  <span>
                    Add a new campus event
                  </span>

                </div>

                <ArrowUpRight size={16} />

              </button>

              <button
                onClick={() =>
                  navigate("/admin/students")
                }
              >

                <div className="tool-icon">
                  <Users size={19} />
                </div>

                <div>

                  <strong>
                    Student Directory
                  </strong>

                  <span>
                    View registered students
                  </span>

                </div>

                <ArrowUpRight size={16} />

              </button>

              <button
                onClick={() =>
                  navigate("/admin/clubs")
                }
              >

                <div className="tool-icon">
                  <Building2 size={19} />
                </div>

                <div>

                  <strong>
                    Club Management
                  </strong>

                  <span>
                    Manage campus clubs
                  </span>

                </div>

                <ArrowUpRight size={16} />

              </button>

              <button
                onClick={() =>
                  navigate("/admin/notifications")
                }
              >

                <div className="tool-icon">
                  <Bell size={19} />
                </div>

                <div>

                  <strong>
                    Send Announcement
                  </strong>

                  <span>
                    Notify students instantly
                  </span>

                </div>

                <ArrowUpRight size={16} />

              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

/* =========================================================
   SMALL CUSTOM ICON
========================================================= */

function SparklesIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      <path
        d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"
        fill="currentColor"
      />

      <path
        d="M19 15L19.7 17.3L22 18L19.7 18.7L19 21L18.3 18.7L16 18L18.3 17.3L19 15Z"
        fill="currentColor"
      />

    </svg>
  );
}

export default AdminDashboard;
