
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

const API_URL = import.meta.env.VITE_API_URL;

function ClubProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [history, setHistory] = useState("");
  const [pastEvents, setPastEvents] = useState("");
  const [achievements, setAchievements] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const applyClubData = (data) => {
    setClub(data);
    setName(data.name ?? "");
    setCategory(data.category ?? "");
    setAbout(data.about ?? "");
    setHistory(data.history ?? "");
    setPastEvents(data.pastEvents ?? "");
    setAchievements(data.achievements ?? "");
  };

  // Load the logged-in user's club profile.
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    let loggedInUser;

    try {
      loggedInUser = JSON.parse(userData);
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (!loggedInUser?.id) {
      navigate("/login");
      return;
    }

    setUser(loggedInUser);

    const loadClubProfile = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(
          `${API_URL}/clubs/owner/${loggedInUser.id}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "No club profile was found for this account."
              : `Unable to load club profile (${response.status}).`
          );
        }

        const data = await response.json();

        applyClubData(data);
        setError("");
      } catch (err) {
        console.error("Error loading club profile:", err);
        setError(err.message || "Unable to load club profile.");
      } finally {
        setLoading(false);
      }
    };

    loadClubProfile();
  }, [navigate]);

  // Save the profile and verify it by fetching it again.
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Club name is required.");
      return;
    }

    if (!category.trim()) {
      setError("Please select a category.");
      return;
    }

    if (!user?.id || !club) {
      setError("Club profile is not available. Please reload the page.");
      return;
    }

    if (!API_URL) {
      setError("API URL is not configured.");
      return;
    }

    const payload = {
      name: name.trim(),
      category: category.trim(),
      about,
      history,
      pastEvents,
      achievements,
    };

    const profileUrl = `${API_URL}/clubs/owner/${user.id}`;

    setSaving(true);

    try {
      // Step 1: Send the profile update.
      const response = await fetch(profileUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText ||
            `Unable to save club profile (${response.status}).`
        );
      }

      // Step 2: Retrieve the profile from the backend again.
      const verifyResponse = await fetch(profileUrl, {
        cache: "no-store",
      });

      if (!verifyResponse.ok) {
        throw new Error(
          `Profile update was submitted, but verification failed (${verifyResponse.status}).`
        );
      }

      const savedClub = await verifyResponse.json();

      // Display the values actually returned by the backend.
      applyClubData(savedClub);

      // Step 3: Compare the saved values with the submitted values.
      const fieldsToCheck = [
        "name",
        "category",
        "about",
        "history",
        "pastEvents",
        "achievements",
      ];

      const mismatchedFields = fieldsToCheck.filter((field) => {
        return (
          String(savedClub[field] ?? "") !==
          String(payload[field] ?? "")
        );
      });

      if (mismatchedFields.length > 0) {
        setError(
          "The backend returned different values for: " +
            mismatchedFields.join(", ") +
            ". Please check the backend and database configuration."
        );
        return;
      }

      setMessage("Club profile saved and verified successfully!");
    } catch (err) {
      console.error("Error saving club profile:", err);

      setError(
        err.message || "Unable to save club profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderSidebar = () => (
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
          type="button"
          className="club-nav-item"
          onClick={() => navigate("/club")}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className="club-nav-item"
          onClick={() => navigate("/club/events")}
        >
          <CalendarDays size={19} />
          <span>My Events</span>
        </button>

        <button
          type="button"
          className="club-nav-item"
          onClick={() => navigate("/club/create-event")}
        >
          <Plus size={19} />
          <span>Create Event</span>
        </button>

        <button
          type="button"
          className="club-nav-item"
          onClick={() => navigate("/club/registrations")}
        >
          <Users size={19} />
          <span>Registrations</span>
        </button>

        <button
          type="button"
          className="club-nav-item"
          onClick={() => navigate("/club/attendance")}
        >
          <QrCode size={19} />
          <span>Attendance</span>
        </button>

        <button
          type="button"
          className="club-nav-item"
          onClick={() => navigate("/club/feedback")}
        >
          <MessageSquare size={19} />
          <span>Feedback</span>
        </button>

        <button
          type="button"
          className="club-nav-item"
          onClick={() => navigate("/club/updates")}
        >
          <Bell size={19} />
          <span>Updates</span>
        </button>
      </nav>

      <div className="club-sidebar-bottom">
        <button
          type="button"
          className="club-nav-item active"
          onClick={() => navigate("/club/profile")}
        >
          <UserCircle size={19} />
          <span>Club Profile</span>
        </button>

        <button
          type="button"
          className="club-nav-item club-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  if (loading) {
    return (
      <div className="club-profile-page">
        {renderSidebar()}
        <main className="club-profile-main">
          <div className="club-profile-loading">
            Loading club profile...
          </div>
        </main>
      </div>
    );
  }

  if (error && !club) {
    return (
      <div className="club-profile-page">
        {renderSidebar()}
        <main className="club-profile-main">
          <div className="club-profile-error">
            <Building2 size={30} />
            <h2>Club Profile Not Found</h2>
            <p>{error}</p>
            <button
              type="button"
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
      {renderSidebar()}

      <main className="club-profile-main">
        <header className="club-profile-header">
          <div>
            <p className="club-profile-label">CLUB MANAGEMENT</p>
            <h1>Club Profile</h1>
            <p>
              Manage your club information and introduce your club to
              students.
            </p>
          </div>

          <div className="club-profile-header-user">
            <div className="club-profile-user-avatar">
              <Building2 size={20} />
            </div>
            <div>
              <strong>{user?.name || "Club Owner"}</strong>
              <span>Club Account</span>
            </div>
          </div>
        </header>

        <div className="club-profile-content">
          <section className="club-profile-card">
            <div className="club-profile-card-heading">
              <div className="club-profile-icon">
                <Building2 size={25} />
              </div>

              <div>
                <h2>Club Information</h2>
                <p>
                  Add accurate information that students can see on your
                  club's public page.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="club-profile-field">
                <label htmlFor="club-name">Club Name</label>
                <input
                  id="club-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter club name"
                  required
                />
              </div>

              <div className="club-profile-field">
                <label htmlFor="club-category">Category</label>
                <select
                  id="club-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Literary">Literary</option>
                  <option value="Social">Social</option>
                  <option value="Arts">Arts</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="club-profile-field">
                <label htmlFor="club-about">About the Club</label>
                <textarea
                  id="club-about"
                  name="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Introduce your club, its purpose, and what members do."
                  rows={5}
                />
              </div>

              <div className="club-profile-field">
                <label htmlFor="club-history">Club History</label>
                <textarea
                  id="club-history"
                  name="history"
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  placeholder="Describe when and why the club was established."
                  rows={5}
                />
              </div>

              <div className="club-profile-field">
                <label htmlFor="club-past-events">Past Events</label>
                <textarea
                  id="club-past-events"
                  name="pastEvents"
                  value={pastEvents}
                  onChange={(e) => setPastEvents(e.target.value)}
                  placeholder={"Enter one past event per line.\nExample: Coding Workshop - 2026"}
                  rows={5}
                />
                <small>Enter each event on a separate line.</small>
              </div>

              <div className="club-profile-field">
                <label htmlFor="club-achievements">
                  Achievements &amp; Prizes
                </label>
                <textarea
                  id="club-achievements"
                  name="achievements"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder={"Enter one achievement per line.\nExample: First prize in a college competition"}
                  rows={5}
                />
                <small>Enter each achievement on a separate line.</small>
              </div>

              {error && (
                <div className="club-profile-message error" role="alert">
                  {error}
                </div>
              )}

              {message && (
                <div
                  className="club-profile-message success"
                  role="status"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="club-profile-save"
                disabled={saving}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          <section className="club-profile-side">
            <div className="club-profile-info-card">
              <div className="club-profile-info-icon">
                <Users size={22} />
              </div>
              <span>Total Members</span>
              <strong>{club?.members ?? 0}</strong>
              <p>Members currently associated with your club.</p>
            </div>

            <div className="club-profile-info-card">
              <div className="club-profile-info-icon">
                <ShieldCheck size={22} />
              </div>
              <span>Club Status</span>
              <strong className="club-status">
                {club?.status || "UNKNOWN"}
              </strong>
              <p>Your club's current platform status.</p>
            </div>

            <div className="club-profile-account">
              <span>Club Account</span>
              <strong>{user?.name || "Club Owner"}</strong>
              <p>{user?.email || ""}</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ClubProfile;
