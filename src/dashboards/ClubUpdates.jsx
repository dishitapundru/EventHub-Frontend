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
  Search,
  Trash2,
  Send,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClubUpdates.css";
import "./ClubDashboard.css";

function ClubUpdates() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);
  const [updates, setUpdates] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
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

    loadUpdates(loggedInUser.id);
  }, [navigate]);

  const loadUpdates = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const clubResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs/owner/${userId}`
      );

      if (!clubResponse.ok) {
        throw new Error("Club not found");
      }

      const clubData = await clubResponse.json();

      setClub(clubData);

      const updatesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/club-updates/club/${clubData.id}`
      );

      if (!updatesResponse.ok) {
        throw new Error("Unable to load updates");
      }

      const updatesData = await updatesResponse.json();

      setUpdates(updatesData);

    } catch (err) {
      console.error("Updates loading error:", err);

      setError(
        err.message || "Unable to load updates"
      );

    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter an update title.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter an update message.");
      return;
    }

    if (!club) {
      setError("Club information is unavailable.");
      return;
    }

    try {
      setPublishing(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/club-updates?clubId=${club.id}&title=${encodeURIComponent(
          title.trim()
        )}&message=${encodeURIComponent(message.trim())}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Unable to publish update"
        );
      }

      const newUpdate = await response.json();

      setUpdates((prev) => [
        newUpdate,
        ...prev,
      ]);

      setTitle("");
      setMessage("");

      setSuccess(
        "Update published successfully."
      );

    } catch (err) {
      console.error(
        "Publish update error:",
        err
      );

      setError(
        err.message ||
          "Unable to publish update"
      );

    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (updateId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this update?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/club-updates/${updateId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to delete update"
        );
      }

      setUpdates((prev) =>
        prev.filter(
          (item) => item.id !== updateId
        )
      );

      setSuccess(
        "Update deleted successfully."
      );

    } catch (err) {
      console.error(
        "Delete update error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete update"
      );
    }
  };

  const filteredUpdates = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return updates;
    }

    return updates.filter((item) =>
      `${item.title || ""} ${
        item.message || ""
      }`
        .toLowerCase()
        .includes(search)
    );
  }, [updates, searchTerm]);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    return new Date(
      dateValue
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
    <div className="club-updates-page">

      {/* SIDEBAR */}

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
            onClick={() =>
              navigate("/club/events")
            }
          >
            <CalendarDays size={19} />
            <span>My Events</span>
          </button>

          <button
            className="club-nav-item"
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
            className="club-nav-item active"
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

      {/* MAIN */}

      <main className="club-updates-main">

        <header className="club-updates-header">

          <div>

            <p className="club-updates-label">
              CLUB MANAGEMENT
            </p>

            <h1>Club Updates</h1>

            <p>
              Share announcements and important
              information with students.
            </p>

          </div>

          <div className="club-updates-header-user">

            <div className="club-updates-user-avatar">
              <Building2 size={20} />
            </div>

            <div>

              <strong>
                {user?.name}
              </strong>

              <span>
                Club Account
              </span>

            </div>

          </div>

        </header>

        {error && (
          <div className="club-updates-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="club-updates-message success">
            {success}
          </div>
        )}

        {/* CREATE UPDATE */}

        <section className="club-update-create-card">

          <div className="club-update-section-heading">

            <div className="club-update-heading-icon">
              <Plus size={19} />
            </div>

            <div>

              <h2>Create New Update</h2>

              <p>
                Publish an announcement for students.
              </p>

            </div>

          </div>

          <form
            className="club-update-form"
            onSubmit={handlePublish}
          >

            <div className="club-update-field">

              <label>
                Update Title
              </label>

              <input
                type="text"
                placeholder="e.g. Workshop venue changed"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                maxLength={120}
              />

            </div>

            <div className="club-update-field">

              <label>
                Message
              </label>

              <textarea
                placeholder="Write your announcement here..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                rows={5}
                maxLength={1000}
              />

            </div>

            <div className="club-update-form-footer">

              <span>
                {message.length}/1000 characters
              </span>

              <button
                type="submit"
                disabled={publishing}
                className="club-update-publish-btn"
              >

                <Send size={17} />

                {publishing
                  ? "Publishing..."
                  : "Publish Update"}

              </button>

            </div>

          </form>

        </section>

        {/* EXISTING UPDATES */}

        <section className="club-updates-card">

          <div className="club-updates-card-header">

            <div>

              <h2>Published Updates</h2>

              <p>
                Announcements published by your club.
              </p>

            </div>

            <div className="club-updates-count">

              {filteredUpdates.length}{" "}

              {filteredUpdates.length === 1
                ? "Update"
                : "Updates"}

            </div>

          </div>

          <div className="club-updates-tools">

            <div className="club-updates-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search updates..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

          </div>

          {loading ? (

            <div className="club-updates-empty">

              <Bell size={36} />

              <h2>
                Loading updates...
              </h2>

              <p>
                Please wait while we load your
                announcements.
              </p>

            </div>

          ) : filteredUpdates.length === 0 ? (

            <div className="club-updates-empty">

              <Bell size={38} />

              <h2>
                {updates.length === 0
                  ? "No updates yet"
                  : "No matching updates"}
              </h2>

              <p>
                {updates.length === 0
                  ? "Create your first announcement for students."
                  : "Try changing your search."}
              </p>

            </div>

          ) : (

            <div className="club-updates-list">

              {filteredUpdates.map((update) => (

                <article
                  className="club-update-item"
                  key={update.id}
                >

                  <div className="club-update-item-icon">
                    <Bell size={19} />
                  </div>

                  <div className="club-update-item-content">

                    <div className="club-update-item-top">

                      <div>

                        <h3>
                          {update.title}
                        </h3>

                        <span>
                          {formatDate(
                            update.createdAt
                          )}
                        </span>

                      </div>

                      <button
                        className="club-update-delete-btn"
                        onClick={() =>
                          handleDelete(
                            update.id
                          )
                        }
                        title="Delete update"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                    <p>
                      {update.message}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default ClubUpdates;