import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  IdCard,
} from "lucide-react";
import { useState } from "react";
import "./ClubRegistration.css";

function ClubRegistration() {
  const navigate = useNavigate();
  const { clubId } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const clubs = {
    1: "Coding Club",
    2: "AI Club",
    3: "Design Club",
    4: "Sports Club",
    5: "Music Club",
  };

  const clubName = clubs[clubId];

  const [formData, setFormData] = useState({
    rollNumber: "",
    department: "",
    year: "",
    section: "",
    phoneNumber: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert(
        "Please accept the terms and conditions."
      );
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);

    const existingClubs =
      JSON.parse(
        localStorage.getItem("joinedClubs") || "[]"
      );

    const clubNumber = Number(clubId);

    if (!existingClubs.includes(clubNumber)) {
      existingClubs.push(clubNumber);
    }

    localStorage.setItem(
      "joinedClubs",
      JSON.stringify(existingClubs)
    );

    localStorage.setItem(
      `clubRegistration_${clubId}_${user.id}`,
      JSON.stringify({
        clubId: clubNumber,
        clubName,
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
      `Successfully joined ${clubName}!`
    );

    setLoading(false);

    navigate("/my-clubs");
  };

  if (!clubName) {
    return (
      <div className="club-registration-page">

        <div className="club-registration-not-found">

          <h2>
            Club not found
          </h2>

          <button
            onClick={() =>
              navigate("/my-clubs")
            }
          >
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
        onClick={() =>
          navigate(`/clubs/${clubId}`)
        }
      >
        <ArrowLeft size={18} />
        Back to Club
      </button>


      <div className="club-registration-container">

        {/* Header */}
        <div className="club-registration-header">

          <span>
            Club Membership
          </span>

          <h1>
            {clubName}
          </h1>

          <p>
            Complete the form below to become a
            member of this club.
          </p>

        </div>


        {/* Form */}
        <form
          className="club-registration-card"
          onSubmit={handleSubmit}
        >

          <h2>
            Student Information
          </h2>


          {/* Name */}
          <div className="club-form-group">

            <label>
              Full Name
            </label>

            <div className="club-registration-input disabled-input">

              <User size={18} />

              <input
                type="text"
                value={user?.name || ""}
                disabled
              />

            </div>

          </div>


          {/* Email */}
          <div className="club-form-group">

            <label>
              Email Address
            </label>

            <div className="club-registration-input disabled-input">

              <Mail size={18} />

              <input
                type="email"
                value={user?.email || ""}
                disabled
              />

            </div>

          </div>


          {/* Roll Number */}
          <div className="club-form-group">

            <label>
              Roll Number
            </label>

            <div className="club-registration-input">

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
          <div className="club-form-group">

            <label>
              Department
            </label>

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


          {/* Year + Section */}
          <div className="club-form-row">

            <div className="club-form-group">

              <label>
                Year
              </label>

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


            <div className="club-form-group">

              <label>
                Section
              </label>

              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Section
                </option>

                <option value="A">
                  A
                </option>

                <option value="B">
                  B
                </option>

                <option value="C">
                  C
                </option>

                <option value="D">
                  D
                </option>

                <option value="E">
                  E
                </option>

                <option value="F">
                  F
                </option>

              </select>

            </div>

          </div>


          {/* Phone */}
          <div className="club-form-group">

            <label>
              Phone Number
            </label>

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


          {/* Terms */}
          <label className="club-terms-checkbox">

            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />

            <span>
              I confirm that the information provided
              is correct and I agree to the club rules
              and guidelines.
            </span>

          </label>


          {/* Submit */}
          <button
            type="submit"
            className="club-confirm-registration"
            disabled={loading}
          >
            {loading
              ? "Joining Club..."
              : "Confirm Club Membership"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ClubRegistration;