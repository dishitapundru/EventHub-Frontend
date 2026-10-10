
import { useNavigate } from "react-router-dom";
import {
  Users,
  Code2,
  Brain,
  Palette,
  Trophy,
  Music,
  Plus,
  CheckCircle,
  LogOut,
  CalendarDays,
  Bookmark,
  UserCircle,
  Bell,
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";

import "./MyClubs.css";
import "../dashboards/StudentDashboard.css";

const categoryIcons = {
  technology: Code2,
  "artificial intelligence": Brain,
  design: Palette,
  sports: Trophy,
  "arts & culture": Music,
};

function getClubIcon(category) {
  return (
    categoryIcons[String(category ?? "").toLowerCase()] ||
    Users
  );
}

function MyClubs() {
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load clubs joined in this browser.
    try {
      const savedClubs = JSON.parse(
        localStorage.getItem("joinedClubs") || "[]"
      );

      setJoinedClubs(
        Array.isArray(savedClubs) ? savedClubs : []
      );
    } catch {
      setJoinedClubs([]);
    }

    let isMounted = true;

    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          throw new Error("VITE_API_URL is not configured.");
        }

        const response = await fetch(
          `${apiUrl.replace(/\/$/, "")}/clubs`
        );

        if (!response.ok) {
          throw new Error(
            `Unable to fetch clubs (${response.status}).`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "The backend returned an unexpected clubs response."
          );
        }

        // Show active clubs from the backend.
        const activeClubs = data.filter(
          (club) =>
            String(club.status ?? "").toUpperCase() === "ACTIVE"
        );

        if (isMounted) {
          setClubs(activeClubs);
        }
      } catch (err) {
        console.error("Error fetching clubs:", err);

        if (isMounted) {
          setClubs([]);
          setError(
            "Unable to load clubs. Please check that the backend is running and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClubs();

    return () => {
      isMounted = false;
    };
  }, []);

  const isJoined = (clubId) =>
    joinedClubs.some(
      (id) => String(id) === String(clubId)
    );

  const handleLeaveClub = (clubId) => {
    const updatedClubs = joinedClubs.filter(
      (id) => String(id) !== String(clubId)
    );

    setJoinedClubs(updatedClubs);

    localStorage.setItem(
      "joinedClubs",
      JSON.stringify(updatedClubs)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
            className="student-nav-item"
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
            className="student-nav-item active"
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

        <button
          className="student-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="student-main">
        <div className="my-clubs-page">
          <div className="my-clubs-container">
            <div className="my-clubs-header">
              <div className="clubs-title-icon">
                <Users size={25} />
              </div>

              <div>
                <h1>My Clubs</h1>
                <p>
                  Discover and connect with student clubs
                  at EventHub.
                </p>
              </div>
            </div>

            <div className="clubs-summary">
              <div className="clubs-summary-icon">
                <Users size={22} />
              </div>

              <div>
                <strong>{joinedClubs.length}</strong>
                <span>Clubs Joined</span>
              </div>
            </div>

            {joinedClubs.length > 0 && (
              <section className="joined-clubs-section">
                <div className="clubs-section-heading">
                  <div>
                    <h2>My Joined Clubs</h2>
                    <p>
                      Clubs selected as joined on this browser.
                    </p>
                  </div>
                </div>

                <div className="joined-clubs-list">
                  {clubs
                    .filter((club) => isJoined(club.id))
                    .map((club) => {
                      const Icon = getClubIcon(club.category);

                      return (
                        <div
                          className="joined-club-card"
                          key={club.id}
                        >
                          <div className="joined-club-icon">
                            <Icon size={21} />
                          </div>

                          <div className="joined-club-info">
                            <strong>{club.name}</strong>
                            <span>
                              {club.category || "General"}
                            </span>
                          </div>

                          <div className="joined-status">
                            <CheckCircle size={16} />
                            Joined
                          </div>

                          <button
                            className="joined-leave-button"
                            onClick={() =>
                              handleLeaveClub(club.id)
                            }
                          >
                            <LogOut size={15} />
                            Leave
                          </button>

                          <button
                            className="club-view-button"
                            onClick={() =>
                              navigate(`/clubs/${club.id}`)
                            }
                          >
                            View Club
                          </button>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            <section className="available-clubs-section">
              <div className="clubs-section-heading">
                <div>
                  <h2>Explore Clubs</h2>
                  <p>
                    Find a club that matches your interests.
                  </p>
                </div>

                <span className="club-count">
                  {clubs.length} Clubs
                </span>
              </div>

              {loading ? (
                <div className="clubs-empty-state">
                  <RefreshCw size={25} />
                  <p>Loading clubs from EventHub...</p>
                </div>
              ) : error ? (
                <div className="clubs-empty-state">
                  <p>{error}</p>

                  <button
                    className="club-view-button"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                </div>
              ) : clubs.length === 0 ? (
                <div className="clubs-empty-state">
                  <Users size={30} />
                  <h3>No active clubs available</h3>
                  <p>
                    Approved clubs will appear here when
                    they are available.
                  </p>
                </div>
              ) : (
                <div className="clubs-grid">
                  {clubs.map((club) => {
                    const Icon = getClubIcon(club.category);
                    const joined = isJoined(club.id);

                    // Use the saved About field first.
                    const description =
                      club.about?.trim() ||
                      club.description?.trim() ||
                      "No club description added yet.";

                    return (
                      <div
                        className="club-card"
                        key={club.id}
                      >
                        <div className="club-card-top">
                          <div className="club-icon">
                            <Icon size={24} />
                          </div>

                          <span className="club-members">
                            <Users size={14} />
                            {club.membersCount ??
                              club.memberCount ??
                              club.members?.length ??
                              0}{" "}
                            members
                          </span>
                        </div>

                        <h2>{club.name}</h2>

                        <span className="club-category">
                          {club.category || "General"}
                        </span>

                        <p>{description}</p>

                        <div className="club-actions">
                          <button
                            className="club-view-button"
                            onClick={() =>
                              navigate(`/clubs/${club.id}`)
                            }
                          >
                            View Club
                          </button>

                          {joined ? (
                            <button
                              className="club-leave-button"
                              onClick={() =>
                                handleLeaveClub(club.id)
                              }
                            >
                              <LogOut size={16} />
                              Leave
                            </button>
                          ) : (
                            <button
                              className="club-join-button"
                              onClick={() =>
                                navigate(
                                  `/clubs/${club.id}/join`
                                )
                              }
                            >
                              <Plus size={17} />
                              Join Club
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyClubs;
