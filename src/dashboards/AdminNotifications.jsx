
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
  Send,
  Megaphone,
  Clock3,
  Trash2,
} from "lucide-react";
import "./AdminNotifications.css";

function AdminNotifications() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Students");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    loadNotifications();
  }, [navigate, user?.id, user?.role]);

  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  const loadNotifications = async () => {
    try {
      setLoading(true);

      /*
       * The admin history is currently loaded from
       * the first student because notifications are
       * stored per student.
       *
       * Later we can create a separate admin
       * notification-history API.
       */

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/user/1`
      );

      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = await response.json();

      setNotifications(data);
    } catch (error) {
      console.error(
        "Notification loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // SEND NOTIFICATION
  // =========================

  const sendNotification = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please enter both title and message.");
      return;
    }

    if (audience !== "All Students") {
      alert(
        "Currently, notifications can only be sent to All Students."
      );
      return;
    }

    try {
      setSending(true);

      const params = new URLSearchParams();

      params.append("type", "info");
      params.append("title", title.trim());
      params.append("message", message.trim());

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/broadcast?${params.toString()}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(
          errorMessage || "Failed to send notification"
        );
      }

      const savedNotifications = await response.json();

      setNotifications((currentNotifications) => [
        ...savedNotifications,
        ...currentNotifications,
      ]);

      setTitle("");
      setMessage("");

      alert(
        "Notification sent successfully to all students!"
      );
    } catch (error) {
      console.error(
        "Send notification error:",
        error
      );

      alert(
        error.message ||
          "Unable to send notification."
      );
    } finally {
      setSending(false);
    }
  };

  // =========================
  // DELETE NOTIFICATION
  // =========================

  const deleteNotification = async (id) => {
    /*
     * Individual admin-history deletion is not
     * implemented yet because notifications belong
     * to individual students.
     */

    setNotifications((currentNotifications) =>
      currentNotifications.filter(
        (notification) =>
          notification.id !== id
      )
    );
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (createdAt) => {
    if (!createdAt) {
      return "Recently";
    }

    return new Date(createdAt).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="admin-module-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            ✦
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
            className="admin-nav-item"
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

          <button className="admin-nav-item active">
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
            onClick={() => navigate("/admin/profile")}
          >
            <UserCircle size={19} />
            <span>My Profile</span>
          </button>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-user">

            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase() ||
                "A"}
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

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="admin-module-main">

        <header className="admin-module-header">

          <div>

            <span className="admin-module-kicker">
              COMMUNICATION CENTER
            </span>

            <h1>
              Notifications
            </h1>

            <p>
              Send announcements and updates to students.
            </p>

          </div>

        </header>

        {/* =========================
            NOTIFICATION LAYOUT
        ========================= */}

        <section className="notification-layout">

          {/* =========================
              COMPOSE
          ========================= */}

          <div className="notification-compose-card">

            <div className="notification-card-heading">

              <div className="notification-heading-icon">
                <Megaphone size={20} />
              </div>

              <div>

                <h2>
                  Send Announcement
                </h2>

                <p>
                  Create a notification for students.
                </p>

              </div>

            </div>

            <form
              className="notification-form"
              onSubmit={sendNotification}
            >

              <label>
                Notification Title
              </label>

              <input
                type="text"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <label>
                Message
              </label>

              <textarea
                placeholder="Write your announcement..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                rows="6"
              />

              <label>
                Audience
              </label>

              <select
                value={audience}
                onChange={(e) =>
                  setAudience(e.target.value)
                }
              >

                <option>
                  All Students
                </option>

                <option>
                  Computer Science Students
                </option>

                <option>
                  Club Members
                </option>

                <option>
                  Event Participants
                </option>

              </select>

              <button
                type="submit"
                className="notification-send-button"
                disabled={sending}
              >

                <Send size={17} />

                {sending
                  ? "Sending..."
                  : "Send Notification"}

              </button>

            </form>

          </div>

          {/* =========================
              NOTIFICATION HISTORY
          ========================= */}

          <div className="notification-history-card">

            <div className="notification-history-header">

              <div>

                <span className="admin-module-kicker">
                  RECENT
                </span>

                <h2>
                  Sent Notifications
                </h2>

              </div>

              <Bell size={21} />

            </div>

            <div className="notification-list">

              {loading ? (

                <p>
                  Loading notifications...
                </p>

              ) : notifications.length === 0 ? (

                <p>
                  No notifications sent yet.
                </p>

              ) : (

                notifications.map(
                  (notification) => (

                    <div
                      className="notification-item"
                      key={notification.id}
                    >

                      <div className="notification-item-icon">
                        <Bell size={17} />
                      </div>

                      <div className="notification-item-content">

                        <h3>
                          {notification.title}
                        </h3>

                        <p>
                          {notification.message}
                        </p>

                        <div className="notification-item-meta">

                          <span>
                            <Users size={13} />
                            All Students
                          </span>

                          <span>
                            <Clock3 size={13} />

                            {formatDate(
                              notification.createdAt
                            )}

                          </span>

                        </div>

                      </div>

                      <button
                        className="notification-delete"
                        title="Remove from view"
                        onClick={() =>
                          deleteNotification(
                            notification.id
                          )
                        }
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminNotifications;
