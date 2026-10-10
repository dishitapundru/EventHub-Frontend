import { Navigate } from "react-router-dom";
import StudentDashboard from "./dashboards/StudentDashboard";

function Dashboard() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userData = localStorage.getItem("user");

  if (!isLoggedIn || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  if (user.role === "STUDENT") {
    return <StudentDashboard />;
  }

  return <Navigate to="/" replace />;
}

export default Dashboard;