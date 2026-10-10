import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  MapPin,
  CheckCircle,
  ClipboardList,
  Users,
  Bookmark,
  UserCircle,
  Bell,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";

import "./MyRegistrations.css";
import "../dashboards/StudentDashboard.css";

function MyRegistrations() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load Registrations
  // =========================

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchRegistrations = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/registrations/user/${user.id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load registrations"
          );
        }

        const data = await response.json();

        setRegistrations(data);
      } catch (error) {
        console.error(
          "Registration loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [navigate, user?.id]);

  // =========================
  // Format Date
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="student-dashboard">

      {/* =========================
          SIDEBAR
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
            className="student-nav-item active"
            onClick={() =>
              navigate("/my-registrations")
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
              navigate("/notifications")
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
            className="student-nav-item"
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
          MAIN CONTENT
      ========================= */}

      <main className="student-main">

        <div className="my-registrations-page">

          <div className="my-registrations-container">

            {/* Header */}

            <div className="my-registrations-header">

              <div className="registrations-title-icon">
                <ClipboardList size={25} />
              </div>

              <div>

                <h1>
                  My Registrations
                </h1>

                <p>
                  View all the events you
                  have registered for.
                </p>

              </div>

            </div>

            {/* Loading */}

            {loading && (
              <div className="registrations-empty">

                <p>
                  Loading your
                  registrations...
                </p>

              </div>
            )}

            {/* No registrations */}

            {!loading &&
              registrations.length === 0 && (
                <div className="registrations-empty">

                  <div className="empty-icon">
                    <CalendarDays size={35} />
                  </div>

                  <h2>
                    No registrations yet
                  </h2>

                  <p>
                    You haven't registered
                    for any events yet.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/events")
                    }
                  >
                    Browse Events
                  </button>

                </div>
              )}

            {/* Registrations */}

            {!loading &&
              registrations.length > 0 && (
                <div className="registrations-grid">

                  {registrations.map(
                    (registration) => {

                      const event =
                        registration.event;

                      return (
                        <div
                          className="registration-event-card"
                          key={registration.id}
                        >

                          {/* Card Top */}

                          <div className="registration-card-top">

                            <div className="registration-event-icon">

                              <CalendarDays
                                size={22}
                              />

                            </div>

                            <span className="registered-badge">

                              <CheckCircle
                                size={15}
                              />

                              Registered

                            </span>

                          </div>

                          {/* Event Title */}

                          <h2>
                            {event?.title ||
                              "Event no longer available"}
                          </h2>

                          {/* Date */}

                          <div className="registration-event-detail">

                            <CalendarDays
                              size={17}
                            />

                            <span>
                              {formatDate(
                                event?.eventDate
                              )}
                            </span>

                          </div>

                          {/* Location */}

                          <div className="registration-event-detail">

                            <MapPin
                              size={17}
                            />

                            <span>
                              {event?.location ||
                                "Location not available"}
                            </span>

                          </div>

                          {/* Student Information */}

                          <div className="registration-student-info">

                            <div>

                              <span>
                                Roll Number
                              </span>

                              <strong>
                                {registration.rollNumber}
                              </strong>

                            </div>

                            <div>

                              <span>
                                Department
                              </span>

                              <strong>
                                {registration.department}
                              </strong>

                            </div>

                            <div>

                              <span>
                                Year
                              </span>

                              <strong>
                                {registration.year}
                              </strong>

                            </div>

                            <div>

                              <span>
                                Section
                              </span>

                              <strong>
                                {registration.section}
                              </strong>

                            </div>

                          </div>

                          {/* View Event */}

                          {event?.id && (
                            <button
                              className="view-registration-event"
                              onClick={() =>
                                navigate(
                                  `/events/${event.id}`
                                )
                              }
                            >
                              View Event
                            </button>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default MyRegistrations;