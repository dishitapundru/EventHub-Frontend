
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  IdCard,
} from "lucide-react";
import "./ClubRegistration.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function ClubRegistration() {
  const navigate = useNavigate();
  const { clubId } = useParams();

  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    rollNumber: "",
    department: "",
    year: "",
    section: "",
    phoneNumber: "",
    terms: false,
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadClub() {
      if (!API_URL) {
        setError("Backend API URL is not configured.");
        setLoading(false);
        return;
      }

      if (!clubId || !/^\d+$/.test(clubId)) {
        setError("Invalid club ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/clubs/${encodeURIComponent(clubId)}`,
          {
            signal: controller.signal,
            headers: { Accept: "application/json" },
          }
        );

        if (response.status === 404) {
          throw new Error("This club does not exist.");
        }

        if (!response.ok) {
          throw new Error(`Unable to load club (${response.status}).`);
        }

        const data = await response.json();

        if (!data?.id) {
          throw new Error("Invalid club details received.");
        }

        if (!controller.signal.aborted) {
          setClub(data);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          console.error("Unable to load club:", err);
          setError(err.message || "Unable to load club.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadClub();
    return () => controller.abort();
  }, [clubId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }

    if (!formData.terms) {
      alert("Please accept the terms and conditions.");
      return;
    }

    if (!club?.id) {
      alert("Club details are not loaded. Please try again.");
      return;
    }

    if (!API_URL) {
      alert("Backend API URL is not configured.");
      return;
    }

    setSubmitting(true);

    try {
      // Register the student in the backend database.
      const response = await fetch(
        `${API_URL}/clubs/${club.id}/join/${user.id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();

        if (response.status === 404) {
          throw new Error("Club or student not found. Please log in again.");
        }

        throw new Error(
          message || `Unable to join club (${response.status}).`
        );
      }

      const updatedClub = await response.json();

      // Keep existing browser data for compatibility with My Clubs.
      const stored = JSON.parse(
        localStorage.getItem("joinedClubs") || "[]"
      );

      const joinedClubs = Array.isArray(stored) ? stored : [];
      const actualClubId = Number(club.id);

      if (!joinedClubs.includes(actualClubId)) {
        joinedClubs.push(actualClubId);
      }

      localStorage.setItem("joinedClubs", JSON.stringify(joinedClubs));

      localStorage.setItem(
        `clubRegistration_${actualClubId}_${user.id}`,
        JSON.stringify({
          clubId: actualClubId,
          clubName: updatedClub.name || club.name,
          userId: user.id,
          name: user.name,
          email: user.email,
          rollNumber: formData.rollNumber,
          department: formData.department,
          year: formData.year,
          section: formData.section,
          phoneNumber: formData.phoneNumber,
        })
      );

      alert(
        `Successfully joined ${updatedClub.name || club.name}!`
      );
      navigate("/my-clubs");
    } catch (err) {
      console.error("Unable to join club:", err);
      alert(err.message || "Unable to save your registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="club-registration-page">
        <div className="club-registration-not-found">
          <h2>Loading club details...</h2>
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="club-registration-page">
        <div className="club-registration-not-found">
          <h2>{error || "Club not found."}</h2>
          <button onClick={() => navigate("/clubs")}>
            Back to Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="club-registration-page">
      <button
        className="club-registration-back"
        onClick={() => navigate(`/clubs/${club.id}`)}
      >
        <ArrowLeft size={18} />
        Back to Club
      </button>

      <div className="club-registration-container">
        <div className="club-registration-header">
          <span>Club Membership</span>
          <h1>{club.name}</h1>
          <p>
            Complete the form below to become a member of this club.
          </p>
        </div>

        <form
          className="club-registration-card"
          onSubmit={handleSubmit}
        >
          <h2>Student Information</h2>

          <div className="club-form-group">
            <label>Full Name</label>
            <div className="club-registration-input disabled-input">
              <User size={18} />
              <input value={user?.name || ""} disabled />
            </div>
          </div>

          <div className="club-form-group">
            <label>Email Address</label>
            <div className="club-registration-input disabled-input">
              <Mail size={18} />
              <input
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>
          </div>

          <div className="club-form-group">
            <label>Roll Number</label>
            <div className="club-registration-input">
              <IdCard size={18} />
              <input
                name="rollNumber"
                placeholder="Enter your roll number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="club-form-group">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science & Engineering</option>
              <option value="AIML">Artificial Intelligence & Machine Learning</option>
              <option value="ECE">Electronics & Communication Engineering</option>
              <option value="EEE">Electrical & Electronics Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="club-form-row">
            <div className="club-form-group">
              <label>Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="club-form-group">
              <label>Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>

          <div className="club-form-group">
            <label>Phone Number</label>
            <div className="club-registration-input">
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

          <label className="club-terms-checkbox">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            <span>
              I confirm that the information provided is correct and
              I agree to the club rules and guidelines.
            </span>
          </label>

          <button
            type="submit"
            className="club-confirm-registration"
            disabled={submitting}
          >
            {submitting ? "Joining Club..." : "Confirm Club Membership"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ClubRegistration;
