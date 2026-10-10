
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
} from "lucide-react";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [notificationCount, setNotificationCount] = useState(0);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [savedEventCount, setSavedEventCount] = useState(0);
  const [myClubCount, setMyClubCount] = useState(0);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // =========================
  // Fetch Upcoming Events
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchUpcomingEvents = async () => {
      try {
        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        setEventsLoading(true);
        setEventsError("");

        const response = await fetch(`${apiUrl}/events`);

        if (!response.ok) {
          throw new Error("Failed to load events.");
        }

        const data = await response.json();
        const eventList = Array.isArray(data) ? data : [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredEvents = eventList
          .filter((event) => {
            if (!event.eventDate) return false;

            const date = new Date(`${event.eventDate}T00:00:00`);

            return (
              !Number.isNaN(date.getTime()) &&
              date >= today
            );
          })
          .sort(
            (a, b) =>
              new Date(`${a.eventDate}T00:00:00`) -
              new Date(`${b.eventDate}T00:00:00`)
          );

        if (isMounted) {
          setUpcomingEvents(filteredEvents);
        }
      } catch (error) {
        console.error("Upcoming events error:", error);

        if (isMounted) {
          setUpcomingEvents([]);
          setEventsError("Unable to load events. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setEventsLoading(false);
        }
      }
    };

    fetchUpcomingEvents();

    const handleFocus = () => fetchUpcomingEvents();
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [apiUrl]);

  // =========================
  // Notification Count
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchNotificationCount = async () => {
      try {
        if (!user?.id || !apiUrl) {
          if (isMounted) setNotificationCount(0);
          return;
        }

        const response = await fetch(
          `${apiUrl}/notifications/user/${user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications.");
        }

        const data = await response.json();

        const unreadCount = Array.isArray(data)
          ? data.filter(
              (notification) => notification.readStatus === false
            ).length
          : 0;

        if (isMounted) {
          setNotificationCount(unreadCount);
        }
      } catch (error) {
        console.error("Notification count error:", error);
        if (isMounted) setNotificationCount(0);
      }
    };

    fetchNotificationCount();

    const handleFocus = () => fetchNotificationCount();
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.id, apiUrl]);

  // =========================
  // Registration Count
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchRegistrationCount = async () => {
      try {
        if (!user?.id || !apiUrl) {
          if (isMounted) setRegistrationCount(0);
          return;
        }

        const response = await fetch(
          `${apiUrl}/registrations/user/${user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch registrations.");
        }

        const data = await response.json();

        if (isMounted) {
          setRegistrationCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error("Registration count error:", error);
        if (isMounted) setRegistrationCount(0);
      }
    };

    fetchRegistrationCount();

    const handleFocus = () => fetchRegistrationCount();
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.id, apiUrl]);

  // =========================
  // Saved Events Count
  // =========================
  useEffect(() => {
    const updateSavedEventCount = () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setSavedEventCount(0);
          return;
        }

        const currentUser = JSON.parse(storedUser);
        const savedKey = `savedEvents_${currentUser.id}`;
        const savedData = localStorage.getItem(savedKey);

        if (!savedData) {
          setSavedEventCount(0);
          return;
        }

        const savedEvents = JSON.parse(savedData);

        setSavedEventCount(
          Array.isArray(savedEvents) ? savedEvents.length : 0
        );
      } catch (error) {
        console.error("Saved events count error:", error);
        setSavedEventCount(0);
      }
    };

    updateSavedEventCount();

    window.addEventListener("storage", updateSavedEventCount);
    window.addEventListener("focus", updateSavedEventCount);

    return () => {
      window.removeEventListener("storage", updateSavedEventCount);
      window.removeEventListener("focus", updateSavedEventCount);
    };
  }, []);

  // =========================
  // My Clubs Count
  // Counts ACTIVE clubs owned by this user.
  // The current backend has no student membership endpoint.
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchMyClubCount = async () => {
      try {
        if (!user?.id || !apiUrl) {
          if (isMounted) setMyClubCount(0);
          return;
        }

        const response = await fetch(`${apiUrl}/clubs`);

        if (!response.ok) {
          throw new Error("Failed to fetch clubs.");
        }

        const data = await response.json();
        const allClubs = Array.isArray(data) ? data : [];

        const myClubs = allClubs.filter((club) => {
          const ownerId = club.ownerId ?? club.owner?.id;

          return (
            String(ownerId ?? "") === String(user.id) &&
            String(club.status ?? "").toUpperCase() === "ACTIVE"
          );
        });

        if (isMounted) {
          setMyClubCount(myClubs.length);
        }
      } catch (error) {
        console.error("My Clubs count error:", error);
        if (isMounted) setMyClubCount(0);
      }
    };

    fetchMyClubCount();

    const handleFocus = () => fetchMyClubCount();
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.id, apiUrl]);

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // =========================
  // Format Event Date
  // =========================
  const getEventDateParts = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return {
      month: date
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase(),
      day: String(date.getDate()).padStart(2, "0"),
    };
  };

  // =========================
  // Render Dashboard
  // =========================
  return (
    <div className="student-dashboard">
      <aside className="student-sidebar">
        <div className="student-brand">
          <div className="student-brand-icon">
            <LayoutDashboard size={21} />
          </div>
          <span>EventHub</span>
        </div>

        <nav className="student-nav">
          <button
            className="student-nav-item active"
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
            className="student-nav-item"
            onClick={() => navigate("/notifications")}
          >
            <Bell size={19} />
            Notifications
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

        <button className="student-logout" onClick={handleLogout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="student-main">
        <header className="student-header">
          <div>
            <p className="student-small-title">Student Dashboard</p>
            <h1>Welcome back, {user?.name || "Student"} 👋</h1>
            <p>
              Discover events, manage your registrations and stay
              connected with your campus community.
            </p>
          </div>

          <div className="student-profile">
            <div className="student-avatar">
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </div>

            <div>
              <strong>{user?.name || "Student"}</strong>
              <span>Student</span>
            </div>
          </div>
        </header>

        <section className="student-stats">
          <div
            className="student-stat-card"
            onClick={() => navigate("/my-registrations")}
            style={{ cursor: "pointer" }}
          >
            <div className="student-stat-icon">
              <CalendarDays size={22} />
            </div>
            <div>
              <span>My Registrations</span>
              <strong>{registrationCount}</strong>
            </div>
          </div>

          <div
            className="student-stat-card"
            onClick={() => navigate("/my-clubs")}
            style={{ cursor: "pointer" }}
          >
            <div className="student-stat-icon">
              <Users size={22} />
            </div>
            <div>
              <span>My Clubs</span>
              <strong>{myClubCount}</strong>
            </div>
          </div>

          <div
            className="student-stat-card"
            onClick={() => navigate("/saved-events")}
            style={{ cursor: "pointer" }}
          >
            <div className="student-stat-icon">
              <Bookmark size={22} />
            </div>
            <div>
              <span>Saved Events</span>
              <strong>{savedEventCount}</strong>
            </div>
          </div>

          <div
            className="student-stat-card"
            onClick={() => navigate("/notifications")}
            style={{ cursor: "pointer" }}
          >
            <div className="student-stat-icon">
              <Bell size={22} />
            </div>
            <div>
              <span>Notifications</span>
              <strong>{notificationCount}</strong>
            </div>
          </div>
        </section>

        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <h2>Upcoming Events</h2>
              <p>Events happening on your campus</p>
            </div>

            <button onClick={() => navigate("/events")}>
              View All
            </button>
          </div>

          <div className="student-event-grid">
            {eventsLoading ? (
              <p>Loading upcoming events...</p>
            ) : eventsError ? (
              <p>{eventsError}</p>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const { month, day } = getEventDateParts(
                  event.eventDate
                );

                return (
                  <div
                    className="student-event-card"
                    key={event.id}
                  >
                    <div className="student-event-date">
                      <span>{month}</span>
                      <strong>{day}</strong>
                    </div>

                    <div className="student-event-info">
                      <h3>{event.title}</h3>
                      <p>
                        {event.location || "Location not specified"}
                      </p>
                      <span>
                        {event.capacity ?? "N/A"} seats in total
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View Event
                    </button>
                  </div>
                );
              })
            ) : (
              <p>No upcoming events available.</p>
            )}
          </div>
        </section>

        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your EventHub activities</p>
            </div>
          </div>

          <div className="student-actions">
            <button onClick={() => navigate("/events")}>
              <CalendarDays size={22} />
              <div>
                <strong>Browse Events</strong>
                <span>Find upcoming campus events</span>
              </div>
            </button>

            <button onClick={() => navigate("/my-registrations")}>
              <Bookmark size={22} />
              <div>
                <strong>My Registrations</strong>
                <span>View events you registered for</span>
              </div>
            </button>

            <button onClick={() => navigate("/my-clubs")}>
              <Users size={22} />
              <div>
                <strong>My Clubs</strong>
                <span>View clubs you joined</span>
              </div>
            </button>

            <button onClick={() => navigate("/feedback")}>
              <MessageSquare size={22} />
              <div>
                <strong>Event Feedback</strong>
                <span>Rate events you attended</span>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
