
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
} from "lucide-react";
import { useEffect, useState } from "react";

import "./MyClubs.css";
import "../dashboards/StudentDashboard.css";

function MyClubs() {
  const navigate = useNavigate();

  const clubs = [
    {
      id: 1,
      name: "Coding Club",
      category: "Technology",
      description:
        "A community for students interested in programming, problem solving, competitive coding and software development.",
      members: 128,
      icon: Code2,
    },
    {
      id: 2,
      name: "AI Club",
      category: "Artificial Intelligence",
      description:
        "Explore Artificial Intelligence, Machine Learning, Generative AI and emerging technologies through projects and workshops.",
      members: 96,
      icon: Brain,
    },
    {
      id: 3,
      name: "Design Club",
      category: "Design",
      description:
        "A creative community for students interested in UI/UX design, graphics, branding and digital creativity.",
      members: 74,
      icon: Palette,
    },
    {
      id: 4,
      name: "Sports Club",
      category: "Sports",
      description:
        "Connect with fellow students through sports, competitions, fitness activities and campus tournaments.",
      members: 156,
      icon: Trophy,
    },
    {
      id: 5,
      name: "Music Club",
      category: "Arts & Culture",
      description:
        "A community for singers, musicians and music enthusiasts to collaborate, perform and participate in campus events.",
      members: 68,
      icon: Music,
    },
  ];

  const [joinedClubs, setJoinedClubs] = useState([]);

  useEffect(() => {
    const savedClubs =
      localStorage.getItem("joinedClubs");

    if (savedClubs) {
      setJoinedClubs(JSON.parse(savedClubs));
    }
  }, []);

  const handleLeaveClub = (clubId) => {
    const updatedClubs =
      joinedClubs.filter(
        (id) => id !== clubId
      );

    setJoinedClubs(updatedClubs);

    localStorage.setItem(
      "joinedClubs",
      JSON.stringify(updatedClubs)
    );
  };

  const isJoined = (clubId) => {
    return joinedClubs.includes(clubId);
  };

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

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/events")
            }
          >
            <CalendarDays size={19} />
            Browse Events
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/my-registrations")
            }
          >
            <Bookmark size={19} />
            My Registrations
          </button>

          <button
            className="student-nav-item active"
            onClick={() =>
              navigate("/my-clubs")
            }
          >
            <Users size={19} />
            My Clubs
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/notifications")
            }
          >
            <Bell size={19} />
            Notifications
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/attendance")
            }
          >
            <ClipboardCheck size={19} />
            Attendance
          </button>

          <button
            className="student-nav-item"
            onClick={() =>
              navigate("/feedback")
            }
          >
            <MessageSquare size={19} />
            Feedback
          </button>

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

        <div className="my-clubs-page">

          <div className="my-clubs-container">

            {/* Header */}

            <div className="my-clubs-header">

              <div className="clubs-title-icon">
                <Users size={25} />
              </div>

              <div>

                <h1>
                  My Clubs
                </h1>

                <p>
                  Discover and connect with
                  student clubs at EventHub.
                </p>

              </div>

            </div>

            {/* Summary */}

            <div className="clubs-summary">

              <div className="clubs-summary-icon">
                <Users size={22} />
              </div>

              <div>

                <strong>
                  {joinedClubs.length}
                </strong>

                <span>
                  Clubs Joined
                </span>

              </div>

            </div>

            {/* Joined Clubs */}

            {joinedClubs.length > 0 && (
              <section className="joined-clubs-section">

                <div className="clubs-section-heading">

                  <div>

                    <h2>
                      My Joined Clubs
                    </h2>

                    <p>
                      Clubs you are currently
                      a member of.
                    </p>

                  </div>

                </div>

                <div className="joined-clubs-list">

                  {clubs
                    .filter((club) =>
                      joinedClubs.includes(
                        club.id
                      )
                    )
                    .map((club) => {

                      const Icon =
                        club.icon;

                      return (
                        <div
                          className="joined-club-card"
                          key={club.id}
                        >

                          <div className="joined-club-icon">
                            <Icon size={21} />
                          </div>

                          <div className="joined-club-info">

                            <strong>
                              {club.name}
                            </strong>

                            <span>
                              {club.category}
                            </span>

                          </div>

                          <div className="joined-status">

                            <CheckCircle
                              size={16}
                            />

                            Joined

                          </div>

                          <button
                            className="joined-leave-button"
                            onClick={() =>
                              handleLeaveClub(
                                club.id
                              )
                            }
                          >
                            <LogOut size={15} />
                            Leave
                          </button>

                        </div>
                      );
                    })}

                </div>

              </section>
            )}

            {/* Explore Clubs */}

            <section className="available-clubs-section">

              <div className="clubs-section-heading">

                <div>

                  <h2>
                    Explore Clubs
                  </h2>

                  <p>
                    Find a club that matches
                    your interests.
                  </p>

                </div>

                <span className="club-count">
                  {clubs.length} Clubs
                </span>

              </div>

              <div className="clubs-grid">

                {clubs.map((club) => {

                  const Icon = club.icon;

                  const joined =
                    isJoined(club.id);

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

                          {club.members} members

                        </span>

                      </div>

                      <h2>
                        {club.name}
                      </h2>

                      <span className="club-category">
                        {club.category}
                      </span>

                      <p>
                        {club.description}
                      </p>

                      <div className="club-actions">

                        {/* View Club */}

                        <button
                          className="club-view-button"
                          onClick={() =>
                            navigate(
                              `/clubs/${club.id}`
                            )
                          }
                        >
                          View Club
                        </button>

                        {/* Join / Leave */}

                        {joined ? (

                          <button
                            className="club-leave-button"
                            onClick={() =>
                              handleLeaveClub(
                                club.id
                              )
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

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

export default MyClubs;
