import {
  LayoutDashboard,
  CalendarDays,
  Users,
  QrCode,
  MessageSquare,
  Bell,
  Building2,
  UserCircle,
  LogOut,
  Plus,
  TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClubDashboard.css";

function ClubDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    const loggedInUser = JSON.parse(userData);

    setUser(loggedInUser);
    loadClubStats(loggedInUser.id);
  }, [navigate]);

  const loadClubStats = async (userId) => {
    try {
      // Get club owned by logged-in user
      const clubResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs/owner/${userId}`
      );

      if (!clubResponse.ok) {
        throw new Error("Club not found");
      }

      const club = await clubResponse.json();

      // Get club events
      const eventsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/events/club/${club.id}`
      );

      if (eventsResponse.ok) {
        const events = await eventsResponse.json();
        setTotalEvents(events.length);
      }

      // Get club registrations
      const registrationsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/registrations/club/${club.id}`
      );

      if (registrationsResponse.ok) {
        const registrations = await registrationsResponse.json();
        setTotalRegistrations(registrations.length);
      }

      // Get club attendance
      const attendanceResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/attendance/club/${club.id}`
      );

      if (attendanceResponse.ok) {
        const attendance = await attendanceResponse.json();

        const presentCount = attendance.filter(
          (item) => item.attended === true
        ).length;

        setTotalAttendance(presentCount);
      }
    } catch (error) {
      console.error(
        "Unable to load club dashboard statistics:",
        error
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="club-dashboard">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="club-sidebar">

        <div className="club-brand">
          <div className="club-brand-icon">
            <Building2 size={21} />
          </div>

          <span>EventHub</span>
        </div>

        <div className="club-role">
          <span className="club-role-dot"></span>
          Club Management
        </div>

        <nav className="club-nav">

          <button
            className="club-nav-item active"
            onClick={() => navigate("/club")}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() => navigate("/club/events")}
          >
            <CalendarDays size={19} />
            <span>My Events</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() => navigate("/club/create-event")}
          >
            <Plus size={19} />
            <span>Create Event</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() => navigate("/club/registrations")}
          >
            <Users size={19} />
            <span>Registrations</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() => navigate("/club/attendance")}
          >
            <QrCode size={19} />
            <span>Attendance</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() => navigate("/club/feedback")}
          >
            <MessageSquare size={19} />
            <span>Feedback</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() => navigate("/club/updates")}
          >
            <Bell size={19} />
            <span>Updates</span>
          </button>

        </nav>

        <div className="club-sidebar-bottom">

          <button
            className="club-nav-item"
            onClick={() => navigate("/club/profile")}
          >
            <UserCircle size={19} />
            <span>Club Profile</span>
          </button>

          <button
            className="club-nav-item club-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="club-main">

        {/* Header */}

        <header className="club-header">

          <div>
            <p className="club-header-label">
              CLUB MANAGEMENT
            </p>

            <h1>
              Welcome back, {user.name} 👋
            </h1>

            <p className="club-header-subtitle">
              Manage your club, events, registrations and
              student engagement.
            </p>
          </div>

          <div className="club-header-user">

            <div className="club-user-avatar">
              <Building2 size={20} />
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>Club Account</span>
            </div>

          </div>

        </header>

        {/* =========================
            STATISTICS
        ========================== */}

        <section className="club-stats">

          <div className="club-stat-card">

            <div className="club-stat-icon purple">
              <CalendarDays size={21} />
            </div>

            <div>
              <span>Total Events</span>

              <strong>
                {totalEvents}
              </strong>

              <small>
                Events created by your club
              </small>
            </div>

          </div>

          <div className="club-stat-card">

            <div className="club-stat-icon cyan">
              <Users size={21} />
            </div>

            <div>
              <span>Total Registrations</span>

              <strong>
                {totalRegistrations}
              </strong>

              <small>
                Students registered
              </small>
            </div>

          </div>

          <div className="club-stat-card">

            <div className="club-stat-icon green">
              <QrCode size={21} />
            </div>

            <div>
              <span>Attendance</span>

              <strong>
                {totalAttendance}
              </strong>

              <small>
                Students attended
              </small>
            </div>

          </div>

          <div className="club-stat-card">

            <div className="club-stat-icon orange">
              <TrendingUp size={21} />
            </div>

            <div>
              <span>Engagement</span>

              <strong>
                0%
              </strong>

              <small>
                Overall event engagement
              </small>
            </div>

          </div>

        </section>

        {/* =========================
            QUICK ACTIONS
        ========================== */}

        <section className="club-section">

          <div className="club-section-heading">

            <div>
              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your club activities quickly.
              </p>
            </div>

          </div>

          <div className="club-quick-grid">

            <button
              className="club-action-card"
              onClick={() =>
                navigate("/club/create-event")
              }
            >
              <div className="club-action-icon purple">
                <Plus size={22} />
              </div>

              <div>
                <strong>
                  Create Event
                </strong>

                <span>
                  Post a new college event
                </span>
              </div>
            </button>

            <button
              className="club-action-card"
              onClick={() =>
                navigate("/club/events")
              }
            >
              <div className="club-action-icon cyan">
                <CalendarDays size={22} />
              </div>

              <div>
                <strong>
                  Manage Events
                </strong>

                <span>
                  View and manage your events
                </span>
              </div>
            </button>

            <button
              className="club-action-card"
              onClick={() =>
                navigate("/club/registrations")
              }
            >
              <div className="club-action-icon green">
                <Users size={22} />
              </div>

              <div>
                <strong>
                  View Registrations
                </strong>

                <span>
                  Check registered students
                </span>
              </div>
            </button>

            <button
              className="club-action-card"
              onClick={() =>
                navigate("/club/attendance")
              }
            >
              <div className="club-action-icon orange">
                <QrCode size={22} />
              </div>

              <div>
                <strong>
                  Mark Attendance
                </strong>

                <span>
                  Scan student QR passes
                </span>
              </div>
            </button>

          </div>

        </section>

        {/* =========================
            UPCOMING EVENTS
        ========================== */}

        <section className="club-section">

          <div className="club-section-heading">

            <div>

              <h2>
                Upcoming Events
              </h2>

              <p>
                Your club's upcoming events will
                appear here.
              </p>

            </div>

            <button
              className="club-view-all"
              onClick={() =>
                navigate("/club/events")
              }
            >
              View All
            </button>

          </div>

          <div className="club-empty-state">

            <div className="club-empty-icon">
              <CalendarDays size={28} />
            </div>

            <h3>
              No events yet
            </h3>

            <p>
              Create your first event and start
              engaging with students.
            </p>

            <button
              className="club-primary-button"
              onClick={() =>
                navigate("/club/create-event")
              }
            >
              <Plus size={18} />
              Create Your First Event
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ClubDashboard;