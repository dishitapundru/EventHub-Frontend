
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Users,
  CalendarDays,
  Trophy,
  CheckCircle,
  Building2,
  Clock,
  RefreshCw,
} from "lucide-react";

import "./ClubDetails.css";

const API_URL = import.meta.env.VITE_API_URL;

function getLines(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getMemberCount(club) {
  if (typeof club.membersCount === "number") {
    return club.membersCount;
  }

  if (typeof club.memberCount === "number") {
    return club.memberCount;
  }

  if (Array.isArray(club.members)) {
    return club.members.length;
  }

  if (typeof club.members === "number") {
    return club.members;
  }

  return 0;
}

function ClubDetails() {
  const navigate = useNavigate();
  const { clubId } = useParams();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchClub = async () => {
      if (!API_URL) {
        setError("The backend API URL is not configured.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setClub(null);

      try {
        const baseUrl = API_URL.replace(/\/$/, "");

        const response = await fetch(
          `${baseUrl}/clubs/${encodeURIComponent(clubId)}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.status === 404) {
          throw new Error("Club not found.");
        }

        if (!response.ok) {
          throw new Error(
            `Unable to load club details (${response.status}).`
          );
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
          throw new Error("Invalid club details received.");
        }

        if (!controller.signal.aborted) {
          setClub(data);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          console.error("Error loading club:", err);
          setError(
            err.message || "Unable to load club details."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (!clubId) {
      setError("Club ID is missing.");
      setLoading(false);
    } else {
      fetchClub();
    }

    return () => controller.abort();
  }, [clubId]);

  const goBack = () => {
    navigate("/my-clubs");
  };

  if (loading) {
    return (
      <div className="club-details-page">
        <div className="club-not-found">
          <RefreshCw size={25} />
          <p>Loading club details...</p>
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="club-details-page">
        <div className="club-not-found">
          <h2>{error || "Club not found."}</h2>

          <p>
            Please check your connection and try opening the club again.
          </p>

          <button onClick={goBack}>
            <ArrowLeft size={18} />
            Back to My Clubs
          </button>
        </div>
      </div>
    );
  }

  const emptyMessage = "No information added yet.";

  const about = getText(club.about) || getText(club.description);
  const history = getText(club.history);
  const pastEvents = getLines(club.pastEvents);
  const achievements = getLines(club.achievements);
  const memberCount = getMemberCount(club);

  return (
    <div className="club-details-page">
      <button
        className="club-details-back"
        onClick={goBack}
      >
        <ArrowLeft size={18} />
        Back to My Clubs
      </button>

      <div className="club-details-container">
        {/* Club Header */}
        <div className="club-details-header">
          <div className="club-header-icon">
            <Users size={34} />
          </div>

          <div className="club-header-content">
            <span className="club-details-category">
              {club.category || "Category not specified"}
            </span>

            <h1>{club.name || "Unnamed Club"}</h1>

            <p>{about || emptyMessage}</p>
          </div>

          <div className="club-member-box">
            <Users size={21} />
            <strong>{memberCount}</strong>
            <span>Members</span>
          </div>
        </div>

        {/* About */}
        <section className="club-details-section">
          <h2>
            <Building2 size={21} />
            About the Club
          </h2>

          <p className="club-detail-text">
            {about || emptyMessage}
          </p>
        </section>

        {/* History */}
        <section className="club-details-section">
          <h2>
            <Clock size={21} />
            Club History
          </h2>

          <p className="club-detail-text">
            {history || emptyMessage}
          </p>
        </section>

        {/* Past Events */}
        <section className="club-details-section">
          <h2>
            <CalendarDays size={21} />
            Past Events
          </h2>

          <div className="club-event-list">
            {pastEvents.length > 0 ? (
              pastEvents.map((event, index) => (
                <div
                  className="club-past-event"
                  key={`${index}-${event}`}
                >
                  <CheckCircle size={18} />
                  <span>{event}</span>
                </div>
              ))
            ) : (
              <p>{emptyMessage}</p>
            )}
          </div>
        </section>

        {/* Achievements */}
        <section className="club-details-section">
          <h2>
            <Trophy size={21} />
            Achievements &amp; Prizes
          </h2>

          <div className="club-achievements">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <div
                  className="club-achievement"
                  key={`${index}-${achievement}`}
                >
                  <Trophy size={17} />
                  <span>{achievement}</span>
                </div>
              ))
            ) : (
              <p>{emptyMessage}</p>
            )}
          </div>
        </section>

        {/* Join Club */}
        <section className="club-join-section">
          <div>
            <h2>Interested in joining?</h2>

            <p>
              Learn more about {club.name || "this club"} and
              participate in its activities and events.
            </p>
          </div>

          <button
            onClick={() => navigate(`/clubs/${clubId}/join`)}
          >
            Join Club
          </button>
        </section>
      </div>
    </div>
  );
}

export default ClubDetails;
