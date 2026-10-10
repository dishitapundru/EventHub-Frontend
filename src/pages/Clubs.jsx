
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Sparkles } from "lucide-react";
import "./Clubs.css";

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchClubs = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(`${apiUrl}/clubs`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch clubs (${response.status}).`);
        }

        const data = await response.json();

        const activeClubs = (Array.isArray(data) ? data : []).filter(
          (club) =>
            String(club.status || "").toUpperCase() === "ACTIVE"
        );

        setClubs(activeClubs);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching clubs:", err);
          setError("Unable to load clubs. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchClubs();

    return () => controller.abort();
  }, []);

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
            Explore campus clubs and read the information provided by
            each club owner.
          </p>
        </div>

        {loading ? (
          <p className="clubs-message">Loading clubs...</p>
        ) : error ? (
          <p className="clubs-message">{error}</p>
        ) : clubs.length === 0 ? (
          <p className="clubs-message">
            No active clubs are available at the moment.
          </p>
        ) : (
          <div className="clubs-grid">
            {clubs.map((club) => (
              <div className="club-card" key={club.id}>
                <div className="club-icon">
                  <Sparkles size={25} />
                </div>

                <h2>{club.name}</h2>

                <p>
                  {club.about?.trim() ||
                    "No club description added yet."}
                </p>

                <div className="club-members">
                  <Users size={17} />
                  {club.members ?? 0} Members
                </div>

                <Link
                  to={`/clubs/${club.id}`}
                  className="club-view"
                >
                  View Club
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Clubs;
