import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./Dashboard";

import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventRegistration from "./pages/EventRegistration";

import MyRegistrations from "./pages/MyRegistrations";
import SavedEvents from "./pages/SavedEvents";

import Clubs from "./pages/Clubs";
import ClubDetails from "./pages/ClubDetails";
import ClubRegistration from "./pages/ClubRegistration";
import MyClubs from "./pages/MyClubs";

import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import AdminDashboard from "./dashboards/AdminDashboard";
import AdminEvents from "./dashboards/AdminEvents";
import AdminStudents from "./dashboards/AdminStudents";
import AdminClubs from "./dashboards/AdminClubs";
import AdminNotifications from "./dashboards/AdminNotifications";

import ClubDashboard from "./dashboards/ClubDashboard";
import ClubProfile from "./dashboards/ClubProfile";
import ClubEvents from "./dashboards/ClubEvents";
import ClubCreateEvent from "./dashboards/ClubCreateEvent";
import ClubEditEvent from "./dashboards/ClubEditEvent";
import ClubRegistrations from "./dashboards/ClubRegistrations";
import ClubAttendance from "./dashboards/ClubAttendance";
import ClubFeedback from "./dashboards/ClubFeedback";

import StudentFeedback from "./dashboards/StudentFeedback";
import StudentAttendance from "./dashboards/StudentAttendance";
import ClubUpdates from "./dashboards/ClubUpdates";
import AdminProfile from "./dashboards/AdminProfile";

function App() {
return ( <BrowserRouter> <Routes>


    {/* =========================
        Public Pages
    ========================= */}
<Route path="/admin/profile" element={<AdminProfile />} />

    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />


    {/* =========================
        Student Pages
    ========================= */}

    <Route
      path="/dashboard"
      element={<Dashboard />}
    />

    <Route
      path="/events"
      element={<Events />}
    />

    <Route
      path="/events/:eventId"
      element={<EventDetails />}
    />

    <Route
      path="/events/:eventId/register"
      element={<EventRegistration />}
    />

    <Route
      path="/my-registrations"
      element={<MyRegistrations />}
    />

    <Route
      path="/saved-events"
      element={<SavedEvents />}
    />

    <Route
      path="/clubs"
      element={<Clubs />}
    />

    <Route
      path="/clubs/:clubId"
      element={<ClubDetails />}
    />

    <Route
      path="/clubs/:clubId/join"
      element={<ClubRegistration />}
    />

    <Route
      path="/my-clubs"
      element={<MyClubs />}
    />

    <Route
      path="/notifications"
      element={<Notifications />}
    />

    <Route
      path="/profile"
      element={<Profile />}
    />

    {/* Student Attendance */}

    <Route
      path="/attendance"
      element={<StudentAttendance />}
    />

    {/* Student Feedback */}

    <Route
      path="/feedback"
      element={<StudentFeedback />}
    />


    {/* =========================
        Admin Pages
    ========================= */}

    <Route
      path="/admin"
      element={<AdminDashboard />}
    />

    <Route
      path="/admin/events"
      element={<AdminEvents />}
    />

    <Route
      path="/admin/students"
      element={<AdminStudents />}
    />

    <Route
      path="/admin/clubs"
      element={<AdminClubs />}
    />

    <Route
      path="/admin/notifications"
      element={<AdminNotifications />}
    />


    {/* =========================
        Club Pages
    ========================= */}

    <Route
      path="/club"
      element={<ClubDashboard />}
    />

    <Route
      path="/club/profile"
      element={<ClubProfile />}
    />

    <Route
      path="/club/events"
      element={<ClubEvents />}
    />

    <Route
      path="/club/create-event"
      element={<ClubCreateEvent />}
    />

    <Route
      path="/club/events/edit/:eventId"
      element={<ClubEditEvent />}
    />

    <Route
      path="/club/registrations"
      element={<ClubRegistrations />}
    />

    <Route
      path="/club/attendance"
      element={<ClubAttendance />}
    />

    <Route
      path="/club/feedback"
      element={<ClubFeedback />}
    />
    <Route path="/club/updates" element={<ClubUpdates />} />


  </Routes>
</BrowserRouter>


);
}

export default App;
