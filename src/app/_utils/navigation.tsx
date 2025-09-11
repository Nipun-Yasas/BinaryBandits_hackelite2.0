import { type Navigation } from "@toolpad/core/AppProvider";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import QuizIcon from "@mui/icons-material/Quiz";
import ForumIcon from "@mui/icons-material/Forum";
import WorkIcon from "@mui/icons-material/Work";
import ExploreIcon from "@mui/icons-material/Explore";


export function buildNavigation(role?: string): Navigation {
  const nav: Navigation = [
    { kind: "header", title: " Learning Hub" },
    { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
    { segment: "profile", title: "Profile", icon: <AccountCircleIcon /> },
    { segment: "quiz", title: "Quiz", icon: <QuizIcon /> },
    { segment: "careersuggestion", title: "Career suggestions", icon: <WorkIcon /> },
    { segment: "discussion", title: "Discussion Forum", icon: <ForumIcon /> },
    { segment: "careerexplore", title: "Explore careers", icon: <ExploreIcon /> },
  ];

  if (role === "admin") {
    nav.push(
      { kind: "divider" },
      { kind: "header", title: "Administration" },
      { segment: "admin", title: "Admin Dashboard", icon: <AdminPanelSettingsIcon /> },
      { segment: "admin/analytics", title: "Analytics", icon: <DashboardIcon /> },
      { segment: "admin/system", title: "System Monitor", icon: <AdminPanelSettingsIcon /> },
      { segment: "admin/users", title: "User Management", icon: <AccountCircleIcon /> },
    );
  }

  return nav;
}
