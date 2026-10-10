
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
  ArrowUpRight,
  Search,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  X,
} from "lucide-react";

import "./AdminEvents.css";

function AdminEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    eventDate: "",
    location: "",
    capacity: "",
  });

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    fetchEvents();
  }, []);

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
      console.error("Error fetching events:", error);
      alert("Unable to load events from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/events/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== id)
      );

      alert("Event deleted successfully.");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Unable to delete the event.");
    }
  };

  const openCreateForm = () => {
    setEditingEvent(null);

    setFormData({
      title: "",
      eventDate: "",
      location: "",
      capacity: "",
    });

    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);

    setFormData({
      title: event.title,
      eventDate: event.eventDate,
      location: event.location,
      capacity: event.capacity,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingEvent(null);

    setFormData({
      title: "",
      eventDate: "",
      location: "",
      capacity: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.eventDate ||
      !formData.location.trim() ||
      !formData.capacity
    ) {
      alert("Please fill in all event details.");
      return;
    }

    if (Number(formData.capacity) <= 0) {
      alert("Capacity must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const eventData = {
        title: formData.title.trim(),
        eventDate: formData.eventDate,
        location: formData.location.trim(),
        capacity: Number(formData.capacity),
      };

      let response;

      if (editingEvent) {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/events/${editingEvent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/events`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          editingEvent
            ? "Failed to update event"
            : "Failed to create event"
        );
      }

      const savedEvent = await response.json();

      if (editingEvent) {
        setEvents((currentEvents) =>
          currentEvents.map((event) =>
            event.id === savedEvent.id
              ? savedEvent
              : event
          )
        );

        alert("Event updated successfully.");
      } else {
        setEvents((currentEvents) => [
          ...currentEvents,
          savedEvent,
        ]);

        alert("Event created successfully.");
      }

      closeForm();
    } catch (error) {
      console.error("Error saving event:", error);

      alert(
        editingEvent
          ? "Unable to update the event."
          : "Unable to create the event."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase();

    return (
      event.title.toLowerCase().includes(searchText) ||
      event.location.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

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
            className="admin-nav-item"
            onClick={() => navigate("/admin")}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className="admin-nav-item active"
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

      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-header">

          <div>

            <div className="admin-header-label">
              <span className="admin-live-dot"></span>
              EVENT MANAGEMENT
            </div>

            <h1>
              Manage Events
            </h1>

            <p>
              Create, edit and manage all college events.
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

        {/* CREATE / EDIT FORM */}

        {showForm && (

          <section className="admin-panel admin-create-panel">

            <div className="admin-panel-header">

              <div>

                <span className="admin-section-kicker">
                  {editingEvent
                    ? "EDIT EVENT"
                    : "NEW EVENT"}
                </span>

                <h2>
                  {editingEvent
                    ? "Edit Event"
                    : "Create Event"}
                </h2>

              </div>

              <button
                className="admin-icon-button"
                onClick={closeForm}
                title="Close"
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="admin-create-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-form-grid">

                <div className="admin-form-group">

                  <label>
                    Event Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleFormChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Event Date
                  </label>

                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleFormChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Venue
                  </label>

                  <input
                    type="text"
                    name="location"
                    placeholder="Enter venue"
                    value={formData.location}
                    onChange={handleFormChange}
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Capacity
                  </label>

                  <input
                    type="number"
                    name="capacity"
                    placeholder="Enter capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleFormChange}
                  />

                </div>

              </div>

              <div className="admin-form-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {editingEvent ? (
                    <>
                      <Pencil size={17} />
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      {saving
                        ? "Creating..."
                        : "Create Event"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* TOOLBAR */}

        <section className="admin-section">

          <div className="admin-module-toolbar">

            <div className="admin-search-box">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <button
              className="admin-primary-button"
              onClick={openCreateForm}
            >
              <Plus size={18} />
              Create Event
            </button>

          </div>

        </section>

        {/* EVENTS TABLE */}

        <section className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <span className="admin-section-kicker">
                EVENT DIRECTORY
              </span>

              <h2>
                All Events
              </h2>

            </div>

            <span className="admin-count-badge">
              {filteredEvents.length} Events
            </span>

          </div>

          {loading ? (

            <div className="admin-empty-state">
              <CalendarDays size={30} />
              <h3>Loading events...</h3>
              <p>
                Fetching events from the database.
              </p>
            </div>

          ) : filteredEvents.length === 0 ? (

            <div className="admin-empty-state">
              <CalendarDays size={30} />
              <h3>No events found</h3>
              <p>
                Try another search or create a new event.
              </p>
            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredEvents.map((event) => (

                    <tr key={event.id}>

                      <td>

                        <div className="admin-table-event">

                          <div className="admin-table-event-icon">
                            <CalendarDays size={19} />
                          </div>

                          <div>

                            <strong>
                              {event.title}
                            </strong>

                            <span>
                              Event #{event.id}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {new Date(
                          `${event.eventDate}T00:00:00`
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td>

                        <span className="admin-location-cell">
                          <MapPin size={14} />
                          {event.location}
                        </span>

                      </td>

                      <td>
                        {event.capacity}
                      </td>

                      <td>

                        <span className="admin-status-badge">
                          Upcoming
                        </span>

                      </td>

                      <td>

                        <div className="admin-table-actions">

                          <button
                            className="admin-edit-button"
                            onClick={() =>
                              openEditForm(event)
                            }
                            title="Edit Event"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="admin-delete-button"
                            onClick={() =>
                              handleDelete(event.id)
                            }
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

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
        d="M19 15L19.7 17.3L22 18L19 15Z"
        fill="currentColor"
      />

    </svg>
  );
}

export default AdminEvents;
