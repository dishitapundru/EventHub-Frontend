import { useEffect, useState } from "react";
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
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react";

import "./Notifications.css";
import "../dashboards/StudentDashboard.css";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const userData = localStorage.getItem("user");

      if (!userData) {
        navigate("/login");
        return;
      }

      const loggedInUser = JSON.parse(userData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/user/${loggedInUser.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      setNotifications(data);
    } catch (err) {
      console.error("Notification fetch error:", err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id
            ? { ...notification, readStatus: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/user/${user.id}/read-all`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          readStatus: true,
        }))
      );
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  };

  const deleteAllNotifications = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete all notifications?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/user/${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete notifications");
      }

      setNotifications([]);
    } catch (err) {
      console.error("Delete notifications error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.readStatus
  ).length;

  return (
    <div className="student-dashboard notifications-page">

      {/* =====================================================
          STUDENT SIDEBAR
      ====================================================== */}

      <aside className="student-sidebar">

        <div className="student-brand">
          <div className="student-brand-icon">
            <LayoutDashboard size={21} />
          </div>

          <span>EventHub</span>
        </div>

        <nav className="student-nav">

          <button
            className="student-nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className="student-nav-item"
            onClick={() => navigate("/events")}
          >
            <CalendarDays size={19} />
            Browse Events
          </button>

          <button
            className="student-nav-item"
            onClick={() => navigate("/my-registrations")}
          >
            <Bookmark size={19} />
            My Registrations
          </button>

          <button
            className="student-nav-item"
            onClick={() => navigate("/my-clubs")}
          >
            <Users size={19} />
            My Clubs
          </button>

          <button
            className="student-nav-item active"
            onClick={() => navigate("/notifications")}
          >
            <Bell size={19} />
            Notifications

            {unreadCount > 0 && (
              <span className="student-notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            className="student-nav-item"
            onClick={() => navigate("/attendance")}
          >
            <ClipboardCheck size={19} />
            Attendance
          </button>

          <button
            className="student-nav-item"
            onClick={() => navigate("/feedback")}
          >
            <MessageSquare size={19} />
            Feedback
          </button>

          <button
            className="student-nav-item"
            onClick={() => navigate("/profile")}
          >
            <UserCircle size={19} />
            My Profile
          </button>

        </nav>

        <button
          className="student-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          Logout
        </button>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="student-main notifications-main">

        <div className="notifications-container">

          <div className="notifications-header">

            <div>
              <p className="notifications-label">
                STUDENT PORTAL
              </p>

              <h1>Notifications</h1>

              <p>
                Stay updated with the latest events, clubs and announcements.
              </p>
            </div>

            <div className="notifications-actions">

              {unreadCount > 0 && (
                <button
                  className="notification-action-btn"
                  onClick={markAllAsRead}
                >
                  <CheckCheck size={17} />
                  Mark all as read
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  className="notification-delete-btn"
                  onClick={deleteAllNotifications}
                >
                  <Trash2 size={17} />
                  Clear all
                </button>
              )}

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="notifications-message">
              Loading notifications...
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <div className="notifications-message error">
              {error}
            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            notifications.length === 0 && (
              <div className="notifications-empty">

                <div className="notifications-empty-icon">
                  <Bell size={30} />
                </div>

                <h2>No notifications yet</h2>

                <p>
                  You will see event announcements, club updates
                  and other important notifications here.
                </p>

                <button
                  onClick={() => navigate("/events")}
                >
                  Browse Events
                </button>

              </div>
            )}

          {/* =================================================
              NOTIFICATIONS LIST
          ================================================= */}

          {!loading &&
            !error &&
            notifications.length > 0 && (
              <div className="notifications-list">

                {notifications.map((notification) => (

                  <div
                    key={notification.id}
                    className={`notification-card ${
                      !notification.readStatus ? "unread" : ""
                    }`}
                  >

                    <div className="notification-icon">
                      <Bell size={20} />
                    </div>

                    <div className="notification-content">

                      <div className="notification-top">

                        <div>

                          <span className="notification-type">
                            {notification.type === "CLUB_UPDATE"
                              ? "Club Update"
                              : notification.type}
                          </span>

                          <h3>
                            {notification.title}
                          </h3>

                        </div>

                        {!notification.readStatus && (
                          <span className="notification-unread-dot"></span>
                        )}

                      </div>

                      <p className="notification-message">
                        {notification.message}
                      </p>

                      <div className="notification-bottom">

                        <span className="notification-date">
                          {notification.createdAt
                            ? new Date(
                                notification.createdAt
                              ).toLocaleString()
                            : ""}
                        </span>

                        {!notification.readStatus && (
                          <button
                            className="notification-read-btn"
                            onClick={() =>
                              markAsRead(notification.id)
                            }
                          >
                            <Check size={15} />
                            Mark as read
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </div>

      </main>

    </div>
  );
}

export default Notifications;