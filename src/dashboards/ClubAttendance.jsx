import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  CheckCircle,
  ClipboardCheck,
  Search,
  UserRound,
  Filter,
} from "lucide-react";

import "./ClubAttendance.css";
import "./ClubDashboard.css";

function ClubAttendance() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [club, setClub] = useState(null);
  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const userData = localStorage.getItem("user");

      if (!userData) {
        navigate("/login");
        return;
      }

      const loggedInUser = JSON.parse(userData);

      setUser(loggedInUser);

      // GET CLUB
      const clubResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs/owner/${loggedInUser.id}`
      );

      if (!clubResponse.ok) {
        throw new Error("Club not found");
      }

      const clubData = await clubResponse.json();

      setClub(clubData);

      // GET CLUB REGISTRATIONS
      const registrationsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/registrations/club/${clubData.id}`
      );

      if (!registrationsResponse.ok) {
        throw new Error("Unable to load registrations");
      }

      const registrationData =
        await registrationsResponse.json();

      setRegistrations(registrationData);

      // GET ATTENDANCE
      const attendanceData = {};

      for (const registration of registrationData) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/attendance/registration/${registration.id}`
          );

          if (response.ok) {
            const data = await response.json();

            attendanceData[registration.id] =
              data ? data.attended : false;
          } else {
            attendanceData[registration.id] = false;
          }
        } catch (err) {
          console.error(
            "Unable to load attendance:",
            err
          );

          attendanceData[registration.id] = false;
        }
      }

      setAttendance(attendanceData);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // MARK ATTENDANCE
  const markAttendance = async (registrationId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/attendance/mark?registrationId=${registrationId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to mark attendance"
        );
      }

      setAttendance((previous) => ({
        ...previous,
        [registrationId]: true,
      }));

    } catch (err) {
      alert(err.message);
    }
  };

  // GET UNIQUE EVENTS
  const events = [];

  registrations.forEach((registration) => {
    const event = registration.event;

    if (
      event &&
      !events.some(
        (existingEvent) =>
          existingEvent.id === event.id
      )
    ) {
      events.push(event);
    }
  });

  // FILTER REGISTRATIONS
  const filteredRegistrations =
    registrations.filter((registration) => {

      const search =
        searchTerm.toLowerCase().trim();

      const studentName =
        registration.user?.name || "";

      const email =
        registration.user?.email || "";

      const rollNumber =
        registration.rollNumber || "";

      const department =
        registration.department || "";

      const year =
        registration.year || "";

      const section =
        registration.section || "";

      const eventTitle =
        registration.event?.title || "";

      const matchesSearch =
        studentName
          .toLowerCase()
          .includes(search) ||

        email
          .toLowerCase()
          .includes(search) ||

        rollNumber
          .toLowerCase()
          .includes(search) ||

        department
          .toLowerCase()
          .includes(search) ||

        year
          .toLowerCase()
          .includes(search) ||

        section
          .toLowerCase()
          .includes(search) ||

        eventTitle
          .toLowerCase()
          .includes(search);

      const matchesEvent =
        selectedEvent === "ALL" ||
        String(registration.event?.id) ===
          String(selectedEvent);

      return (
        matchesSearch &&
        matchesEvent
      );
    });

  // COUNTS
  const presentCount =
    filteredRegistrations.filter(
      (registration) =>
        attendance[registration.id]
    ).length;

  const notMarkedCount =
    Math.max(
      filteredRegistrations.length -
        presentCount,
      0
    );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="club-attendance-page">

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
            className="club-nav-item active"
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
          MAIN
      ================================== */}

      <main className="club-attendance-main">

        <header className="club-attendance-header">

          <div>

            <p className="club-attendance-label">
              CLUB MANAGEMENT
            </p>

            <h1>Attendance</h1>

            <p>
              Track and manage student attendance
              for your club events.
            </p>

          </div>

          <div className="club-attendance-header-user">

            <div className="club-attendance-user-avatar">
              <Building2 size={20} />
            </div>

            <div>
              <strong>{user?.name}</strong>
              <span>Club Account</span>
            </div>

          </div>

        </header>

        {loading ? (

          <div className="club-attendance-message">
            Loading attendance...
          </div>

        ) : error ? (

          <div className="club-attendance-message error">
            {error}
          </div>

        ) : (

          <>

            {/* =================================
                STATS
            ================================== */}

            <div className="attendance-stats">

              <div className="attendance-stat-card">

                <CalendarDays size={22} />

                <div>
                  <span>
                    Total Registrations
                  </span>

                  <strong>
                    {filteredRegistrations.length}
                  </strong>
                </div>

              </div>

              <div className="attendance-stat-card present">

                <CheckCircle size={22} />

                <div>
                  <span>Present</span>

                  <strong>
                    {presentCount}
                  </strong>
                </div>

              </div>

              <div className="attendance-stat-card remaining">

                <UserRound size={22} />

                <div>
                  <span>Not Marked</span>

                  <strong>
                    {notMarkedCount}
                  </strong>
                </div>

              </div>

            </div>

            {/* =================================
                TABLE
            ================================== */}

            <section className="attendance-table-card">

              <div className="attendance-table-header">

                <div>

                  <h2>
                    Student Attendance
                  </h2>

                  <p>
                    {club?.name || "Your Club"}
                  </p>

                </div>

                <div className="attendance-tools">

                  <div className="attendance-filter">

                    <Filter size={16} />

                    <select
                      value={selectedEvent}
                      onChange={(e) =>
                        setSelectedEvent(
                          e.target.value
                        )
                      }
                    >

                      <option value="ALL">
                        All Events
                      </option>

                      {events.map((event) => (

                        <option
                          key={event.id}
                          value={event.id}
                        >
                          {event.title}
                        </option>

                      ))}

                    </select>

                  </div>

                  <div className="attendance-search">

                    <Search size={17} />

                    <input
                      type="text"
                      placeholder="Search students, roll no..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              </div>

              {filteredRegistrations.length === 0 ? (

                <div className="attendance-empty">

                  <ClipboardCheck size={42} />

                  <h3>

                    {registrations.length === 0
                      ? "No registrations yet"
                      : "No matching students"}

                  </h3>

                  <p>

                    {registrations.length === 0
                      ? "Students who register for your events will appear here."
                      : "Try a different search or event filter."}

                  </p>

                </div>

              ) : (

                <div className="attendance-table-wrapper">

                  <table className="attendance-table">

                    <thead>

                      <tr>

                        <th>Student</th>
                        <th>Roll Number</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Event</th>
                        <th>Status</th>
                        <th>Action</th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredRegistrations.map(
                        (registration) => {

                          const isPresent =
                            attendance[
                              registration.id
                            ];

                          return (

                            <tr
                              key={
                                registration.id
                              }
                            >

                              <td>

                                <div className="attendance-student">

                                  <div className="student-avatar">

                                    <UserRound
                                      size={17}
                                    />

                                  </div>

                                  <div>

                                    <strong>
                                      {registration.user?.name ||
                                        "Student"}
                                    </strong>

                                    <span>
                                      {registration.user?.email ||
                                        ""}
                                    </span>

                                  </div>

                                </div>

                              </td>

                              <td>
                                {registration.rollNumber ||
                                  "-"}
                              </td>

                              <td>
                                {registration.department ||
                                  "-"}
                              </td>

                              <td>

                                {registration.year ||
                                  "-"}

                                {" "}

                                {registration.section ||
                                  ""}

                              </td>

                              <td>

                                <div className="attendance-event">

                                  <CalendarDays
                                    size={15}
                                  />

                                  {registration.event
                                    ?.title ||
                                    "Event"}

                                </div>

                              </td>

                              <td>

                                <span
                                  className={
                                    isPresent
                                      ? "attendance-status present"
                                      : "attendance-status pending"
                                  }
                                >

                                  {isPresent
                                    ? "Present"
                                    : "Not Marked"}

                                </span>

                              </td>

                              <td>

                                <button
                                  className={
                                    isPresent
                                      ? "attendance-action marked"
                                      : "attendance-action"
                                  }
                                  onClick={() =>
                                    markAttendance(
                                      registration.id
                                    )
                                  }
                                  disabled={
                                    isPresent
                                  }
                                >

                                  <CheckCircle
                                    size={15}
                                  />

                                  {isPresent
                                    ? "Marked"
                                    : "Mark Present"}

                                </button>

                              </td>

                            </tr>

                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </>

        )}

      </main>

    </div>
  );
}

export default ClubAttendance;