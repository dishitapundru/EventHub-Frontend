import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ClubEditEvent.css";

function ClubEditEvent() {
  const navigate = useNavigate();
  const { eventId } = useParams();

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

    const loadData = async () => {
      try {
        const clubResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/clubs/owner/${loggedInUser.id}`
        );

        if (!clubResponse.ok) {
          throw new Error("Club profile not found");
        }

        const clubData = await clubResponse.json();
        setClub(clubData);

        const eventResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/events/${eventId}`
        );

        if (!eventResponse.ok) {
          throw new Error("Event not found");
        }

        const eventData = await eventResponse.json();

        setFormData({
          title: eventData.title || "",
          eventDate: eventData.eventDate || "",
          location: eventData.location || "",
          capacity: eventData.capacity || "",
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load event");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId, navigate]);

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

    setSaving(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            eventDate: formData.eventDate,
            location: formData.location.trim(),
            capacity: Number(formData.capacity),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update event");
      }

      setSuccess("Event updated successfully!");

      setTimeout(() => {
        navigate("/club/events");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="club-edit-event-page">
        <div className="club-edit-loading">
          Loading event...
        </div>
      </div>
    );
  }

  return (
    <div className="club-edit-event-page">

      {/* Sidebar */}
      <aside className="club-edit-sidebar">

        <div className="club-edit-logo">

          <div className="club-edit-logo-icon">
            <CalendarDays size={24} />
          </div>

          <div>
            <h2>EventHub</h2>
            <span>Club Portal</span>
          </div>

        </div>

        <nav className="club-edit-nav">

          <button onClick={() => navigate("/club")}>
            <CalendarDays size={19} />
            Dashboard
          </button>

          <button
            className="active"
            onClick={() => navigate("/club/events")}
          >
            <CalendarDays size={19} />
            My Events
          </button>

          <button onClick={() => navigate("/club/create-event")}>
            <CalendarDays size={19} />
            Create Event
          </button>

          <button onClick={() => navigate("/club/registrations")}>
            <Users size={19} />
            Registrations
          </button>

          <button onClick={() => navigate("/club/attendance")}>
            <Users size={19} />
            Attendance
          </button>

          <button onClick={() => navigate("/club/feedback")}>
            <CalendarDays size={19} />
            Feedback
          </button>

          <button onClick={() => navigate("/club/updates")}>
            <CalendarDays size={19} />
            Updates
          </button>

          <button onClick={() => navigate("/club/profile")}>
            <CalendarDays size={19} />
            Club Profile
          </button>

        </nav>

        <div className="club-edit-sidebar-bottom">

          <button
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* Main */}
      <main className="club-edit-main">

        <div className="club-edit-header">

          <button
            className="edit-back-button"
            onClick={() => navigate("/club/events")}
          >
            <ArrowLeft size={18} />
            Back to My Events
          </button>

          <h1>Edit Event</h1>

          <p>
            Update the details of{" "}
            <strong>{club?.name}</strong>'s event.
          </p>

        </div>

        <div className="club-edit-card">

          <div className="club-edit-card-heading">

            <div className="edit-heading-icon">
              <CalendarDays size={24} />
            </div>

            <div>
              <h2>Event Details</h2>
              <p>
                Update the information and save your changes.
              </p>
            </div>

          </div>

          {error && (
            <div className="edit-event-error">
              {error}
            </div>
          )}

          {success && (
            <div className="edit-event-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="edit-form-group">

              <label>Event Title</label>

              <div className="edit-input-wrapper">
                <CalendarDays size={18} />

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                />
              </div>

            </div>

            <div className="edit-form-row">

              <div className="edit-form-group">

                <label>Event Date</label>

                <div className="edit-input-wrapper">
                  <CalendarDays size={18} />

                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="edit-form-group">

                <label>Capacity</label>

                <div className="edit-input-wrapper">
                  <Users size={18} />

                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </div>

            <div className="edit-form-group">

              <label>Location</label>

              <div className="edit-input-wrapper">
                <MapPin size={18} />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                />
              </div>

            </div>

            <div className="club-edit-actions">

              <button
                type="button"
                className="edit-cancel-button"
                onClick={() => navigate("/club/events")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-save-button"
                disabled={saving}
              >
                <Save size={18} />

                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default ClubEditEvent;