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
  Globe,
  Plus,
  Star,
  Search,
  UserRound,
  Filter,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClubFeedback.css";
import "./ClubDashboard.css";

function ClubFeedback() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);
  const [feedback, setFeedback] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] =
    useState("ALL");

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

    loadFeedback(loggedInUser.id);
  }, [navigate]);

  const loadFeedback = async (userId) => {
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

      const feedbackResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/feedback/club/${clubData.id}`
      );

      if (!feedbackResponse.ok) {
        throw new Error("Unable to load feedback");
      }

      const feedbackData =
        await feedbackResponse.json();

      setFeedback(feedbackData);

    } catch (err) {
      console.error(
        "Feedback loading error:",
        err
      );

      setError(
        err.message || "Unable to load feedback"
      );

    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {

      const registration = item.registration;
      const student = registration?.user;
      const event = registration?.event;

      const searchText = [
        student?.name,
        student?.email,
        registration?.rollNumber,
        registration?.department,
        event?.title,
        item.comment,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchText.includes(
          searchTerm.toLowerCase()
        );

      const matchesRating =
        selectedRating === "ALL" ||
        String(item.rating) === selectedRating;

      return matchesSearch && matchesRating;
    });
  }, [
    feedback,
    searchTerm,
    selectedRating,
  ]);

  const totalReviews = feedback.length;

  const averageRating =
    totalReviews === 0
      ? "0.0"
      : (
          feedback.reduce(
            (sum, item) =>
              sum + Number(item.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1);

  const fiveStarCount = feedback.filter(
    (item) => Number(item.rating) === 5
  ).length;

  const fourPlusCount = feedback.filter(
    (item) => Number(item.rating) >= 4
  ).length;

  const renderStars = (rating) => {
    return (
      <div className="feedback-stars">

        {[1, 2, 3, 4, 5].map((star) => (

          <Star
            key={star}
            size={16}
            fill={
              star <= rating
                ? "currentColor"
                : "none"
            }
          />

        ))}

      </div>
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    return new Date(
      dateValue
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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
    <div className="club-feedback-page">

      {/* =================================
          SIDEBAR
      ================================== */}

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
            className="club-nav-item active"
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

      {/* =================================
          MAIN
      ================================== */}

      <main className="club-feedback-main">

        <header className="club-feedback-header">

          <div>

            <p className="club-feedback-label">
              CLUB MANAGEMENT
            </p>

            <h1>Student Feedback</h1>

            <p>
              Review what students think about
              your events.
            </p>

          </div>

          <div className="club-feedback-header-user">

            <div className="club-feedback-user-avatar">
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
          <div className="club-feedback-error">
            {error}
          </div>
        )}

        {/* =================================
            STATS
        ================================== */}

        <section className="feedback-stats">

          <div className="feedback-stat-card">

            <div className="feedback-stat-icon">
              <MessageSquare size={20} />
            </div>

            <div>

              <span>Total Reviews</span>

              <strong>
                {totalReviews}
              </strong>

            </div>

          </div>

          <div className="feedback-stat-card">

            <div className="feedback-stat-icon">
              <Star size={20} />
            </div>

            <div>

              <span>Average Rating</span>

              <strong>
                {averageRating}
              </strong>

            </div>

          </div>

          <div className="feedback-stat-card">

            <div className="feedback-stat-icon">
              <Star size={20} />
            </div>

            <div>

              <span>5 Star Reviews</span>

              <strong>
                {fiveStarCount}
              </strong>

            </div>

          </div>

          <div className="feedback-stat-card">

            <div className="feedback-stat-icon">
              <UserRound size={20} />
            </div>

            <div>

              <span>4+ Star Reviews</span>

              <strong>
                {fourPlusCount}
              </strong>

            </div>

          </div>

        </section>

        {/* =================================
            FEEDBACK CARD
        ================================== */}

        <section className="club-feedback-card">

          <div className="feedback-card-header">

            <div>

              <h2>Event Reviews</h2>

              <p>
                Feedback received from students
                registered for your events.
              </p>

            </div>

            <div className="feedback-count">

              {filteredFeedback.length}{" "}

              {filteredFeedback.length === 1
                ? "Review"
                : "Reviews"}

            </div>

          </div>

          {/* TOOLS */}

          <div className="feedback-tools">

            <div className="feedback-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search student, event, comment..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

            <div className="feedback-filter">

              <Filter size={16} />

              <select
                value={selectedRating}
                onChange={(e) =>
                  setSelectedRating(
                    e.target.value
                  )
                }
              >

                <option value="ALL">
                  All Ratings
                </option>

                <option value="5">
                  5 Stars
                </option>

                <option value="4">
                  4 Stars
                </option>

                <option value="3">
                  3 Stars
                </option>

                <option value="2">
                  2 Stars
                </option>

                <option value="1">
                  1 Star
                </option>

              </select>

            </div>

          </div>

          {/* CONTENT */}

          {loading ? (

            <div className="club-feedback-empty">

              <MessageSquare size={34} />

              <h2>
                Loading feedback...
              </h2>

              <p>
                Please wait while we load
                student reviews.
              </p>

            </div>

          ) : filteredFeedback.length === 0 ? (

            <div className="club-feedback-empty">

              <MessageSquare size={38} />

              <h2>

                {feedback.length === 0
                  ? "No feedback yet"
                  : "No matching feedback"}

              </h2>

              <p>

                {feedback.length === 0
                  ? "Student feedback will appear here after they submit reviews."
                  : "Try changing your search or rating filter."}

              </p>

            </div>

          ) : (

            <div className="feedback-list">

              {filteredFeedback.map((item) => {

                const registration =
                  item.registration;

                const student =
                  registration?.user;

                const event =
                  registration?.event;

                return (

                  <article
                    className="feedback-item"
                    key={item.id}
                  >

                    <div className="feedback-item-top">

                      <div className="feedback-student">

                        <div className="feedback-avatar">
                          <UserRound size={19} />
                        </div>

                        <div>

                          <h3>
                            {student?.name ||
                              "Unknown Student"}
                          </h3>

                          <span>
                            {student?.email ||
                              "Email unavailable"}
                          </span>

                        </div>

                      </div>

                      <div className="feedback-rating">

                        {renderStars(item.rating)}

                        <strong>
                          {item.rating}/5
                        </strong>

                      </div>

                    </div>

                    <div className="feedback-event">

                      <CalendarDays size={16} />

                      <span>
                        {event?.title ||
                          "Event unavailable"}
                      </span>

                    </div>

                    {item.comment ? (

                      <div className="feedback-comment">

                        <p>
                          "{item.comment}"
                        </p>

                      </div>

                    ) : (

                      <div className="feedback-no-comment">
                        No written comment provided.
                      </div>

                    )}

                    <div className="feedback-item-bottom">

                      <span>
                        Roll No:{" "}
                        {registration?.rollNumber ||
                          "Not available"}
                      </span>

                      <span>
                        {registration?.department ||
                          "Department unavailable"}
                      </span>

                      <span>
                        Submitted:{" "}
                        {formatDate(
                          item.submittedAt
                        )}
                      </span>

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default ClubFeedback;