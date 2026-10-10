import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Users,
  Bookmark,
  UserCircle,
  Bell,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./StudentAttendance.css";

function StudentAttendance() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/registrations/user/${user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch registrations");
        }

        const data = await response.json();

        setRegistrations(data);

        const attendanceData = {};

        for (const registration of data) {
          try {
            const attendanceResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/attendance/registration/${registration.id}`
            );

            if (attendanceResponse.ok) {
              const result = await attendanceResponse.json();

              attendanceData[registration.id] = result;
            }
          } catch (error) {
            console.error(
              "Attendance fetch error:",
              error
            );
          }
        }

        setAttendance(attendanceData);
      } catch (error) {
        console.error(
          "Student attendance error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="student-attendance-page">

      {/* Sidebar */}

      <aside className="student-sidebar">

        <div className="student-brand">

          <div className="student-brand-icon">
            <LayoutDashboard size={21} />
          </div>

          <span>EventHub</span>

        </div>

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
            className="student-nav-item active"
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

      {/* Main Content */}

      <main className="student-attendance-main">

        <header className="student-attendance-header">

          <div>

            <p className="student-attendance-small-title">
              Student Portal
            </p>

            <h1>
              Attendance
            </h1>

            <p>
              Track your attendance for registered
              campus events.
            </p>

          </div>

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

        <section className="attendance-content">

          {loading ? (
            <div className="attendance-empty">

              <ClipboardCheck size={40} />

              <h2>
                Loading attendance...
              </h2>

              <p>
                Please wait while we fetch your
                attendance records.
              </p>

            </div>

          ) : registrations.length === 0 ? (

            <div className="attendance-empty">

              <ClipboardCheck size={45} />

              <h2>
                No Registered Events
              </h2>

              <p>
                Register for an event to see your
                attendance here.
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

            <div className="attendance-list">

              {registrations.map((registration) => {

                const event =
                  registration.event;

                const record =
                  attendance[registration.id];

                const attended =
                  record?.attended === true;

                return (
                  <div
                    className="attendance-card"
                    key={registration.id}
                  >

                    <div className="attendance-icon">
                      <ClipboardCheck size={24} />
                    </div>

                    <div className="attendance-info">

                      <h2>
                        {event?.title ||
                          "Event"}
                      </h2>

                      <p>
                        {event?.location ||
                          "Campus Event"}
                      </p>

                      <span>
                        Registration ID:{" "}
                        {registration.id}
                      </span>

                    </div>

                    <div
                      className={
                        attended
                          ? "attendance-status present"
                          : "attendance-status pending"
                      }
                    >
                      {attended
                        ? "Present"
                        : "Not Marked"}
                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default StudentAttendance;