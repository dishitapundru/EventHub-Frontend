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
  ClipboardList,
  UserRound,
  Phone,
  GraduationCap,
  Hash,
  Search,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClubRegistrations.css";
import "./ClubDashboard.css";

function ClubRegistrations() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [club, setClub] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

        return fetch(
          `${import.meta.env.VITE_API_URL}/registrations/club/${clubData.id}`
        );
      })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load registrations");
        }

        return response.json();
      })
      .then((registrationData) => {
        setRegistrations(registrationData);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load registrations");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const filteredRegistrations = registrations.filter(
    (registration) => {
      const search = searchTerm.toLowerCase().trim();

      return (
        registration.user?.name
          ?.toLowerCase()
          .includes(search) ||

        registration.user?.email
          ?.toLowerCase()
          .includes(search) ||

        registration.rollNumber
          ?.toLowerCase()
          .includes(search) ||

        registration.department
          ?.toLowerCase()
          .includes(search) ||

        registration.year
          ?.toLowerCase()
          .includes(search) ||

        registration.section
          ?.toLowerCase()
          .includes(search) ||

        registration.event?.title
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="club-registrations-page">

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

        <main className="club-registrations-main">

          <div className="club-registrations-loading">
            Loading registrations...
          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="club-registrations-page">

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
            onClick={() => navigate("/club/events")}
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
            className="club-nav-item active"
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

      {/* =================================
          MAIN CONTENT
      ================================== */}

      <main className="club-registrations-main">

        <header className="club-registrations-header">

          <div>

            <p className="club-registrations-label">
              CLUB MANAGEMENT
            </p>

            <h1>Registrations</h1>

            <p>
              Students registered for{" "}
              <strong>{club?.name}</strong>
            </p>

          </div>

          <div className="registration-count-card">

            <div className="registration-count-icon">
              <Users size={22} />
            </div>

            <div>
              <span>Total Registrations</span>

              <strong>
                {registrations.length}
              </strong>
            </div>

          </div>

        </header>

        {/* Error */}

        {error && (
          <div className="club-registrations-error">
            {error}
          </div>
        )}

        {/* Empty State */}

        {!error && registrations.length === 0 && (

          <div className="club-registrations-empty">

            <div className="empty-icon">
              <ClipboardList size={42} />
            </div>

            <h2>No Registrations Yet</h2>

            <p>
              Students who register for your events
              will appear here.
            </p>

            <button
              onClick={() =>
                navigate("/club/events")
              }
            >
              View My Events
            </button>

          </div>

        )}

        {/* Registrations */}

        {registrations.length > 0 && (

          <div className="registrations-table-card">

            <div className="table-header">

              <div>

                <h2>Registered Students</h2>

                <p>
                  View students registered for your
                  club events.
                </p>

              </div>

              <div className="registration-tools">

                <div className="registration-search">

                  <Search size={17} />

                  <input
                    type="text"
                    placeholder="Search students, roll no, event..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                  />

                </div>

                <div className="table-total">

                  {filteredRegistrations.length}{" "}

                  {filteredRegistrations.length === 1
                    ? "Student"
                    : "Students"}

                </div>

              </div>

            </div>

            {/* No Search Results */}

            {filteredRegistrations.length === 0 ? (

              <div className="registration-no-results">

                <Search size={32} />

                <h3>No students found</h3>

                <p>
                  Try searching with a different name,
                  roll number, department, or event.
                </p>

              </div>

            ) : (

              <div className="registrations-table-wrapper">

                <table className="registrations-table">

                  <thead>

                    <tr>

                      <th>
                        <UserRound size={15} />
                        Student
                      </th>

                      <th>
                        <CalendarDays size={15} />
                        Event
                      </th>

                      <th>
                        <Hash size={15} />
                        Roll Number
                      </th>

                      <th>
                        <GraduationCap size={15} />
                        Department
                      </th>

                      <th>
                        Year
                      </th>

                      <th>
                        Section
                      </th>

                      <th>
                        <Phone size={15} />
                        Phone
                      </th>

                      <th>
                        Registered On
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredRegistrations.map(
                      (registration) => (

                        <tr
                          key={registration.id}
                        >

                          {/* Student */}

                          <td>

                            <div className="student-cell">

                              <div className="student-avatar">

                                {registration.user?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "S"}

                              </div>

                              <div>

                                <strong>
                                  {registration.user?.name ||
                                    "Unknown Student"}
                                </strong>

                                <span>
                                  {registration.user?.email ||
                                    "-"}
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* Event */}

                          <td>

                            <span className="event-name">
                              {registration.event?.title ||
                                "Unknown Event"}
                            </span>

                          </td>

                          {/* Roll Number */}

                          <td>
                            {registration.rollNumber || "-"}
                          </td>

                          {/* Department */}

                          <td>
                            {registration.department || "-"}
                          </td>

                          {/* Year */}

                          <td>
                            {registration.year || "-"}
                          </td>

                          {/* Section */}

                          <td>
                            {registration.section || "-"}
                          </td>

                          {/* Phone */}

                          <td>
                            {registration.phoneNumber || "-"}
                          </td>

                          {/* Registered On */}

                          <td>

                            {registration.registeredAt
                              ? new Date(
                                  registration.registeredAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "-"}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default ClubRegistrations;