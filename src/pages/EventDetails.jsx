import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Building2,
  CheckCircle,
} from "lucide-react";
import "./EventDetails.css";

function EventDetails() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Load selected event from backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/events/${eventId}`
        );

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await response.json();

        setEvent(data);
      } catch (error) {
        console.error("Error loading event:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Format backend date
  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="event-details-page">
        <div className="event-not-found">
          <h2>Loading event...</h2>
        </div>
      </div>
    );
  }

  // Event not found
  if (notFound || !event) {
    return (
      <div className="event-details-page">

        <div className="event-not-found">

          <h2>Event not found</h2>

          <p>
            This event may have been deleted or is no longer
            available.
          </p>

          <button
            onClick={() => navigate("/events")}
          >
            Back to Events
          </button>

        </div>

      </div>
    );
  }

  const handleRegister = () => {
    navigate(`/events/${eventId}/register`);
  };

  return (
    <div className="event-details-page">

      <button
        className="event-details-back"
        onClick={() => navigate("/events")}
      >
        <ArrowLeft size={18} />
        Back to Events
      </button>

      <div className="event-details-container">

        <div className="event-details-header">

          <div>

            <span className="event-category">
              College Event
            </span>

            <h1>{event.title}</h1>

            <p className="event-description">
              Join this EventHub college event and participate
              in an engaging campus activity with fellow
              students.
            </p>

          </div>

        </div>

        <div className="event-info-grid">

          {/* Date */}
          <div className="event-info-card">

            <CalendarDays size={22} />

            <div>
              <span>Date</span>

              <strong>
                {formatDate(event.eventDate)}
              </strong>
            </div>

          </div>

          {/* Time */}
          <div className="event-info-card">

            <Clock size={22} />

            <div>
              <span>Time</span>

              <strong>
                To be announced
              </strong>
            </div>

          </div>

          {/* Venue */}
          <div className="event-info-card">

            <MapPin size={22} />

            <div>
              <span>Venue</span>

              <strong>
                {event.location}
              </strong>
            </div>

          </div>

          {/* Capacity */}
          <div className="event-info-card">

            <Users size={22} />

            <div>
              <span>Capacity</span>

              <strong>
                {event.capacity} Students
              </strong>
            </div>

          </div>

          {/* Organizer */}
          <div className="event-info-card">

            <Building2 size={22} />

            <div>
              <span>Organized By</span>

              <strong>
                EventHub
              </strong>
            </div>

          </div>

        </div>

        <div className="event-details-content">

          {/* About */}
          <div className="event-section">

            <h2>About the Event</h2>

            <p>
              {event.title} is a college event organized
              through EventHub. Students can participate in
              this event and take part in the activities
              planned by the organizers.
            </p>

          </div>

          {/* Eligibility */}
          <div className="event-section">

            <h2>Eligibility</h2>

            <div className="eligibility-box">

              <CheckCircle size={20} />

              <span>
                Open to all Anurag University students.
              </span>

            </div>

          </div>

          {/* Registration */}
          <div className="event-section">

            <h2>Registration</h2>

            <p>
              Register for this event by providing your
              student details. Your registration will be
              saved to your EventHub account.
            </p>

            <button
              className="event-register-large"
              onClick={handleRegister}
            >
              Register Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EventDetails;