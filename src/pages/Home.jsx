
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Users,
  QrCode,
  Sparkles,
  Search,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import "./Home.css";

function Home() {
  const [latestEvent, setLatestEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestEvent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/events`);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        // Find the most recently created event.
        // Prefer createdAt when your backend provides it.
        const sortedEvents = [...data].sort((a, b) => {
          const dateA = new Date(
            a.createdAt || a.created_at || a.id || 0
          ).getTime();

          const dateB = new Date(
            b.createdAt || b.created_at || b.id || 0
          ).getTime();

          return dateB - dateA;
        });

        setLatestEvent(sortedEvents[0] || null);
      } catch (error) {
        console.error("Error fetching latest event:", error);
        setLatestEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEvent();
  }, []);

  const eventDate = latestEvent?.eventDate
    ? new Date(`${latestEvent.eventDate}T00:00:00`)
    : null;

  const formattedDate =
    eventDate && !Number.isNaN(eventDate.getTime())
      ? eventDate.toLocaleDateString("en-IN", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Date to be announced";

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="brand">
            <div className="brand-icon">
              <Sparkles size={20} />
            </div>
            <span>EventHub</span>
          </div>

          <div className="nav-links">
            <Link to="/events">Events</Link>
            <Link to="/clubs">Clubs</Link>
            <a href="#about">About</a>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="signup-btn">
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-glow glow-one"></div>
          <div className="hero-glow glow-two"></div>

          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="hero-badge">
              <Sparkles size={15} />
              <span>Campus events, simplified</span>
            </div>

            <h1>
              Discover what's
              <span> happening </span>
              on campus.
            </h1>

            <p>
              Find events, connect with clubs, register instantly,
              and make the most of your college experience — all in one place.
            </p>

            <div className="hero-actions">
              <Link to="/events" className="primary-btn">
                Explore Events
                <ArrowRight size={18} />
              </Link>

              <Link to="/clubs" className="secondary-btn">
                Browse Clubs
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <strong>EventHub</strong>
                <span>Campus Events</span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat">
                <strong>Clubs</strong>
                <span>Connect & Explore</span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat">
                <strong>Students</strong>
                <span>Campus Community</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-preview"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="preview-window">
              <div className="preview-header">
                <div>
                  <span className="small-label">
                    {loading ? "Loading event..." : "Recently created event"}
                  </span>

                  <h3>
                    {loading
                      ? "Loading..."
                      : latestEvent?.title || "No events available"}
                  </h3>
                </div>

                {latestEvent && (
                  <div className="event-status">
                    <span></span>
                    Available
                  </div>
                )}
              </div>

              <div className="event-image">
                <div className="event-image-overlay">
                  <CalendarDays size={20} />
                  <span>
                    {loading
                      ? "Please wait..."
                      : latestEvent
                      ? formattedDate
                      : "Check back for new events"}
                  </span>
                </div>
              </div>

              <div className="event-details">
                <div className="detail-row">
                  <Users size={18} />
                  <span>
                    {latestEvent
                      ? latestEvent.location || "Location to be announced"
                      : "Explore campus events"}
                  </span>
                </div>

                <div className="detail-row">
                  <Ticket size={18} />
                  <span>
                    {latestEvent
                      ? `${latestEvent.capacity ?? "N/A"} total seats`
                      : "Discover upcoming events"}
                  </span>
                </div>
              </div>

              {latestEvent && (
                <Link
                  to={`/events/${latestEvent.id}`}
                  className="preview-register"
                >
                  View Event
                  <ArrowRight size={16} />
                </Link>
              )}

              {!loading && !latestEvent && (
                <Link to="/events" className="preview-register">
                  Explore Events
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        </section>

        <section className="features-section" id="about">
          <div className="section-heading">
            <span className="section-label">EVERYTHING IN ONE PLACE</span>

            <h2>
              Your campus.
              <br />
              <span>One connected experience.</span>
            </h2>

            <p>
              EventHub brings students, clubs and administrators
              together through one simple platform.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon={<Search size={23} />}
              title="Discover Events"
              text="Find workshops, competitions, fests and activities based on your interests."
            />

            <FeatureCard
              icon={<QrCode size={23} />}
              title="Event Entry Pass"
              text="Keep track of your event registrations and entry details."
            />

            <FeatureCard
              icon={<ShieldCheck size={23} />}
              title="Verified Clubs"
              text="Discover activities from verified college clubs and organizations."
            />

            <FeatureCard
              icon={<CalendarDays size={23} />}
              title="Easy Registration"
              text="Register for events in seconds and keep track of everything."
            />
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <Sparkles size={28} />
            <h2>Make every campus moment count.</h2>
            <p>Discover events. Meet people. Build experiences.</p>

            <Link to="/register" className="primary-btn">
              Join EventHub
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <span>EventHub</span>
        </div>

        <p>College Events & Club Management Platform</p>
        <span className="copyright">© 2026 EventHub</span>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      className="feature-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <ArrowRight className="feature-arrow" size={18} />
    </motion.div>
  );
}

export default Home;
