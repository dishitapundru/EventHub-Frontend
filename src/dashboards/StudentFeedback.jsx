import {
  MessageSquare,
  Star,
  Send,
  CalendarDays,
  Users,
  Bookmark,
  UserCircle,
  Bell,
  LogOut,
  LayoutDashboard,
  ClipboardCheck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./StudentFeedback.css";
import "./StudentDashboard.css";

function StudentFeedback() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // Load User
  // =========================

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    const loggedInUser = JSON.parse(userData);

    setUser(loggedInUser);

    loadRegistrations(loggedInUser.id);
  }, [navigate]);

  // =========================
  // Load Registrations
  // =========================

  const loadRegistrations = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/registrations/user/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load registrations"
        );
      }

      const registrationData =
        await response.json();

      setRegistrations(registrationData);

      const feedbackMap = {};

      for (const registration of registrationData) {
        try {
          const feedbackResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/feedback/registration/${registration.id}`
          );

          if (feedbackResponse.ok) {
            const existingFeedback =
              await feedbackResponse.json();

            if (existingFeedback) {
              feedbackMap[registration.id] =
                existingFeedback;
            }
          }
        } catch (feedbackError) {
          console.error(
            "Unable to load feedback:",
            feedbackError
          );
        }
      }

      setFeedback(feedbackMap);
    } catch (err) {
      console.error(
        "Registration loading error:",
        err
      );

      setError(
        err.message ||
          "Unable to load your registrations"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Select Rating
  // =========================

  const selectRating = (
    registrationId,
    rating
  ) => {
    setRatings((previous) => ({
      ...previous,
      [registrationId]: rating,
    }));
  };

  // =========================
  // Comment
  // =========================

  const handleCommentChange = (
    registrationId,
    value
  ) => {
    setComments((previous) => ({
      ...previous,
      [registrationId]: value,
    }));
  };

  // =========================
  // Submit Feedback
  // =========================

  const submitFeedback = async (
    registrationId
  ) => {
    const rating =
      ratings[registrationId];

    if (!rating) {
      setError(
        "Please select a rating before submitting."
      );

      setMessage("");

      return;
    }

    try {
      setSubmitting(registrationId);
      setError("");
      setMessage("");

      const comment =
        comments[registrationId] || "";

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/feedback?registrationId=${registrationId}&rating=${rating}&comment=${encodeURIComponent(
          comment
        )}`,
        {
          method: "POST",
        }
      );

      const result =
        await response.text();

      if (!response.ok) {
        throw new Error(
          result ||
            "Unable to submit feedback"
        );
      }

      const registration =
        registrations.find(
          (item) =>
            item.id === registrationId
        );

      setFeedback((previous) => ({
        ...previous,
        [registrationId]: {
          id: Date.now(),
          rating: rating,
          comment: comment,
          submittedAt:
            new Date().toISOString(),
          registration:
            registration,
        },
      }));

      setMessage(
        "Feedback submitted successfully!"
      );

      setRatings((previous) => ({
        ...previous,
        [registrationId]: 0,
      }));

      setComments((previous) => ({
        ...previous,
        [registrationId]: "",
      }));
    } catch (err) {
      console.error(
        "Feedback submission error:",
        err
      );

      setError(
        err.message ||
          "Unable to submit feedback"
      );

      setMessage("");
    } finally {
      setSubmitting(null);
    }
  };

  // =========================
  // Format Date
  // =========================

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

  // =========================
  // Render Stars
  // =========================

  const renderStars = (
    registrationId,
    existingRating
  ) => {
    const selectedRating =
      ratings[registrationId] || 0;

    const displayRating =
      selectedRating ||
      existingRating ||
      0;

    return (
      <div className="student-feedback-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={Boolean(existingRating)}
            className={
              star <= displayRating
                ? "selected"
                : ""
            }
            onClick={() =>
              selectRating(
                registrationId,
                star
              )
            }
          >
            <Star
              size={25}
              fill={
                star <= displayRating
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        ))}
      </div>
    );
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem("user");

    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="student-feedback-page">

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
            className="student-nav-item"
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
            className="student-nav-item active"
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

      <main className="student-feedback-main">

        {/* Header */}

        <header className="student-feedback-header">

          <div>

            <p className="student-feedback-small-title">
              Student Portal
            </p>

            <h1>
              Event Feedback
            </h1>

            <p>
              Share your experience and help
              clubs improve their events.
            </p>

          </div>

          {/* Profile */}

          <div className="student-profile">

            <div className="student-avatar">
              {user?.name
                ?.charAt(0)
                .toUpperCase() || "S"}
            </div>

            <div>

              <strong>
                {user?.name || "Student"}
              </strong>

              <span>
                Student
              </span>

            </div>

          </div>

        </header>

        {/* Alerts */}

        {error && (
          <div className="student-feedback-alert error">
            {error}
          </div>
        )}

        {message && (
          <div className="student-feedback-alert success">
            {message}
          </div>
        )}

        {/* Loading */}

        {loading ? (
          <div className="student-feedback-empty">

            <MessageSquare size={38} />

            <h2>
              Loading your events...
            </h2>

            <p>
              Please wait while we load your
              registered events.
            </p>

          </div>

        ) : registrations.length === 0 ? (

          /* No Registrations */

          <div className="student-feedback-empty">

            <CalendarDays size={42} />

            <h2>
              No registered events
            </h2>

            <p>
              Register for an event first
              to submit feedback.
            </p>

            <button
              onClick={() =>
                navigate("/events")
              }
            >
              Browse Events
            </button>

          </div>

        ) : (

          /* Feedback List */

          <section className="student-feedback-list">

            {registrations.map(
              (registration) => {

                const existingFeedback =
                  feedback[
                    registration.id
                  ];

                const event =
                  registration.event;

                return (
                  <article
                    className="student-feedback-card"
                    key={registration.id}
                  >

                    {/* Event Header */}

                    <div className="student-feedback-event-header">

                      <div>

                        <span className="student-feedback-label">
                          EVENT
                        </span>

                        <h2>
                          {event?.title ||
                            "Event unavailable"}
                        </h2>

                        <div className="student-feedback-event-meta">

                          <span>
                            <CalendarDays
                              size={14}
                            />

                            {formatDate(
                              event?.eventDate
                            )}
                          </span>

                          <span>
                            Registration #
                            {registration.id}
                          </span>

                        </div>

                      </div>

                      {existingFeedback && (
                        <span className="feedback-submitted-badge">
                          Submitted
                        </span>
                      )}

                    </div>

                    {/* Existing Feedback */}

                    {existingFeedback ? (

                      <div className="submitted-feedback">

                        <div className="submitted-rating">

                          {renderStars(
                            registration.id,
                            existingFeedback.rating
                          )}

                          <strong>
                            {
                              existingFeedback.rating
                            }
                            /5
                          </strong>

                        </div>

                        {existingFeedback.comment ? (

                          <div className="submitted-comment">
                            "{existingFeedback.comment}"
                          </div>

                        ) : (

                          <div className="submitted-no-comment">
                            No written comment
                            provided.
                          </div>

                        )}

                        <span className="submitted-date">
                          Submitted on{" "}
                          {formatDate(
                            existingFeedback.submittedAt
                          )}
                        </span>

                      </div>

                    ) : (

                      /* Feedback Form */

                      <div className="feedback-form">

                        <div className="rating-section">

                          <h3>
                            How was your
                            experience?
                          </h3>

                          <p>
                            Select a rating
                            from 1 to 5 stars.
                          </p>

                          {renderStars(
                            registration.id,
                            null
                          )}

                          <span className="rating-hint">
                            {ratings[
                              registration.id
                            ]
                              ? `${ratings[registration.id]} out of 5`
                              : "No rating selected"}
                          </span>

                        </div>

                        <div className="comment-section">

                          <label>
                            Your comments{" "}
                            <span>
                              (optional)
                            </span>
                          </label>

                          <textarea
                            rows="4"
                            placeholder="Tell us what you liked or what could be improved..."
                            value={
                              comments[
                                registration.id
                              ] || ""
                            }
                            onChange={(e) =>
                              handleCommentChange(
                                registration.id,
                                e.target.value
                              )
                            }
                          />

                        </div>

                        <button
                          className="submit-feedback-btn"
                          onClick={() =>
                            submitFeedback(
                              registration.id
                            )
                          }
                          disabled={
                            submitting ===
                            registration.id
                          }
                        >

                          <Send size={16} />

                          {submitting ===
                          registration.id
                            ? "Submitting..."
                            : "Submit Feedback"}

                        </button>

                      </div>
                    )}

                  </article>
                );
              }
            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default StudentFeedback;