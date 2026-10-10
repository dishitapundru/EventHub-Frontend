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
  Pencil,
  Trash2,
  MapPin,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClubEvents.css";
import "./ClubDashboard.css";

function ClubEvents() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    const loggedInUser = JSON.parse(userData);
    setUser(loggedInUser);

    fetch(
      `${import.meta.env.VITE_API_URL}/clubs/owner/${loggedInUser.id}`
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Club profile not found");
        }

        return response.json();
      })
      .then((clubData) => {
        setClub(clubData);

        return fetch(
          `${import.meta.env.VITE_API_URL}/events/club/${clubData.id}`
        );
      })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load events");
        }

        return response.json();
      })
      .then((eventData) => {
        setEvents(eventData);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load club events");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/events/${eventId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents((currentEvents) =>
        currentEvents.filter(
          (event) => event.id !== eventId
        )
      );
    } catch (err) {
      console.error(err);
      alert("Unable to delete event");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="club-events-page">

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

        </aside>

        <main className="club-events-main">
          <div className="club-events-loading">
            Loading your events...
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="club-events-page">

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
            className="club-nav-item"
            onClick={() => navigate("/club")}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className="club-nav-item active"
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

      <main className="club-events-main">

        {/* Header */}

        <header className="club-events-header">

          <div>

            <p className="club-events-label">
              CLUB MANAGEMENT
            </p>

            <h1>My Events</h1>

            <p className="club-events-subtitle">
              Manage events created by{" "}
              <strong>
                {club?.name || "your club"}
              </strong>
            </p>

          </div>

          <div className="club-events-header-actions">

            <div className="club-events-user">

              <div className="club-events-user-avatar">
                <Building2 size={20} />
              </div>

              <div>
                <strong>{user?.name}</strong>
                <span>Club Account</span>
              </div>

            </div>

            <button
              className="create-event-button"
              onClick={() =>
                navigate("/club/create-event")
              }
            >
              <Plus size={18} />
              Create Event
            </button>

          </div>

        </header>

        {/* Error */}

        {error && (
          <div className="club-events-error">
            {error}
          </div>
        )}

        {/* Empty State */}

        {!error && events.length === 0 && (
          <div className="empty-events-card">

            <div className="empty-events-icon">
              <CalendarDays size={38} />
            </div>

            <h2>No events yet</h2>

            <p>
              Your club has not created any events yet.
            </p>

            <button
              onClick={() =>
                navigate("/club/create-event")
              }
            >
              <Plus size={18} />
              Create Your First Event
            </button>

          </div>
        )}

        {/* Events */}

        {events.length > 0 && (
          <div className="club-events-grid">

            {events.map((event) => (
              <div
                className="club-event-card"
                key={event.id}
              >

                <div className="club-event-card-top">

                  <div className="event-calendar-icon">
                    <CalendarDays size={24} />
                  </div>

                  <span className="event-status">
                    Published
                  </span>

                </div>

                <h2>{event.title}</h2>

                <div className="event-info">

                  <div>
                    <CalendarDays size={17} />
                    <span>
                      {event.eventDate}
                    </span>
                  </div>

                  <div>
                    <MapPin size={17} />
                    <span>
                      {event.location}
                    </span>
                  </div>

                  <div>
                    <Users size={17} />
                    <span>
                      Capacity: {event.capacity}
                    </span>
                  </div>

                </div>

                <div className="event-card-actions">

                  <button
                    className="edit-event-button"
                    onClick={() =>
                      navigate(
                        `/club/events/edit/${event.id}`
                      )
                    }
                  >
                    <Pencil size={17} />
                    Edit
                  </button>

                  <button
                    className="delete-event-button"
                    onClick={() =>
                      handleDelete(event.id)
                    }
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default ClubEvents;