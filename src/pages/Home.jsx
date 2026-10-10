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
                <strong>100+</strong>
                <span>Campus Events</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <strong>30+</strong>
                <span>Active Clubs</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <strong>5K+</strong>
                <span>Students</span>
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
                  <span className="small-label">Upcoming event</span>
                  <h3>Tech Innovators Summit</h3>
                </div>
                <div className="event-status">
                  <span></span>
                  Open
                </div>
              </div>

              <div className="event-image">
                <div className="event-image-overlay">
                  <CalendarDays size={20} />
                  <span>October 18, 2026</span>
                </div>
              </div>

              <div className="event-details">
                <div className="detail-row">
                  <Users size={18} />
                  <span>248 students registered</span>
                </div>
                <div className="detail-row">
                  <Ticket size={18} />
                  <span>120 seats remaining</span>
                </div>
              </div>

              <Link to="/login" className="preview-register">
  Register Now
  <ArrowRight size={16} />
</Link>
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
              title="Digital QR Pass"
              text="Get your event entry pass instantly after registration."
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