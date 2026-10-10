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
  Plus,
  Search,
  Pencil,
  Trash2,
  UsersRound,
  X,
  Check,
  XCircle,
  Clock3,
} from "lucide-react";
import "./AdminClubs.css";

function AdminClubs() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [search, setSearch] = useState("");
  const [clubs, setClubs] = useState([]);
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // APPROVAL STATE
  // =========================

  const [approvalLoading, setApprovalLoading] = useState({});

  // =========================
  // FORM STATE
  // =========================

  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    members: 0,
    status: "ACTIVE",
  });

  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD CLUBS
  // =========================

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    loadClubs();
  }, [navigate, user?.role]);

  const loadClubs = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs`
      );

      if (!response.ok) {
        throw new Error("Failed to load clubs");
      }

      const data = await response.json();

      setClubs(data);

      setPendingClubs(
        data.filter(
          (club) =>
            club.status?.toUpperCase() === "PENDING"
        )
      );
    } catch (error) {
      console.error("Club loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // APPROVE / REJECT CLUB
  // =========================

  const handleClubApproval = async (clubId, action) => {
    try {
      setApprovalLoading((current) => ({
        ...current,
        [clubId]: true,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs/${clubId}/${action}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          action === "approve"
            ? "Failed to approve club"
            : "Failed to reject club"
        );
      }

      const updatedClub = await response.json();

      setClubs((currentClubs) =>
        currentClubs.map((club) =>
          club.id === updatedClub.id
            ? updatedClub
            : club
        )
      );

      setPendingClubs((currentPending) =>
        currentPending.filter(
          (club) => club.id !== updatedClub.id
        )
      );

      if (action === "approve") {
        alert(
          `"${updatedClub.name}" has been approved successfully.`
        );
      } else {
        alert(
          `"${updatedClub.name}" has been rejected.`
        );
      }
    } catch (error) {
      console.error("Club approval error:", error);

      alert(
        action === "approve"
          ? "Failed to approve club."
          : "Failed to reject club."
      );
    } finally {
      setApprovalLoading((current) => ({
        ...current,
        [clubId]: false,
      }));
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // =========================
  // OPEN CREATE FORM
  // =========================

  const openCreateForm = () => {
    setEditingClub(null);

    setFormData({
      name: "",
      category: "",
      members: 0,
      status: "ACTIVE",
    });

    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEditForm = (club) => {
    setEditingClub(club);

    setFormData({
      name: club.name || "",
      category: club.category || "",
      members: club.members ?? 0,
      status: club.status || "ACTIVE",
    });

    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingClub(null);

    setFormData({
      name: "",
      category: "",
      members: 0,
      status: "ACTIVE",
    });
  };

  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // CREATE / UPDATE CLUB
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter the club name.");
      return;
    }

    if (!formData.category.trim()) {
      alert("Please enter the club category.");
      return;
    }

    try {
      setSaving(true);

      const clubData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        members: Number(formData.members),
        status: formData.status,
      };

      let response;

      if (editingClub) {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/clubs/${editingClub.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(clubData),
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/clubs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(clubData),
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          editingClub
            ? "Failed to update club"
            : "Failed to create club"
        );
      }

      const savedClub = await response.json();

      if (editingClub) {
        setClubs((currentClubs) =>
          currentClubs.map((club) =>
            club.id === editingClub.id
              ? savedClub
              : club
          )
        );

        alert("Club updated successfully.");
      } else {
        setClubs((currentClubs) => [
          ...currentClubs,
          savedClub,
        ]);

        alert("Club created successfully.");
      }

      setPendingClubs((currentPending) =>
        savedClub.status?.toUpperCase() === "PENDING"
          ? [
              ...currentPending.filter(
                (club) => club.id !== savedClub.id
              ),
              savedClub,
            ]
          : currentPending.filter(
              (club) => club.id !== savedClub.id
            )
      );

      closeForm();
    } catch (error) {
      console.error("Club save error:", error);

      alert(
        editingClub
          ? "Failed to update club."
          : "Failed to create club."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE CLUB
  // =========================

  const deleteClub = async (id) => {
    const club = clubs.find(
      (currentClub) => currentClub.id === id
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete "${club?.name}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete club");
      }

      setClubs((currentClubs) =>
        currentClubs.filter(
          (currentClub) => currentClub.id !== id
        )
      );

      setPendingClubs((currentPending) =>
        currentPending.filter(
          (currentClub) => currentClub.id !== id
        )
      );

      alert("Club deleted successfully.");
    } catch (error) {
      console.error("Club deletion error:", error);
      alert("Failed to delete club.");
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredClubs = clubs.filter((club) =>
    `${club.name} ${club.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================
  // PAGE
  // =========================

  return (
    <div className="admin-module-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            ✦
          </div>

          <div>
            <span>EventHub</span>
            <small>ADMIN PANEL</small>
          </div>

        </div>

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

          <button className="admin-nav-item active">
            <Building2 size={19} />
            <span>Manage Clubs</span>

            {pendingClubs.length > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  minWidth: "22px",
                  height: "22px",
                  padding: "0 6px",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "800",
                  background: "#ede9fe",
                  color: "#6d28d9",
                }}
              >
                {pendingClubs.length}
              </span>
            )}
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin/notifications")
            }
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

      {/* MAIN */}

      <main className="admin-module-main">

        <header className="admin-module-header">

          <div>

            <span className="admin-module-kicker">
              CLUB MANAGEMENT
            </span>

            <h1>Manage Clubs</h1>

            <p>
              Create and manage college clubs and memberships.
            </p>

          </div>

          <button
            className="admin-primary-button"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            Create Club
          </button>

        </header>

        {/* PENDING CLUB REQUESTS */}

        {pendingClubs.length > 0 && (
          <section
            className="admin-module-card"
            style={{
              marginBottom: "22px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              borderRadius: "18px",
              boxShadow:
                "0 8px 30px rgba(15, 23, 42, 0.06)",
              overflow: "hidden",
            }}
          >

            <div
              className="admin-card-toolbar"
              style={{
                borderBottom: "1px solid #f1f5f9",
                background: "#ffffff",
              }}
            >

              <div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                  }}
                >
                  <Clock3
                    size={19}
                    style={{
                      color: "#7c3aed",
                    }}
                  />

                  <h2>
                    Pending Club Requests
                  </h2>
                </div>

                <span>
                  {pendingClubs.length} club
                  {pendingClubs.length !== 1
                    ? "s"
                    : ""}{" "}
                  waiting for approval
                </span>

              </div>

            </div>

            <div className="admin-club-table">

              <div className="admin-table-header">
                <span>CLUB</span>
                <span>CATEGORY</span>
                <span>MEMBERS</span>
                <span>STATUS</span>
                <span>ACTION</span>
              </div>

              {pendingClubs.map((club) => {

                const isProcessing =
                  approvalLoading[club.id];

                return (
                  <div
                    className="admin-table-row"
                    key={club.id}
                    style={{
                      background: "#ffffff",
                      borderBottom:
                        "1px solid #f1f5f9",
                    }}
                  >

                    <div className="admin-club-name-cell">

                      <div
                        className="admin-club-icon"
                        style={{
                          background: "#f5f3ff",
                          color: "#7c3aed",
                        }}
                      >
                        <Building2 size={19} />
                      </div>

                      <div>

                        <strong>
                          {club.name}
                        </strong>

                        <span>
                          Club #{club.id}
                        </span>

                      </div>

                    </div>

                    <div className="admin-category">
                      {club.category}
                    </div>

                    <div className="admin-members">

                      <UsersRound size={16} />

                      {club.members}

                    </div>

                    <div>

                      <span
                        className="admin-status-badge"
                        style={{
                          background: "#f3e8ff",
                          color: "#7e22ce",
                          border:
                            "1px solid #e9d5ff",
                        }}
                      >
                        PENDING
                      </span>

                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >

                      <button
                        className="admin-primary-button"
                        style={{
                          padding: "9px 12px",
                          fontSize: "12px",
                          opacity: isProcessing ? 0.6 : 1,
                        }}
                        disabled={isProcessing}
                        onClick={() =>
                          handleClubApproval(
                            club.id,
                            "approve"
                          )
                        }
                      >
                        <Check size={15} />
                        {isProcessing
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        className="admin-delete-button"
                        style={{
                          padding: "9px 12px",
                        }}
                        title="Reject Club"
                        disabled={isProcessing}
                        onClick={() =>
                          handleClubApproval(
                            club.id,
                            "reject"
                          )
                        }
                      >
                        <XCircle size={16} />
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>
        )}

        {/* CREATE / EDIT FORM */}

        {showForm && (
          <section className="admin-club-form-card">

            <div className="admin-club-form-header">

              <div>

                <span className="admin-module-kicker">
                  {editingClub
                    ? "EDIT CLUB"
                    : "NEW CLUB"}
                </span>

                <h2>
                  {editingClub
                    ? "Edit Club"
                    : "Create New Club"}
                </h2>

                <p>
                  {editingClub
                    ? "Update the club information below."
                    : "Add a new college club to EventHub."}
                </p>

              </div>

              <button
                type="button"
                className="admin-form-close"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={19} />
              </button>

            </div>

            <form
              className="admin-club-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-club-form-grid">

                <div className="admin-form-group">
                  <label>Club Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter club name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category</label>

                  <input
                    type="text"
                    name="category"
                    placeholder="Example: Technical"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Members</label>

                  <input
                    type="number"
                    name="members"
                    min="0"
                    placeholder="0"
                    value={formData.members}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>
                  </select>
                </div>

              </div>

              <div className="admin-club-form-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingClub
                    ? "Update Club"
                    : "Create Club"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* CLUB TABLE */}

        <section className="admin-module-card">

          <div className="admin-card-toolbar">

            <div>

              <h2>College Clubs</h2>

              <span>
                {filteredClubs.length} clubs available
              </span>

            </div>

            <div className="admin-search-box">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search clubs..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          <div className="admin-club-table">

            <div className="admin-table-header">
              <span>CLUB</span>
              <span>CATEGORY</span>
              <span>MEMBERS</span>
              <span>STATUS</span>
              <span>ACTIONS</span>
            </div>

            {loading ? (

              <div className="admin-table-row">
                <span>Loading clubs...</span>
              </div>

            ) : filteredClubs.length === 0 ? (

              <div className="admin-table-row">
                <span>No clubs found.</span>
              </div>

            ) : (

              filteredClubs.map((club) => (

                <div
                  className="admin-table-row"
                  key={club.id}
                >

                  <div className="admin-club-name-cell">

                    <div className="admin-club-icon">
                      <Building2 size={19} />
                    </div>

                    <div>

                      <strong>
                        {club.name}
                      </strong>

                      <span>
                        Club #{club.id}
                      </span>

                    </div>

                  </div>

                  <div className="admin-category">
                    {club.category}
                  </div>

                  <div className="admin-members">

                    <UsersRound size={16} />

                    {club.members}

                  </div>

                  <div>

                    <span
                      className="admin-status-badge"
                      style={
                        club.status === "PENDING"
                          ? {
                              background: "#f3e8ff",
                              color: "#7e22ce",
                              border:
                                "1px solid #e9d5ff",
                            }
                          : undefined
                      }
                    >
                      {club.status}
                    </span>

                  </div>

                  <div className="admin-row-actions">

                    <button
                      className="admin-edit-button"
                      title="Edit Club"
                      onClick={() =>
                        openEditForm(club)
                      }
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="admin-delete-button"
                      title="Delete Club"
                      onClick={() =>
                        deleteClub(club.id)
                      }
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

export default AdminClubs;