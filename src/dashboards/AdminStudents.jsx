
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  Bell,
  UserCircle,
  LogOut,
  Search,
  Eye,
  Trash2,
  GraduationCap,
} from "lucide-react";
import "./AdminStudents.css";

function AdminStudents() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    loadStudents();
  }, [navigate, user?.role]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error("VITE_API_URL is not configured.");
      }

      const response = await fetch(`${apiUrl}/students`);

      if (!response.ok) {
        throw new Error(
          `Failed to load students (${response.status}).`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected student data returned by the server.");
      }

      console.log("Student API response:", data);

      const formattedStudents = data.map((student) => ({
        id: student.id,
        name: student.name || "Unnamed Student",
        email: student.email || "No email",
        department:
          student.department?.trim() || "Not provided",
        year: student.year?.trim() || "Not provided",
        status: student.status || "Active",
      }));

      setStudents(formattedStudents);
    } catch (error) {
      console.error("Student loading error:", error);
      setLoadError(error.message || "Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const deleteStudent = async (id) => {
    const student = students.find(
      (currentStudent) => currentStudent.id === id
    );

    const confirmed = window.confirm(
      `Are you sure you want to remove "${student?.name}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/students/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student.");
      }

      setStudents((currentStudents) =>
        currentStudents.filter(
          (currentStudent) => currentStudent.id !== id
        )
      );

      alert("Student deleted successfully.");
    } catch (error) {
      console.error("Student deletion error:", error);
      alert("Failed to delete student.");
    }
  };

  const viewStudent = (student) => {
    alert(
      `Student Details\n\n` +
        `Name: ${student.name}\n` +
        `Email: ${student.email}\n` +
        `Department: ${student.department}\n` +
        `Year: ${student.year}\n` +
        `Status: ${student.status}`
    );
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.department} ${student.year}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-module-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">✦</div>
          <div>
            <span>EventHub</span>
            <small>ADMIN PANEL</small>
          </div>
        </div>

        <div className="admin-menu-title">MAIN MENU</div>

        <nav className="admin-nav">
          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin")}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/events")}
          >
            <CalendarDays size={19} />
            <span>Manage Events</span>
          </button>

          <button className="admin-nav-item active">
            <Users size={19} />
            <span>Students</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/clubs")}
          >
            <Building2 size={19} />
            <span>Manage Clubs</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/notifications")}
          >
            <Bell size={19} />
            <span>Notifications</span>
          </button>
        </nav>

        <div className="admin-menu-title admin-secondary-title">
          ACCOUNT
        </div>

        <nav className="admin-nav">
          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/profile")}
          >
            <UserCircle size={19} />
            <span>My Profile</span>
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="admin-user-info">
              <strong>{user?.name || "EventHub Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-module-main">
        <header className="admin-module-header">
          <div>
            <span className="admin-module-kicker">
              STUDENT MANAGEMENT
            </span>
            <h1>Students</h1>
            <p>
              View and manage students registered on EventHub.
            </p>
          </div>

          <div className="admin-header-count">
            <Users size={19} />
            <strong>{students.length}</strong>
            <span>Students</span>
          </div>
        </header>

        <section className="admin-module-card">
          <div className="admin-card-toolbar">
            <div>
              <h2>Registered Students</h2>
              <span>
                Manage student accounts and information
              </span>
            </div>

            <div className="admin-search-box">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-student-table">
            <div className="admin-table-header">
              <span>STUDENT</span>
              <span>DEPARTMENT</span>
              <span>YEAR</span>
              <span>STATUS</span>
              <span>ACTIONS</span>
            </div>

            {loading ? (
              <div className="admin-table-row">
                <span>Loading students...</span>
              </div>
            ) : loadError ? (
              <div className="admin-table-row">
                <span>{loadError}</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="admin-table-row">
                <span>No students found.</span>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  className="admin-table-row"
                  key={student.id}
                >
                  <div className="admin-student-name-cell">
                    <div className="admin-student-avatar">
                      {student.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <strong>{student.name}</strong>
                      <span>{student.email}</span>
                    </div>
                  </div>

                  <div className="admin-department">
                    <GraduationCap size={16} />
                    <span>{student.department}</span>
                  </div>

                  <div className="admin-year">
                    {student.year}
                  </div>

                  <div>
                    <span className="admin-status-badge">
                      {student.status}
                    </span>
                  </div>

                  <div className="admin-row-actions">
                    <button
                      className="admin-view-button"
                      title="View Student"
                      onClick={() => viewStudent(student)}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="admin-delete-button"
                      title="Delete Student"
                      onClick={() => deleteStudent(student.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminStudents;
