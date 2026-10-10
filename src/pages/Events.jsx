import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  MapPin,
  Users,
  Bookmark,
  UserCircle,
  Bell,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";

import "./Events.css";
import "../dashboards/StudentDashboard.css";

function Events() {
  const navigate = useNavigate();

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const userData = localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load Events
  // =========================
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/events`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        setEvents(data);
      } catch (error) {
        console.error(
          "Error loading events:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // =========================
  // Load Saved Events
  // =========================
  useEffect(() => {
    if (!user) {
      setSavedEvents([]);
      return;
    }

    const savedKey =
      `savedEvents_${user.id}`;

    const savedData =
      localStorage.getItem(savedKey);

    if (savedData) {
      setSavedEvents(
        JSON.parse(savedData)
      );
    }
  }, [user?.id]);

  // =========================
  // Save / Unsave Event
  // =========================
  const toggleSaveEvent = (eventId) => {
    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }

    const savedKey =
      `savedEvents_${user.id}`;

    let updatedSavedEvents;

    if (savedEvents.includes(eventId)) {
      updatedSavedEvents =
        savedEvents.filter(
          (id) => id !== eventId
        );
    } else {
      updatedSavedEvents = [
        ...savedEvents,
        eventId,
      ];
    }

    setSavedEvents(
      updatedSavedEvents
    );

    localStorage.setItem(
      savedKey,
      JSON.stringify(
        updatedSavedEvents
      )
    );
  };

  const isEventSaved = (eventId) => {
    return savedEvents.includes(eventId);
  };

  // =========================
  // Format Date
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  return (
    <div className="student-dashboard">

      {/* =========================
          Sidebar
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

          {/* Dashboard */}

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          {/* Browse Events */}

          <button
            className="student-nav-item active"
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
              navigate(
                "/my-registrations"
              )
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
              navigate(
                "/notifications"
              )
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

        <div className="events-page">

          <div className="events-container">

            {/* Page Heading */}

            <div className="events-heading">

              <span>EVENTHUB</span>

              <h1>
                Upcoming Events
              </h1>

              <p>
                Discover workshops,
                competitions, fests and
                activities happening on
                campus.
              </p>

            </div>

            {/* Loading */}

            {loading && (
              <div className="events-empty">
                Loading events...
              </div>
            )}

            {/* No Events */}

            {!loading &&
              events.length === 0 && (
                <div className="events-empty">
                  No events are available
                  right now.
                </div>
              )}

            {/* Events */}

            {!loading &&
              events.length > 0 && (
                <div className="events-grid">

                  {events.map((event) => (

                    <div
                      className="event-card"
                      key={event.id}
                    >

                      <div className="event-card-top">

                        <CalendarDays
                          size={22}
                        />

                        <span>
                          Open
                        </span>

                      </div>

                      <h2>
                        {event.title}
                      </h2>

                      <div className="event-info">

                        <p>
                          <CalendarDays
                            size={17}
                          />

                          {formatDate(
                            event.eventDate
                          )}
                        </p>

                        <p>
                          <MapPin
                            size={17}
                          />

                          {event.location}
                        </p>

                        <p>
                          <Users
                            size={17}
                          />

                          {event.capacity}{" "}
                          seats remaining
                        </p>

                      </div>

                      <div className="event-actions">

                        <button
                          className="event-register"
                          onClick={() =>
                            navigate(
                              `/events/${event.id}`
                            )
                          }
                        >
                          View Details
                        </button>

                        <button
                          className={`event-save ${
                            isEventSaved(
                              event.id
                            )
                              ? "event-saved"
                              : ""
                          }`}
                          onClick={() =>
                            toggleSaveEvent(
                              event.id
                            )
                          }
                        >

                          <Bookmark
                            size={17}
                            fill={
                              isEventSaved(
                                event.id
                              )
                                ? "currentColor"
                                : "none"
                            }
                          />

                          {isEventSaved(
                            event.id
                          )
                            ? "Saved"
                            : "Save Event"}

                        </button>

                      </div>

                    </div>

                  ))}

                </div>
              )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Events;