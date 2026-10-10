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
  Save,
  MapPin,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClubCreateEvent.css";
import "./ClubDashboard.css";

function ClubCreateEvent() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    eventDate: "",
    location: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load club information");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Event title is required");
      return;
    }

    if (!formData.eventDate) {
      setError("Event date is required");
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required");
      return;
    }

    if (!formData.capacity || Number(formData.capacity) <= 0) {
      setError("Capacity must be greater than 0");
      return;
    }

    if (!club) {
      setError("Club information is unavailable");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/events/club`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            eventDate: formData.eventDate,
            location: formData.location.trim(),
            capacity: Number(formData.capacity),
            clubId: club.id,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to create event"
        );
      }

      setSuccess("Event created successfully!");

      setFormData({
        title: "",
        eventDate: "",
        location: "",
        capacity: "",
      });

      setTimeout(() => {
        navigate("/club/events");
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Unable to create event");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="club-create-event-page">

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

        <main className="club-create-main">
          <div className="club-create-loading">
            Loading...
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="club-create-event-page">

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
            className="club-nav-item"
            onClick={() => navigate("/club/events")}
          >
            <CalendarDays size={19} />
            <span>My Events</span>
          </button>

          <button
            className="club-nav-item active"
            onClick={() =>
              navigate("/club/create-event")
            }
          >
            <Plus size={19} />
            <span>Create Event</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() =>
              navigate("/club/registrations")
            }
          >
            <Users size={19} />
            <span>Registrations</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() =>
              navigate("/club/attendance")
            }
          >
            <QrCode size={19} />
            <span>Attendance</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() =>
              navigate("/club/feedback")
            }
          >
            <MessageSquare size={19} />
            <span>Feedback</span>
          </button>

          <button
            className="club-nav-item"
            onClick={() =>
              navigate("/club/updates")
            }
          >
            <Bell size={19} />
            <span>Updates</span>
          </button>

        </nav>

        <div className="club-sidebar-bottom">

          <button
            className="club-nav-item"
            onClick={() =>
              navigate("/club/profile")
            }
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

      <main className="club-create-main">

        {/* Header */}

        <header className="club-create-header">

          <div>

            <p className="club-create-label">
              CLUB MANAGEMENT
            </p>

            <h1>Create Event</h1>

            <p className="club-create-subtitle">
              Create a new event for{" "}
              <strong>{club?.name}</strong>
            </p>

          </div>

          <div className="club-create-header-user">

            <div className="club-create-user-avatar">
              <Building2 size={20} />
            </div>

            <div>
              <strong>{user?.name}</strong>
              <span>Club Account</span>
            </div>

          </div>

        </header>

        {/* Form Card */}

        <section className="club-create-card">

          <div className="club-create-card-heading">

            <div className="create-heading-icon">
              <CalendarDays size={24} />
            </div>

            <div>

              <h2>Event Details</h2>

              <p>
                Fill in the information below to publish
                your event.
              </p>

            </div>

          </div>

          {error && (
            <div className="create-event-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="create-event-message success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Event Title */}

            <div className="form-group full-width">

              <label>
                Event Title
              </label>

              <div className="input-wrapper">

                <CalendarDays size={18} />

                <input
                  type="text"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Date + Capacity */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Event Date
                </label>

                <div className="input-wrapper">

                  <CalendarDays size={18} />

                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Capacity
                </label>

                <div className="input-wrapper">

                  <Users size={18} />

                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    placeholder="e.g. 100"
                    value={formData.capacity}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

            {/* Location */}

            <div className="form-group full-width">

              <label>
                Location
              </label>

              <div className="input-wrapper">

                <MapPin size={18} />

                <input
                  type="text"
                  name="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Actions */}

            <div className="club-create-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/club/events")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-event-button"
                disabled={saving}
              >

                <Save size={18} />

                {saving
                  ? "Creating..."
                  : "Create Event"}

              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default ClubCreateEvent;