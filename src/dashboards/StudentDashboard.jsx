import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Users,
  Bookmark,
  UserCircle,
  Bell,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [notificationCount, setNotificationCount] = useState(0);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [savedEventCount, setSavedEventCount] = useState(0);
  const [myClubCount, setMyClubCount] = useState(0);

  // =========================
  // Notification Count
  // =========================
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const userData = localStorage.getItem("user");

        if (!userData) {
          setNotificationCount(0);
          return;
        }

        const currentUser = JSON.parse(userData);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/notifications/user/${currentUser.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const notifications = await response.json();

        const unreadCount = notifications.filter(
          (notification) => notification.readStatus === false
        ).length;

        setNotificationCount(unreadCount);
      } catch (error) {
        console.error(
          "Notification count error:",
          error
        );

        setNotificationCount(0);
      }
    };

    fetchNotificationCount();

    const handleFocus = () => {
      fetchNotificationCount();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // =========================
  // Registration Count
  // =========================
  useEffect(() => {
    const fetchRegistrationCount = async () => {
      try {
        const userData =
          localStorage.getItem("user");

        if (!userData) {
          setRegistrationCount(0);
          return;
        }

        const currentUser =
          JSON.parse(userData);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/registrations/user/${currentUser.id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch registrations"
          );
        }

        const data = await response.json();

        setRegistrationCount(data.length);
      } catch (error) {
        console.error(
          "Registration count error:",
          error
        );

        setRegistrationCount(0);
      }
    };

    fetchRegistrationCount();
  }, []);

  // =========================
  // Saved Events Count
  // =========================
  useEffect(() => {
    const updateSavedEventCount = () => {
      const userData =
        localStorage.getItem("user");

      if (!userData) {
        setSavedEventCount(0);
        return;
      }

      try {
        const currentUser =
          JSON.parse(userData);

        const savedKey =
          `savedEvents_${currentUser.id}`;

        const savedData =
          localStorage.getItem(savedKey);

        if (savedData) {
          const savedEvents =
            JSON.parse(savedData);

          setSavedEventCount(
            Array.isArray(savedEvents)
              ? savedEvents.length
              : 0
          );
        } else {
          setSavedEventCount(0);
        }
      } catch (error) {
        console.error(
          "Saved events count error:",
          error
        );

        setSavedEventCount(0);
      }
    };

    updateSavedEventCount();

    window.addEventListener(
      "storage",
      updateSavedEventCount
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateSavedEventCount
      );
    };
  }, []);

  // =========================
  // My Clubs Count
  // =========================
  useEffect(() => {
    const updateClubCount = () => {
      const userData =
        localStorage.getItem("user");

      if (!userData) {
        setMyClubCount(0);
        return;
      }

      try {
        const currentUser =
          JSON.parse(userData);

        const userClubKey =
          `joinedClubs_${currentUser.id}`;

        let joinedData =
          localStorage.getItem(userClubKey);

        if (!joinedData) {
          joinedData =
            localStorage.getItem("joinedClubs");
        }

        if (joinedData) {
          const clubs =
            JSON.parse(joinedData);

          if (Array.isArray(clubs)) {
            setMyClubCount(clubs.length);
          } else {
            setMyClubCount(0);
          }
        } else {
          setMyClubCount(0);
        }
      } catch (error) {
        console.error(
          "My Clubs count error:",
          error
        );

        setMyClubCount(0);
      }
    };

    updateClubCount();

    window.addEventListener(
      "storage",
      updateClubCount
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateClubCount
      );
    };
  }, []);

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
          Sidebar
      ========================= */}

      <aside className="student-sidebar">

        <div className="student-brand">

          <div className="student-brand-icon">
            <LayoutDashboard size={21} />
          </div>

          <span>EventHub</span>

        </div>

        <nav className="student-nav">

          {/* Dashboard */}

          <button
            className="student-nav-item active"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          {/* Browse Events */}

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/events")
            }
          >
            <CalendarDays size={19} />
            Browse Events
          </button>

          {/* My Registrations */}

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/my-registrations")
            }
          >
            <Bookmark size={19} />
            My Registrations
          </button>

          {/* My Clubs */}

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/my-clubs")
            }
          >
            <Users size={19} />
            My Clubs
          </button>

          {/* Notifications */}

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/notifications")
            }
          >
            <Bell size={19} />
            Notifications
          </button>

          {/* Attendance */}

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/attendance")
            }
          >
            <ClipboardCheck size={19} />
            Attendance
          </button>

          {/* Feedback */}

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/feedback")
            }
          >
            <MessageSquare size={19} />
            Feedback
          </button>

          {/* My Profile */}

          <button
            className="student-nav-item"
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
          Main Content
      ========================= */}

      <main className="student-main">

        {/* Header */}

        <header className="student-header">

          <div>

            <p className="student-small-title">
              Student Dashboard
            </p>

            <h1>
              Welcome back,{" "}
              {user?.name || "Student"} 👋
            </h1>

            <p>
              Discover events, manage your
              registrations and stay connected
              with your campus community.
            </p>

          </div>

          {/* Profile */}

          <div className="student-profile">

            <div className="student-avatar">
              {user?.name
                ?.charAt(0)
                .toUpperCase() || "S"}
            </div>

            <div>

              <strong>
                {user?.name || "Student"}
              </strong>

              <span>
                Student
              </span>

            </div>

          </div>

        </header>

        {/* =========================
            Stats
        ========================= */}

        <section className="student-stats">

          {/* My Registrations */}

          <div
            className="student-stat-card"
            onClick={() =>
              navigate("/my-registrations")
            }
            style={{ cursor: "pointer" }}
          >

            <div className="student-stat-icon">
              <CalendarDays size={22} />
            </div>

            <div>

              <span>
                My Registrations
              </span>

              <strong>
                {registrationCount}
              </strong>

            </div>

          </div>

          {/* My Clubs */}

          <div
            className="student-stat-card"
            onClick={() =>
              navigate("/my-clubs")
            }
            style={{ cursor: "pointer" }}
          >

            <div className="student-stat-icon">
              <Users size={22} />
            </div>

            <div>

              <span>
                My Clubs
              </span>

              <strong>
                {myClubCount}
              </strong>

            </div>

          </div>

          {/* Saved Events */}

          <div
            className="student-stat-card"
            onClick={() =>
              navigate("/saved-events")
            }
            style={{ cursor: "pointer" }}
          >

            <div className="student-stat-icon">
              <Bookmark size={22} />
            </div>

            <div>

              <span>
                Saved Events
              </span>

              <strong>
                {savedEventCount}
              </strong>

            </div>

          </div>

          {/* Notifications */}

          <div
            className="student-stat-card"
            onClick={() =>
              navigate("/notifications")
            }
            style={{ cursor: "pointer" }}
          >

            <div className="student-stat-icon">
              <Bell size={22} />
            </div>

            <div>

              <span>
                Notifications
              </span>

              <strong>
                {notificationCount}
              </strong>

            </div>

          </div>

        </section>

        {/* =========================
            Upcoming Events
        ========================= */}

        <section className="student-section">

          <div className="student-section-heading">

            <div>

              <h2>
                Upcoming Events
              </h2>

              <p>
                Events happening on your campus
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/events")
              }
            >
              View All
            </button>

          </div>

          <div className="student-event-grid">

            {/* Event 1 */}

            <div className="student-event-card">

              <div className="student-event-date">
                <span>OCT</span>
                <strong>18</strong>
              </div>

              <div className="student-event-info">

                <h3>
                  Tech Innovators Summit
                </h3>

                <p>
                  Main Auditorium
                </p>

                <span>
                  120 seats available
                </span>

              </div>

              <button
                onClick={() =>
                  navigate("/events/1")
                }
              >
                View Event
              </button>

            </div>

            {/* Event 2 */}

            <div className="student-event-card">

              <div className="student-event-date">
                <span>OCT</span>
                <strong>25</strong>
              </div>

              <div className="student-event-info">

                <h3>
                  CodeSprint Hackathon
                </h3>

                <p>
                  Innovation Lab
                </p>

                <span>
                  80 seats available
                </span>

              </div>

              <button
                onClick={() =>
                  navigate("/events/2")
                }
              >
                View Event
              </button>

            </div>

            {/* Event 3 */}

            <div className="student-event-card">

              <div className="student-event-date">
                <span>NOV</span>
                <strong>02</strong>
              </div>

              <div className="student-event-info">

                <h3>
                  AI & Machine Learning Workshop
                </h3>

                <p>
                  Seminar Hall
                </p>

                <span>
                  45 seats available
                </span>

              </div>

              <button
                onClick={() =>
                  navigate("/events/3")
                }
              >
                View Event
              </button>

            </div>

          </div>

        </section>

        {/* =========================
            Quick Actions
        ========================= */}

        <section className="student-section">

          <div className="student-section-heading">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your EventHub activities
              </p>

            </div>

          </div>

          <div className="student-actions">

            {/* Browse Events */}

            <button
              onClick={() =>
                navigate("/events")
              }
            >

              <CalendarDays size={22} />

              <div>

                <strong>
                  Browse Events
                </strong>

                <span>
                  Find upcoming campus events
                </span>

              </div>

            </button>

            {/* My Registrations */}

            <button
              onClick={() =>
                navigate("/my-registrations")
              }
            >

              <Bookmark size={22} />

              <div>

                <strong>
                  My Registrations
                </strong>

                <span>
                  View events you registered for
                </span>

              </div>

            </button>

            {/* My Clubs */}

            <button
              onClick={() =>
                navigate("/my-clubs")
              }
            >

              <Users size={22} />

              <div>

                <strong>
                  My Clubs
                </strong>

                <span>
                  View clubs you joined
                </span>

              </div>

            </button>

            {/* Event Feedback */}

            <button
              onClick={() =>
                navigate("/feedback")
              }
            >

              <MessageSquare size={22} />

              <div>

                <strong>
                  Event Feedback
                </strong>

                <span>
                  Rate events you attended
                </span>

              </div>

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;