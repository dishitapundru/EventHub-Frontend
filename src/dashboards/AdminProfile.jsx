
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  Bell,
  UserCircle,
  LogOut,
  ShieldCheck,
  Mail,
  Settings,
} from "lucide-react";

import "./AdminProfile.css";

function AdminProfile() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");

  if (!userData) {
    navigate("/login");
    return null;
  }

  const user = JSON.parse(userData);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="admin-profile-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        {/* Brand */}

        <div className="admin-brand">

          <div className="admin-brand-icon">
            ✦
          </div>

          <div>
            <span>EventHub</span>
            <small>ADMIN PANEL</small>
          </div>

        </div>

        {/* Main Menu */}

        <div className="admin-menu-title">
          MAIN MENU
        </div>

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

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/students")}
          >
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

        {/* Account */}

        <div className="admin-menu-title admin-secondary-title">
          ACCOUNT
        </div>

        <nav className="admin-nav">

          <button
            className="admin-nav-item active"
          >
            <UserCircle size={19} />
            <span>My Profile</span>
          </button>

        </nav>

        {/* Bottom User */}

        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-user">

            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="admin-user-info">

              <strong>
                {user?.name || "EventHub Admin"}
              </strong>

              <span>Administrator</span>

            </div>

          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="admin-profile-main">

        {/* Header */}

        <header className="admin-profile-header">

          <div>

            <span className="admin-profile-kicker">
              ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your EventHub administrator account.
            </p>

          </div>

        </header>


        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <section className="admin-profile-card">

          {/* Profile Top */}

          <div className="admin-profile-user">

            <div className="admin-profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="admin-profile-user-info">

              <h2>
                {user?.name || "EventHub Admin"}
              </h2>

              <p>
                {user?.email || "No email available"}
              </p>

              <span className="admin-profile-role">
                <ShieldCheck size={15} />
                Administrator
              </span>

            </div>

          </div>


          {/* Account Information */}

          <div className="admin-profile-section">

            <div className="admin-profile-section-title">

              <UserCircle size={20} />

              <h2>
                Account Information
              </h2>

            </div>


            <div className="admin-profile-grid">

              <div className="admin-profile-detail">

                <span>Full Name</span>

                <strong>
                  {user?.name || "Not available"}
                </strong>

              </div>


              <div className="admin-profile-detail">

                <span>Email Address</span>

                <strong>
                  {user?.email || "Not available"}
                </strong>

              </div>


              <div className="admin-profile-detail">

                <span>Account Type</span>

                <strong>
                  ADMIN
                </strong>

              </div>


              <div className="admin-profile-detail">

                <span>User ID</span>

                <strong>
                  #{user?.id || "N/A"}
                </strong>

              </div>

            </div>

          </div>


          {/* Account Status */}

          <div className="admin-profile-section">

            <div className="admin-profile-section-title">

              <ShieldCheck size={20} />

              <h2>
                Account Status
              </h2>

            </div>


            <div className="admin-status-card">

              <div className="admin-status-icon">
                <ShieldCheck size={22} />
              </div>

              <div>

                <strong>
                  Administrator Account Active
                </strong>

                <p>
                  Your EventHub administrator account
                  is active and has access to the admin
                  management features.
                </p>

              </div>

            </div>

          </div>


          {/* Admin Access */}

          <div className="admin-profile-section">

            <div className="admin-profile-section-title">

              <Settings size={20} />

              <h2>
                Admin Access
              </h2>

            </div>


            <div className="admin-access-grid">

              <button
                onClick={() => navigate("/admin/events")}
              >
                <CalendarDays size={21} />

                <div>
                  <strong>
                    Manage Events
                  </strong>

                  <span>
                    Create and manage college events
                  </span>
                </div>

              </button>


              <button
                onClick={() => navigate("/admin/students")}
              >
                <Users size={21} />

                <div>
                  <strong>
                    Manage Students
                  </strong>

                  <span>
                    View and manage student accounts
                  </span>
                </div>

              </button>


              <button
                onClick={() => navigate("/admin/clubs")}
              >
                <Building2 size={21} />

                <div>
                  <strong>
                    Manage Clubs
                  </strong>

                  <span>
                    Manage college clubs
                  </span>
                </div>

              </button>


              <button
                onClick={() =>
                  navigate("/admin/notifications")
                }
              >
                <Bell size={21} />

                <div>
                  <strong>
                    Notifications
                  </strong>

                  <span>
                    Manage platform notifications
                  </span>
                </div>

              </button>

            </div>

          </div>


          {/* Logout */}

          <div className="admin-profile-footer">

            <button
              className="admin-profile-logout"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminProfile;
