import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  IdCard,
} from "lucide-react";
import "./EventRegistration.css";

function EventRegistration() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const userData = localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventNotFound, setEventNotFound] = useState(false);

  const [formData, setFormData] = useState({
    rollNumber: "",
    department: "",
    year: "",
    section: "",
    phoneNumber: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);

  // Load event from backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setEventLoading(true);
        setEventNotFound(false);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/events/${eventId}`
        );

        if (response.status === 404) {
          setEventNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await response.json();

        setEvent(data);
      } catch (error) {
        console.error("Error loading event:", error);
        setEventNotFound(true);
      } finally {
        setEventLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!formData.terms) {
      alert("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        userId: String(user.id),
        eventId: String(eventId),
        rollNumber: formData.rollNumber.trim(),
        department: formData.department,
        year: formData.year,
        section: formData.section,
        phoneNumber: formData.phoneNumber.trim(),
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/registrations?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.text();

      if (!response.ok) {
        alert(data);
        return;
      }

      alert("Registration successful!");

      navigate("/my-registrations");

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        "Cannot connect to backend. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading event
  if (eventLoading) {
    return (
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-header">
            <span>Event Registration</span>

            <h1>Loading event...</h1>

            <p>
              Please wait while we load the event details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Event not found
  if (eventNotFound || !event) {
    return (
      <div className="registration-page">

        <div className="registration-container">

          <div className="registration-header">

            <span>Event Registration</span>

            <h1>Event not found</h1>

            <p>
              This event may have been deleted or is no
              longer available.
            </p>

            <button
              className="confirm-registration"
              onClick={() => navigate("/events")}
            >
              Back to Events
            </button>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="registration-page">

      <button
        className="registration-back"
        onClick={() =>
          navigate(`/events/${eventId}`)
        }
      >
        <ArrowLeft size={18} />
        Back to Event
      </button>

      <div className="registration-container">

        <div className="registration-header">

          <span>Event Registration</span>

          <h1>{event.title}</h1>

          <p>
            Complete the form below to register for this
            event.
          </p>

        </div>

        <form
          className="registration-card"
          onSubmit={handleSubmit}
        >

          <h2>Student Information</h2>

          {/* Full Name */}

          <div className="form-group">

            <label>Full Name</label>

            <div className="registration-input disabled-input">

              <User size={18} />

              <input
                type="text"
                value={user?.name || ""}
                disabled
              />

            </div>

          </div>

          {/* Email */}

          <div className="form-group">

            <label>Email Address</label>

            <div className="registration-input disabled-input">

              <Mail size={18} />

              <input
                type="email"
                value={user?.email || ""}
                disabled
              />

            </div>

          </div>

          {/* Roll Number */}

          <div className="form-group">

            <label>Roll Number</label>

            <div className="registration-input">

              <IdCard size={18} />

              <input
                type="text"
                name="rollNumber"
                placeholder="Enter your roll number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Department */}

          <div className="form-group">

            <label>Department</label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Department
              </option>

              <option value="CSE">
                Computer Science & Engineering
              </option>

              <option value="AIML">
                Artificial Intelligence & Machine Learning
              </option>

              <option value="ECE">
                Electronics & Communication Engineering
              </option>

              <option value="EEE">
                Electrical & Electronics Engineering
              </option>

              <option value="ME">
                Mechanical Engineering
              </option>

              <option value="CE">
                Civil Engineering
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* Year and Section */}

          <div className="form-row">

            <div className="form-group">

              <label>Year</label>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Year
                </option>

                <option value="1st Year">
                  1st Year
                </option>

                <option value="2nd Year">
                  2nd Year
                </option>

                <option value="3rd Year">
                  3rd Year
                </option>

                <option value="4th Year">
                  4th Year
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>Section</label>

              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Section
                </option>

                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>

              </select>

            </div>

          </div>

          {/* Phone */}

          <div className="form-group">

            <label>Phone Number</label>

            <div className="registration-input">

              <Phone size={18} />

              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Terms */}

          <label className="terms-checkbox">

            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />

            <span>
              I confirm that the information provided is
              correct and I agree to the event rules and
              guidelines.
            </span>

          </label>

          {/* Submit */}

          <button
            type="submit"
            className="confirm-registration"
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Confirm Registration"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default EventRegistration;