import { Link } from "react-router-dom";
import { ArrowLeft, Users, Sparkles } from "lucide-react";
import "./Clubs.css";

function Clubs() {
  return (
    <div className="clubs-page">
      <div className="clubs-container">

        <Link to="/" className="clubs-back">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="clubs-heading">
          <span>EVENTHUB</span>
          <h1>Discover Campus Clubs</h1>
          <p>
            Connect with student communities and discover clubs that match
            your interests.
          </p>
        </div>

        <div className="clubs-grid">

          <div className="club-card">
            <div className="club-icon">
              <Sparkles size={25} />
            </div>

            <h2>Code Club</h2>

            <p>
              Learn programming, participate in coding contests and build
              exciting projects.
            </p>

            <div className="club-members">
              <Users size={17} />
              120 Members
            </div>

            <Link to="/clubs/code-club" className="club-view">
  View Club
</Link>
          </div>

          <div className="club-card">
            <div className="club-icon">
              <Sparkles size={25} />
            </div>

            <h2>AI & Robotics Club</h2>

            <p>
              Explore artificial intelligence, machine learning and robotics
              through hands-on activities.
            </p>

            <div className="club-members">
              <Users size={17} />
              95 Members
            </div>

           <Link to="/clubs/ai-robotics" className="club-view">
  View Club
</Link>
          </div>

          <div className="club-card">
            <div className="club-icon">
              <Sparkles size={25} />
            </div>

            <h2>Cultural Club</h2>

            <p>
              Participate in cultural events, performances and activities
              across campus.
            </p>

            <div className="club-members">
              <Users size={17} />
              150 Members
            </div>

            <Link to="/clubs/cultural" className="club-view">
  View Club
</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Clubs;