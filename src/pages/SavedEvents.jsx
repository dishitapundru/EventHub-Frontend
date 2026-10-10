import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Bookmark,
  Trash2,
} from "lucide-react";
import "./SavedEvents.css";

function SavedEvents() {
  const navigate = useNavigate();

  const [savedEvents, setSavedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  // Load saved event IDs
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const savedKey = `savedEvents_${user.id}`;

    const savedData =
      localStorage.getItem(savedKey);

    if (savedData) {
      try {
        setSavedEvents(JSON.parse(savedData));
      } catch (error) {
        console.error(
          "Saved events data error:",
          error
        );

        setSavedEvents([]);
      }
    }

    setLoading(false);
  }, [navigate, user?.id]);

  // Load all events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/events`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load events"
          );
        }

        const data = await response.json();

        setEvents(data);
      } catch (error) {
        console.error(
          "Saved events loading error:",
          error
        );
      }
    };

    fetchEvents();
  }, []);

  const removeSavedEvent = (eventId) => {
    if (!user) return;

    const savedKey = `savedEvents_${user.id}`;

    const updatedEvents =
      savedEvents.filter(
        (id) =>
          Number(id) !== Number(eventId)
      );

    setSavedEvents(updatedEvents);

    localStorage.setItem(
      savedKey,
      JSON.stringify(updatedEvents)
    );
  };

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

  const savedEventDetails =
    events.filter((event) =>
      savedEvents.some(
        (savedId) =>
          Number(savedId) ===
          Number(event.id)
      )
    );

  return (
    <div className="saved-events-page">

      <div className="saved-events-container">

        <button
          className="saved-events-back"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="saved-events-heading">

          <div className="saved-events-icon">
            <Bookmark size={25} />
          </div>

          <div>

            <h1>Saved Events</h1>

            <p>
              Events you saved to check out later.
            </p>

          </div>

        </div>

        {loading ? (

          <div className="saved-events-empty">

            <p>
              Loading saved events...
            </p>

          </div>

        ) : savedEventDetails.length === 0 ? (

          <div className="saved-events-empty">

            <div className="saved-empty-icon">
              <Bookmark size={38} />
            </div>

            <h2>No saved events yet</h2>

            <p>
              Save interesting events from the
              Events page and they will appear here.
            </p>

            <button
              onClick={() =>
                navigate("/events")
              }
            >
              Browse Events
            </button>

          </div>

        ) : (

          <div className="saved-events-grid">

            {savedEventDetails.map(
              (event) => (

                <div
                  className="saved-event-card"
                  key={event.id}
                >

                  <div className="saved-event-top">

                    <div className="saved-event-calendar">

                      <CalendarDays size={22} />

                    </div>

                    <span className="saved-badge">

                      <Bookmark size={14} />

                      Saved

                    </span>

                  </div>

                  <h2>
                    {event.title}
                  </h2>

                  <div className="saved-event-info">

                    <p>

                      <CalendarDays size={17} />

                      {formatDate(
                        event.eventDate
                      )}

                    </p>

                    <p>

                      <MapPin size={17} />

                      {event.location}

                    </p>

                    <p>

                      <Users size={17} />

                      {event.capacity} seats
                      remaining

                    </p>

                  </div>

                  <div className="saved-event-actions">

                    <button
                      className="saved-view-button"
                      onClick={() =>
                        navigate(
                          `/events/${event.id}`
                        )
                      }
                    >
                      View Event
                    </button>

                    <button
                      className="saved-remove-button"
                      onClick={() =>
                        removeSavedEvent(
                          event.id
                        )
                      }
                    >
                      <Trash2 size={17} />

                      Remove
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default SavedEvents;