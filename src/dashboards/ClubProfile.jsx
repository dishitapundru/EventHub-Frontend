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
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClubProfile.css";
import "./ClubDashboard.css";

function ClubProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
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
      .then((data) => {
        setClub(data);
        setName(data.name || "");
        setCategory(data.category || "");
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load club profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Club name is required");
      return;
    }

    if (!category.trim()) {
      setError("Category is required");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs/owner/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            category: category.trim(),
            members: club.members,
            status: club.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedClub = await response.json();

      setClub(updatedClub);
      setName(updatedClub.name);
      setCategory(updatedClub.category);

      setMessage("Club profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Unable to update club profile");
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
      <div className="club-profile-page">
        <div className="club-profile-loading">
          Loading club profile...
        </div>
      </div>
    );
  }

  if (error && !club) {
    return (
      <div className="club-profile-page">

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
              className="club-nav-item active"
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

        <main className="club-profile-main">

          <div className="club-profile-error">

            <Building2 size={30} />

            <h2>Club Profile Not Found</h2>

            <p>{error}</p>

            <button
              onClick={() => navigate("/club")}
              className="club-profile-error-button"
            >
              Back to Dashboard
            </button>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="club-profile-page">

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
            className="club-nav-item active"
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

      <main className="club-profile-main">

        {/* Header */}

        <header className="club-profile-header">

          <div>

            <p className="club-profile-label">
              CLUB MANAGEMENT
            </p>

            <h1>Club Profile</h1>

            <p>
              Manage your club information and account details.
            </p>

          </div>

          <div className="club-profile-header-user">

            <div className="club-profile-user-avatar">
              <Building2 size={20} />
            </div>

            <div>
              <strong>{user?.name}</strong>
              <span>Club Account</span>
            </div>

          </div>

        </header>

        {/* Content */}

        <div className="club-profile-content">

          {/* Club Information */}

          <section className="club-profile-card">

            <div className="club-profile-card-heading">

              <div className="club-profile-icon">
                <Building2 size={25} />
              </div>

              <div>

                <h2>Club Information</h2>

                <p>
                  Update the basic information about your club.
                </p>

              </div>

            </div>

            <form onSubmit={handleSave}>

              <div className="club-profile-field">

                <label>Club Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter club name"
                />

              </div>

              <div className="club-profile-field">

                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Technical">
                    Technical
                  </option>

                  <option value="Cultural">
                    Cultural
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Literary">
                    Literary
                  </option>

                  <option value="Social">
                    Social
                  </option>

                  <option value="Arts">
                    Arts
                  </option>

                  <option value="General">
                    General
                  </option>

                </select>

              </div>

              {error && (
                <div className="club-profile-message error">
                  {error}
                </div>
              )}

              {message && (
                <div className="club-profile-message success">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="club-profile-save"
                disabled={saving}
              >

                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </form>

          </section>

          {/* Side Information */}

          <section className="club-profile-side">

            <div className="club-profile-info-card">

              <div className="club-profile-info-icon">
                <Users size={22} />
              </div>

              <span>Total Members</span>

              <strong>
                {club?.members ?? 0}
              </strong>

              <p>
                Members currently associated with your club.
              </p>

            </div>

            <div className="club-profile-info-card">

              <div className="club-profile-info-icon">
                <ShieldCheck size={22} />
              </div>

              <span>Club Status</span>

              <strong className="club-status">
                {club?.status || "ACTIVE"}
              </strong>

              <p>
                Your club's current platform status.
              </p>

            </div>

            <div className="club-profile-account">

              <span>Club Account</span>

              <strong>
                {user?.name}
              </strong>

              <p>
                {user?.email}
              </p>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default ClubProfile;