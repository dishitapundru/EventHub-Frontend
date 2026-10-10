import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  CalendarDays,
  Trophy,
  CheckCircle,
  Building2,
  Clock,
} from "lucide-react";
import "./ClubDetails.css";

function ClubDetails() {
  const navigate = useNavigate();
  const { clubId } = useParams();

  const clubs = {
    1: {
      name: "Coding Club",
      category: "Technology",
      members: 128,
      description:
        "The Coding Club is a community of students passionate about programming, software development, problem solving and competitive coding.",
      about:
        "The Coding Club provides a collaborative environment where students can improve their programming skills, participate in coding competitions, build software projects and learn from experienced peers.",
      history:
        "The Coding Club was created to bring together students interested in programming and technology. Since its beginning, the club has conducted coding contests, development workshops and hackathon preparation sessions.",
      achievements: [
        "Organized multiple campus coding contests",
        "Conducted programming and DSA workshops",
        "Students participated in national-level hackathons",
        "Conducted hackathon preparation sessions",
      ],
      pastEvents: [
        "CodeSprint 2026",
        "Competitive Programming Workshop",
        "Git & GitHub Bootcamp",
      ],
    },

    2: {
      name: "AI Club",
      category: "Artificial Intelligence",
      members: 96,
      description:
        "The AI Club is a student community focused on Artificial Intelligence, Machine Learning, Generative AI and emerging technologies.",
      about:
        "The AI Club helps students explore AI concepts through workshops, projects, discussions and practical demonstrations. Members can collaborate on AI and Machine Learning projects.",
      history:
        "The AI Club was formed to create a dedicated community for students interested in Artificial Intelligence and Machine Learning. The club regularly conducts technical sessions and project activities.",
      achievements: [
        "Conducted AI and Machine Learning workshops",
        "Organized Generative AI project sessions",
        "Supported students in AI hackathons",
        "Conducted hands-on AI demonstrations",
      ],
      pastEvents: [
        "Introduction to Generative AI",
        "Machine Learning Workshop",
        "AI Project Showcase",
      ],
    },

    3: {
      name: "Design Club",
      category: "Design",
      members: 74,
      description:
        "The Design Club is a creative community for students interested in UI/UX, graphic design and digital creativity.",
      about:
        "The Design Club gives students an opportunity to explore UI/UX design, visual communication, branding and creative digital work.",
      history:
        "The club was created to encourage creativity and design thinking among students through workshops, design challenges and collaborative projects.",
      achievements: [
        "Conducted UI/UX design workshops",
        "Organized campus design challenges",
        "Created designs for student events",
        "Conducted creative portfolio sessions",
      ],
      pastEvents: [
        "UI/UX Design Workshop",
        "Figma Design Challenge",
        "Creative Portfolio Session",
      ],
    },

    4: {
      name: "Sports Club",
      category: "Sports",
      members: 156,
      description:
        "The Sports Club brings together students interested in sports, fitness, competitions and campus tournaments.",
      about:
        "The Sports Club promotes teamwork, fitness and healthy competition through sports activities and inter-college events.",
      history:
        "The club has been a platform for students to participate in campus sports and represent the university in competitions.",
      achievements: [
        "Organized inter-department tournaments",
        "Conducted annual sports competitions",
        "Supported university sports teams",
        "Conducted fitness activities",
      ],
      pastEvents: [
        "Annual Sports Meet",
        "Inter-Department Cricket Tournament",
        "Campus Football Championship",
      ],
    },

    5: {
      name: "Music Club",
      category: "Arts & Culture",
      members: 68,
      description:
        "The Music Club is a community for singers, musicians and students passionate about music and performances.",
      about:
        "The Music Club provides students with opportunities to practice, collaborate and perform at university events.",
      history:
        "The club was created to provide a platform for students with musical interests and encourage cultural activities on campus.",
      achievements: [
        "Performed at university cultural events",
        "Organized student music sessions",
        "Conducted open mic activities",
        "Participated in cultural competitions",
      ],
      pastEvents: [
        "Campus Open Mic",
        "Freshers Cultural Night",
        "Music Jam Session",
      ],
    },
  };

  const club = clubs[clubId];

  if (!club) {
    return (
      <div className="club-details-page">
        <div className="club-not-found">
          <h2>Club not found</h2>

          <button onClick={() => navigate("/my-clubs")}>
            Back to Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="club-details-page">

      <button
        className="club-details-back"
        onClick={() => navigate("/my-clubs")}
      >
        <ArrowLeft size={18} />
        Back to Clubs
      </button>


      <div className="club-details-container">

        {/* Header */}
        <div className="club-details-header">

          <div className="club-header-icon">
            <Users size={34} />
          </div>

          <div className="club-header-content">

            <span className="club-details-category">
              {club.category}
            </span>

            <h1>{club.name}</h1>

            <p>
              {club.description}
            </p>

          </div>

          <div className="club-member-box">

            <Users size={21} />

            <strong>
              {club.members}
            </strong>

            <span>
              Members
            </span>

          </div>

        </div>


        {/* About */}
        <section className="club-details-section">

          <h2>
            <Building2 size={21} />
            About the Club
          </h2>

          <p>
            {club.about}
          </p>

        </section>


        {/* History */}
        <section className="club-details-section">

          <h2>
            <Clock size={21} />
            Club History
          </h2>

          <p>
            {club.history}
          </p>

        </section>


        {/* Past Events */}
        <section className="club-details-section">

          <h2>
            <CalendarDays size={21} />
            Past Events
          </h2>

          <div className="club-event-list">

            {club.pastEvents.map((event, index) => (
              <div
                className="club-past-event"
                key={index}
              >
                <CheckCircle size={18} />
                <span>{event}</span>
              </div>
            ))}

          </div>

        </section>


        {/* Achievements */}
        <section className="club-details-section">

          <h2>
            <Trophy size={21} />
            Achievements & Prizes
          </h2>

          <div className="club-achievements">

            {club.achievements.map((achievement, index) => (
              <div
                className="club-achievement"
                key={index}
              >
                <Trophy size={17} />
                <span>{achievement}</span>
              </div>
            ))}

          </div>

        </section>


        {/* Join */}
        <section className="club-join-section">

          <div>
            <h2>
              Interested in joining?
            </h2>

            <p>
              Become a member of {club.name} and participate
              in club activities, events and projects.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(`/clubs/${clubId}/join`)
            }
          >
            Join Club
          </button>

        </section>

      </div>

    </div>
  );
}

export default ClubDetails;